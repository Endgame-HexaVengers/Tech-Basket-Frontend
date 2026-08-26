"use client";

import { Branch } from "@/types/branch";
import { Button, Spinner } from "@heroui/react";


interface ApprovalFiltersProps {
  branches: Branch[];
  selectedBranch: string;
  fromDate: string;
  toDate: string;
  loading: boolean;
  onBranchChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onLoad: () => void;
}

export default function ApprovalFilters({
  branches,
  selectedBranch,
  fromDate,
  toDate,
  loading,
  onBranchChange,
  onFromDateChange,
  onToDateChange,
  onLoad,
}: ApprovalFiltersProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 shadow-xs">
      
      <div className="min-w-[200px] flex-1">
        <label className="mb-1 block text-xs font-semibold text-slate-600">
          Branch Name
        </label>

        <select
          value={selectedBranch}
          onChange={(e) => onBranchChange(e.target.value)}
          className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-700 outline-none focus:border-indigo-500"
        >
          <option value="">Select Branch</option>

          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[150px] flex-1">
        <label className="mb-1 block text-xs font-semibold text-slate-600">
          From Date
        </label>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-2 text-sm outline-none focus:border-indigo-500"
        />
      </div>

      <div className="min-w-[150px] flex-1">
        <label className="mb-1 block text-xs font-semibold text-slate-600">
          To Date
        </label>

        <input
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-2 text-sm outline-none focus:border-indigo-500"
        />
      </div>

      <Button
        isDisabled={loading}
        onPress={onLoad}
        className="min-w-[100px] cursor-pointer rounded bg-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-300"
      >
        <span className="flex items-center justify-center gap-2">
          {loading && <Spinner size="sm" />}
          {loading ? "Loading..." : "Load"}
        </span>
      </Button>
    </div>
  );
}