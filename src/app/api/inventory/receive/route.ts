import { NextRequest, NextResponse } from "next/server";
import { catalogDatabase } from "@/lib/mongodb";
import { InventoryItem } from "@/types/purchase";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

const getInventoryCollection = () => catalogDatabase.collection<InventoryItem>("inventory_items");
const getPurchasesCollection = () => catalogDatabase.collection("purchases");

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { purchaseId, branchId, items } = data;

    if (!purchaseId || !branchId || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (purchaseId, branchId, items)" },
        { status: 400 }
      );
    }

    const inventoryCol = getInventoryCollection();
    const purchasesCol = getPurchasesCollection();

    const newInventoryItems: InventoryItem[] = [];

    // Flatten the products and serial numbers into individual inventory items
    for (const item of items) {
      if (!item.productId || !item.serialNumbers || !Array.isArray(item.serialNumbers)) continue;

      for (let i = 0; i < item.quantity; i++) {
        const serialNumber = item.serialNumbers[i] || ""; // Allow empty if without serial
        
        // Generate unique itemId
        const itemId = `INV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        newInventoryItems.push({
          itemId,
          productId: item.productId,
          productName: item.productName || "Unknown Product",
          purchaseId,
          serialNumber,
          branchId,
          status: "Available",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    if (newInventoryItems.length > 0) {
      await inventoryCol.insertMany(newInventoryItems as any);
    }

    // Update the purchase document to mark invoice as generated
    let purchaseFilter = {};
    if (ObjectId.isValid(purchaseId) && purchaseId.length === 24) {
      purchaseFilter = { $or: [{ _id: new ObjectId(purchaseId) }, { id: purchaseId }] };
    } else {
      purchaseFilter = { id: purchaseId };
    }

    await purchasesCol.updateOne(
      purchaseFilter,
      { 
        $set: { 
          invoiceGenerated: true,
          updatedAt: new Date().toISOString() 
        } 
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: `Successfully received ${newInventoryItems.length} items into inventory.`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Inventory Receive POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to receive inventory", details: String(error) },
      { status: 500 }
    );
  }
}
