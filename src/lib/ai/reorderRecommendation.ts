import {
  InventoryProduct,
  ReorderRecommendation,
} from "@/types/ai";

export function getReorderRecommendations(
  products: InventoryProduct[]
): ReorderRecommendation[] {
  return products
    .filter(
      (product) =>
        product.currentStock <= product.minimumStock ||
        product.currentStock / product.dailySales <= 7
    )
    .map((product) => {
      const safetyStock = product.dailySales * 7;

      const recommendedQuantity = Math.max(
        product.maximumStock -
          product.currentStock +
          safetyStock,
        0
      );

      return {
        productId: product.id,
        productName: product.name,
        currentStock: product.currentStock,
        recommendedQuantity: Math.ceil(recommendedQuantity),
        reason:
          product.currentStock <= product.minimumStock
            ? "Stock is below minimum level."
            : "Product may run out within 7 days.",
      };
    });
}