"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  ChevronDown,
  Package,
  Plus,
  Search,
  Trash2,
  UserPlus,
  CheckCircle2,
  Phone,
  Calendar,
  Building2,
  User,
  DollarSign,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { Customer, SaleItem, Sale, PaymentMethod } from "@/types/sale";
import SaleReceiptModal from "@/components/SalesSection/SaleReceiptModal";

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-[14px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#123b9c] focus:ring-2 focus:ring-blue-100";

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="mb-1.5 block text-[13px] font-semibold text-slate-600">
    {children}
  </label>
);

const SaleField = ({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <FieldLabel>{label}</FieldLabel>
    {children}
  </div>
);

const SaleAccordion = ({
  number,
  title,
  children,
  defaultOpen = true,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
      <button
        className="flex min-h-14 w-full items-center justify-between bg-slate-50/70 px-5 text-left transition-colors hover:bg-slate-100/60"
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="flex items-center gap-3">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-bold ${
              isOpen ? "bg-[#123b9c] text-white" : "bg-slate-200 text-slate-600"
            }`}
          >
            {number}
          </span>
          <span className="text-[15px] font-bold tracking-tight text-slate-900">
            {title}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="border-t border-slate-100 p-5">{children}</div>}
    </section>
  );
};

export default function NewSaleEntry() {
  // Sales Person state
  const [salesPersonName, setSalesPersonName] = useState("Chan Badsha Bhuiyan");
  const [employeeId, setEmployeeId] = useState("EMP-00125");
  const [branchName, setBranchName] = useState("Dhaka Branch");
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);

  // Customer state
  const [customerPhone, setCustomerPhone] = useState("");
  const [searchingCustomer, setSearchingCustomer] = useState(false);
  const [customerStatus, setCustomerStatus] = useState<"initial" | "found" | "not_found">("initial");
  const [customerName, setCustomerName] = useState("");
  const [customerType, setCustomerType] = useState<"Individual" | "Business">("Individual");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerDueBalance, setCustomerDueBalance] = useState(0);
  const [creatingCustomer, setCreatingCustomer] = useState(false);

  // Product Selection state
  const [productSearch, setProductSearch] = useState("");
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [searchingProducts, setSearchingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [currentQty, setCurrentQty] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentDiscount, setCurrentDiscount] = useState(0);

  // Cart / Line Items
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);


  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [paidAmountInput, setPaidAmountInput] = useState("0");
  const [remarks, setRemarks] = useState("");
  const [taxPercent, setTaxPercent] = useState(0);

  // Submission & Receipt Modal
  const [submitting, setSubmitting] = useState(false);
  const [createdSale, setCreatedSale] = useState<Sale | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Search customer by phone
  const handleSearchCustomer = async (overridePhone?: string) => {
    const phoneToSearch = (overridePhone || customerPhone).trim();
    if (!phoneToSearch) {
      toast.error("Please enter a phone number to search");
      return;
    }

    setSearchingCustomer(true);
    try {
      const res = await fetch(`/api/customers?phone=${encodeURIComponent(phoneToSearch)}`);
      const data = await res.json();

      if (data.success && data.customer) {
        const c = data.customer;
        setCustomerStatus("found");
        setSelectedCustomerId(c.customerId);
        setCustomerName(c.name);
        setCustomerType(c.type || "Individual");
        setCustomerAddress(c.address || "");
        setCustomerDueBalance(Number(c.dueBalance) || 0);
        toast.success(`Customer found: ${c.name}`);
      } else {
        setCustomerStatus("not_found");
        setSelectedCustomerId("");
        setCustomerName("");
        setCustomerAddress("");
        setCustomerDueBalance(0);
      }
    } catch (err) {
      console.error("Failed to search customer:", err);
      toast.error("Error searching customer");
    } finally {
      setSearchingCustomer(false);
    }
  };

  // Create new customer
  const handleCreateCustomer = async () => {
    if (!customerPhone.trim() || !customerName.trim()) {
      toast.error("Please enter both customer name and phone number");
      return;
    }

    setCreatingCustomer(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: customerPhone.trim(),
          name: customerName.trim(),
          type: customerType,
          address: customerAddress.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.customer) {
        const customer = data.customer;
        toast.success("Customer profile created and selected!");
        setSelectedCustomerId(customer.customerId);
        setCustomerPhone(customer.phone || customerPhone.trim());
        setCustomerName(customer.name || customerName.trim());
        setCustomerType(customer.type || customerType);
        setCustomerAddress(customer.address || customerAddress.trim());
        setCustomerDueBalance(0);
        setCustomerStatus("found");
      } else {
        toast.error(data.error || "Failed to create customer");
      }
    } catch (err) {
      console.error("Create customer error:", err);
      toast.error("An error occurred while creating customer");
    } finally {
      setCreatingCustomer(false);
    }
  };

  // Live product search
  useEffect(() => {
    if (!productSearch.trim()) {
      setAvailableProducts([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchingProducts(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(productSearch)}&limit=8`);
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setAvailableProducts(data.products);
        }
      } catch (err) {
        console.error("Product search error:", err);
      } finally {
        setSearchingProducts(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [productSearch]);

  const handleSelectProduct = (prod: any) => {
    setSelectedProduct(prod);
    setProductSearch(prod.title || prod.name || "");
    setCurrentPrice(Number(prod.price || prod.sellingPrice || prod.unitCost || 0));
    setCurrentQty(1);
    setCurrentDiscount(0);
    setAvailableProducts([]);
  };

  // Add Item to Cart
  const handleAddItem = () => {
    if (!selectedProduct && !productSearch.trim()) {
      toast.error("Please search and select a product first");
      return;
    }

    const pTitle = selectedProduct ? (selectedProduct.title || selectedProduct.name) : productSearch.trim();
    const pId = selectedProduct ? (selectedProduct.id || selectedProduct._id || selectedProduct.sku || `PROD-${Date.now().toString().slice(-4)}`) : `PROD-${Date.now().toString().slice(-4)}`;
    const pSku = selectedProduct?.sku || selectedProduct?.productCode || pId;

    if (currentPrice <= 0) {
      toast.error("Sale price must be greater than 0");
      return;
    }

    if (currentQty <= 0) {
      toast.error("Quantity must be at least 1");
      return;
    }

    const lineTotal = currentQty * currentPrice - currentDiscount;

    const newItem: SaleItem = {
      productId: pId,
      productName: pTitle,
      sku: pSku,
      quantity: currentQty,
      unitPrice: currentPrice,
      discount: currentDiscount,
      subtotal: Math.max(0, lineTotal),
    };

    setCartItems((prev) => [...prev, newItem]);
    setSelectedProduct(null);
    setProductSearch("");
    setCurrentQty(1);
    setCurrentPrice(0);
    setCurrentDiscount(0);
    toast.success("Product added to sale list");
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Financial Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalDiscount = cartItems.reduce((sum, item) => sum + (Number(item.discount) || 0), 0);
  const taxAmount = (subtotal * taxPercent) / 100;
  const grandTotal = Math.max(0, subtotal - totalDiscount + taxAmount);
  const paidAmount = Math.max(0, Number(paidAmountInput) || 0);
  const dueAmount = Math.max(0, grandTotal - paidAmount);

  // Submit Sale
  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Please add at least one product to the sale list");
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Customer name and phone number are required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        salesPerson: {
          name: salesPersonName,
          employeeId: employeeId,
        },
        branch: {
          branchId: "BRANCH-001",
          branchName: branchName,
        },
        customer: {
          customerId: selectedCustomerId,
          name: customerName.trim(),
          phone: customerPhone.trim(),
          type: customerType,
          address: customerAddress.trim(),
        },
        saleDate,
        items: cartItems,
        paymentMethod,
        paidAmount,
        remarks,
        tax: taxAmount,
      };

      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.sale) {
        toast.success(`Sale created successfully! ID: ${data.sale.id}`);
        setCreatedSale(data.sale);
        setIsReceiptModalOpen(true);
        // Reset cart for next sale
        setCartItems([]);
        setCustomerPhone("");
        setCustomerName("");
        setCustomerAddress("");
        setCustomerStatus("initial");
        setPaidAmountInput("0");
        setRemarks("");
      } else {
        toast.error(data.error || "Failed to create sale");
      }
    } catch (err) {
      console.error("Sale creation error:", err);
      toast.error("An error occurred while creating the sale");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full min-h-[calc(100vh-64px)] bg-[#f6f8fa] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="w-full space-y-4">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/80 pb-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              New Sale Entry
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Create a retail POS sale, assign customer ledger, and print instant sales invoices.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-[#123b9c] border border-blue-200">
              <Building2 className="h-3.5 w-3.5" />
              {branchName} • POS Terminal
            </span>
          </div>
        </div>

        <form onSubmit={handleCreateSale} className="space-y-4">
          {/* 1. Sales Person Information */}
          <SaleAccordion number={1} title="Sales Person Information" defaultOpen>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SaleField label="Sales Person">
                <input
                  className={`${inputClassName} bg-slate-50`}
                  value={salesPersonName}
                  onChange={(e) => setSalesPersonName(e.target.value)}
                />
              </SaleField>
              <SaleField label="Employee ID">
                <input
                  className={`${inputClassName} bg-slate-50 font-mono`}
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
              </SaleField>
              <SaleField label="Branch">
                <input
                  className={`${inputClassName} bg-slate-50`}
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                />
              </SaleField>
              <SaleField label="Sale Date">
                <input
                  className={inputClassName}
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                />
              </SaleField>
            </div>
          </SaleAccordion>

          {/* 2. Customer Information (Direct match to screenshot) */}
          <SaleAccordion number={2} title="Customer Information" defaultOpen>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <SaleField
                label="Search Customer by Phone"
                className="w-full sm:max-w-[320px]"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    className={`${inputClassName} pl-9`}
                    placeholder="Enter phone number..."
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      if (customerStatus !== "initial") setCustomerStatus("initial");
                    }}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearchCustomer())}
                  />
                </div>
              </SaleField>
              <button
                type="button"
                onClick={() => handleSearchCustomer()}
                disabled={searchingCustomer}
                className="h-11 rounded-xl bg-slate-200 px-6 text-[14px] font-semibold text-slate-700 transition hover:bg-slate-300 disabled:opacity-60 cursor-pointer"
              >
                {searchingCustomer ? "Searching..." : "Search"}
              </button>
            </div>

            {/* If Customer Found */}
            {customerStatus === "found" && (
              <div className="mt-3.5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-xs text-emerald-800">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Existing Customer Verified: {customerName}</span>
                </div>
                {customerDueBalance > 0 ? (
                  <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800 border border-amber-200">
                    Previous Due: ৳ {customerDueBalance.toLocaleString()}
                  </span>
                ) : (
                  <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                    Zero Due Balance
                  </span>
                )}
              </div>
            )}

            {/* If Customer Not Found (Matches screenshot) */}
            {customerStatus === "not_found" && (
              <div className="mt-3.5 flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3 text-slate-700">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <div>
                  <p className="text-[14px] font-bold text-slate-800">No Customer Found</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    This phone number is not registered. Please enter details to create a new customer profile.
                  </p>
                </div>
              </div>
            )}

            {/* Customer Form Fields */}
            <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
              <SaleField label="Customer Name *">
                <input
                  className={inputClassName}
                  placeholder="Enter full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </SaleField>
              <SaleField label="Customer Type *">
                <div className="relative">
                  <select
                    className={`${inputClassName} appearance-none`}
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value as any)}
                  >
                    <option value="Individual">Individual</option>
                    <option value="Business">Business</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </SaleField>
            </div>

            <SaleField label="Address (Optional)" className="mt-3">
              <input
                className={inputClassName}
                placeholder="Enter street address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
            </SaleField>

            {/* Create Customer Button */}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleCreateCustomer}
                disabled={creatingCustomer}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#123b9c] px-6 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0d2f80] disabled:opacity-60 cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                {creatingCustomer ? "Creating..." : "Create Customer"}
              </button>
            </div>
          </SaleAccordion>

          {/* 3. Product Information */}
          <SaleAccordion number={3} title="Product Information" defaultOpen>
            {/* Live Search & Add Bar */}
            <div className="relative grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-[minmax(0,1fr)_80px_120px_110px_90px] sm:items-end">
              <SaleField label="Search Product (Name/SKU)">
                <div className="relative">
                  <Package className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    className={`${inputClassName} pl-9`}
                    placeholder="Type product name or scan barcode..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                  {searchingProducts && (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-blue-600" />
                  )}

                  {/* Dropdown Results */}
                  {availableProducts.length > 0 && (
                    <div className="absolute top-12 left-0 z-30 w-full max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                      {availableProducts.map((p) => (
                        <div
                          key={p._id || p.id}
                          onClick={() => handleSelectProduct(p)}
                          className="flex items-center justify-between p-3 text-xs hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-none"
                        >
                          <div>
                            <p className="font-bold text-slate-800">{p.title || p.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              SKU: {p.sku || p.id}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-blue-900">
                              ৳ {Number(p.price || p.sellingPrice || 0).toLocaleString()}
                            </span>
                            <span className="block text-[10px] text-emerald-600 font-semibold">
                              In Stock: {p.stock ?? 25}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </SaleField>

              <SaleField label="Qty">
                <input
                  className={`${inputClassName} text-center font-bold`}
                  type="number"
                  min="1"
                  value={currentQty}
                  onChange={(e) => setCurrentQty(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </SaleField>

              <SaleField label="Sale Price">
                <input
                  className={`${inputClassName} font-bold`}
                  type="number"
                  min="0"
                  value={currentPrice || ""}
                  onChange={(e) => setCurrentPrice(Number(e.target.value) || 0)}
                  placeholder="0"
                />
              </SaleField>

              <SaleField label="Discount (৳)">
                <input
                  className={inputClassName}
                  type="number"
                  min="0"
                  value={currentDiscount || ""}
                  onChange={(e) => setCurrentDiscount(Number(e.target.value) || 0)}
                  placeholder="0"
                />
              </SaleField>

              <button
                type="button"
                onClick={handleAddItem}
                className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#123b9c] text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d2f80] cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            {/* Line Items Table */}
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Product & SKU</th>
                    <th className="py-3 px-3 text-center">Qty</th>
                    <th className="py-3 px-3 text-right">Unit Price</th>
                    <th className="py-3 px-3 text-right">Discount</th>
                    <th className="py-3 px-3 text-right">Total</th>
                    <th className="py-3 px-3 text-center w-16">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cartItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No products added to the sale yet. Use the search bar above to add products.
                      </td>
                    </tr>
                  ) : (
                    cartItems.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-3">
                          <p className="font-bold text-slate-800">{item.productName}</p>
                          <span className="text-[11px] text-slate-400 font-mono">
                            SKU: {item.sku}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-800">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-600">
                          ৳ {Number(item.unitPrice).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right text-red-500">
                          {Number(item.discount || 0) > 0
                            ? `− ৳ ${Number(item.discount).toLocaleString()}`
                            : "—"}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">
                          ৳ {Number(item.subtotal).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveCartItem(index)}
                            className="p-1 text-slate-400 hover:text-red-500 transition"
                            title="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </SaleAccordion>

          {/* 4. Payment Details */}
          <SaleAccordion number={4} title="Payment Details" defaultOpen>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SaleField label="Payment Method">
                <div className="relative">
                  <select
                    className={`${inputClassName} appearance-none`}
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Mobile Banking">Mobile Banking (bKash / Nagad)</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </SaleField>

              <SaleField label="Payment Status">
                <div className="flex h-11 items-center px-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full ${
                      dueAmount <= 0
                        ? "bg-emerald-100 text-emerald-800"
                        : paidAmount > 0
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {dueAmount <= 0 ? "Paid" : paidAmount > 0 ? "Partial" : "Due"}
                  </span>
                </div>
              </SaleField>
            </div>

            <SaleField label="Paid Amount" className="mt-3">
              <input
                className={`${inputClassName} font-bold text-emerald-700 text-base`}
                type="number"
                min="0"
                value={paidAmountInput}
                onChange={(e) => setPaidAmountInput(e.target.value)}
              />
            </SaleField>

            <SaleField label="Remarks / Notes" className="mt-3">
              <textarea
                className="w-full resize-none rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-blue-600 focus:bg-white"
                rows={2}
                placeholder="Add any internal notes or customer reference here..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </SaleField>
          </SaleAccordion>

          {/* 5. Financial Summary */}
          <SaleAccordion number={5} title="Financial Summary" defaultOpen>
            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
              {/* Left: Tax Rate Input */}
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <h4 className="mb-3 text-[12px] font-bold uppercase tracking-wider text-slate-500">Tax / VAT Configuration</h4>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="mb-1 block text-[12px] font-semibold text-slate-600">VAT / Tax Rate (%)</label>
                      <div className="relative">
                        <input
                          className={`${inputClassName} pr-10 font-mono`}
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          value={taxPercent || ""}
                          onChange={(e) => setTaxPercent(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                          placeholder="0"
                        />
                        <span className="pointer-events-none absolute right-3 top-3 text-sm font-bold text-slate-400">%</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="mb-1 block text-[12px] font-semibold text-slate-600">Tax Amount (Auto)</label>
                      <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 font-mono text-sm font-bold text-slate-700">
                        ৳ {taxAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Financial Breakdown */}
              <div className="rounded-xl bg-slate-50/80 border border-slate-200 p-5 space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                  <span className="font-semibold text-slate-800">
                    ৳ {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Discount</span>
                  <span className="font-semibold text-red-500">
                    − ৳ {totalDiscount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">VAT / Tax ({taxPercent}%)</span>
                  <span className="font-semibold text-slate-800">
                    + ৳ {taxAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2.5 text-sm font-black text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-blue-900 text-base">
                    ৳ {grandTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Paid Amount</span>
                  <span>৳ {paidAmount.toLocaleString()}</span>
                </div>
                <div className={`flex justify-between rounded-xl p-2.5 font-bold border ${dueAmount <= 0 ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                  <span>{dueAmount <= 0 ? "✓ Fully Paid" : "Due Amount"}</span>
                  <span>৳ {Math.max(0, dueAmount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </SaleAccordion>


          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => {
                setCartItems([]);
                setPaidAmountInput("0");
                setRemarks("");
              }}
              className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel / Reset
            </button>
            <button
              type="submit"
              disabled={submitting || cartItems.length === 0}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#123b9c] px-8 text-sm font-bold text-white shadow-md hover:bg-blue-800 disabled:opacity-50 transition cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              {submitting ? "Processing Sale..." : "Create Sale & Print Invoice"}
            </button>
          </div>
        </form>
      </div>

      {/* Sale Receipt & Invoice Modal */}
      <SaleReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        sale={createdSale}
      />
    </section>
  );
}
