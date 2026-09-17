"use client";

import { Supplier } from "@/types/supplier";
import {
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  History,
  FileText,
  AlertTriangle,
  ExternalLink,
  Plus,
  ShoppingBag,
  Star,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";

interface SupplierDetailsDrawerProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "overview" | "purchases" | "ledger" | "rma";
  onCreatePurchase?: (supplier: Supplier) => void;
}

export default function SupplierDetailsDrawer({
  supplier,
  isOpen,
  onClose,
  defaultTab = "overview",
  onCreatePurchase,
}: SupplierDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "purchases" | "ledger" | "rma">(defaultTab);

  if (!isOpen || !supplier) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(amount).replace("BDT", "৳");
  };

  const creditUsedPercent =
    supplier.creditLimit > 0
      ? Math.min(100, Math.round((supplier.currentBalance / supplier.creditLimit) * 100))
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="relative flex h-full w-full max-w-3xl flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="border-b border-slate-200/80 bg-slate-50/60 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white font-bold text-xl shadow-md shadow-blue-500/20">
                {supplier.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    {supplier.name}
                  </h2>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                    {supplier.status}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {supplier.supplierCode}
                  </span>
                  <span>•</span>
                  <span className="font-medium text-slate-700">{supplier.type}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    {supplier.rating} Rating
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-xs">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Total Purchased
              </p>
              <p className="mt-0.5 text-base font-bold text-slate-900">
                {formatCurrency(supplier.totalPurchased)}
              </p>
              <p className="text-[11px] text-slate-500">{supplier.totalOrders} Orders</p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Current Due / Payable
              </p>
              <p
                className={`mt-0.5 text-base font-bold ${
                  supplier.currentBalance > 0 ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {formatCurrency(supplier.currentBalance)}
              </p>
              <p className="text-[11px] text-slate-500">
                {supplier.currentBalance > 0 ? "Pending payment" : "All cleared"}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Credit Utilization
              </p>
              <p className="mt-0.5 text-base font-bold text-slate-900">
                {creditUsedPercent}%
              </p>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all ${
                    creditUsedPercent > 80 ? "bg-rose-500" : "bg-blue-600"
                  }`}
                  style={{ width: `${creditUsedPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex items-center gap-2 border-b border-slate-200 -mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-semibold transition ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Overview & Profile
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("purchases")}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-semibold transition ${
                activeTab === "purchases"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <History className="h-3.5 w-3.5" />
              Purchases ({supplier.purchases?.length || 0})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ledger")}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-semibold transition ${
                activeTab === "ledger"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Ledger Statement
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("rma")}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-semibold transition ${
                activeTab === "rma"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              RMA & Claims ({supplier.rmaItems?.length || 0})
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Contact Information Card */}
              <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Primary Contact & Office
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Contact Person</span>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900">
                      {supplier.contactPerson}
                    </p>
                    <p className="text-slate-500">{supplier.designation}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium">Phone Numbers</span>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900">
                      {supplier.phone}
                    </p>
                    {supplier.alternatePhone && (
                      <p className="text-slate-500">Alt: {supplier.alternatePhone}</p>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium">Official Email</span>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900">
                      {supplier.email}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium">Location</span>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900">
                      {supplier.city}, Bangladesh
                    </p>
                    <p className="text-slate-500">{supplier.address}</p>
                  </div>
                </div>
              </div>

              {/* Financial Policies & Banking */}
              <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Financial Terms & Bank Accounts
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Payment Terms</span>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900">
                      {supplier.paymentTerms}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium">Credit Limit</span>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900">
                      {formatCurrency(supplier.creditLimit)}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium">Trade License</span>
                    <p className="mt-0.5 font-mono text-sm font-semibold text-slate-800">
                      {supplier.tradeLicense || "N/A"}
                    </p>
                  </div>

                  {supplier.bankName && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-500 font-medium">Bank Details</span>
                      <p className="mt-0.5 text-sm font-semibold text-slate-900">
                        {supplier.bankName} ({supplier.branchName})
                      </p>
                      <p className="font-mono text-slate-600">
                        A/C: {supplier.accountNumber} • Routing: {supplier.routingNumber}
                      </p>
                    </div>
                  )}

                  {supplier.bkashNumber && (
                    <div>
                      <span className="text-slate-500 font-medium">bKash Merchant</span>
                      <p className="mt-0.5 font-mono text-sm font-semibold text-rose-600">
                        {supplier.bkashNumber}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Brands Supplied */}
              <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Brands & Hardware Supplied
                </h4>
                <div className="flex flex-wrap gap-2">
                  {supplier.brands.map((b) => (
                    <span
                      key={b}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PURCHASES */}
          {activeTab === "purchases" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Procurement History ({supplier.purchases?.length || 0})
                </h4>
              </div>

              {!supplier.purchases || supplier.purchases.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No purchases recorded yet for this supplier.
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200/80">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase text-slate-500">
                      <tr>
                        <th className="p-3">Invoice No</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Due</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {supplier.purchases.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/60">
                          <td className="p-3 font-mono font-semibold text-blue-600">
                            {p.invoiceNo}
                          </td>
                          <td className="p-3 text-slate-600">{p.date}</td>
                          <td className="p-3 text-slate-600">{p.itemsCount} pcs</td>
                          <td className="p-3 font-semibold text-slate-900">
                            {formatCurrency(p.totalAmount)}
                          </td>
                          <td className="p-3 font-medium text-rose-600">
                            {p.dueAmount > 0 ? formatCurrency(p.dueAmount) : "৳ 0"}
                          </td>
                          <td className="p-3 text-right">
                            <span
                              className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                                p.status === "Paid"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : p.status === "Partial"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LEDGER */}
          {activeTab === "ledger" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Vendor Ledger (খতিয়ান / হিসাব খাতা)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Audit trail of all invoices, returns, and payment disbursements
                  </p>
                </div>
              </div>

              {!supplier.ledger || supplier.ledger.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No ledger entries recorded yet.
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200/80">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase text-slate-500">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Reference / Tx</th>
                        <th className="p-3">Transaction</th>
                        <th className="p-3 text-right">Debit (Payment)</th>
                        <th className="p-3 text-right">Credit (Bill)</th>
                        <th className="p-3 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {supplier.ledger.map((entry) => (
                        <tr key={entry.id} className="hover:bg-slate-50/60 font-mono">
                          <td className="p-3 text-slate-600 font-sans">{entry.date}</td>
                          <td className="p-3 text-blue-600 font-semibold">
                            {entry.referenceNo}
                          </td>
                          <td className="p-3 font-sans text-slate-800">
                            {entry.type}
                          </td>
                          <td className="p-3 text-right text-emerald-600">
                            {entry.debit > 0 ? formatCurrency(entry.debit) : "-"}
                          </td>
                          <td className="p-3 text-right text-rose-600">
                            {entry.credit > 0 ? formatCurrency(entry.credit) : "-"}
                          </td>
                          <td className="p-3 text-right font-bold text-slate-900">
                            {formatCurrency(entry.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RMA */}
          {activeTab === "rma" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Warranty & Replacement Items ({supplier.rmaItems?.length || 0})
                </h4>
                <p className="text-[11px] text-slate-500">
                  Items handed over to supplier for repair or brand replacement
                </p>
              </div>

              {!supplier.rmaItems || supplier.rmaItems.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No active RMA or defect claims with this supplier.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {supplier.rmaItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between rounded-xl border border-slate-200/80 bg-slate-50/40 p-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-600">
                            {item.rmaNo}
                          </span>
                          <span className="text-xs font-medium text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{item.date}</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {item.productName}
                        </p>
                        <p className="font-mono text-xs text-slate-600 mt-0.5">
                          SN: {item.serialNo}
                        </p>
                        <p className="text-xs text-rose-600 mt-1">Issue: {item.issue}</p>
                      </div>

                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
