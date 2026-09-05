import {
  InventoryProduct,
  RMAInsight,
} from "@/types/ai";

export function analyzeRMA(
  products: InventoryProduct[]
): RMAInsight[] {
  return products
    .filter((product) => product.totalSold > 0)
    .map((product): RMAInsight => {
      const rmaRate =
        (product.rmaCount / product.totalSold) * 100;

      if (rmaRate >= 10) {
        return {
          productId: product.id,
          productName: product.name,
          rmaRate: Number(rmaRate.toFixed(2)),
          severity: "high",
          message:
            "High RMA rate detected. Supplier or product quality should be reviewed.",
        };
      }

      if (rmaRate >= 5) {
        return {
          productId: product.id,
          productName: product.name,
          rmaRate: Number(rmaRate.toFixed(2)),
          severity: "medium",
          message:
            "RMA rate is higher than normal. Monitor this product.",
        };
      }

      return {
        productId: product.id,
        productName: product.name,
        rmaRate: Number(rmaRate.toFixed(2)),
        severity: "low",
        message:
          "RMA rate is within a normal range.",
      };
    })
    .sort((a, b) => b.rmaRate - a.rmaRate);
}