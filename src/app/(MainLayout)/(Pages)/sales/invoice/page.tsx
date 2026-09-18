"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  Eye,
  Search,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  Wallet,
  AlertCircle,
  FileCheck,
  Clock,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Sale } from "@/types/sale";
import SaleReceiptModal from "@/components/SalesSection/SaleReceiptModal";

const fieldClass =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none focus:border-[#123b9c] focus:ring-2 focus:ring-blue-100 transition";

type Stats = {
  totalSalesCount: number;
  totalRevenue: number;
  totalPaid: number;
  totalDue: number;
  invoicedCount: number;
  pendingInvoiceCount: number;
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  isCurrency = true,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  isCurrency?: boolean;
}) => (
  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
      <Icon className="h-5 w-5" />
    </span>
    <div className="min-w-0">
      <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-0.5 text-lg font-black text-slate-900">
        {isCurrency ? `৳ ${Number(value).toLocaleString()}` : Number(value).toLocaleString()}
      </p>
    </div>
  </div>
);

export default function SalesInvoicePage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalSalesCount: 0,
    totalRevenue: 0,
    totalPaid: 0,
    totalDue: 0,
    invoicedCount: 0,
    pendingInvoiceCount: 0,
  });

  const [selectedSaleId, setSelectedSaleId] = useState<string>("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      if (statusFilter !== "all") params.set("invoiceStatus", statusFilter);

      const res = await fetch(`/api/sales?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.sales)) {
        setSales(data.sales);
        if (data.stats) setStats(data.stats);
        if (data.sales.length > 0 && !selectedSaleId) {
          setSelectedSaleId(data.sales[0].id);
          setSelectedSale(data.sales[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load sales:", err);
      toast.error("Failed to load sales list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredSales = useMemo(() => {
    if (!searchQuery.trim()) return sales;
    const q = searchQuery.toLowerCase();
    return sales.filter(
      (s) =>
        s.id?.toLowerCase().includes(q) ||
        s.invoiceNo?.toLowerCase().includes(q) ||
        s.customer?.name?.toLowerCase().includes(q) ||
        s.customer?.phone?.includes(q) ||
        s.salesPerson?.name?.toLowerCase().includes(q)
    );
  }, [sales, searchQuery]);

  const handleSelectSale = (s: Sale) => {
    setSelectedSaleId(s.id);
    setSelectedSale(s);
  };

  const handleFinalizeInvoice = async () => {
    if (!selectedSale) return;
    try {
      const res = await fetch(`/api/sales/${selectedSale.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceStatus: "Invoiced" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Invoice for ${selectedSale.id} finalized!`);
        setSales((prev) =>
          prev.map((s) => s.id === selectedSale.id ? { ...s, invoiceStatus: "Invoiced" } : s)
        );
        setSelectedSale((prev) => prev ? { ...prev, invoiceStatus: "Invoiced" } : prev);
      }
    } catch {
      toast.error("Failed to finalize invoice");
    }
  };

  const getPaymentBadge = (status?: string) => {
    if (status === "Paid") return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (status === "Partial") return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getSaleStatusBadge = (status?: string) => {
    if (status === "Completed") return "bg-emerald-100 text-emerald-800";
    if (status === "Returned") return "bg-red-100 text-red-800";
    if (status === "Partially Returned") return "bg-amber-100 text-amber-800";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <section className="w-full min-h-[calc(100vh-64px)] bg-[#f8fafc] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="w-full space-y-5">

        {/* Page Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Sales Invoice Center
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              TechBasket ERP • Enterprise Sales Invoicing & Receipt Generator
            </p>
          </div>
          <button
            type="button"
            onClick={fetchSales}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60 transition cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </header>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Total Sales" value={stats.totalSalesCount} icon={TrendingUp} color="bg-blue-100 text-blue-700" isCurrency={false} />
          <StatCard label="Total Revenue" value={stats.totalRevenue} icon={TrendingUp} color="bg-indigo-100 text-indigo-700" />
          <StatCard label="Total Paid" value={stats.totalPaid} icon={Wallet} color="bg-emerald-100 text-emerald-700" />
          <StatCard label="Total Due" value={stats.totalDue} icon={AlertCircle} color="bg-red-100 text-red-700" />
          <StatCard label="Invoiced" value={stats.invoicedCount} icon={FileCheck} color="bg-teal-100 text-teal-700" isCurrency={false} />
          <StatCard label="Pending" value={stats.pendingInvoiceCount} icon={Clock} color="bg-amber-100 text-amber-700" isCurrency={false} />
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto_auto] lg:items-end">
            <div>
              <label className="mb-1 block text-[12px] font-bold uppercase tracking-wider text-slate-500">Search Sale</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  className={`${fieldClass} pl-9`}
                  placeholder="Sale ID, invoice no, customer name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")} className="absolute right-3 top-3 text-slate-400 hover:text-slate-700">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-bold uppercase tracking-wider text-slate-500">Invoice Status</label>
              <div className="relative">
                <select className={`${fieldClass} appearance-none`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="Invoiced">Invoiced</option>
                  <option value="Pending">Pending</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-bold uppercase tracking-wider text-slate-500">Date From</label>
              <input className={fieldClass} type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-bold uppercase tracking-wider text-slate-500">Date To</label>
              <input className={fieldClass} type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <button onClick={fetchSales} disabled={loading} className="h-10 rounded-xl bg-[#123b9c] px-5 text-[13px] font-bold text-white shadow-sm hover:bg-blue-800 disabled:opacity-60 transition cursor-pointer" type="button">
              {loading ? "Loading..." : "Load"}
            </button>
            <button onClick={() => { setSearchQuery(""); setDateFrom(""); setDateTo(""); setStatusFilter("all"); }} className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-4 text-[13px] font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer" type="button">
              Clear
            </button>
          </div>
        </div>

        {/* Sales List Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h2 className="text-sm font-bold text-slate-900">
              Sales Records{" "}
              <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                {filteredSales.length}
              </span>
            </h2>
            {selectedSale && (
              <span className="text-xs text-slate-500">
                Selected: <span className="font-mono font-bold text-blue-900">{selectedSale.id}</span>
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-3 w-12 text-center">Sel.</th>
                  <th className="py-3 px-3">Sale ID</th>
                  <th className="py-3 px-3">Invoice No</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Sale Date</th>
                  <th className="py-3 px-3">Sales Person</th>
                  <th className="py-3 px-3 text-right">Grand Total</th>
                  <th className="py-3 px-3 text-center">Payment</th>
                  <th className="py-3 px-3 text-center">Invoice Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-400">
                      <RefreshCw className="mx-auto mb-2 h-5 w-5 animate-spin" />
                      Loading sales records...
                    </td>
                  </tr>
                ) : filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-400">
                      No sales records found. Try adjusting your filters or create sales in &quot;Sales Entry&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((s) => {
                    const isSelected = selectedSaleId === s.id;
                    return (
                      <tr
                        key={s.id}
                        onClick={() => handleSelectSale(s)}
                        className={`cursor-pointer transition ${isSelected ? "bg-blue-50/70" : "hover:bg-slate-50"}`}
                      >
                        <td className="px-3 py-3 text-center">
                          <input type="radio" name="selectedSale" checked={isSelected} onChange={() => handleSelectSale(s)} className="h-4 w-4 cursor-pointer accent-[#123b9c]" />
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-[#123b9c]">{s.id}</td>
                        <td className="py-3 px-3 font-mono text-slate-500">{s.invoiceNo || "—"}</td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-slate-800">{s.customer?.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{s.customer?.phone}</p>
                        </td>
                        <td className="py-3 px-3 text-slate-500">{s.saleDate}</td>
                        <td className="py-3 px-3 text-slate-600">{s.salesPerson?.name}</td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">৳ {Number(s.grandTotal).toLocaleString()}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getPaymentBadge(s.paymentStatus)}`}>
                            {s.paymentStatus || "—"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${s.invoiceStatus === "Invoiced" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"}`}>
                            {s.invoiceStatus || "Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Sale Detail Panel */}
        {selectedSale && (
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Sale Info */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#123b9c] text-[11px] font-bold text-white">2</span>
                  Sale Information
                </h3>
                <div className="grid grid-cols-2 gap-y-3 text-xs">
                  <div><span className="text-slate-400 block mb-0.5">Sale ID</span><b className="font-mono text-sm text-blue-900">{selectedSale.id}</b></div>
                  <div><span className="text-slate-400 block mb-0.5">Invoice Number</span><b className="font-mono text-slate-800">{selectedSale.invoiceNo || "—"}</b></div>
                  <div><span className="text-slate-400 block mb-0.5">Sale Date</span><b>{selectedSale.saleDate}</b></div>
                  <div><span className="text-slate-400 block mb-0.5">Sales Person</span><b>{selectedSale.salesPerson?.name}</b></div>
                  <div><span className="text-slate-400 block mb-0.5">Branch</span><b>{selectedSale.branch?.branchName || "Dhaka Branch"}</b></div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Sale Status</span>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${getSaleStatusBadge(selectedSale.status)}`}>{selectedSale.status}</span>
                  </div>
                  <div><span className="text-slate-400 block mb-0.5">Payment Method</span><b>{selectedSale.paymentMethod}</b></div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Payment Status</span>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold border ${getPaymentBadge(selectedSale.paymentStatus)}`}>{selectedSale.paymentStatus}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#123b9c] text-[11px] font-bold text-white">3</span>
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-y-3 text-xs">
                  <div><span className="text-slate-400 block mb-0.5">Customer ID</span><b className="font-mono text-slate-600">{selectedSale.customer?.customerId}</b></div>
                  <div><span className="text-slate-400 block mb-0.5">Account Type</span><b>{selectedSale.customer?.type || "Individual"}</b></div>
                  <div><span className="text-slate-400 block mb-0.5">Full Name</span><b className="text-slate-900">{selectedSale.customer?.name}</b></div>
                  <div><span className="text-slate-400 block mb-0.5">Phone Number</span><b className="font-mono">{selectedSale.customer?.phone}</b></div>
                  <div className="col-span-2"><span className="text-slate-400 block mb-0.5">Billing Address</span><p className="text-slate-700">{selectedSale.customer?.address || "N/A"}</p></div>
                  {Number(selectedSale.dueAmount) > 0 && (
                    <div className="col-span-2 rounded-xl bg-red-50 border border-red-100 p-2.5">
                      <span className="text-red-600 font-bold text-[12px]">⚠ Outstanding Due: ৳ {Number(selectedSale.dueAmount).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-5 py-3">
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#123b9c] text-[11px] font-bold text-white">4</span>
                  Sale Line Items ({selectedSale.items?.length || 0} products)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">#</th>
                      <th className="py-3 px-3">Product Name</th>
                      <th className="py-3 px-3">SKU</th>
                      <th className="py-3 px-3 text-center">Qty</th>
                      <th className="py-3 px-3 text-right">Unit Price</th>
                      <th className="py-3 px-3 text-right">Discount</th>
                      <th className="py-3 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedSale.items?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 text-center text-slate-400">{idx + 1}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{item.productName}</td>
                        <td className="py-3 px-3 font-mono text-slate-500">{item.sku}</td>
                        <td className="py-3 px-3 text-center font-bold text-slate-800">{item.quantity}</td>
                        <td className="py-3 px-3 text-right text-slate-600">৳ {Number(item.unitPrice).toLocaleString()}</td>
                        <td className="py-3 px-3 text-right text-red-500">{Number(item.discount || 0) > 0 ? `− ৳ ${Number(item.discount).toLocaleString()}` : "—"}</td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">৳ {Number(item.subtotal).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-bold text-xs">
                    {Number(selectedSale.totalDiscount) > 0 && (
                      <tr><td colSpan={6} className="py-2.5 px-4 text-right text-slate-500">Total Discount:</td><td className="py-2.5 px-3 text-right text-red-500">− ৳ {Number(selectedSale.totalDiscount).toLocaleString()}</td></tr>
                    )}
                    {Number(selectedSale.tax) > 0 && (
                      <tr><td colSpan={6} className="py-2.5 px-4 text-right text-slate-500">VAT / Tax:</td><td className="py-2.5 px-3 text-right text-slate-700">+ ৳ {Number(selectedSale.tax).toLocaleString()}</td></tr>
                    )}
                    <tr>
                      <td colSpan={6} className="py-3 px-4 text-right text-slate-700 text-sm">Grand Total:</td>
                      <td className="py-3 px-3 text-right text-sm text-[#123b9c]">৳ {Number(selectedSale.grandTotal).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Actions Footer */}
            <footer className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4 text-xs">
                <div><span className="text-slate-400 block">Grand Total</span><span className="text-lg font-black text-slate-900">৳ {Number(selectedSale.grandTotal).toLocaleString()}</span></div>
                <div className="border-l border-slate-200 pl-4"><span className="text-slate-400 block">Paid</span><span className="text-base font-bold text-emerald-700">৳ {Number(selectedSale.paidAmount).toLocaleString()}</span></div>
                {Number(selectedSale.dueAmount) > 0 && (
                  <div className="border-l border-slate-200 pl-4"><span className="text-slate-400 block">Due</span><span className="text-base font-bold text-red-600">৳ {Number(selectedSale.dueAmount).toLocaleString()}</span></div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedSale.invoiceStatus !== "Invoiced" && (
                  <button onClick={handleFinalizeInvoice} className="h-11 inline-flex items-center gap-2 rounded-xl bg-[#123b9c] px-6 text-xs font-bold text-white shadow-md hover:bg-blue-800 transition cursor-pointer" type="button">
                    <CheckCircle2 className="h-4 w-4" />
                    Finalize & Mark Invoiced
                  </button>
                )}
                <button onClick={() => setIsReceiptModalOpen(true)} className="h-11 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-sm" type="button">
                  <Eye className="h-4 w-4 text-blue-700" />
                  Preview & Print Invoice
                </button>
              </div>
            </footer>
          </div>
        )}
      </div>

      <SaleReceiptModal isOpen={isReceiptModalOpen} onClose={() => setIsReceiptModalOpen(false)} sale={selectedSale} />
    </section>
  );
}

import { Printer, FileText, User, Calendar, Building2, Phone } from "lucide-react";

const legacyFieldClass =
  "h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-[14px] text-slate-700 outline-none focus:border-blue-600 transition";
const legacyLabelClass =
  "mb-1.5 block text-[13px] font-semibold uppercase tracking-wide text-slate-600";

const InvoiceAccordion = ({
  number,
  title,
  children,
  defaultOpen = true,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => (
  <details className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" open={defaultOpen}>
    <summary className="flex cursor-pointer list-none items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3 text-[14px] font-bold uppercase tracking-wide text-blue-950 marker:hidden">
      <span className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#123b9c] text-[13px] text-white font-bold">
          {number}
        </span>
        {title}
      </span>
      <ChevronDown className="h-4 w-4 text-slate-500 transition-transform [details[open]_&]:rotate-180" />
    </summary>
    <div className="p-4">{children}</div>
  </details>
);

function LegacySalesInvoicePage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<string>("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Filters
  const [branch, setBranch] = useState("Dhaka Branch");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Print modal
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);

      const res = await fetch(`/api/sales?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.sales)) {
        setSales(data.sales);
        if (data.sales.length > 0 && !selectedSaleId) {
          setSelectedSaleId(data.sales[0].id);
          setSelectedSale(data.sales[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load sales for invoicing:", err);
      toast.error("Failed to load sales list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleSelectSale = (s: Sale) => {
    setSelectedSaleId(s.id);
    setSelectedSale(s);
  };

  const handleFinalizeInvoice = async () => {
    if (!selectedSale) return;
    try {
      const res = await fetch(`/api/sales/${selectedSale.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceStatus: "Invoiced" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Invoice for ${selectedSale.id} finalized!`);
        fetchSales();
      }
    } catch {
      toast.error("Failed to finalize invoice");
    }
  };

  return (
    <section className="min-h-[calc(100vh-64px)] bg-[#f8fafc] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="w-full space-y-4">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/80 pb-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Generate Sales Invoice
            </h1>
            <p className="text-xs uppercase tracking-wider text-slate-500 mt-0.5">
              TechBasket ERP • Enterprise Sales Invoicing & Receipt Generator
            </p>
          </div>
          <button
            type="button"
            onClick={fetchSales}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Sales
          </button>
        </header>

        {/* Filter Bar */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_auto] lg:items-end">
            <div>
              <label className={legacyLabelClass}>Branch Name *</label>
              <div className="relative">
                <select
                  className={`${legacyFieldClass} appearance-none`}
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                >
                  <option>Dhaka Branch</option>
                  <option>Chittagong Branch</option>
                  <option>Sylhet Branch</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
              </div>
            </div>
            <div>
              <label className={legacyLabelClass}>Date From</label>
              <input
                className={legacyFieldClass}
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className={legacyLabelClass}>Date To</label>
              <input
                className={legacyFieldClass}
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <button
              onClick={fetchSales}
              disabled={loading}
              className="h-10 rounded-xl bg-[#123b9c] px-6 text-[14px] font-bold text-white shadow-sm hover:bg-blue-800 disabled:opacity-60 transition cursor-pointer"
              type="button"
            >
              <Search className="mr-1.5 inline h-4 w-4" />
              {loading ? "Loading..." : "Load Sales"}
            </button>
          </div>
        </section>

        {/* 1. Sales List Table */}
        <InvoiceAccordion number={1} title="Available Sales for Invoice">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-3 w-12 text-center">Select</th>
                  <th className="py-3 px-3">Sale ID</th>
                  <th className="py-3 px-3">Invoice No</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Sale Date</th>
                  <th className="py-3 px-3">Sales Person</th>
                  <th className="py-3 px-3 text-right">Net Amount</th>
                  <th className="py-3 px-3 text-center">Invoice Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No sales records found. Create sales in "Sales Entry" first.
                    </td>
                  </tr>
                ) : (
                  sales.map((s) => {
                    const isSelected = selectedSaleId === s.id;
                    return (
                      <tr
                        key={s.id}
                        onClick={() => handleSelectSale(s)}
                        className={`cursor-pointer transition ${
                          isSelected ? "bg-blue-50/60 font-semibold" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="px-3 py-3 text-center">
                          <input
                            type="radio"
                            name="selectedSale"
                            checked={isSelected}
                            onChange={() => handleSelectSale(s)}
                            className="h-4 w-4 text-blue-600 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-blue-900">{s.id}</td>
                        <td className="py-3 px-3 font-mono text-slate-600">{s.invoiceNo || "—"}</td>
                        <td className="py-3 px-3 text-slate-800">{s.customer?.name}</td>
                        <td className="py-3 px-3 text-slate-500">{s.saleDate}</td>
                        <td className="py-3 px-3 text-slate-600">{s.salesPerson?.name}</td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">
                          ৳ {Number(s.grandTotal).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              s.invoiceStatus === "Invoiced"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {s.invoiceStatus || "Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </InvoiceAccordion>

        {/* 2. Sale & Customer Details */}
        {selectedSale && (
          <>
            <InvoiceAccordion number={2} title="Sale & Customer Information">
              <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    ◎ Sale Information
                  </h3>
                  <div className="grid grid-cols-2 gap-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Sale ID</span>
                      <b className="text-blue-900 text-sm">{selectedSale.id}</b>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Invoice Number</span>
                      <b className="font-mono text-slate-800">{selectedSale.invoiceNo}</b>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Sale Date</span>
                      <b>{selectedSale.saleDate}</b>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Sales Person</span>
                      <b>{selectedSale.salesPerson?.name}</b>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Branch</span>
                      <b>{selectedSale.branch?.branchName || "Dhaka Branch"}</b>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Status</span>
                      <b className="text-emerald-700">{selectedSale.status}</b>
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    ♙ Customer Information
                  </h3>
                  <div className="grid grid-cols-2 gap-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">Phone Number</span>
                      <b className="text-slate-800 font-mono">{selectedSale.customer?.phone}</b>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Customer ID</span>
                      <b className="font-mono text-slate-600">{selectedSale.customer?.customerId}</b>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Account Type</span>
                      <b>{selectedSale.customer?.type || "Individual"}</b>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Full Name</span>
                      <b className="text-slate-900">{selectedSale.customer?.name}</b>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block">Billing Address</span>
                      <p className="text-slate-700">{selectedSale.customer?.address || "N/A"}</p>
                    </div>
                  </div>
                </section>
              </div>
            </InvoiceAccordion>

            {/* 3. Sale Line Items */}
            <InvoiceAccordion number={3} title="Sale Line Items">
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">#</th>
                      <th className="py-3 px-3">Product Name</th>
                      <th className="py-3 px-3">SKU</th>
                      <th className="py-3 px-3 text-center">Quantity</th>
                      <th className="py-3 px-3 text-right">Sale Price</th>
                      <th className="py-3 px-3 text-right">Discount</th>
                      <th className="py-3 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedSale.items?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 text-center text-slate-400">{idx + 1}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{item.productName}</td>
                        <td className="py-3 px-3 font-mono text-slate-500">{item.sku}</td>
                        <td className="py-3 px-3 text-center font-bold text-slate-800">{item.quantity}</td>
                        <td className="py-3 px-3 text-right text-slate-600">
                          ৳ {Number(item.unitPrice).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right text-red-500">
                          {Number(item.discount || 0) > 0 ? `৳ ${Number(item.discount).toLocaleString()}` : "—"}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">
                          ৳ {Number(item.subtotal).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-slate-300 bg-slate-50 font-bold">
                    <tr>
                      <td colSpan={6} className="py-3 px-4 text-slate-600 text-right">Grand Total:</td>
                      <td className="py-3 px-3 text-right text-sm text-[#123b9c]">
                        ৳ {Number(selectedSale.grandTotal).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </InvoiceAccordion>

            {/* Actions Footer */}
            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <button
                onClick={handleFinalizeInvoice}
                className="h-11 rounded-xl bg-[#123b9c] px-6 text-xs font-bold text-white shadow-md hover:bg-blue-800 transition cursor-pointer"
                type="button"
              >
                <CheckCircle2 className="mr-1.5 inline h-4 w-4" />
                Finalize & Mark Invoiced
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsReceiptModalOpen(true)}
                  className="h-11 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  type="button"
                >
                  <Eye className="h-4 w-4 text-blue-700" />
                  Preview & Print Invoice
                </button>
              </div>
            </footer>
          </>
        )}
      </div>

      {/* Sale Receipt & Invoice Modal */}
      <SaleReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        sale={selectedSale}
      />
    </section>
  );
}
