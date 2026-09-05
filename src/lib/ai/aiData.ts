import { InventoryProduct } from "@/types/ai";

export const AI_PRODUCTS: InventoryProduct[] = [
  {
    id: "1",
    name: "Logitech MX Master 3S",
    currentStock: 5,
    minimumStock: 10,
    maximumStock: 50,
    dailySales: 3,
    purchasePrice: 8500,
    rmaCount: 4,
    totalSold: 50,
  },
  {
    id: "2",
    name: "ThinkPad T14 Gen 3",
    currentStock: 18,
    minimumStock: 10,
    maximumStock: 40,
    dailySales: 1,
    purchasePrice: 125000,
    rmaCount: 2,
    totalSold: 80,
  },
  {
    id: "3",
    name: "HP LaserJet Pro",
    currentStock: 8,
    minimumStock: 15,
    maximumStock: 30,
    dailySales: 2,
    purchasePrice: 25000,
    rmaCount: 8,
    totalSold: 45,
  },
];