"use client";

import { Supplier, SupplierType, PaymentTerm, SupplierStatus } from "@/types/supplier";
import { X, Building2, Phone, CreditCard, Tag, Check, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplier: Partial<Supplier>) => void;
  initialData?: Supplier | null;
}

const COMMON_BRANDS = [
  "HP",
  "Dell",
  "Lenovo",
  "Asus",
  "Acer",
  "Apple",
  "Logitech",
  "Intel",
  "AMD",
  "MSI",
  "Gigabyte",
  "Western Digital",
  "Samsung",
  "TP-Link",
  "D-Link",
  "Rapoo",
  "A4Tech",
  "Fantech",
];

export default function AddSupplierModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddSupplierModalProps) {
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: "",
    companyName: "",
    type: "Distributor",
    tradeLicense: "",
    binNumber: "",
    contactPerson: "",
    designation: "Key Account Manager",
    phone: "",
    alternatePhone: "",
    email: "",
    address: "",
    city: "Dhaka",
    paymentTerms: "Net 30",
    creditLimit: 500000,
    currentBalance: 0,
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    branchName: "",
    bkashNumber: "",
    brands: [],
    status: "Active",
  });

  const [customBrand, setCustomBrand] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        companyName: "",
        type: "Distributor",
        tradeLicense: "",
        binNumber: "",
        contactPerson: "",
        designation: "Key Account Manager",
        phone: "",
        alternatePhone: "",
        email: "",
        address: "",
        city: "Dhaka",
        paymentTerms: "Net 30",
        creditLimit: 500000,
        currentBalance: 0,
        bankName: "",
        accountNumber: "",
        routingNumber: "",
        branchName: "",
        bkashNumber: "",
        brands: ["HP", "Dell"],
        status: "Active",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name?.trim()) errs.name = "Company / Supplier name is required";
    if (!formData.phone?.trim()) errs.phone = "Phone number is required";
    if (!formData.contactPerson?.trim()) errs.contactPerson = "Contact person is required";
    if (!formData.city?.trim()) errs.city = "City is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      companyName: formData.companyName || formData.name,
    });
    onClose();
  };

  const toggleBrand = (brand: string) => {
    const current = formData.brands || [];
    if (current.includes(brand)) {
      setFormData({ ...formData, brands: current.filter((b) => b !== brand) });
    } else {
      setFormData({ ...formData, brands: [...current, brand] });
    }
  };

  const addCustomBrand = () => {
    if (!customBrand.trim()) return;
    const current = formData.brands || [];
    if (!current.includes(customBrand.trim())) {
      setFormData({ ...formData, brands: [...current, customBrand.trim()] });
    }
    setCustomBrand("");
  };

  const inputClass = (fieldName?: string) =>
    `h-10 w-full rounded-lg border ${
      fieldName && errors[fieldName] ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : "border-slate-200 focus:border-blue-600 focus:ring-blue-100"
    } bg-white px-3 text-sm text-slate-800 outline-none transition focus:ring-2`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {initialData ? "Edit Supplier Record" : "Add New Supplier"}
            </h3>
            <p className="text-xs text-slate-500">
              {initialData
                ? `Updating profile for ${initialData.supplierCode}`
                : "Register a verified vendor or distributor for procurement and RMA"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* 1. Basic & Legal Info */}
          <div>
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
              <Building2 className="h-4 w-4" />
              Company Identification
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supplier / Company Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Smart Technologies BD Ltd."
                  className={inputClass("name")}
                />
                {errors.name && (
                  <p className="mt-1 text-[11px] text-rose-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supplier Category / Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as SupplierType })
                  }
                  className={inputClass()}
                >
                  <option value="Distributor">Distributor (Official Brand)</option>
                  <option value="Importer">Importer</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Local Vendor">Local Vendor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Trade License Number
                </label>
                <input
                  type="text"
                  value={formData.tradeLicense || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, tradeLicense: e.target.value })
                  }
                  placeholder="e.g. TR-DHK-2024-8841"
                  className={inputClass()}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  BIN / VAT Registration
                </label>
                <input
                  type="text"
                  value={formData.binNumber || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, binNumber: e.target.value })
                  }
                  placeholder="e.g. 002345891-0101"
                  className={inputClass()}
                />
              </div>
            </div>
          </div>

          {/* 2. Contact Information */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
              <Phone className="h-4 w-4" />
              Primary Contact & Location
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  value={formData.contactPerson || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPerson: e.target.value })
                  }
                  placeholder="e.g. Md. Rafiqul Islam"
                  className={inputClass("contactPerson")}
                />
                {errors.contactPerson && (
                  <p className="mt-1 text-[11px] text-rose-500">
                    {errors.contactPerson}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={formData.designation || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  placeholder="e.g. Senior Key Account Lead"
                  className={inputClass()}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Mobile / Phone *
                </label>
                <input
                  type="text"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="017xxxxxxxx"
                  className={inputClass("phone")}
                />
                {errors.phone && (
                  <p className="mt-1 text-[11px] text-rose-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sales@vendor.com"
                  className={inputClass()}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Office / Warehouse Address
                </label>
                <input
                  type="text"
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Street, Building, Commercial Area"
                  className={inputClass()}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City / District *
                </label>
                <input
                  type="text"
                  value={formData.city || ""}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Dhaka, Chittagong, Sylhet"
                  className={inputClass("city")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as SupplierStatus })
                  }
                  className={inputClass()}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Financials & Payment Terms */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
              <CreditCard className="h-4 w-4" />
              Financial Policy & Banking
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Terms
                </label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentTerms: e.target.value as PaymentTerm,
                    })
                  }
                  className={inputClass()}
                >
                  <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                  <option value="Net 15">Net 15 Days</option>
                  <option value="Net 30">Net 30 Days</option>
                  <option value="Net 60">Net 60 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Credit Limit (BDT)
                </label>
                <input
                  type="number"
                  value={formData.creditLimit || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, creditLimit: Number(e.target.value) })
                  }
                  className={inputClass()}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Due / Balance (BDT)
                </label>
                <input
                  type="number"
                  value={formData.currentBalance || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentBalance: Number(e.target.value),
                    })
                  }
                  className={inputClass()}
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Name & Branch
                </label>
                <input
                  type="text"
                  value={formData.bankName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bankName: e.target.value })
                  }
                  placeholder="e.g. BRAC Bank PLC, Panthapath"
                  className={inputClass()}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  value={formData.accountNumber || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, accountNumber: e.target.value })
                  }
                  placeholder="e.g. 1501203948501"
                  className={inputClass()}
                />
              </div>
            </div>
          </div>

          {/* 4. Brands Supplied */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              <Tag className="h-4 w-4" />
              Brands Supplied
            </h4>
            <p className="text-xs text-slate-500 mb-2">
              Select brands that TechBasket procures from this vendor:
            </p>

            <div className="flex flex-wrap gap-1.5">
              {COMMON_BRANDS.map((brand) => {
                const isSelected = formData.brands?.includes(brand);
                return (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => toggleBrand(brand)}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    {brand}
                  </button>
                );
              })}
            </div>

            {/* Custom brand adder */}
            <div className="mt-2.5 flex items-center gap-2">
              <input
                type="text"
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                placeholder="Add other brand (e.g. Anker)..."
                className="h-8 rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomBrand();
                  }
                }}
              />
              <button
                type="button"
                onClick={addCustomBrand}
                className="h-8 rounded-lg bg-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-300"
              >
                Add
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 rounded-lg bg-blue-600 px-5 text-xs font-semibold text-white shadow-xs shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition"
            >
              {initialData ? "Save Changes" : "Save Supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
