"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Search,
  RotateCcw,
  Package,
  CheckCircle2,
  Printer,
  X,
  FileSpreadsheet,
  Building2,
  Calendar,

  ArrowRight,
  Info,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { Purchase, PurchaseReturn, ReturnSettlementType } from "@/types/purchase";
import ReturnInvoiceModal from "./ReturnInvoiceModal";
import ReturnDebitNoteModal from "./ReturnDebitNoteModal";

interface SelectedReturnItem {
  productId: string;
  purchaseItemId?: string;
  productName: string;
  purchasedQty: number;
  returnQty: number;
  unitPrice: number;
  returnReason: string;
  serialNumbers: string[];
}

const RETURN_REASONS = [
  "Damaged / Broken in Transit",
  "Defective / Technical Fault",
  "Wrong Item Received",
  "Expired / Near Expiry",
  "Excess Stock / Over-ordered",
  "Quality Mismatch",
  "Other Reason",
];

export default function PurchaseReturnClient() {
  const [searchInvoice, setSearchInvoice] = useState("");
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Return items table state
  const [selectedItems, setSelectedItems] = useState<Record<string, SelectedReturnItem>>({});
  const [settlementType, setSettlementType] = useState<ReturnSettlementType>("adjust_due");
  const [generalReason, setGeneralReason] = useState("");
  const [notes, setNotes] = useState("");

  // Modals state
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isDebitNoteModalOpen, setIsDebitNoteModalOpen] = useState(false);
  const [activeDebitNote, setActiveDebitNote] = useState<PurchaseReturn | null>(null);

  // Returns History & Stats
  const [returnsHistory, setReturnsHistory] = useState<PurchaseReturn[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [historySearch, setHistorySearch] = useState("");
  const [stats, setStats] = useState({
    totalReturns: 0,
    totalRefundAmount: 0,
    pendingCount: 0,
    completedCount: 0,
    uniqueSuppliersCount: 0,
  });

  // Fetch recent returns & stats
  const fetchReturnHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/purchases/return");
      const data = await res.json();
      if (data.success) {
        setReturnsHistory(data.returns || []);
        if (data.stats) {
          setStats(data.stats);
        }
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

  // Search invoice
  const handleSearch = async (overrideInvoiceId?: string) => {
    const invToSearch = (overrideInvoiceId || searchInvoice).trim();
    if (!invToSearch) {
      toast.error("Please enter a purchase invoice number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/purchases?search=${encodeURIComponent(invToSearch)}`);
      const data = await res.json();
      const purchases = Array.isArray(data.purchases)
        ? (data.purchases as Purchase[])
        : [];

      if (data.success && purchases.length > 0) {
        // Find exact match first or pick the first matching purchase
        const found =
          purchases.find(
            (candidate) =>
              candidate.id?.toLowerCase() === invToSearch.toLowerCase() ||
              candidate.purchaseNumber?.toLowerCase() === invToSearch.toLowerCase() ||
              candidate.referenceNo?.toLowerCase() === invToSearch.toLowerCase()
          ) || purchases[0];

        setPurchase(found);
        setSearchInvoice(found.id || found.purchaseNumber || invToSearch);

        // Pre-populate items map (none selected by default)
        const initialMap: Record<string, SelectedReturnItem> = {};
        found.items?.forEach((it) => {
          initialMap[it.productId] = {
            productId: it.productId,
            purchaseItemId: it.id,
            productName: it.title || it.productName || "Product",
            purchasedQty: it.quantity || 1,
            returnQty: 1,
            unitPrice: Number(it.price || it.unitCost || 0),
            returnReason: RETURN_REASONS[0],
            serialNumbers: it.serialNumbers || [],
          };
        });
        setSelectedItems({});
        toast.success(`Purchase Invoice loaded: ${found.id || invToSearch}`);
      } else {
        toast.error("Purchase invoice not found. Check the ID and try again.");
      }
    } catch (err) {
      console.error("Error fetching purchase invoice:", err);
      toast.error("Failed to fetch purchase invoice details.");
    } finally {
      setLoading(false);
    }
  };

  // Select/Deselect product in table
  const handleToggleProduct = (item: Purchase["items"][number]) => {
    setSelectedItems((prev) => {
      const copy = { ...prev };
      if (copy[item.productId]) {
        delete copy[item.productId];
      } else {
        copy[item.productId] = {
          productId: item.productId,
          purchaseItemId: item.id,
          productName: item.title || item.productName || "Product",
          purchasedQty: item.quantity || 1,
          returnQty: 1,
          unitPrice: Number(item.price || item.unitCost || 0),
          returnReason: RETURN_REASONS[0],
          serialNumbers: [],
        };
      }
      return copy;
    });
  };

  // Change Return Qty
  const handleQtyChange = (productId: string, val: number, max: number) => {
    const safeVal = Math.min(Math.max(1, isNaN(val) ? 1 : val), max);
    setSelectedItems((prev) => {
      if (!prev[productId]) return prev;
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          returnQty: safeVal,
        },
      };
    });
  };

  // Change Reason
  const handleReasonChange = (productId: string, reason: string) => {
    setSelectedItems((prev) => {
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

  // Reset current purchase
  const handleResetPurchase = () => {
    setPurchase(null);
    setSearchInvoice("");
    setSelectedItems({});
    setGeneralReason("");
    setNotes("");
  };

  // Calculations
  const selectedItemsList = Object.values(selectedItems);
  const totalReturnUnits = selectedItemsList.reduce((sum, item) => sum + item.returnQty, 0);
  const totalRefundAmount = selectedItemsList.reduce(
    (sum, item) => sum + item.returnQty * item.unitPrice,
    0
  );

  // Submit Return
  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchase) return;

    if (selectedItemsList.length === 0) {
      toast.error("Please select at least one item to return.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        purchaseId: purchase.id || purchase.purchaseNumber || purchase._id,
        purchaseInvoiceNo: purchase.id || purchase.purchaseNumber,
        supplierId: purchase.supplierId,
        supplierName: purchase.supplierName,
        supplierPhone: purchase.supplierPhone,
        branchName: purchase.branchName,
        settlementType,
        returnReason: generalReason || selectedItemsList[0]?.returnReason || "General Return",
        notes,
        items: selectedItemsList.map((item) => ({
          productId: item.productId,
          purchaseItemId: item.purchaseItemId,
          productName: item.productName,
          quantity: item.returnQty,
          unitPrice: item.unitPrice,
          refundAmount: item.returnQty * item.unitPrice,
          returnReason: item.returnReason,
          serialNumbers: item.serialNumbers,
        })),
      };

      const res = await fetch("/api/purchases/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.return) {
        toast.success(`Purchase return saved! Return ID: ${data.return.returnId}`);
        setActiveDebitNote(data.return);
        setIsDebitNoteModalOpen(true);
        handleResetPurchase();
        fetchReturnHistory();
      } else {
        toast.error(data.error || "Failed to process return.");
      }
    } catch (err) {
      console.error("Return submission error:", err);
      toast.error("An error occurred while processing the purchase return.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter history
  const filteredReturns = returnsHistory.filter((item) => {
    const matchesStatus =
      statusFilter === "all" || item.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      !historySearch ||
      item.returnId?.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.purchaseInvoiceNo?.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.supplierName?.toLowerCase().includes(historySearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <main className=" px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#123b9c]/10 text-[#123b9c]">
                <RotateCcw className="h-5 w-5" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Purchase Return
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Return received inventory to supplier, adjust ledger balance, and issue official debit notes.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsInvoiceModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-blue-400 transition"
            >
              <FileSpreadsheet className="h-4 w-4 text-blue-700" />
              Browse Invoices
            </button>
            <button
              type="button"
              onClick={fetchReturnHistory}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm hover:bg-slate-50 transition"
              title="Refresh return history"
            >
              <RefreshCw className={`h-4 w-4 ${historyLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* 4 Stat Overview Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Returns
              </span>
              <span className="rounded-lg bg-blue-50 p-2 text-blue-700">
                <Package className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">{stats.totalReturns}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Recorded return operations</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Value Credited
              </span>
              <span className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                <DollarSign className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-emerald-700">
              ৳ {stats.totalRefundAmount.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Supplier credit or refunded</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Completed Returns
              </span>
              <span className="rounded-lg bg-indigo-50 p-2 text-indigo-700">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">{stats.completedCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Approved & settled</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Suppliers Involved
              </span>
              <span className="rounded-lg bg-amber-50 p-2 text-amber-700">
                <Building2 className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900">{stats.uniqueSuppliersCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Vendors credited</p>
          </div>
        </div>

        {/* Invoice Search Box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600">
                <span>Purchase Invoice Number</span>
                <span className="text-[11px] font-normal text-slate-400">
                  e.g. PUR-2026-001 or supplier reference
                </span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter purchase invoice number or reference..."
                  value={searchInvoice}
                  onChange={(e) => setSearchInvoice(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#123b9c] focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#123b9c] px-6 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 disabled:opacity-70 transition cursor-pointer"
              >
                <Search className="h-4 w-4" />
                {loading ? "Searching..." : "Load Purchase"}
              </button>

              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(true)}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
              >
                Quick Pick
              </button>
            </div>
          </div>
        </div>

        {/* STATE A: When Purchase IS LOADED (Active Return Process) */}
        {purchase ? (
          <form onSubmit={handleSubmitReturn} className="space-y-5 animate-in fade-in">
            {/* Header: Loaded Purchase Info */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-blue-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-blue-900">
                      {purchase.id || purchase.purchaseNumber}
                    </span>
                    {purchase.referenceNo && (
                      <span className="rounded bg-white px-2 py-0.5 text-xs text-slate-600 border border-slate-200">
                        Ref: {purchase.referenceNo}
                      </span>
                    )}
                    <span className="rounded bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      Status: {purchase.status || "Received"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" /> Date: {purchase.purchaseDate}
                    </span>
                    {purchase.branchName && (
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" /> Branch: {purchase.branchName}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Supplier Due Balance</p>
                    <p className="text-sm font-bold text-amber-800">
                      ৳ {Number(purchase.dueAmount || 0).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetPurchase}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                  >
                    <X className="h-3.5 w-3.5" />
                    Unload / Cancel
                  </button>
                </div>
              </div>

              {/* Supplier Details Strip */}
              <div className="grid grid-cols-2 gap-4 pt-3 sm:grid-cols-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Supplier Name</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {purchase.supplierName || "Direct Supplier"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Contact Phone</span>
                  <span className="text-slate-700 font-medium">
                    {purchase.supplierPhone || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Invoice Net Total</span>
                  <span className="font-bold text-slate-800 text-sm">
                    ৳ {Number(purchase.grandTotal ?? purchase.subTotal ?? 0).toLocaleString()}
                  </span>
                  {Number(purchase.totalRefundAmount || 0) > 0 && (
                    <span className="text-[11px] text-red-600 font-semibold block">
                      (Prev Returned: -৳ {Number(purchase.totalRefundAmount).toLocaleString()})
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Due Balance</span>
                  <span className="font-semibold text-amber-700 text-sm">
                    ৳ {Number(purchase.dueAmount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Products Return Table */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Select Products & Quantities to Return
                  </h3>
                  <p className="text-xs text-slate-500">
                    Check the items you want to return, specify the returned quantity and select the reason.
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {selectedItemsList.length} of {purchase.items?.length || 0} items selected
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3 text-center w-12">Return?</th>
                      <th className="py-3 px-3">Product Name / Title</th>
                      <th className="py-3 px-3 text-center">Purchased</th>
                      <th className="py-3 px-3 text-center">Prev Returned</th>
                      <th className="py-3 px-3 text-center">Available</th>
                      <th className="py-3 px-3 text-right">Unit Price</th>
                      <th className="py-3 px-3 text-center w-36">Return Qty</th>
                      <th className="py-3 px-3 w-56">Return Reason</th>
                      <th className="py-3 px-3 text-right">Credit Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {purchase.items?.map((item) => {
                      const isChecked = Boolean(selectedItems[item.productId]);
                      const currentSelected = selectedItems[item.productId];
                      const purchasedQty = Number(item.quantity) || 1;
                      const prevReturned = Number(item.returnedQuantity) || 0;
                      const maxQty = item.availableQuantity !== undefined
                        ? Number(item.availableQuantity)
                        : Math.max(0, purchasedQty - prevReturned);
                      const isFullyReturned = maxQty <= 0;
                      const returnQty = currentSelected?.returnQty || 1;
                      const itemSubtotal = returnQty * Number(item.price || 0);

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
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              disabled={isFullyReturned}
                              checked={isChecked}
                              onChange={() => handleToggleProduct(item)}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                            />
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-800">{item.title}</p>
                              {isFullyReturned && (
                                <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">
                                  Fully Returned
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 font-mono">
                              ID: {item.productId}
                            </p>
                          </td>
                          <td className="py-3 px-3 text-center font-semibold text-slate-700">
                            {purchasedQty}
                          </td>
                          <td className="py-3 px-3 text-center font-medium text-amber-700">
                            {prevReturned > 0 ? prevReturned : "—"}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-emerald-700">
                            {maxQty}
                          </td>
                          <td className="py-3 px-3 text-right text-slate-600 font-medium">
                            ৳ {Number(item.price).toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {isChecked && !isFullyReturned ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQtyChange(item.productId, returnQty - 1, maxQty)
                                  }
                                  className="h-7 w-7 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
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
                                  className="h-7 w-14 text-center rounded border border-slate-300 bg-white font-bold text-slate-800 outline-none focus:border-blue-600"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQtyChange(item.productId, returnQty + 1, maxQty)
                                  }
                                  className="h-7 w-7 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
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
                          <td className="py-3 px-3">
                            {isChecked ? (
                              <select
                                value={currentSelected?.returnReason || RETURN_REASONS[0]}
                                onChange={(e) =>
                                  handleReasonChange(item.productId, e.target.value)
                                }
                                className="h-8 w-full rounded border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-blue-600"
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
                          <td className="py-3 px-3 text-right font-bold text-slate-900">
                            {isChecked ? (
                              `৳ ${itemSubtotal.toLocaleString()}`
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

            {/* Settlement Options & Notes Card */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Refund & Settlement Method
                </h3>
                <div className="space-y-2.5">
                  <label
                    className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
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
                      className="mt-1 h-4 w-4 text-blue-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Adjust with Supplier Due / Payable
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Deducts return amount from current pending due (৳ {Number(purchase.dueAmount || 0).toLocaleString()}).
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
                      settlementType === "supplier_credit"
                        ? "border-blue-600 bg-blue-50/50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="settlementType"
                      value="supplier_credit"
                      checked={settlementType === "supplier_credit"}
                      onChange={() => setSettlementType("supplier_credit")}
                      className="mt-1 h-4 w-4 text-blue-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Supplier Credit Ledger (Credit Note)
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Holds amount as credit with supplier for future purchase orders.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${
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
                      className="mt-1 h-4 w-4 text-blue-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Direct Cash / Bank Refund
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Supplier instantly refunds the returned amount via Cash or Bank transfer.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Return Remarks & Internal Notes
                </h3>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">
                    Overall Return Summary / Reason
                  </label>
                  <input
                    type="text"
                    value={generalReason}
                    onChange={(e) => setGeneralReason(e.target.value)}
                    placeholder="Brief summary e.g. Batch #401 arrived defective"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">
                    Internal Notes / Memo (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional details for store manager or accounts..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs outline-none focus:border-blue-600 focus:bg-white resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="sticky bottom-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-slate-400 block">Selected Items</span>
                  <span className="text-base font-black text-slate-900">
                    {selectedItemsList.length} ({totalReturnUnits} Units)
                  </span>
                </div>
                <div className="border-l border-slate-200 pl-6">
                  <span className="text-slate-400 block">Total Refund Credit</span>
                  <span className="text-xl font-black text-blue-900">
                    ৳ {totalRefundAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleResetPurchase}
                  className="rounded-xl border border-slate-200 bg-slate-100 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || selectedItemsList.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#123b9c] px-7 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-800 disabled:opacity-50 transition cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  {submitting ? "Processing Return..." : "Confirm & Save Return"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* STATE B: When NO Purchase is Loaded (Default Dashboard State) */
          <div className="space-y-6">
            {/* Quick Process Guidance Banner */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/60 p-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Ready to initiate a supplier return?
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Search an invoice number above or click{" "}
                    <button
                      type="button"
                      onClick={() => setIsInvoiceModalOpen(true)}
                      className="font-bold text-blue-700 underline underline-offset-2"
                    >
                      Browse Invoices
                    </button>{" "}
                    to load purchased items and calculate credit refunds instantly.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-800 transition whitespace-nowrap"
              >
                Select Purchase Invoice
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Recent Purchase Returns History Table */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Recent Purchase Returns History
                  </h3>
                  <p className="text-xs text-slate-500">
                    Audit trail of all processed inventory returns and supplier debit notes.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filter returns..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      className="h-9 w-44 sm:w-52 rounded-xl border border-slate-200 bg-slate-50/60 pl-8 pr-3 text-xs outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-9 rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-xs text-slate-700 outline-none focus:border-blue-600"
                  >
                    <option value="all">All Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3">Return ID</th>
                      <th className="py-3 px-3">Purchase Ref</th>
                      <th className="py-3 px-3">Supplier Name</th>
                      <th className="py-3 px-3">Return Date</th>
                      <th className="py-3 px-3 text-center">Items</th>
                      <th className="py-3 px-3 text-right">Credit Amount</th>
                      <th className="py-3 px-3">Settlement</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {historyLoading ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-400">
                          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                          Loading return records...
                        </td>
                      </tr>
                    ) : filteredReturns.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-400">
                          <Package className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-slate-600">
                            No purchase returns recorded yet
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Load an invoice above to process your first inventory return.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredReturns.map((ret) => (
                        <tr key={ret._id || ret.returnId} className="hover:bg-slate-50/60 transition">
                          <td className="py-3 px-3 font-mono font-bold text-blue-900">
                            {ret.returnId}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-600">
                            {ret.purchaseInvoiceNo || ret.purchaseId}
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-800">
                            {ret.supplierName || "Supplier"}
                          </td>
                          <td className="py-3 px-3 text-slate-500">
                            {new Date(ret.returnDate || ret.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-3 px-3 text-center font-semibold text-slate-700">
                            {ret.items?.length || 0}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900">
                            ৳ {Number(ret.totalRefundAmount || 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 capitalize">
                              {ret.settlementType ? ret.settlementType.replace("_", " ") : "Credit Note"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                ret.status === "Completed"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {ret.status || "Completed"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDebitNote(ret);
                                setIsDebitNoteModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-[#123b9c] hover:text-white transition shadow-sm"
                            >
                              <Printer className="h-3.5 w-3.5" />
                              Debit Note
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Quick Selection Modal */}
      <ReturnInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSelectInvoice={(invId) => {
          setSearchInvoice(invId);
          handleSearch(invId);
        }}
      />

      {/* Debit Note Voucher Print Modal */}
      <ReturnDebitNoteModal
        isOpen={isDebitNoteModalOpen}
        onClose={() => setIsDebitNoteModalOpen(false)}
        returnData={activeDebitNote}
      />
    </main>
  );
}
