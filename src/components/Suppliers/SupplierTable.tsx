"use client";

import { Supplier } from "@/types/supplier";
import {
  Building2,
  Phone,
  Mail,
  MoreVertical,
  Eye,
  Edit2,
  FileText,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

interface SupplierTableProps {
  suppliers: Supplier[];
  isLoading?: boolean;
  onViewDetails: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onOpenLedger: (supplier: Supplier) => void;
  onCreatePurchase?: (supplier: Supplier) => void;
}

export default function SupplierTable({
  suppliers,
  isLoading = false,
  onViewDetails,
  onEdit,
  onOpenLedger,
  onCreatePurchase,
}: SupplierTableProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(amount).replace("BDT", "৳");
  };

  const getStatusBadge = (status: Supplier["status"]) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        );
      case "Inactive":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Inactive
          </span>
        );
      case "On Hold":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            On Hold
          </span>
        );
    }
  };

  const getTypeBadge = (type: Supplier["type"]) => {
    const colors: Record<Supplier["type"], string> = {
      Distributor: "bg-blue-50 text-blue-700 border-blue-200",
      Importer: "bg-purple-50 text-purple-700 border-purple-200",
      Wholesaler: "bg-indigo-50 text-indigo-700 border-indigo-200",
      Manufacturer: "bg-teal-50 text-teal-700 border-teal-200",
      "Local Vendor": "bg-slate-100 text-slate-700 border-slate-200",
    };

    return (
      <span
        className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-medium ${colors[type] || "bg-slate-50 text-slate-600 border-slate-200"}`}
      >
        {type}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">Supplier / Company</th>
                <th className="px-5 py-3.5">Contact Person</th>
                <th className="px-5 py-3.5">Brands / Products</th>
                <th className="px-5 py-3.5">Purchases</th>
                <th className="px-5 py-3.5">Due / Outstanding</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-200" />
                      <div className="space-y-1.5">
                        <div className="h-4 w-36 rounded-md bg-slate-200" />
                        <div className="h-3 w-20 rounded-md bg-slate-100" />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-28 rounded-md bg-slate-200" />
                      <div className="h-3 w-24 rounded-md bg-slate-100" />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      <div className="h-5 w-12 rounded-md bg-slate-200" />
                      <div className="h-5 w-12 rounded-md bg-slate-200" />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-4 w-20 rounded-md bg-slate-200" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-4 w-20 rounded-md bg-slate-200" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-6 w-16 rounded-full bg-slate-200" />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="ml-auto h-8 w-8 rounded-lg bg-slate-200" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
          <Building2 className="h-7 w-7" />
        </div>
        <h4 className="text-base font-semibold text-slate-900">No suppliers found</h4>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          No supplier records match your search or filter parameters. Try clearing the filters or add a new supplier.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3.5">Supplier / Company</th>
              <th className="px-5 py-3.5">Contact Person</th>
              <th className="px-5 py-3.5">Brands / Products</th>
              <th className="px-5 py-3.5">Purchases</th>
              <th className="px-5 py-3.5">Due / Outstanding</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70">
            {suppliers.map((supplier) => {
              const currentBalance = Number(supplier.currentBalance) || 0;
              const creditLimit = Number(supplier.creditLimit) || 0;
              const hasDue = currentBalance > 0;
              const isOverLimit =
                creditLimit > 0 &&
                currentBalance > creditLimit;

              return (
                <tr
                  key={supplier.id}
                  className="group transition-colors hover:bg-blue-50/30"
                >
                  {/* Supplier & Company */}
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-slate-100 to-slate-200 text-slate-700 font-bold text-sm shadow-xs border border-slate-200/60">
                        {(supplier.name || supplier.companyName || "S").charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onViewDetails(supplier)}
                            className="font-semibold text-slate-900 hover:text-blue-600 transition text-left"
                          >
                            {supplier.name}
                          </button>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {supplier.supplierCode}
                          </span>
                          {getTypeBadge(supplier.type)}
                          <span className="text-[11px] text-slate-400 font-medium">
                            • {supplier.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Person */}
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-slate-800 text-xs">
                        {supplier.contactPerson}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {supplier.designation}
                      </p>
                      <div className="mt-1.5 flex flex-col gap-0.5 text-[11px]">
                        <a
                          href={`tel:${supplier.phone}`}
                          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 font-medium"
                        >
                          <Phone className="h-3 w-3 text-slate-400" />
                          {supplier.phone}
                        </a>
                        <a
                          href={`mailto:${supplier.email}`}
                          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-blue-600 truncate max-w-[170px]"
                        >
                          <Mail className="h-3 w-3 text-slate-400" />
                          {supplier.email}
                        </a>
                      </div>
                    </div>
                  </td>

                  {/* Brands / Products */}
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(supplier.brands || []).slice(0, 3).map((brand) => (
                        <span
                          key={brand}
                          className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                        >
                          {brand}
                        </span>
                      ))}
                      {(supplier.brands || []).length > 3 && (
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                          +{(supplier.brands || []).length - 3} more
                        </span>
                      )}
                      {(!supplier.brands || supplier.brands.length === 0) && (
                        <span className="text-[11px] text-slate-400 italic">No brands</span>
                      )}
                    </div>
                    {(Number(supplier.pendingRmaCount) || 0) > 0 && (
                      <div className="mt-2 inline-flex items-center gap-1 rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600 border border-rose-100">
                        <span>{supplier.pendingRmaCount} RMA pending</span>
                      </div>
                    )}
                  </td>

                  {/* Total Purchases */}
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-semibold text-slate-900 text-xs">
                        {formatCurrency(supplier.totalPurchased)}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {supplier.totalOrders} Orders placed
                      </p>
                      <span className="text-[10px] font-medium text-slate-400">
                        Terms: {supplier.paymentTerms}
                      </span>
                    </div>
                  </td>

                  {/* Outstanding Due */}
                  <td className="px-5 py-4">
                    <div>
                      {hasDue ? (
                        <div>
                          <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
                            {formatCurrency(supplier.currentBalance)}
                          </span>
                          {isOverLimit && (
                            <p className="mt-0.5 text-[10px] font-semibold text-rose-600">
                              Exceeds Credit Limit!
                            </p>
                          )}
                          <p className="mt-0.5 text-[10px] text-slate-400">
                            Limit: {formatCurrency(supplier.creditLimit)}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                            ৳ 0 (Cleared)
                          </span>
                          <p className="mt-0.5 text-[10px] text-slate-400">
                            Limit: {formatCurrency(supplier.creditLimit)}
                          </p>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    {getStatusBadge(supplier.status)}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View Profile Button */}
                      <button
                        type="button"
                        onClick={() => onViewDetails(supplier)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                        title="View 360° Profile & Ledger"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => onEdit(supplier)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                        title="Edit Supplier"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      {/* Ledger Shortcut */}
                      <button
                        type="button"
                        onClick={() => onOpenLedger(supplier)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                        title="View Ledger Statement"
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="flex items-center justify-between border-t border-slate-200/80 bg-slate-50/50 px-5 py-3 text-xs text-slate-500 font-medium">
        <span>Showing {suppliers.length} suppliers</span>
        <span className="text-[11px] text-slate-400">
          Click &quot;Eye&quot; icon for full 360° history and ledger statement
        </span>
      </div>
    </div>
  );
}
