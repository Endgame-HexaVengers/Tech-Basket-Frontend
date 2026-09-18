"use client";

import {
  X,
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  UserCheck,
  Store,
  Compass,
  Warehouse,
  Users,
  Edit2,
} from "lucide-react";
import { Branch } from "@/types/branch";

interface BranchDetailsDrawerProps {
  branch: Branch | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (branch: Branch) => void;
}

export default function BranchDetailsDrawer({
  branch,
  isOpen,
  onClose,
  onEdit,
}: BranchDetailsDrawerProps) {
  if (!isOpen || !branch) return null;

  const getBranchIcon = (type: string) => {
    switch (type) {
      case "Service Center":
        return <Compass className="h-6 w-6 text-indigo-600" />;
      case "Warehouse":
      case "Distribution Hub":
        return <Warehouse className="h-6 w-6 text-amber-600" />;
      default:
        return <Store className="h-6 w-6 text-blue-600" />;
    }
  };

  const isActive = branch.status === "ACTIVE";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="border-b border-slate-200 bg-slate-50/75 p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 shadow-xs">
                  {getBranchIcon(branch.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {branch.name}
                    </h3>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded">
                      {branch.code}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        isActive
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {branch.status}
                    </span>
                    {branch.isMainBranch && (
                      <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                        Main HQ
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {/* Quick overview card */}
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Branch Type
                </span>
                <p className="mt-0.5 font-bold text-slate-800">{branch.type}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Region / City
                </span>
                <p className="mt-0.5 font-bold text-slate-800">{branch.location}</p>
              </div>
            </div>

            {/* Address */}
            <div className="rounded-xl border border-slate-200/80 p-4 space-y-2">
              <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                <MapPin className="h-4 w-4 text-slate-400" />
                Physical Address
              </h4>
              <p className="text-slate-600 leading-relaxed pl-5">
                {branch.address || "No detailed street address provided."}
              </p>
            </div>

            {/* Manager & Contact */}
            <div className="rounded-xl border border-slate-200/80 p-4 space-y-3">
              <h4 className="font-semibold text-slate-900 text-xs">
                Branch Management & Contact
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Manager:</span>
                  <span className="font-medium text-slate-800">{branch.manager}</span>
                </div>
                {branch.phone && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-slate-400" /> Direct Phone:
                    </span>
                    <a
                      href={`tel:${branch.phone}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {branch.phone}
                    </a>
                  </div>
                )}
                {branch.email && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Mail className="h-3 w-3 text-slate-400" /> Email:
                    </span>
                    <a
                      href={`mailto:${branch.email}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {branch.email}
                    </a>
                  </div>
                )}
                {branch.openingHours && (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" /> Hours:
                    </span>
                    <span className="font-medium text-slate-700">
                      {branch.openingHours}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Users */}
            <div className="rounded-xl border border-slate-200/80 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Users className="h-4 w-4 text-slate-400" />
                  Assigned Staff Members ({branch.users || branch.assignedUsers?.length || 0})
                </h4>
              </div>

              {branch.assignedUsers && branch.assignedUsers.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {branch.assignedUsers.map((user) => (
                    <span
                      key={user}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 border border-slate-200"
                    >
                      <UserCheck className="h-3 w-3 text-slate-400" />
                      {user}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic text-[11px]">
                  No specific staff members linked yet. Users can be assigned in Users & Permissions.
                </p>
              )}
            </div>
          </div>

          {/* Footer Action */}
          <div className="border-t border-slate-200 bg-slate-50/75 p-4 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Registered on {branch.createdAt || "N/A"}
            </span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(branch);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2948a8] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#203b91]"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit Branch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
