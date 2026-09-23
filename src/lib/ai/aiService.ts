import { fetchLiveInventoryContext, InventoryContextData, matchCatalogByKeywords } from "./inventoryQueryEngine";
import { catalogDatabase } from "@/lib/mongodb";

export interface GenerateAIResponseParams {
  message: string;
  conversationId?: string;
  imageUrl?: string;
  userRole?: string;
  userBranch?: string;
  userId?: string;
  userEmail?: string;
}

export interface AIResponseResult {
  answer: string;
  conversationId: string;
  insights?: Record<string, unknown>[];
  sources?: string[];
}

const SYSTEM_PROMPT = `You are TechBasket's Inventory Intelligence Assistant for an inventory & RMA management system.
You provide professional, factual, and strictly advisory insights to warehouse staff, managers, and executives.

CORE PRINCIPLES:
1. STRICT TRUTH: NEVER invent, hallucinate, or assume stock counts, sales numbers, prices, or product records.
2. SOURCE-BOUND: Answer using ONLY the real-time database context provided below. If the database context does not contain sufficient data to answer a question, explicitly state: "Based on the current database records, this information is not available."
3. ADVISORY ONLY: You are strictly advisory. Never claim that you have added, updated, or deleted records.
4. STRUCTURED & CLEAR: Structure answers with clean bullet points, bold product titles, stock quantities, and actionable recommendations.
5. VISION / IMAGE ANALYSIS: If an image is provided, identify visible product labels, model numbers, brands, or condition, and note whether it matches existing catalog inventory.
`;

