import { catalogDatabase } from "@/lib/mongodb";

export interface StockProductSummary {
  productId: string;
  productName: string;
  sku?: string;
  category?: string;
  brand?: string;
  availableStock: number;
  minimumStock: number;
  status: "OUT_OF_STOCK" | "LOW_STOCK" | "HEALTHY" | "OVERSTOCK";
}

export interface BranchStockSummary {
  branchId: string;
  branchName?: string;
  totalUnits: number;
  productCount: number;
}

export interface InventoryContextData {
  summary: {
    totalCatalogProducts: number;
    totalAvailableStockUnits: number;
    outOfStockCount: number;
    lowStockCount: number;
    overstockCount: number;
    healthyCount: number;
  };
  lowStockProducts: StockProductSummary[];
  outOfStockProducts: StockProductSummary[];
  overstockedProducts: StockProductSummary[];
  branchBreakdown: BranchStockSummary[];
  salesSummary?: {
    totalSalesCount: number;
    totalRevenue: number;
    totalPaid: number;
    totalDue: number;
    topSellingProducts: { productId: string; productName: string; quantitySold: number; revenue: number }[];
    recentSalesCount: number;
    totalReturnsCount: number;
    totalRefundAmount: number;
  };
  purchaseSummary?: {
    totalPurchasesCount: number;
    totalPurchaseAmount: number;
    pendingPurchasesCount: number;
    topSuppliers: { name: string; phone?: string; pendingRmaCount: number }[];
  };
}

// Get the products collection safely
async function getProductsCollection() {
  const collections = await catalogDatabase.listCollections().toArray();
  const names = collections.map((c) => c.name);

  if (names.includes("TechBasket_all data")) return catalogDatabase.collection("TechBasket_all data");
  if (names.includes("TechBasket_all_data")) return catalogDatabase.collection("TechBasket_all_data");
  if (names.includes("products")) return catalogDatabase.collection("products");
  return catalogDatabase.collection("TechBasket_all data");
}

