"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Calendar,
  Filter,
  FileText,
  XCircle,
  CheckCircle2,
  Loader2,
  Check,
  Search,

} from "lucide-react";
import FadeUp from "@/components/FadeUp";
import { Button } from "@heroui/react";

interface PurchaseOrder {
  id: string;
  invoiceNumber: string;
  branchName?: string;
  date?: string;
  amount?: number;
}

interface Branch {
  id: string;
  name: string;
}

// 6 Default Branches
const defaultBranches: Branch[] = [
  { id: "1", name: "Dhaka Main Branch" },
  { id: "2", name: "Chittagong Hub" },
  { id: "3", name: "Sylhet Outlet" },
  { id: "4", name: "Rajshahi Center" },
  { id: "5", name: "Tangail Branch" },
  { id: "6", name: "Cumilla Point" },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api";

export default function ApprovalPage() {
  const [branches, setBranches] = useState<Branch[]>(defaultBranches);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    
    // Initial UI Preview Data
    { id: "1", invoiceNumber: "INV-2026-000121" },
    { id: "2", invoiceNumber: "INV-2026-000122" },
    { id: "3", invoiceNumber: "INV-2026-000123" },
    { id: "4", invoiceNumber: "INV-2026-000124" },
    { id: "5", invoiceNumber: "INV-2026-000125" },
  ]);

  // Filter States
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/branches`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) setBranches(data);
      }
    } catch (error) {
      console.log("Using default branches list.");
    }
  };

  // Fetch Purchase Orders
  const handleLoad = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedBranch) queryParams.append("branch", selectedBranch);
      if (fromDate) queryParams.append("fromDate", fromDate);
      if (toDate) queryParams.append("toDate", toDate);

      const res = await fetch(`${API_BASE_URL}/purchase-orders?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPurchaseOrders(data);
        setSelectedIds([]);
      }
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Improved Select / Deselect Logic
  const isAllSelected =
    purchaseOrders.length > 0 && selectedIds.length === purchaseOrders.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      const allIds = purchaseOrders.map((item) => item.id);
      setSelectedIds(allIds);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Actions
  const handleApproval = async () => {
    if (!selectedIds.length) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/purchase-orders/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (res.ok) {
        setPurchaseOrders((prev) => prev.filter((po) => !selectedIds.includes(po.id)));
        setSelectedIds([]);
      }
    } catch (error) {
      console.error("Error approving orders:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedIds.length) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/purchase-orders/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (res.ok) {
        setPurchaseOrders((prev) => prev.filter((po) => !selectedIds.includes(po.id)));
        setSelectedIds([]);
      }
    } catch (error) {
      console.error("Error rejecting orders:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReport = () => {
    window.open(`${API_BASE_URL}/reports/purchase-orders`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Card */}
      <FadeUp>
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4 md:items-end">

            {/* Branch Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Branch Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* From Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                From Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-2 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* To Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                To Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-2 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Load Button */}
            <button
              type="button"
              onClick={handleLoad}
              disabled={loading}
              className="flex h-[42px] items-center justify-center gap-2 rounded-xl bg-[#0d1b2a] px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1b263b] hover:shadow active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Filter className="h-4 w-4" />
              )}
              Load Data
            </button>
          </div>
        </div>
      </FadeUp>

      {/* Main List Box */}
      <FadeUp>
        <div className="overflow-hidden rounded-xl border border-dashed border-slate-200/80 bg-white shadow-sm">
          {/* Header / Select All Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
            <button
              type="button"
              onClick={handleSelectAll}
              className="group flex items-center gap-3 text-sm font-semibold text-slate-700 transition hover:text-blue-900"
            >
              {isAllSelected ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#00175c] text-white shadow-sm">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              ) : (
                <div className="h-5 w-5 rounded-full border-2  border-slate-300 bg-white transition-all group-hover:border-blue-500" />
              )}
              Select All
            </button>

            <span className="rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-[#00175c]">
              {selectedIds.length} Purchase Orders Selected
            </span>
          </div>

          {/* Column Label */}
          <div className="border-b border-dashed border-slate-100 bg-slate-100/60 px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Invoice Number
          </div>

          {/* Invoice List Items */}
          <div className="divide-y divide-slate-100">
            {purchaseOrders.length > 0 ? (
              purchaseOrders.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelect(item.id)}
                    className={`group flex cursor-pointer items-center gap-4 px-6 py-4 transition-all ${isSelected
                        ? "bg-blue-50/40 hover:bg-blue-50/60"
                        : "hover:bg-slate-50"
                      }`}
                  >
                    <div className="flex items-center justify-center">
                      {isSelected ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#00175c] text-white shadow-sm">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2  border-slate-300 bg-white transition-all group-hover:border-blue-400" />
                      )}
                    </div>

                    <span className="font-mono text-sm font-semibold tracking-wide text-slate-800">
                      {item.invoiceNumber}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Search className="mb-2 h-8 w-8 text-slate-300" />
                <p className="text-sm">No purchase orders found. Click &ldquo;Load Data&quot;.</p>
              </div>
            )}
          </div>
        </div>
      </FadeUp>
      {/* Action Buttons Bar */}
      <FadeUp>
        <div className="flex items-center justify-center gap-4 rounded-xl border border-dashed border-gray-200 bg-white p-4 shadow-sm">
          <Button
            type="button"
            onClick={handleReport}
            className="flex items-center gap-2 cursor-pointer  rounded border border-dashed border-slate-200 bg-white px-7 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
          >
            <FileText className="h-4 w-4 text-slate-500" />
            Report
          </Button>

          <Button
            type="button"
            onClick={handleReject}
            isDisabled={!selectedIds.length || actionLoading}
            className="flex items-center gap-2 cursor-pointer  rounded border border-dashed border-rose-200 bg-rose-50/60 px-7 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 hover:text-rose-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <XCircle className="h-4 w-4" />
            Reject
          </Button>

          <Button
            type="button"
            onClick={handleApproval}
            isDisabled={!selectedIds.length || actionLoading}
            className="flex items-center gap-2 cursor-pointer  rounded border border-dashed border-[#00175c] bg-[#00175c] px-8 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#000f3d] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {actionLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Approval
          </Button>
        </div>
      </FadeUp>
    </div>
  );
}