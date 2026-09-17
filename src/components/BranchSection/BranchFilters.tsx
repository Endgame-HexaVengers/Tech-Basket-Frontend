"use client";

import { Search, ChevronDown, RotateCcw } from "lucide-react";
import { FilterParams } from "@/types/branch";

interface BranchFiltersProps {
  filters: FilterParams;
  onFilterChange: (filters: FilterParams) => void;
  availableLocations?: string[];
}

export default function BranchFilters({
  filters,
  onFilterChange,
  availableLocations = ["Dhaka", "Uttara", "Chattogram", "Sylhet", "Gazipur", "Bogura", "Cumilla"],
}: BranchFiltersProps) {
  const handleChange = (key: keyof FilterParams, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onFilterChange({
      search: "",
      status: "",
      type: "",
      location: "",
    });
  };

  const isFiltered = Boolean(
    filters.search || filters.status || filters.type || filters.location
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-4 shadow-2xs">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[260px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search by branch name, code, city..."
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="appearance-none rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-3.5 pr-8 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-600 focus:bg-white cursor-pointer hover:border-slate-300"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        </div>

        {/* Branch Types Dropdown */}
        <div className="relative">
          <select
            value={filters.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="appearance-none rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-3.5 pr-8 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-600 focus:bg-white cursor-pointer hover:border-slate-300"
          >
            <option value="">All Branch Types</option>
            <option value="Retail Store">Retail Store</option>
            <option value="Flagship Store">Flagship Store</option>
            <option value="Service Center">Service Center</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Distribution Hub">Distribution Hub</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        </div>

        {/* Locations Dropdown */}
        <div className="relative">
          <select
            value={filters.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="appearance-none rounded-lg border border-slate-200 bg-slate-50/60 py-2 pl-3.5 pr-8 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-600 focus:bg-white cursor-pointer hover:border-slate-300"
          >
            <option value="">All Locations</option>
            {availableLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        </div>

        {/* Filter Reset / Toggle Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            title="Reset Filters"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
