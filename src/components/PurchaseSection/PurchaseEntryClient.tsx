"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTabs } from "@/context/TabContext";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Package,
  Plus,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import { PurchaseItem } from "@/types/purchase";
import toast from "react-hot-toast";

const inputClass =
  "h-11 w-full rounded-sm border border-slate-200 bg-white px-3 text-[14px] text-slate-700 outline-none transition focus:border-[#123b9c] focus:ring-2 focus:ring-blue-100";

function Field({
  label,
  children,
  className = "",
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`block ${className}`}>
      <div className="mb-1.5 text-[14px] font-medium text-slate-600">
        {label}
      </div>
      {children}
    </div>
  );
}

function Accordion({
  number,
  title,
  children,
  defaultOpen = false,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-hidden rounded-sm border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex min-h-14 w-full items-center justify-between bg-slate-50 px-4 text-left hover:bg-slate-100"
      >
        <span className="flex items-center gap-3">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-[14px] font-semibold ${open ? "bg-[#123b9c] text-white" : "bg-slate-200 text-slate-600"}`}
          >
            {number}
          </span>
          <span className="text-[16px] font-semibold text-slate-900">
            {title}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-600 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="border-t border-slate-200 p-4">{children}</div>}
    </section>
  );
}

export default function PurchaseEntryClient() {
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  
  // Form State
  const [supplierName, setSupplierName] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [supplierType, setSupplierType] = useState("Business");
  
  const [purchasePerson, setPurchasePerson] = useState("Rahim Ahmed");
  const [employeeId, setEmployeeId] = useState("EMP-00125");
  const [branch, setBranch] = useState("Dhaka Main Branch");
  const [branchId, setBranchId] = useState("640000000000000000000001");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [referenceNo, setReferenceNo] = useState("");
  
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Partial");
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [notes, setNotes] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  let openTab: any = null;
  try {
    const tabContext = useTabs();
    openTab = tabContext.openTab;
  } catch {
    // Outside TabProvider fallback
  }

  const [successData, setSuccessData] = useState<{
    id: string;
    supplierName: string;
    grandTotal: number;
    itemsCount: number;
  } | null>(null);
  const [countdown, setCountdown] = useState<number>(3);
  const [isRedirectCancelled, setIsRedirectCancelled] = useState(false);

  const navigateToInvoice = (purchaseId: string) => {
    if (openTab) {
      openTab({
        path: "/purchase/purchase-invoice",
        query: `id=${purchaseId}`,
        title: "Purchase Invoice",
        icon: "•",
      });
    }
    router.push(`/purchase/purchase-invoice?id=${purchaseId}`);
  };

  useEffect(() => {
    if (!successData || isRedirectCancelled) return;

    if (countdown <= 0) {
      navigateToInvoice(successData.id);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [successData, countdown, isRedirectCancelled]);

  // Temp fields for adding new product
  const [tempQty, setTempQty] = useState<number>(1);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempDiscount, setTempDiscount] = useState<number>(0);
  const [tempDiscountType, setTempDiscountType] = useState<"percent" | "fixed">("percent");

  const subtotal = items.reduce((total, item) => total + item.quantity * item.price, 0);
  const discount = items.reduce((total, item) => total + (item.discount || 0), 0);
  const tax = items.reduce((total, item) => total + (item.tax || 0), 0);
  const totalAmount = Math.max(0, subtotal - discount + tax);
  const dueAmount = totalAmount - paidAmount;

  const addItem = () => {
    if (!search.trim()) return;
    const qty = Number(tempQty) || 1;
    const price = Number(tempPrice) || 0;
    const rawDisc = Number(tempDiscount) || 0;
    const itemSub = qty * price;

    let discAmount = 0;
    let discPercent = 0;
    if (tempDiscountType === "percent") {
      discPercent = rawDisc;
      discAmount = Math.round(((itemSub * rawDisc) / 100) * 100) / 100;
    } else {
      discAmount = rawDisc;
      discPercent = itemSub > 0 ? Math.round(((rawDisc / itemSub) * 100) * 10) / 10 : 0;
    }

    const itemTotal = Math.max(0, itemSub - discAmount);

    setItems((current) => [
      ...current,
      {
        id: `TEMP_ITEM_${items.length + 1}`,
        productId: `TEMP_PROD_${items.length + 1}`,
        title: search,
        quantity: qty,
        price: price,
        total: itemTotal,
        discount: discAmount,
        discountPercent: discPercent,
        discountType: tempDiscountType,
        tax: 0
      },
    ]);
    setSearch("");
    setTempQty(1);
    setTempPrice(0);
    setTempDiscount(0);
  };

  const updateItem = (
    id: string, 
    field: "quantity" | "price" | "discountPercent" | "discount", 
    value: number
  ) => {
    setItems((current) => current.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        const sub = (updated.quantity || 0) * (updated.price || 0);
        
        if (field === "discountPercent") {
          updated.discountPercent = value;
          updated.discountType = "percent";
          updated.discount = Math.round(((sub * (value || 0)) / 100) * 100) / 100;
        } else if (field === "discount") {
          updated.discount = value;
          updated.discountType = "fixed";
          updated.discountPercent = sub > 0 ? Math.round(((value / sub) * 100) * 10) / 10 : 0;
        } else if (field === "quantity" || field === "price") {
          if (updated.discountType === "percent" || (updated.discountPercent !== undefined && updated.discountPercent > 0)) {
            updated.discount = Math.round(((sub * (updated.discountPercent || 0)) / 100) * 100) / 100;
          }
        }
        
        updated.total = Math.max(0, sub - (updated.discount || 0) + (updated.tax || 0));
        return updated;
      }
      return item;
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");
    
    if (items.length === 0) {
      setError("Please add at least one product.");
      return;
    }
    
    if (!supplierName) {
      toast.error("Supplier Name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId: supplierId || "SUP_UNSELECTED",
          supplierName,
          supplierPhone,
          branchId,
          branchName: branch,
          purchasePerson,
          employeeId,
          purchaseDate,
          referenceNo,
          items,
          subTotal: subtotal,
          totalTax: tax,
          totalDiscount: discount,
          grandTotal: totalAmount,
          paidAmount,
          dueAmount,
          status: "Received", // Assuming default to Received for now
          paymentStatus,
          notes
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccessData({
          id: data.purchase.id,
          supplierName: supplierName || "Supplier",
          grandTotal: totalAmount,
          itemsCount: items.length,
        });
        setCountdown(3);
        setIsRedirectCancelled(false);

        // Reset form
        setItems([]);
        setSupplierName("");
        setSupplierId("");
        setSupplierPhone("");
        setReferenceNo("");
        setPaidAmount(0);
        setNotes("");
      } else {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : (data.error || "Failed to save purchase.");
        setError(errorMsg);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] px-5 py-6 text-slate-900 sm:px-8 lg:px-10">
      <div className="w-full">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight">
              New Purchase Entry
            </h1>
            <p className="mt-1 text-[14px] text-slate-500">
              Create a purchase record and add received products.
            </p>
          </div>
          <span className="text-[14px] font-medium text-slate-500">
            {branch}
          </span>
        </header>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <Accordion number={1} title="Supplier Information" defaultOpen>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Field
                label="Search Supplier by Phone or Name"
                className="w-full sm:max-w-105"
              >
                <div className="relative">
                  <Search className="absolute left-2.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    className={`${inputClass} pl-9`}
                    placeholder="Search supplier..."
                  />
                </div>
              </Field>
              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-sm bg-slate-200 px-4 text-[14px] font-semibold text-slate-700"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Supplier Name *">
                <input
                  className={inputClass}
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="Enter Supplier Name"
                  required
                />
              </Field>
              <Field label="Supplier ID">
                <input
                  className={inputClass}
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  placeholder="Auto-generated if empty"
                />
              </Field>
              <Field label="Phone Number">
                <input 
                  className={inputClass} 
                  value={supplierPhone}
                  onChange={(e) => setSupplierPhone(e.target.value)}
                  placeholder="Enter Phone Number"
                />
              </Field>
              <Field label="Supplier Type">
                <select
                  className={`${inputClass} appearance-none`}
                  value={supplierType}
                  onChange={(e) => setSupplierType(e.target.value)}
                >
                  <option>Business</option>
                  <option>Individual</option>
                </select>
              </Field>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-sm bg-[#123b9c] px-5 text-[14px] font-semibold text-white hover:bg-[#0d2f80]"
              >
                <UserPlus className="h-4 w-4" />
                Create Supplier
              </button>
            </div>
          </Accordion>

          <Accordion number={2} title="Purchase Information" defaultOpen>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Purchase Person">
                <input
                  className={inputClass}
                  value={purchasePerson}
                  onChange={(e) => setPurchasePerson(e.target.value)}
                />
              </Field>
              <Field label="Employee ID">
                <input
                  className={inputClass}
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                />
              </Field>
              <Field label="Branch">
                <input
                  className={inputClass}
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
              </Field>
              <Field label="Purchase Date">
                <input
                  className={inputClass}
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </Field>
            </div>
            <Field label="Supplier Invoice / Reference No." className="mt-3">
              <input
                className={inputClass}
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="Enter supplier invoice number"
              />
            </Field>
          </Accordion>

          <Accordion number={3} title="Product Information" defaultOpen>
            <div className="grid gap-3 rounded-sm border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[minmax(0,1fr)_85px_120px_165px_75px] sm:items-end">
              <Field label="Search Product (Name/SKU)">
                <div className="relative">
                  <Package className="absolute left-2.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    className={`${inputClass} pl-9`}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Type product name or SKU..."
                  />
                </div>
              </Field>
              <Field label="Qty">
                <input
                  className={inputClass}
                  type="number"
                  min="1"
                  value={tempQty}
                  onChange={(e) => setTempQty(Number(e.target.value))}
                />
              </Field>
              <Field label="Purchase Price">
                <input
                  className={inputClass}
                  type="number"
                  placeholder="0"
                  value={tempPrice || ""}
                  onChange={(e) => setTempPrice(Number(e.target.value))}
                />
              </Field>
              <Field
                label={
                  <div className="flex w-full items-center justify-between">
                    <span>Discount</span>
                    <div className="inline-flex rounded border border-slate-300 bg-white p-0.5 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setTempDiscountType("percent")}
                        className={`px-1.5 py-0.5 rounded transition ${
                          tempDiscountType === "percent"
                            ? "bg-[#123b9c] text-white"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                        title="Percentage discount"
                      >
                        %
                      </button>
                      <button
                        type="button"
                        onClick={() => setTempDiscountType("fixed")}
                        className={`px-1.5 py-0.5 rounded transition ${
                          tempDiscountType === "fixed"
                            ? "bg-[#123b9c] text-white"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                        title="Fixed amount discount"
                      >
                        ৳
                      </button>
                    </div>
                  </div>
                }
              >
                <div className="relative">
                  <input
                    className={`${inputClass} pr-7 font-medium`}
                    type="number"
                    min="0"
                    max={tempDiscountType === "percent" ? 100 : undefined}
                    step="any"
                    placeholder="0"
                    value={tempDiscount || ""}
                    onChange={(e) => setTempDiscount(Number(e.target.value))}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                    {tempDiscountType === "percent" ? "%" : "৳"}
                  </span>
                </div>
                {tempDiscountType === "percent" && (
                  <div className="mt-1 flex items-center gap-1">
                    {[0, 5, 10, 15, 20].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setTempDiscount(pct)}
                        className={`px-1.5 py-0.5 text-[10px] rounded font-semibold border transition ${
                          tempDiscount === pct
                            ? "bg-[#123b9c] border-[#123b9c] text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                )}
                {tempDiscountType === "percent" && tempDiscount > 0 && tempPrice > 0 && (
                  <p className="mt-1 text-[11px] font-semibold text-emerald-600">
                    = -৳{Math.round((((tempQty || 1) * tempPrice * tempDiscount) / 100) * 100) / 100} off
                  </p>
                )}
              </Field>
              <button
                type="button"
                onClick={addItem}
                className="flex h-11 items-center justify-center gap-1 rounded-sm bg-[#123b9c] text-[14px] font-semibold text-white hover:bg-[#0d2f80]"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-180 border-collapse text-left text-[14px]">
                <thead className="border-y border-slate-200 bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Product Name</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Discount</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="px-3 py-3 font-medium">
                        {item.title}
                        <span className="block font-mono text-[12px] font-normal text-slate-400">
                          ID: {item.productId}
                        </span>
                      </td>
                      <td>
                        <input 
                           type="number" 
                           min="1"
                           className="w-16 border rounded px-1.5 py-1 text-sm outline-none" 
                           value={item.quantity} 
                           onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                        />
                      </td>
                      <td>
                        <input 
                           type="number" 
                           className="w-20 border rounded px-1.5 py-1 text-sm outline-none" 
                           value={item.price} 
                           onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                        />
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <div className="relative w-20">
                            <input 
                              type="number" 
                              step="any"
                              min="0"
                              max="100"
                              className="w-full border border-slate-200 rounded px-2 py-1 text-sm outline-none text-right pr-6 focus:border-[#123b9c] bg-white font-medium" 
                              value={item.discountPercent !== undefined ? item.discountPercent : (item.discount ? Math.round(((item.discount / (item.quantity * item.price)) * 100) * 10) / 10 : 0)} 
                              onChange={(e) => updateItem(item.id, 'discountPercent', Number(e.target.value))}
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none">%</span>
                          </div>
                          <span className="text-[12px] text-slate-500 font-medium whitespace-nowrap">
                            (-৳{(item.discount || 0).toLocaleString()})
                          </span>
                        </div>
                      </td>
                      <td className="font-semibold text-slate-800">
                        ৳ {item.total.toLocaleString()}
                      </td>
                      <td>
                        <button
                          type="button"
                          aria-label={`Remove ${item.title}`}
                          onClick={() =>
                            setItems((current) =>
                              current.filter((entry) => entry.id !== item.id),
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700 transition" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-slate-400">No products added.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Accordion>

          <Accordion number={4} title="Payment Details">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Payment Method">
                <select
                  className={`${inputClass} appearance-none`}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option>Card</option>
                </select>
              </Field>
              <Field label="Payment Status">
                <select
                  className={`${inputClass} appearance-none`}
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                >
                  <option value="Partial">Partial</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </Field>
              <Field label="Paid Amount">
                <input 
                  className={inputClass} 
                  type="number" 
                  value={paidAmount} 
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                />
              </Field>
              <Field label="Due Amount">
                <input
                  className={`${inputClass} bg-slate-50 font-semibold`}
                  value={`৳ ${dueAmount.toLocaleString()}`}
                  readOnly
                />
              </Field>
            </div>
            <Field label="Remarks / Notes" className="mt-3">
              <textarea
                className={`${inputClass} h-20 resize-none py-2`}
                placeholder="Add internal notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Field>
          </Accordion>

          <Accordion number={5} title="Financial Summary" defaultOpen>
            <div className="w-full space-y-3 text-[14px]">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} products)</span>
                <span>৳ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Discount</span>
                <span className="font-semibold text-red-500">
                  - ৳ {discount.toLocaleString()}{" "}
                  {subtotal > 0 && discount > 0 && (
                    <span className="text-xs font-normal text-slate-500">
                      ({((discount / subtotal) * 100).toFixed(1)}%)
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>VAT / Tax (0%)</span>
                <span>৳ {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-[16px] font-semibold">
                <span>Grand Total</span>
                <span className="text-[#123b9c]">৳ {totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </Accordion>

          {message && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded border border-emerald-200">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-3">
            <button
              type="reset"
              onClick={() => setItems([])}
              className="h-11 rounded-sm border border-slate-200 bg-slate-100 px-5 text-[14px] font-semibold text-slate-600 hover:bg-slate-200"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-sm bg-[#123b9c] px-5 text-[14px] font-semibold text-white hover:bg-[#0d2f80] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Purchase"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Purchase Success Modal */}
      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Purchase Saved Successfully!
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your purchase order has been saved into the system.
            </p>

            <div className="my-5 rounded-xl bg-slate-50 p-4 text-left border border-slate-100 space-y-2.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Purchase ID:</span>
                <span className="font-mono font-bold text-[#123b9c] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-sm">
                  {successData.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Supplier:</span>
                <span className="font-semibold text-slate-700">{successData.supplierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Products:</span>
                <span className="font-medium text-slate-700">{successData.itemsCount} items</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2.5 font-semibold text-[15px]">
                <span className="text-slate-700">Grand Total:</span>
                <span className="text-emerald-600">৳ {successData.grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {!isRedirectCancelled ? (
              <div className="mb-5 text-xs font-semibold text-blue-700 bg-blue-50/80 py-2.5 px-3 rounded-lg border border-blue-100 flex items-center justify-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Redirecting to <strong>Purchase Invoice & Serials</strong> in {countdown}s...</span>
              </div>
            ) : (
              <div className="mb-5 text-xs font-medium text-slate-500 bg-slate-100 py-2 px-3 rounded-lg">
                Auto-redirect paused
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => navigateToInvoice(successData.id)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#123b9c] px-4 text-sm font-semibold text-white shadow-md hover:bg-[#0d2f80] transition active:scale-[0.98]"
              >
                <span>Go to Purchase Invoice Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRedirectCancelled(true);
                  setSuccessData(null);
                }}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                <span>Stay Here & Create Another Purchase</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