export async function fetchLiveInventoryContext(branchFilter?: string): Promise<InventoryContextData> {
  const productsCol = await getProductsCollection();
  const inventoryCol = catalogDatabase.collection("inventory_items");
  const salesCol = catalogDatabase.collection("sales");
  const salesReturnsCol = catalogDatabase.collection("sales_returns");
  const purchasesCol = catalogDatabase.collection("purchases");
  const suppliersCol = catalogDatabase.collection("suppliers");

  // 1. Fetch all products from catalog
  const catalogProducts = await productsCol
    .find({ status: { $ne: "INACTIVE" } })
    .project({ _id: 1, title: 1, productTitle: 1, sku: 1, brand: 1, category: 1, warrantyPeriod: 1 })
    .toArray();

  const productMap = new Map<string, { name: string; sku?: string; category?: string; brand?: string }>();
  for (const p of catalogProducts) {
    const id = p._id.toString();
    const name = (p.title || p.productTitle || "Unknown Product") as string;
    productMap.set(id, {
      name,
      sku: p.sku as string,
      category: p.category as string,
      brand: p.brand as string,
    });
  }

  // 2. Aggregate available stock from inventory_items
  const inventoryMatch: Record<string, unknown> = { status: "Available" };
  if (branchFilter && branchFilter !== "all") {
    inventoryMatch.branchId = branchFilter;
  }

  const stockByProductPipeline = [
    { $match: inventoryMatch },
    {
      $group: {
        _id: "$productId",
        productName: { $first: "$productName" },
        count: { $sum: 1 },
      },
    },
  ];

  const stockAggResult = await inventoryCol.aggregate<{ _id: string; productName?: string; count: number }>(stockByProductPipeline).toArray();
  const stockMap = new Map<string, { count: number; name?: string }>();
  for (const s of stockAggResult) {
    if (s._id) {
      stockMap.set(s._id, { count: s.count, name: s.productName });
    }
  }

  // 3. Aggregate stock by branch
  const branchStockPipeline = [
    { $match: { status: "Available" } },
    {
      $group: {
        _id: "$branchId",
        totalUnits: { $sum: 1 },
        products: { $addToSet: "$productId" },
      },
    },
  ];

  const branchAggResult = await inventoryCol.aggregate<{ _id: string; totalUnits: number; products: string[] }>(branchStockPipeline).toArray();
  const branchBreakdown: BranchStockSummary[] = branchAggResult.map((b) => ({
    branchId: b._id || "MAIN_BRANCH",
    totalUnits: b.totalUnits,
    productCount: b.products.length,
  }));

  // 4. Calculate stock status per product
  const defaultMinStock = 5;
  const defaultMaxStock = 50;

  const lowStockProducts: StockProductSummary[] = [];
  const outOfStockProducts: StockProductSummary[] = [];
  const overstockedProducts: StockProductSummary[] = [];
  let healthyCount = 0;
  let totalAvailableUnits = 0;

  // Check catalog items
  for (const [prodId, meta] of productMap.entries()) {
    const stockInfo = stockMap.get(prodId);
    const stockCount = stockInfo ? stockInfo.count : 0;
    totalAvailableUnits += stockCount;

    if (stockCount === 0) {
      outOfStockProducts.push({
        productId: prodId,
        productName: meta.name,
        sku: meta.sku,
        brand: meta.brand,
        category: meta.category,
        availableStock: 0,
        minimumStock: defaultMinStock,
        status: "OUT_OF_STOCK",
      });
    } else if (stockCount <= defaultMinStock) {
      lowStockProducts.push({
        productId: prodId,
        productName: meta.name,
        sku: meta.sku,
        brand: meta.brand,
        category: meta.category,
        availableStock: stockCount,
        minimumStock: defaultMinStock,
        status: "LOW_STOCK",
      });
    } else if (stockCount > defaultMaxStock) {
      overstockedProducts.push({
        productId: prodId,
        productName: meta.name,
        sku: meta.sku,
        brand: meta.brand,
        category: meta.category,
        availableStock: stockCount,
        minimumStock: defaultMinStock,
        status: "OVERSTOCK",
      });
    } else {
      healthyCount++;
    }
  }

  // Also include products that appear in inventory_items but not catalog
  for (const [prodId, stockInfo] of stockMap.entries()) {
    if (!productMap.has(prodId)) {
      totalAvailableUnits += stockInfo.count;
      const prodName = stockInfo.name || `Product (${prodId})`;
      if (stockInfo.count <= defaultMinStock) {
        lowStockProducts.push({
          productId: prodId,
          productName: prodName,
          availableStock: stockInfo.count,
          minimumStock: defaultMinStock,
          status: "LOW_STOCK",
        });
      } else {
        healthyCount++;
      }
    }
  }

  // 5. Aggregate Sales Data
  let salesSummary: InventoryContextData["salesSummary"] = undefined;
  try {
    const salesFilter: Record<string, unknown> = {};
    if (branchFilter && branchFilter !== "all") {
      salesFilter["branch.branchId"] = branchFilter;
    }

    const salesList = await salesCol.find(salesFilter).sort({ createdAt: -1 }).limit(200).toArray();

    let totalRevenue = 0;
    let totalPaid = 0;
    let totalDue = 0;
    const soldProductMap = new Map<string, { name: string; quantity: number; revenue: number }>();

    for (const sale of salesList) {
      totalRevenue += Number(sale.grandTotal) || 0;
      totalPaid += Number(sale.paidAmount) || 0;
      totalDue += Number(sale.dueAmount) || 0;

      if (Array.isArray(sale.items)) {
        for (const item of sale.items) {
          const pId = item.productId || item.productName;
          const current = soldProductMap.get(pId) || {
            name: item.productName || "Product",
            quantity: 0,
            revenue: 0,
          };
          current.quantity += Number(item.quantity) || 1;
          current.revenue += Number(item.subtotal || item.unitPrice * (item.quantity || 1)) || 0;
          soldProductMap.set(pId, current);
        }
      }
    }

    const topSelling = Array.from(soldProductMap.entries())
      .map(([id, d]) => ({ productId: id, productName: d.name, quantitySold: d.quantity, revenue: d.revenue }))
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 10);

    const returnsCount = await salesReturnsCol.countDocuments();
    const returnsList = await salesReturnsCol.find({}).project({ totalRefundAmount: 1 }).toArray();
    const totalRefund = returnsList.reduce((acc, r) => acc + (Number(r.totalRefundAmount) || 0), 0);

    salesSummary = {
      totalSalesCount: salesList.length,
      totalRevenue,
      totalPaid,
      totalDue,
      topSellingProducts: topSelling,
      recentSalesCount: salesList.length,
      totalReturnsCount: returnsCount,
      totalRefundAmount: totalRefund,
    };
  } catch (err) {
    console.warn("Could not aggregate sales data for AI:", err);
  }

  // 6. Aggregate Purchase & Supplier Data
  let purchaseSummary: InventoryContextData["purchaseSummary"] = undefined;
  try {
    const purchaseList = await purchasesCol.find({}).sort({ createdAt: -1 }).limit(100).toArray();
    let totalPurchaseAmount = 0;
    let pendingPurchasesCount = 0;

    for (const p of purchaseList) {
      totalPurchaseAmount += Number(p.grandTotal || p.totalAmount) || 0;
      if (p.status === "Pending" || p.status === "Ordered") {
        pendingPurchasesCount++;
      }
    }

    const suppliersList = await suppliersCol.find({}).project({ name: 1, phone: 1, pendingRmaCount: 1 }).toArray();
    const topSuppliers = suppliersList.map((s) => ({
      name: (s.name as string) || "Unknown",
      phone: s.phone as string,
      pendingRmaCount: Number(s.pendingRmaCount) || 0,
    }));

    purchaseSummary = {
      totalPurchasesCount: purchaseList.length,
      totalPurchaseAmount,
      pendingPurchasesCount,
      topSuppliers,
    };
  } catch (err) {
    console.warn("Could not aggregate purchase data for AI:", err);
  }

  return {
    summary: {
      totalCatalogProducts: productMap.size,
      totalAvailableStockUnits: totalAvailableUnits,
      outOfStockCount: outOfStockProducts.length,
      lowStockCount: lowStockProducts.length,
      overstockCount: overstockedProducts.length,
      healthyCount,
    },
    lowStockProducts: lowStockProducts.slice(0, 20),
    outOfStockProducts: outOfStockProducts.slice(0, 20),
    overstockedProducts: overstockedProducts.slice(0, 15),
    branchBreakdown,
    salesSummary,
    purchaseSummary,
  };
}

export async function matchCatalogByKeywords(keywords: string[]): Promise<StockProductSummary[]> {
  if (keywords.length === 0) return [];
  const productsCol = await getProductsCollection();
  const regex = keywords.map((k) => `(?=.*${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`).join("");

  const matched = await productsCol
    .find({
      $or: [
        { title: { $regex: regex, $options: "i" } },
        { productTitle: { $regex: regex, $options: "i" } },
        { brand: { $in: keywords.map((k) => new RegExp(k, "i")) } },
      ],
    })
    .limit(5)
    .toArray();

  return matched.map((p) => ({
    productId: p._id.toString(),
    productName: (p.title || p.productTitle || "Product") as string,
    sku: p.sku as string,
    brand: p.brand as string,
    category: p.category as string,
    availableStock: 0,
    minimumStock: 5,
    status: "HEALTHY",
  }));
}
