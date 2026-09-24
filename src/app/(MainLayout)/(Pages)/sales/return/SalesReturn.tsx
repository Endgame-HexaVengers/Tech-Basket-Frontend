"use client";

import { useState, useEffect } from "react";
import {  Search, X, Printer, RotateCcw,} from "lucide-react";
import toast from "react-hot-toast";
import type { Sale, SalesReturn, SalesReturnSettlementType } from "@/types/sale";
import SalesCreditNoteModal from "@/components/SalesSection/SalesCreditNoteModal";

type ReturnStats = {
  totalReturns: number;
  totalRefundAmount: number;
  uniqueCustomers: number;
};

const RETURN_REASONS = [
  "Defective / Technical Fault",
  "Customer Changed Mind",
  "Wrong Item Supplied",
  "Damaged Packaging",
  "Quality Not as Expected",
  "Other Reason",
];

export default function SalesReturn() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingSales, setLoadingSales] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [eligibleSales, setEligibleSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Return items selection
  const [selectedReturnItems, setSelectedReturnItems] = useState<
    Record<
      string,
      {
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        refundAmount: number;
        returnReason: string;
      }
    >
  >({});

  const [settlementType, setSettlementType] = useState<SalesReturnSettlementType>("cash_refund");
  const [returnNotes, setReturnNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Credit note modal
  const [activeCreditNote, setActiveCreditNote] = useState<SalesReturn | null>(null);
  const [isCreditNoteModalOpen, setIsCreditNoteModalOpen] = useState(false);

  // Return history
  const [returnHistory, setReturnHistory] = useState<SalesReturn[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [returnStats, setReturnStats] = useState<ReturnStats>({
    totalReturns: 0,
    totalRefundAmount: 0,
    uniqueCustomers: 0,
  });

  // Fetch return history
  const fetchReturnHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/sales/return");
      const data = await res.json();
      if (data.success && Array.isArray(data.returns)) {
        setReturnHistory(data.returns);
      }
      if (data.success && data.stats) {
        setReturnStats({
          totalReturns: Number(data.stats.totalReturns) || 0,
          totalRefundAmount: Number(data.stats.totalRefundAmount) || 0,
          uniqueCustomers: Number(data.stats.uniqueCustomers) || 0,
        });
      }
    } catch (err) {
      console.error("Failed to load return history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReturnHistory();
  }, []);

  // Search sales by invoice or phone
  const handleSearchSale = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a phone number or invoice ID to search");
      return;
    }

    setLoadingSales(true);
    try {
      const res = await fetch(`/api/sales?search=${encodeURIComponent(searchTerm.trim())}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.sales) && data.sales.length > 0) {
        setEligibleSales(data.sales);
        setSelectedSale(data.sales[0]);
        setSelectedReturnItems({});
        toast.success(`Found ${data.sales.length} eligible sales`);
      } else {
        toast.error("No matching sales records found");
        setEligibleSales([]);
        setSelectedSale(null);
      }
    } catch (err) {
      console.error("Sale search error:", err);
      toast.error("Failed to search sales");
    } finally {
      setLoadingSales(false);
    }
  };

  // Toggle Item for return
  const handleToggleItem = (item: any) => {
    setSelectedReturnItems((prev) => {
      const copy = { ...prev };
      if (copy[item.productId]) {
        delete copy[item.productId];
      } else {
        copy[item.productId] = {
          productId: item.productId,
          productName: item.productName || item.title || "Product",
          quantity: 1,
          unitPrice: Number(item.unitPrice || 0),
          refundAmount: Number(item.unitPrice || 0),
          returnReason: RETURN_REASONS[0],
        };
      }
      return copy;
    });
  };

  // Change Return Qty
  const handleQtyChange = (productId: string, val: number, max: number) => {
    const safeVal = Math.min(Math.max(1, isNaN(val) ? 1 : val), max);
    setSelectedReturnItems((prev) => {
      if (!prev[productId]) return prev;
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: safeVal,
          refundAmount: safeVal * prev[productId].unitPrice,
        },
      };
    });
  };

  // Change Reason
  const handleReasonChange = (productId: string, reason: string) => {
    setSelectedReturnItems((prev) => {
      if (!prev[productId]) return prev;
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          returnReason: reason,
        },
      };
    });
  };

  const returnItemsList = Object.values(selectedReturnItems);
  const totalRefundAmount = returnItemsList.reduce((sum, it) => sum + it.refundAmount, 0);
  const totalReturnUnits = returnItemsList.reduce((sum, it) => sum + it.quantity, 0);

  // Submit Sales Return
  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSale) return;

    if (returnItemsList.length === 0) {
      toast.error("Please select at least one item to return");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        saleId: selectedSale.id,
        invoiceNo: selectedSale.invoiceNo,
        customerId: selectedSale.customer?.customerId,
        customerName: selectedSale.customer?.name,
        customerPhone: selectedSale.customer?.phone,
        branchName: selectedSale.branch?.branchName || "Dhaka Branch",
        settlementType,
        returnReason: returnItemsList[0]?.returnReason || "Customer Return",
        notes: returnNotes,
        items: returnItemsList,
      };

      const res = await fetch("/api/sales/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.return) {
        toast.success(`Sales return processed! ID: ${data.return.returnId}`);
        setActiveCreditNote(data.return);
        setIsCreditNoteModalOpen(true);
        setSelectedSale(null);
        setSelectedReturnItems({});
        setSearchTerm("");
        fetchReturnHistory();
      } else {
        toast.error(data.error || "Failed to process return");
      }
    } catch (err) {
      console.error("Sales return error:", err);
      toast.error("An error occurred while processing return");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-72px)] w-full px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="w-full space-y-4">
        {/* Header */}
        <header className="border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-[#123b9c]">
              <RotateCcw className="h-4 w-4" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Customer Sales Return
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Search completed sale by customer phone or invoice number, accept returned items, and issue credit notes.
          </p>
        </header>

        {/* Return Summary */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Returns</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{returnStats.totalReturns.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Refund Amount</p>
            <p className="mt-1 text-2xl font-black text-blue-900">৳ {returnStats.totalRefundAmount.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Unique Customers</p>
            <p className="mt-1 text-2xl font-black text-slate-900">{returnStats.uniqueCustomers.toLocaleString()}</p>
          </div>
        </div>

        {/* Search Sale Box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Search Sale by Invoice Number or Phone
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSale()}
                  placeholder="e.g. SALE-2026-0001, INV-2026-0001 or 01712345678..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 text-xs outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleSearchSale}
              disabled={loadingSales}
              className="h-10 rounded-xl bg-[#123b9c] px-7 text-xs font-bold text-white shadow-sm hover:bg-blue-800 disabled:opacity-60 transition cursor-pointer"
            >
              {loadingSales ? "Searching..." : "Load Sale"}
            </button>
          </div>
        </div>

        {/* Active Return Workflow */}
        {selectedSale ? (
          <form onSubmit={handleSubmitReturn} className="space-y-4 animate-in fade-in">
            {/* Sale & Customer Summary Card */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-blue-900">
                      {selectedSale.id}
                    </span>
                    <span className="font-mono text-xs text-slate-600">
                      (Invoice: {selectedSale.invoiceNo || "N/A"})
                    </span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                      {selectedSale.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sale Date: {selectedSale.saleDate} • Branch: {selectedSale.branch?.branchName || "Dhaka Branch"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSale(null)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <X className="h-3.5 w-3.5" />
                  Unload Sale
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Customer Name</span>
                  <b className="text-slate-800">{selectedSale.customer?.name}</b>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Phone Number</span>
                  <b className="text-slate-700 font-mono">{selectedSale.customer?.phone}</b>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Net Grand Total</span>
                  <b className="text-slate-900">
                    ৳ {Number(selectedSale.grandTotal).toLocaleString()}
                  </b>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Customer Due</span>
                  <b className="text-amber-800 font-bold">
                    ৳ {Number(selectedSale.dueAmount || 0).toLocaleString()}
                  </b>
                </div>
              </div>
            </div>

            {/* Products Return Table */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Select Sold Products to Return
                  </h3>
                  <p className="text-xs text-slate-500">
                    Choose which items are being returned by the customer and specify the return reason.
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                  {returnItemsList.length} items selected
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 text-center w-12">Return?</th>
                      <th className="py-2.5 px-3">Product Name</th>
                      <th className="py-2.5 px-3 text-center">Sold Qty</th>
                      <th className="py-2.5 px-3 text-center">Prev Returned</th>
                      <th className="py-2.5 px-3 text-center">Available</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-center w-32">Return Qty</th>
                      <th className="py-2.5 px-3 w-52">Return Reason</th>
                      <th className="py-2.5 px-3 text-right">Refund Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedSale.items?.map((item) => {
                      const isChecked = Boolean(selectedReturnItems[item.productId]);
                      const currentSelected = selectedReturnItems[item.productId];
                      const soldQty = Number(item.quantity) || 1;
                      const prevRet = Number(item.returnedQuantity) || 0;
                      const maxQty = item.availableQuantity !== undefined
                        ? Number(item.availableQuantity)
                        : Math.max(0, soldQty - prevRet);
                      const isFullyReturned = maxQty <= 0;
                      const returnQty = currentSelected?.quantity || 1;
                      const itemRefund = returnQty * Number(item.unitPrice || 0);

                      return (
                        <tr
                          key={item.productId}
                          className={`transition ${
                            isFullyReturned
                              ? "bg-slate-50/80 opacity-60"
                              : isChecked
                              ? "bg-blue-50/30"
                              : "hover:bg-slate-50/60"
                          }`}
                        >
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              disabled={isFullyReturned}
                              checked={isChecked}
                              onChange={() => handleToggleItem(item)}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-800">{item.productName}</p>
                              {isFullyReturned && (
                                <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">
                                  Fully Returned
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              SKU: {item.sku}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-semibold text-slate-700">
                            {soldQty}
                          </td>
                          <td className="py-2.5 px-3 text-center font-medium text-amber-700">
                            {prevRet > 0 ? prevRet : "—"}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-emerald-700">
                            {maxQty}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-600 font-medium">
                            ৳ {Number(item.unitPrice).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {isChecked && !isFullyReturned ? (
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQtyChange(item.productId, returnQty - 1, maxQty)
                                  }
                                  className="h-6 w-6 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min={1}
                                  max={maxQty}
                                  value={returnQty}
                                  onChange={(e) =>
                                    handleQtyChange(
                                      item.productId,
                                      parseInt(e.target.value) || 1,
                                      maxQty
                                    )
                                  }
                                  className="h-6 w-12 text-center rounded border border-slate-300 bg-white font-bold text-slate-800 outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQtyChange(item.productId, returnQty + 1, maxQty)
                                  }
                                  className="h-6 w-6 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">
                                {isFullyReturned ? "N/A" : "Unselected"}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            {isChecked ? (
                              <select
                                value={currentSelected?.returnReason || RETURN_REASONS[0]}
                                onChange={(e) =>
                                  handleReasonChange(item.productId, e.target.value)
                                }
                                className="h-7 w-full rounded border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none"
                              >
                                {RETURN_REASONS.map((r) => (
                                  <option key={r} value={r}>
                                    {r}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                            {isChecked ? (
                              `৳ ${itemRefund.toLocaleString()}`
                            ) : (
                              <span className="text-slate-300">৳ 0</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Settlement Options & Notes */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Refund & Settlement Method
                </h3>
                <div className="space-y-2">
                  <label
                    className={`flex items-start gap-2.5 rounded-xl border p-2.5 cursor-pointer transition ${
                      settlementType === "cash_refund"
                        ? "border-blue-600 bg-blue-50/50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="settlementType"
                      value="cash_refund"
                      checked={settlementType === "cash_refund"}
                      onChange={() => setSettlementType("cash_refund")}
                      className="mt-1 h-3.5 w-3.5 text-blue-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Direct Cash / Mobile Banking Refund
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Cash or bKash/Nagad returned immediately to customer.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 rounded-xl border p-2.5 cursor-pointer transition ${
                      settlementType === "adjust_due"
                        ? "border-blue-600 bg-blue-50/50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="settlementType"
                      value="adjust_due"
                      checked={settlementType === "adjust_due"}
                      onChange={() => setSettlementType("adjust_due")}
                      className="mt-1 h-3.5 w-3.5 text-blue-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Adjust with Customer Due Balance
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Deducts return amount from customer unpaid balance (৳ {Number(selectedSale.dueAmount || 0).toLocaleString()}).
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 rounded-xl border p-2.5 cursor-pointer transition ${
                      settlementType === "customer_credit"
                        ? "border-blue-600 bg-blue-50/50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="settlementType"
                      value="customer_credit"
                      checked={settlementType === "customer_credit"}
                      onChange={() => setSettlementType("customer_credit")}
                      className="mt-1 h-3.5 w-3.5 text-blue-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Store Credit Voucher (Future Purchases)
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Credited to customer wallet / store credit for subsequent sales.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Return Remarks & Notes
                </h3>
                <textarea
                  rows={4}
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  placeholder="Describe reason or customer feedback for store manager..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs outline-none focus:border-blue-600 focus:bg-white resize-none"
                />
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="sticky bottom-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-400 block">Return Items</span>
                  <span className="text-sm font-black text-slate-900">
                    {returnItemsList.length} ({totalReturnUnits} Units)
                  </span>
                </div>
                <div className="border-l border-slate-200 pl-6">
                  <span className="text-slate-400 block">Total Refund</span>
                  <span className="text-lg font-black text-blue-900">
                    ৳ {totalRefundAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReturnItems({})}
                  className="rounded-xl border border-slate-200 bg-slate-100 px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
                >
                  Clear Selection
                </button>
                <button
                  type="submit"
                  disabled={submitting || returnItemsList.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123b9c] px-7 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-800 disabled:opacity-50 transition cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  {submitting ? "Processing..." : "Save Return & Print Credit Note"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Recent Returns History Table */
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Recent Sales Returns Audit Trail
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              List of all customer returns and issued credit note vouchers.
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Return ID</th>
                    <th className="py-2.5 px-3">Original Sale</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Return Date</th>
                    <th className="py-2.5 px-3 text-center">Items</th>
                    <th className="py-2.5 px-3 text-right">Refund Amount</th>
                    <th className="py-2.5 px-3">Settlement</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historyLoading ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Loading return history...
                      </td>
                    </tr>
                  ) : returnHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No customer sales returns recorded yet.
                      </td>
                    </tr>
                  ) : (
                    returnHistory.map((ret) => (
                      <tr key={ret._id || ret.returnId} className="hover:bg-slate-50/60 transition">
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-900">
                          {ret.returnId}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">
                          {ret.saleId}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          {ret.customerName}
                          <span className="block text-[10px] text-slate-400">{ret.customerPhone}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">
                          {new Date(ret.returnDate || ret.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-2.5 px-3 text-center font-semibold text-slate-700">
                          {ret.items?.length || 0}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          ৳ {Number(ret.totalRefundAmount || 0).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 capitalize text-slate-700">
                          {ret.settlementType ? ret.settlementType.replace("_", " ") : "Cash"}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveCreditNote(ret);
                              setIsCreditNoteModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-[#123b9c] hover:text-white transition shadow-sm"
                          >
                            <Printer className="h-3 w-3" />
                            Credit Note
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Credit Note Modal */}
      <SalesCreditNoteModal
        isOpen={isCreditNoteModalOpen}
        onClose={() => setIsCreditNoteModalOpen(false)}
        returnData={activeCreditNote}
      />
    </section>
  );
}
