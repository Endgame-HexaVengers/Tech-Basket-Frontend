export interface SaleItem {
  id?: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  returnedQuantity?: number;
  availableQuantity?: number;
  serialNumbers?: string[];
}

export type PaymentMethod = "Cash" | "Bank Transfer" | "Card" | "Mobile Banking";
export type PaymentStatus = "Paid" | "Partial" | "Due";
export type SaleStatus = "Completed" | "Returned" | "Partially Returned" | "Cancelled";
export type InvoiceStatus = "Pending" | "Invoiced";

export interface Sale {
  _id?: string;
  id: string; // e.g. SALE-2026-0001
  invoiceNo?: string; // e.g. INV-2026-0001
  salesPerson: {
    name: string;
    employeeId: string;
    userId?: string;
  };
  branch: {
    branchId: string;
    branchName: string;
  };
  customer: {
    customerId: string;
    name: string;
    phone: string;
    type: "Individual" | "Business";
    address?: string;
  };
  saleDate: string;
  items: SaleItem[];
  subTotal: number;
  originalSubTotal?: number;
  totalDiscount: number;
  tax: number;
  grandTotal: number;
  originalGrandTotal?: number;
  totalRefundAmount?: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  invoiceStatus: InvoiceStatus;
  status: SaleStatus;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  _id?: string;
  customerId: string;
  name: string;
  phone: string;
  email?: string;
  type: "Individual" | "Business";
  address?: string;
  totalSalesCount?: number;
  totalSpent?: number;
  dueBalance?: number;
  creditBalance?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type SalesReturnSettlementType = "cash_refund" | "adjust_due" | "customer_credit";

export interface SalesReturnItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  refundAmount: number;
  returnReason: string;
  serialNumbers?: string[];
}

export interface SalesReturn {
  _id?: string;
  returnId: string; // e.g. SRET-2026-0001
  saleId: string;
  invoiceNo?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  branchName: string;
  returnDate: string;
  items: SalesReturnItem[];
  totalRefundAmount: number;
  totalReturnedQty: number;
  settlementType: SalesReturnSettlementType;
  returnReason: string;
  notes?: string;
  status: "Completed" | "Pending";
  createdAt: string;
}