export async function generateInventoryAIResponse({
  message,
  conversationId: incomingConvId,
  imageUrl,
  userBranch,
  userId,
  userEmail,
}: GenerateAIResponseParams): Promise<AIResponseResult> {
  const conversationId = incomingConvId || `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const context: InventoryContextData = await fetchLiveInventoryContext(userBranch);

  // Retrieve recent conversation history from MongoDB if available
  let conversationHistory: { role: string; content: string }[] = [];
  try {
    const convCol = catalogDatabase.collection("ai_chat_conversations");
    const existing = await convCol.findOne({ conversationId });
    if (existing && Array.isArray(existing.messages)) {
      conversationHistory = existing.messages.slice(-6).map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || ""),
      }));
    }
  } catch (convErr) {
    console.warn("Could not retrieve conversation history:", convErr);
  }

  // Format database context into clean, structured prompt context
  const contextSummaryText = `
=== REAL DATABASE CONTEXT (TECHBASKET LIVE DATA) ===
1. OVERALL INVENTORY STATUS:
- Total Catalog Products: ${context.summary.totalCatalogProducts}
- Total Available Stock Units in Warehouse: ${context.summary.totalAvailableStockUnits}
- Out of Stock Products: ${context.summary.outOfStockCount}
- Low Stock Products (<= 5 units): ${context.summary.lowStockCount}
- Healthy Stock Products: ${context.summary.healthyCount}
- Overstocked Products (> 50 units): ${context.summary.overstockCount}

2. LOW STOCK PRODUCTS (Urgent Attention):
${context.lowStockProducts.length > 0 ? context.lowStockProducts.map((p) => `- ${p.productName} (SKU: ${p.sku || "N/A"}): Current Stock: ${p.availableStock} | Min Threshold: ${p.minimumStock}`).join("\n") : "None currently below threshold."}

3. OUT OF STOCK PRODUCTS:
${context.outOfStockProducts.length > 0 ? context.outOfStockProducts.map((p) => `- ${p.productName} (SKU: ${p.sku || "N/A"})`).join("\n") : "No products currently at zero stock."}

4. BRANCH DISTRIBUTION:
${context.branchBreakdown.map((b) => `- Branch: ${b.branchId} | Total Available Units: ${b.totalUnits} | Unique Products: ${b.productCount}`).join("\n") || "Main Branch"}

5. SALES PERFORMANCE:
${context.salesSummary ? `
- Total Recorded Sales Orders: ${context.salesSummary.totalSalesCount}
- Total Revenue Generated: ৳${context.salesSummary.totalRevenue.toLocaleString()}
- Total Paid: ৳${context.salesSummary.totalPaid.toLocaleString()}
- Total Due/Receivable: ৳${context.salesSummary.totalDue.toLocaleString()}
- Top Selling Products:
${context.salesSummary.topSellingProducts.map((s) => `  * ${s.productName}: ${s.quantitySold} units sold (Revenue: ৳${s.revenue.toLocaleString()})`).join("\n")}
- Returns & RMA: ${context.salesSummary.totalReturnsCount} returns processed (Refund amount: ৳${context.salesSummary.totalRefundAmount.toLocaleString()})
` : "Sales data not yet loaded."}

6. PURCHASES & SUPPLIERS:
${context.purchaseSummary ? `
- Total Purchase Orders: ${context.purchaseSummary.totalPurchasesCount}
- Total Purchase Spend: ৳${context.purchaseSummary.totalPurchaseAmount.toLocaleString()}
- Pending Purchases: ${context.purchaseSummary.pendingPurchasesCount}
- Active Suppliers:
${context.purchaseSummary.topSuppliers.map((sup) => `  * ${sup.name} | Pending RMA claims: ${sup.pendingRmaCount}`).join("\n")}
` : "Purchase data not yet loaded."}
`;

  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      // Build OpenAI Messages
      const messagesPayload: any[] = [
        {
          role: "system",
          content: `${SYSTEM_PROMPT}\n\n${contextSummaryText}`,
        },
        ...conversationHistory,
      ];

      // Add user message with optional image
      if (imageUrl) {
        messagesPayload.push({
          role: "user",
          content: [
            { type: "text", text: message || "Analyze this product image and check if we have it in stock." },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "auto",
              },
            },
          ],
        });
      } else {
        messagesPayload.push({
          role: "user",
          content: message,
        });
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: messagesPayload,
          temperature: 0.3,
          max_tokens: 1000,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const answer = json?.choices?.[0]?.message?.content;
        if (answer) {
          // Persist message to conversation history
          saveConversationHistory(conversationId, message, answer, imageUrl, userId, userEmail);

          return {
            answer,
            conversationId,
            sources: ["inventory_items", "products", "sales", "purchases"],
          };
        }
      } else {
        const errText = await response.text();
        console.warn("OpenAI API returned non-200 status:", response.status, errText);
      }
    } catch (openaiErr) {
      console.warn("OpenAI fetch failed, invoking deterministic inventory intelligence:", openaiErr);
    }
  }

  // Deterministic Live Inventory Reasoning (Runs directly on real MongoDB data)
  const lowerMsg = message.toLowerCase();
  let answer = "";

  if (lowerMsg.includes("low stock") || lowerMsg.includes("running low") || lowerMsg.includes("restock")) {
    if (context.lowStockProducts.length === 0) {
      answer = `### 📦 Low Stock Inventory Assessment\n\nAll products in the catalog currently meet or exceed their minimum threshold (${context.summary.healthyCount} products are in healthy stock). There are currently **0 products** requiring immediate emergency restocking.`;
    } else {
      answer = `### ⚠️ Low Stock Alert\n\nThere are **${context.lowStockProducts.length} products** currently at or below minimum threshold levels:\n\n` +
        context.lowStockProducts
          .map((p, idx) => `${idx + 1}. **${p.productName}** (SKU: \`${p.sku || "N/A"}\`)\n   - **Available Stock:** ${p.availableStock} units\n   - **Minimum Threshold:** ${p.minimumStock} units\n   - **Status:** Urgent Restock Recommended`)
          .join("\n\n") +
        `\n\n**Actionable Advisory:** Create purchase orders for these items to avoid stockouts in the upcoming sales cycle.`;
    }
  } else if (lowerMsg.includes("out of stock") || lowerMsg.includes("zero stock")) {
    if (context.outOfStockProducts.length === 0) {
      answer = `### ✅ Out of Stock Report\n\nGreat news! None of your active catalog items are currently completely out of stock. Total available units across branches is **${context.summary.totalAvailableStockUnits} units**.`;
    } else {
      answer = `### 🚨 Out of Stock Products\n\nThere are **${context.outOfStockProducts.length} items** with 0 available units in inventory:\n\n` +
        context.outOfStockProducts.map((p, idx) => `${idx + 1}. **${p.productName}** (SKU: \`${p.sku || "N/A"}\`) — Category: ${p.category || "General"}`).join("\n") +
        `\n\n**Actionable Advisory:** Inquire with suppliers or check incoming purchase orders to replenish these items immediately.`;
    }
  } else if (lowerMsg.includes("sales") || lowerMsg.includes("revenue") || lowerMsg.includes("sold")) {
    const s = context.salesSummary;
    if (!s || s.totalSalesCount === 0) {
      answer = `### 📊 Sales Activity Overview\n\nThere are currently no finalized sales orders recorded in the database. When invoices are completed, daily sales trends and top-performing products will populate automatically.`;
    } else {
      answer = `### 📊 Sales Performance & Revenue Summary\n\n` +
        `- **Total Sales Orders:** ${s.totalSalesCount} completed invoices\n` +
        `- **Gross Revenue:** ৳${s.totalRevenue.toLocaleString()}\n` +
        `- **Amount Collected (Paid):** ৳${s.totalPaid.toLocaleString()}\n` +
        `- **Receivable Due:** ৳${s.totalDue.toLocaleString()}\n\n` +
        `#### 🏆 Top Performing Products:\n` +
        s.topSellingProducts.slice(0, 5).map((p, idx) => `${idx + 1}. **${p.productName}**: ${p.quantitySold} units sold (৳${p.revenue.toLocaleString()})`).join("\n") +
        `\n\n- **Returns & RMA:** ${s.totalReturnsCount} returns processed with ৳${s.totalRefundAmount.toLocaleString()} total refunded.`;
    }
  } else if (lowerMsg.includes("reorder") || lowerMsg.includes("purchase") || lowerMsg.includes("order")) {
    const itemsToReorder = [...context.outOfStockProducts, ...context.lowStockProducts];
    if (itemsToReorder.length === 0) {
      answer = `### 🛒 Weekly Reorder Plan\n\nInventory levels are stable. No products currently require urgent purchase reorders. Total units in warehouse: **${context.summary.totalAvailableStockUnits}**.`;
    } else {
      answer = `### 🛒 Recommended Weekly Reorder Plan\n\nBased on current stock levels, the following items are prioritized for purchase:\n\n` +
        itemsToReorder.slice(0, 8).map((p, idx) => `${idx + 1}. **${p.productName}**\n   - Current Stock: **${p.availableStock}** | Suggested Reorder Quantity: **${Math.max(10, p.minimumStock * 2 - p.availableStock)} units**`).join("\n") +
        `\n\nPending Purchase Orders in pipeline: **${context.purchaseSummary?.pendingPurchasesCount || 0}**.`;
    }
  } else if (lowerMsg.includes("branch") || lowerMsg.includes("location")) {
    answer = `### 🏢 Branch Stock Breakdown\n\n` +
      context.branchBreakdown.map((b) => `- **Branch \`${b.branchId}\`**: ${b.totalUnits} available units (${b.productCount} product types)`).join("\n") +
      `\n\nTotal stock across all branches: **${context.summary.totalAvailableStockUnits} units**.`;
  } else if (imageUrl) {
    answer = `### 🔍 Product Image Inspection\n\n` +
      `The product image has been securely uploaded and cataloged.\n` +
      `- **Hosted Image:** [View Uploaded Image](${imageUrl})\n` +
      `- **Inventory Cross-Reference:** Image has been registered with your session. For exact item matching, verify product barcode or title in the products catalog.\n` +
      `- **Current Catalog Size:** ${context.summary.totalCatalogProducts} products on record.`;
  } else {
    answer = `### 🤖 TechBasket Inventory Assistant\n\n` +
      `Here is a real-time snapshot of your inventory:\n\n` +
      `- **Catalog Items:** ${context.summary.totalCatalogProducts} products\n` +
      `- **Available Warehouse Units:** ${context.summary.totalAvailableStockUnits} units\n` +
      `- **Low Stock Items:** ${context.summary.lowStockCount} products needing attention\n` +
      `- **Out of Stock Items:** ${context.summary.outOfStockCount} products\n` +
      `- **Total Sales Recorded:** ৳${(context.salesSummary?.totalRevenue || 0).toLocaleString()}\n\n` +
      `You can ask me specific questions like *"Which products have low stock?"*, *"Summarize today's sales"*, or *"What should we reorder this week?"*.`;
  }

  saveConversationHistory(conversationId, message, answer, imageUrl, userId, userEmail);

  return {
    answer,
    conversationId,
    sources: ["inventory_items", "products", "sales"],
  };
}

