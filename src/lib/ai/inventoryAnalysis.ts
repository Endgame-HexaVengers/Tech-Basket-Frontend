import {
  InventoryProduct,
  InventoryRisk,
} from "@/types/ai";

export function analyzeInventory(
  products: InventoryProduct[]
): InventoryRisk[] {
  return products.map((product) => {
    const stockoutDays =
      product.dailySales > 0
        ? Math.floor(product.currentStock / product.dailySales)
        : 999;

    if (product.currentStock <= product.minimumStock) {
      return {
        productId: product.id,
        productName: product.name,
        status: "critical",
        stockoutDays,
        message: `Critical stock. Product may run out in ${stockoutDays} days.`,
      };
    }

    if (stockoutDays <= 7) {
      return {
        productId: product.id,
        productName: product.name,
        status: "warning",
        stockoutDays,
        message: `Stock may run out within ${stockoutDays} days.`,
      };
    }

    if (product.currentStock > product.maximumStock) {
      return {
        productId: product.id,
        productName: product.name,
        status: "overstock",
        stockoutDays,
        message: "Current stock is higher than recommended level.",
      };
    }

    return {
      productId: product.id,
      productName: product.name,
      status: "healthy",
      stockoutDays,
      message: "Inventory level is healthy.",
    };
  });
}