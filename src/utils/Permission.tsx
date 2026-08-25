export const PERMISSIONS = {
  // Product
  PRODUCT_CREATE: "product.create",
  PRODUCT_VIEW: "product.view",
  PRODUCT_UPDATE: "product.update",

  // Purchase
  PURCHASE_CREATE: "purchase.create",
  PURCHASE_INVOICE: "purchase.invoice",
  PURCHASE_RETURN: "purchase.return",

  // Sales
  SALES_CREATE: "sales.create",
  SALES_INVOICE: "sales.invoice",
  SALES_RETURN: "sales.return",

  // Inventory
  INVENTORY_CURRENT_VIEW: "inventory.current.view",
  INVENTORY_RMA_VIEW: "inventory.rma.view",
  INVENTORY_TRANSFER: "inventory.transfer",
  INVENTORY_TRANSFER_INVOICE: "inventory.transfer.invoice",

  // Approval
  PRODUCT_APPROVE: "approval.product",
  PURCHASE_APPROVE: "approval.purchase",
  PURCHASE_RETURN_APPROVE: "approval.purchase_return",
  SALES_APPROVE: "approval.sales",
  STOCK_TRANSFER_APPROVE: "approval.stock_transfer",
  SALES_RETURN_APPROVE: "approval.sales_return",

  // RMA
  RMA_COMPLAINT_RECEIVED: "rma.complaint_received",
  RMA_CUSTOMER_DELIVERY: "rma.customer_delivery",
  RMA_REPLACEMENT_OUT: "rma.replacement_out",
  RMA_REPLACEMENT_IN: "rma.replacement_in",

  // RMA Approval
  RMA_COMPLAINT_APPROVE: "approval.rma.complaint_received",
  RMA_DELIVERY_APPROVE: "approval.rma.customer_delivery",
  RMA_REPLACEMENT_OUT_APPROVE: "approval.rma.replacement_out",
  RMA_REPLACEMENT_IN_APPROVE: "approval.rma.replacement_in",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
