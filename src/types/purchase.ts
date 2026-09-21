export interface PurchaseItem {
  id: string; // unique ID for the line item
  productId: string;
  title: string;
  productName?: string;
  price: number;
  unitCost?: number;
  quantity: number;
  serialNumbers?: string[];
  returnedQuantity?: number;
  availableQuantity?: number;
  total: number;
  tax?: number;
  discount?: number;
  discountPercent?: number;
  discountType?: "percent" | "fixed";
}

export type PurchaseStatus = "Pending" | "Received" | "Returned" | "Partially Returned" | "Cancelled";
export type PaymentStatus = "Unpaid" | "Partial" | "Paid";

export interface Purchase {
  _id?: string;
  id?: string; // e.g. PUR-2026-001
  purchaseNumber?: string;
  supplierId: string;
  supplierName: string;
  supplierPhone?: string;
  branchId: string;
  branchName: string;
  purchasePerson: string;
  employeeId?: string;
  purchaseDate: string;
  referenceNo?: string;
  items: PurchaseItem[];
  subTotal: number;
  originalSubTotal?: number;
  totalTax: number;
  totalDiscount: number;
  grandTotal: number;
  originalGrandTotal?: number;
  totalRefundAmount?: number;
  paidAmount: number;
  dueAmount: number;
  status: PurchaseStatus;
  paymentStatus: PaymentStatus;
  invoiceGenerated?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseReturnItem {
  purchaseItemId?: string;
  productId: string;
  productName?: string;
  title?: string;
  quantity: number;
  quantityReturned?: number;
  price?: number;
  unitPrice?: number;
  refundAmount: number;
  returnReason?: string;
  serialNumbers?: string[];
}

export type ReturnSettlementType = "adjust_due" | "supplier_credit" | "cash_refund";

export interface PurchaseReturn {
  _id?: string;
  returnId: string; // e.g. RET-2026-001
  purchaseId: string;
  purchaseInvoiceNo?: string;
  supplierId?: string;
  supplierName?: string;
  supplierPhone?: string;
  branchName?: string;
  returnDate: string;
  items: PurchaseReturnItem[];
  totalRefundAmount: number;
  totalReturnedQty?: number;
  settlementType?: ReturnSettlementType;
  returnReason?: string;
  notes?: string;
  status: "Pending" | "Completed";
  createdAt: string;
  updatedAt?: string;
}

export type InventoryItemStatus = "Available" | "Sold" | "Returned" | "Defective";

export interface InventoryItem {
  _id?: string;
  itemId: string; // Unique ID for this specific serial numbered item
  productId: string;
  productName: string;
  purchaseId: string;
  serialNumber?: string;
  branchId: string;
  status: InventoryItemStatus;
  createdAt: string;
  updatedAt: string;
}