export interface InventoryProduct {
  id: string;
  name: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  dailySales: number;
  purchasePrice: number;
  rmaCount: number;
  totalSold: number;
}

export interface InventoryRisk {
  productId: string;
  productName: string;
  status: "critical" | "warning" | "healthy" | "overstock";
  message: string;
  stockoutDays: number;
}

export interface ReorderRecommendation {
  productId: string;
  productName: string;
  currentStock: number;
  recommendedQuantity: number;
  reason: string;
}

export interface RMAInsight {
  productId: string;
  productName: string;
  rmaRate: number;
  severity: "low" | "medium" | "high";
  message: string;
}