function generateConversationTitle(text: string): string {
  const clean = text.replace(/^[#*\-—\s]+/, "").trim();
  if (!clean) return "New Inquiry";
  const firstLine = clean.split("\n")[0].trim();
  return firstLine.length > 45 ? firstLine.slice(0, 42) + "..." : firstLine;
}

async function saveConversationHistory(
  conversationId: string,
  userMsg: string,
  aiMsg: string,
  imageUrl?: string,
  userId?: string,
  userEmail?: string
) {
  try {
    const convCol = catalogDatabase.collection("ai_chat_conversations");
    const now = new Date().toISOString();
    const userMsgId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const aiMsgId = `msg-${Date.now() + 1}-${Math.random().toString(36).slice(2, 7)}`;
    const title = generateConversationTitle(userMsg);

    const updateFields: Record<string, unknown> = { updatedAt: now };
    if (userId) updateFields.userId = userId;
    if (userEmail) updateFields.userEmail = userEmail;

    await convCol.updateOne(
      { conversationId },
      {
        $push: {
          messages: {
            $each: [
              { id: userMsgId, role: "user", content: userMsg, imageUrl, timestamp: now },
              { id: aiMsgId, role: "assistant", content: aiMsg, timestamp: now },
            ],
          },
        } as any,
        $set: updateFields,
        $setOnInsert: {
          createdAt: now,
          title,
          conversationId,
          ...(userId ? { userId } : {}),
          ...(userEmail ? { userEmail } : {}),
        },
      },
      { upsert: true }
    );
  } catch (err) {
    console.warn("Failed to persist conversation history:", err);
  }
}

export async function getConversationList(filter?: { userId?: string; userEmail?: string }) {
  try {
    const convCol = catalogDatabase.collection("ai_chat_conversations");
    const query: Record<string, unknown> = {};
    if (filter?.userId || filter?.userEmail) {
      query.$or = [
        ...(filter.userId ? [{ userId: filter.userId }] : []),
        ...(filter.userEmail ? [{ userEmail: filter.userEmail }] : []),
      ];
    }

    const conversations = await convCol
      .find(query)
      .sort({ updatedAt: -1 })
      .limit(40)
      .project({
        conversationId: 1,
        title: 1,
        createdAt: 1,
        updatedAt: 1,
        messages: { $slice: -1 },
      })
      .toArray();

    return conversations.map((c) => ({
      id: c._id.toString(),
      conversationId: (c.conversationId as string) || c._id.toString(),
      title: (c.title as string) || "Inventory Consultation",
      createdAt: (c.createdAt as string) || new Date().toISOString(),
      updatedAt: (c.updatedAt as string) || new Date().toISOString(),
      lastMessageSnippet:
        Array.isArray(c.messages) && c.messages.length > 0
          ? (c.messages[0].content as string)?.slice(0, 90)
          : undefined,
    }));
  } catch (err) {
    console.error("Error fetching conversation list:", err);
    return [];
  }
}

export async function getConversationById(conversationId: string) {
  try {
    const convCol = catalogDatabase.collection("ai_chat_conversations");
    const doc = await convCol.findOne({ conversationId });
    if (!doc) return null;

    return {
      id: doc._id.toString(),
      conversationId: doc.conversationId,
      title: doc.title || "Inventory Consultation",
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      messages: (doc.messages || []).map((m: any) => ({
        id: m.id || `msg-${Math.random().toString(36).slice(2, 9)}`,
        role: m.role || "user",
        content: m.content || "",
        imageUrl: m.imageUrl,
        timestamp: m.timestamp || doc.updatedAt,
      })),
    };
  } catch (err) {
    console.error("Error fetching conversation by id:", err);
    return null;
  }
}

export async function renameConversation(conversationId: string, newTitle: string) {
  try {
    const convCol = catalogDatabase.collection("ai_chat_conversations");
    const result = await convCol.updateOne(
      { conversationId },
      { $set: { title: newTitle.trim(), updatedAt: new Date().toISOString() } }
    );
    return result.matchedCount > 0;
  } catch (err) {
    console.error("Error renaming conversation:", err);
    return false;
  }
}

export async function deleteConversation(conversationId: string) {
  try {
    const convCol = catalogDatabase.collection("ai_chat_conversations");
    const result = await convCol.deleteOne({ conversationId });
    return result.deletedCount > 0;
  } catch (err) {
    console.error("Error deleting conversation:", err);
    return false;
  }
}
