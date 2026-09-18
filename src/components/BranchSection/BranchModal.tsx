"use client";

import { useState, useEffect } from "react";
import { X, Building2, MapPin, User, Phone, Mail, Clock } from "lucide-react";
import { Branch, BranchType, BranchStatus } from "@/types/branch";

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (branchData: Partial<Branch>) => Promise<void>;
  initialData?: Branch | null;
}

const BRANCH_TYPES: BranchType[] = [
  "Retail Store",
  "Flagship Store",
  "Service Center",
  "Warehouse",
  "Distribution Hub",
];

const COMMON_CITIES = [
  "Dhaka",
  "Uttara",
  "Chattogram",
  "Sylhet",
  "Gazipur",
  "Bogura",
  "Cumilla",
  "Khulna",
  "Rajshahi",
  "Barishal",
];

export default function BranchModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: BranchModalProps) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState<Partial<Branch>>({
    name: "",
    code: "",
    type: "Retail Store",
    location: "Dhaka",
    address: "",
    manager: "",
    managerPhone: "",
    managerEmail: "",
    phone: "",
    email: "",
    openingHours: "10:00 AM - 08:00 PM",
    status: "ACTIVE",
    isMainBranch: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        code: "",
        type: "Retail Store",
        location: "Dhaka",
        address: "",
        manager: "",
        managerPhone: "",
        managerEmail: "",
        phone: "",
        email: "",
        openingHours: "10:00 AM - 08:00 PM",
        status: "ACTIVE",
        isMainBranch: false,
      });
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setError("Branch name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await onSave({
        ...formData,
        name: formData.name.trim(),
        location: formData.location?.trim() || "Dhaka",
        manager: formData.manager?.trim() || "Not Assigned",
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save branch. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/75 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? "Edit Branch Information" : "Add New Branch"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? "Update store location, manager, and operational status."
                  : "Register a new retail shop, service point, or warehouse hub."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-rose-600 font-medium text-xs">
              {error}
            </div>
          )}

          {/* Row 1: Name & Code */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1 block font-semibold text-slate-700">
                Branch / Store Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Dhaka Multiplan Center Branch"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-slate-700">
                Branch Code
              </label>
              <input
                type="text"
                value={formData.code || ""}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g., BR-DHK-01"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Row 2: Type & Location */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-semibold text-slate-700">
                Branch Type
              </label>
              <select
                value={formData.type || "Retail Store"}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as BranchType })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                {BRANCH_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block font-semibold text-slate-700">
                City / Region
              </label>
              <input
                list="cities-list"
                value={formData.location || "Dhaka"}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Dhaka"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
              <datalist id="cities-list">
                {COMMON_CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Row 3: Full Address */}
          <div>
            <label className="mb-1 block font-semibold text-slate-700 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-slate-400" />
              Full Street Address
            </label>
            <input
              type="text"
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g., Shop 412, Level 4, Multiplan Center, Elephant Road, Dhaka-1205"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Row 4: Manager Name & Phone */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-semibold text-slate-700 flex items-center gap-1">
                <User className="h-3 w-3 text-slate-400" />
                Branch Manager
              </label>
              <input
                type="text"
                value={formData.manager || ""}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                placeholder="e.g., Md. Tanvir Ahmed"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-slate-700 flex items-center gap-1">
                <Phone className="h-3 w-3 text-slate-400" />
                Branch Contact Phone
              </label>
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g., 01711-223344"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Row 5: Email & Opening Hours */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-semibold text-slate-700 flex items-center gap-1">
                <Mail className="h-3 w-3 text-slate-400" />
                Branch Email
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g., multiplan@techbasket.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1 block font-semibold text-slate-700 flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-400" />
                Working Hours
              </label>
              <input
                type="text"
                value={formData.openingHours || ""}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                placeholder="e.g., 10:00 AM - 08:30 PM"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Row 6: Status & Main Branch */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Operational Status
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-700">
                  <input
                    type="radio"
                    name="status"
                    value="ACTIVE"
                    checked={formData.status === "ACTIVE"}
                    onChange={() => setFormData({ ...formData, status: "ACTIVE" })}
                    className="accent-blue-600"
                  />
                  <span>ACTIVE</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-700">
                  <input
                    type="radio"
                    name="status"
                    value="INACTIVE"
                    checked={formData.status === "INACTIVE"}
                    onChange={() => setFormData({ ...formData, status: "INACTIVE" })}
                    className="accent-blue-600"
                  />
                  <span>INACTIVE</span>
                </label>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer mt-4 text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={Boolean(formData.isMainBranch)}
                onChange={(e) => setFormData({ ...formData, isMainBranch: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
              />
              <span>Main Headquarters / Central Hub</span>
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[#2948a8] px-5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#203b91] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting
                ? isEditing
                  ? "Saving Changes..."
                  : "Adding Branch..."
                : isEditing
                ? "Update Branch"
                : "Add Branch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
