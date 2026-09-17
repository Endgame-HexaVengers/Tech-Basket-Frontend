"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Calendar, User, Package, Check, Loader2 } from "lucide-react";
import { Purchase } from "@/types/purchase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectInvoice: (invoiceId: string) => void;
}

export default function ReturnInvoiceModal({ isOpen, onClose, onSelectInvoice }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchPurchases = async () => {
      setLoading(true);
      try {
        const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
        const res = await fetch(`/api/purchases${query}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.purchases)) {
          setPurchases(data.purchases);
        }
      } catch (err) {
        console.error("Failed to fetch purchases:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchPurchases, 300);
    return () => clearTimeout(debounce);
  }, [isOpen, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Select Purchase Invoice for Return</h2>
            <p className="text-xs text-slate-500">Pick an invoice from recent purchases or search by invoice number or supplier</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="border-b border-slate-100 p-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by invoice number (e.g. PUR-...), supplier name, or ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
              autoFocus
            />
          </div>
        </div>

        {/* Invoice List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
              <p className="text-sm">Loading purchase records...</p>
            </div>
          ) : purchases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Package className="h-10 w-10 text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-600">No purchase invoices found</p>
              <p className="text-xs text-slate-400 mt-1">Try another search keyword or create a new purchase entry.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {purchases.map((p) => {
                const invId = p.id || (p as any).purchaseNumber || (p as any)._id;
                const itemCount = p.items?.length || 0;
                return (
                  <div
                    key={p._id || invId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-blue-400 hover:shadow-md transition-all group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-blue-800">
                          {invId}
                        </span>
                        {p.referenceNo && (
                          <span className="text-xs text-slate-400">
                            (Ref: {p.referenceNo})
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            p.status === "Returned"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : p.status === "Partially Returned"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {p.status || "Received"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          {p.supplierName || "Direct Supplier"}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {p.purchaseDate}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Package className="h-3.5 w-3.5 text-slate-400" />
                          {itemCount} Items
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-slate-400">Net Grand Total</p>
                        <p className="text-sm font-bold text-slate-900">
                          ৳ {Number(p.grandTotal ?? p.subTotal ?? 0).toLocaleString()}
                        </p>
                        {Number(p.totalRefundAmount || 0) > 0 && (
                          <p className="text-[11px] font-semibold text-red-600">
                            (Returned: -৳{Number(p.totalRefundAmount).toLocaleString()})
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectInvoice(invId);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs hover:bg-[#123b9c] hover:text-white transition group-hover:bg-[#123b9c] group-hover:text-white"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Select
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/70 px-6 py-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
