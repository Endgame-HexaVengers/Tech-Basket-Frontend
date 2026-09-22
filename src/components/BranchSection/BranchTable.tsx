"use client";

import {
  Store,
  Compass,
  Warehouse,
  Building2,
  Eye,
  Edit2,
  Trash2,
  UserCheck,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Branch } from "@/types/branch";

interface BranchTableProps {
  branches: Branch[];
  loading: boolean;
  onViewDetails: (branch: Branch) => void;
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
  onToggleStatus: (branch: Branch) => void;
}

export default function BranchTable({
  branches,
  loading,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
}: BranchTableProps) {
  /**
   * Safely convert any value to string.
   * Handles legacy MongoDB documents where a field
   * can sometimes be an object instead of a string.
   */
  const safeStr = (val: unknown, fallback = ""): string => {
    if (val === null || val === undefined || val === "") {
      return fallback;
    }

    if (typeof val === "string") {
      return val;
    }

    if (typeof val === "number" || typeof val === "boolean") {
      return String(val);
    }

    if (typeof val === "object") {
      const obj = val as Record<string, unknown>;

      const parts = [
        obj.street,
        obj.address,
        obj.city,
        obj.state,
        obj.zip,
      ]
        .filter(
          (item): item is string | number =>
            typeof item === "string" || typeof item === "number"
        )
        .map(String)
        .filter(Boolean);

      return parts.join(", ") || fallback;
    }

    return fallback;
  };

  const getBranchIcon = (type: string) => {
    switch (type) {
      case "Service Center":
        return <Compass className="h-4 w-4 text-indigo-600" />;

      case "Warehouse":
      case "Distribution Hub":
        return <Warehouse className="h-4 w-4 text-amber-600" />;

      default:
        return <Store className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Service Center":
        return (
          <span className="inline-flex items-center rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
            Service Center
          </span>
        );

      case "Warehouse":
      case "Distribution Hub":
        return (
          <span className="inline-flex items-center rounded-md border border-amber-100 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
            {type}
          </span>
        );

      case "Flagship Store":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-purple-100 bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-700">
            <Sparkles className="h-3 w-3" />
            Flagship
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
            {type}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-black">
                <th className="px-5 py-3.5">BRANCH</th>
                <th className="px-5 py-3.5">CODE</th>
                <th className="px-5 py-3.5">LOCATION</th>
                <th className="px-5 py-3.5">TYPE</th>
                <th className="px-5 py-3.5">MANAGER</th>
                <th className="px-5 py-3.5">USERS</th>
                <th className="px-5 py-3.5">STATUS</th>
                <th className="px-5 py-3.5 text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5].map((idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-slate-200" />
                      <div className="space-y-1.5">
                        <div className="h-4 w-32 rounded bg-slate-200" />
                        <div className="h-3 w-48 rounded bg-slate-100" />
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="h-4 w-16 rounded bg-slate-200" />
                  </td>

                  <td className="px-5 py-4">
                    <div className="h-4 w-20 rounded bg-slate-200" />
                  </td>

                  <td className="px-5 py-4">
                    <div className="h-5 w-20 rounded bg-slate-200" />
                  </td>

                  <td className="px-5 py-4">
                    <div className="h-4 w-24 rounded bg-slate-200" />
                  </td>

                  <td className="px-5 py-4">
                    <div className="h-5 w-12 rounded bg-slate-200" />
                  </td>

                  <td className="px-5 py-4">
                    <div className="h-5 w-16 rounded-full bg-slate-200" />
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="ml-auto h-7 w-16 rounded bg-slate-200" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-2xs">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Building2 className="h-7 w-7" />
        </div>

        <h4 className="text-base font-semibold text-slate-800">
          No branches found
        </h4>

        <p className="mt-1 max-w-sm text-xs text-slate-500">
          No branch records match your search or filter parameters. Try
          clearing the filters or add a new branch.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200/90 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-black">
              <th className="px-5 py-3.5">BRANCH</th>
              <th className="px-5 py-3.5">CODE</th>
              <th className="px-5 py-3.5">LOCATION</th>
              <th className="px-5 py-3.5">TYPE</th>
              <th className="px-5 py-3.5">MANAGER</th>
              <th className="px-5 py-3.5">USERS</th>
              <th className="px-5 py-3.5">STATUS</th>
              <th className="px-5 py-3.5 text-right">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {branches.map((branch) => {
              const isActive = branch.status === "ACTIVE";

              return (
                <tr
                  key={branch.id}
                  className="group transition-colors hover:bg-blue-50/30"
                >
                  {/* Branch Name & Icon */}
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-2 shadow-2xs">
                        {getBranchIcon(safeStr(branch.type))}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onViewDetails(branch)}
                            className="text-left text-xs font-semibold text-slate-900 transition hover:text-blue-600"
                          >
                            {safeStr(branch.name)}
                          </button>

                          {branch.isMainBranch && (
                            <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[9px] font-bold text-blue-700">
                              HQ
                            </span>
                          )}
                        </div>

                        {branch.address && (
                          <p className="mt-0.5 flex max-w-[220px] items-center gap-1 truncate text-[11px] text-slate-500">
                            <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                            {safeStr(branch.address)}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Code */}
                  <td className="px-5 py-4">
                    <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700">
                      {safeStr(branch.code)}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium text-slate-700">
                      {safeStr(branch.location)}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="px-5 py-4">
                    {getTypeBadge(safeStr(branch.type))}
                  </td>

                  {/* Manager */}
                  <td className="px-5 py-4">
                    <div>
                      <p
                        className={`text-xs font-medium ${
                          safeStr(branch.manager, "Not Assigned") ===
                          "Not Assigned"
                            ? "italic text-slate-400"
                            : "text-slate-800"
                        }`}
                      >
                        {safeStr(branch.manager, "Not Assigned")}
                      </p>

                      {branch.phone && (
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {safeStr(branch.phone)}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Users */}
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                      <UserCheck className="h-3 w-3 text-slate-500" />
                      {branch.users || 0}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(branch)}
                      title={`Click to set ${
                        isActive ? "INACTIVE" : "ACTIVE"
                      }`}
                      className={`inline-flex cursor-pointer items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition ${
                        isActive
                          ? "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
                          : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <span
                        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                          isActive
                            ? "animate-pulse bg-blue-600"
                            : "bg-slate-400"
                        }`}
                      />

                      {safeStr(branch.status)}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View */}
                      <button
                        type="button"
                        onClick={() => onViewDetails(branch)}
                        title="View Branch Details"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => onEdit(branch)}
                        title="Edit Branch"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onDelete(branch)}
                        title="Delete Branch"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-200/80 bg-slate-50/50 px-5 py-3 text-xs font-medium text-slate-500">
        <span>Showing {branches.length} branches</span>

        <span className="text-[11px] text-slate-400">
          Click status pill to toggle Active / Inactive
        </span>
      </div>
    </div>
  );
}