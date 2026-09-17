"use client";

import { SupplierType, SupplierStatus } from "@/types/supplier";
import { Search, Plus, Filter, Download, RotateCcw } from "lucide-react";

export interface SupplierFilterValues {
  search: string;
  type: string;
  status: string;
  dueFilter: "all" | "due" | "clear";
}

interface SupplierFiltersProps {
  filters: SupplierFilterValues;
  onChange: (filters: SupplierFilterValues) => void;
  onOpenAddModal: () => void;
  onExport: () => void;
}

export default function SupplierFilters({
  filters,
  onChange,
  onOpenAddModal,
  onExport,
}: SupplierFiltersProps) {
  const isFiltered =
    filters.search !== "" ||
    filters.type !== "all" ||
    filters.status !== "all" ||
    filters.dueFilter !== "all";

  const handleReset = () => {
    onChange({
      search: "",
      type: "all",
      status: "all",
      dueFilter: "all",
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search by supplier name, code, phone, email, brand..."
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onExport}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
            title="Export suppliers as CSV"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 transition hover:bg-blue-700 active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {/* Filter Dropdowns row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium mr-1">
          <Filter className="h-3.5 w-3.5" />
          <span>Filters:</span>
        </div>

        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
          className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="Distributor">Distributor</option>
          <option value="Importer">Importer</option>
          <option value="Wholesaler">Wholesaler</option>
          <option value="Manufacturer">Manufacturer</option>
          <option value="Local Vendor">Local Vendor</option>
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="On Hold">On Hold</option>
        </select>

        {/* Dues Filter */}
        <select
          value={filters.dueFilter}
          onChange={(e) =>
            onChange({ ...filters, dueFilter: e.target.value as "all" | "due" | "clear" })
          }
          className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Balances</option>
          <option value="due">Has Outstanding Due</option>
          <option value="clear">No Due (Cleared)</option>
        </select>

        {/* Reset button */}
        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
