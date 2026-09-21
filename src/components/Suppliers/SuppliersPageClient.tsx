"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Supplier, INITIAL_SUPPLIERS } from "@/types/supplier";
import SupplierStats from "./SupplierStats";
import SupplierFilters, { SupplierFilterValues } from "./SupplierFilters";
import SupplierTable from "./SupplierTable";
import AddSupplierModal from "./AddSupplierModal";
import SupplierDetailsDrawer from "./SupplierDetailsDrawer";
import FadeUp from "../FadeUp";
import { useTabs } from "@/context/TabContext";
import { RotateCw } from "lucide-react";
import toast from "react-hot-toast";

export default function SuppliersPageClient() {
  const { openTab } = useTabs();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [filters, setFilters] = useState<SupplierFilterValues>({
    search: "",
    type: "all",
    status: "all",
    dueFilter: "all",
  });

  // Modal & Drawer states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [drawerTab, setDrawerTab] = useState<"overview" | "purchases" | "ledger" | "rma">("overview");

  // Fetch suppliers from backend database
  const fetchSuppliers = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    try {
      const res = await fetch("/api/suppliers", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.suppliers)) {
        setSuppliers(data.suppliers);
      } else {
        // Fallback to initial suppliers if database query was empty
        setSuppliers(INITIAL_SUPPLIERS);
      }
    } catch (err) {
      console.error("Failed to load suppliers from backend:", err);
      // If server is offline or fails, keep initial data so UI is never broken
      setSuppliers((prev) => (prev.length > 0 ? prev : INITIAL_SUPPLIERS));
      toast.error("Could not sync with backend database. Showing cached records.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((item) => {
      // Search check
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesName = item.name?.toLowerCase().includes(query);
        const matchesCode = item.supplierCode?.toLowerCase().includes(query);
        const matchesPerson = item.contactPerson?.toLowerCase().includes(query);
        const matchesPhone = item.phone?.toLowerCase().includes(query);
        const matchesEmail = item.email?.toLowerCase().includes(query);
        const matchesCity = item.city?.toLowerCase().includes(query);
        const matchesBrand = Array.isArray(item.brands) && item.brands.some((b) => b.toLowerCase().includes(query));

        if (
          !matchesName &&
          !matchesCode &&
          !matchesPerson &&
          !matchesPhone &&
          !matchesEmail &&
          !matchesCity &&
          !matchesBrand
        ) {
          return false;
        }
      }

      // Type filter
      if (filters.type !== "all" && item.type !== filters.type) {
        return false;
      }

      // Status filter
      if (filters.status !== "all" && item.status !== filters.status) {
        return false;
      }

      // Due balance filter
      if (filters.dueFilter === "due" && (item.currentBalance || 0) <= 0) {
        return false;
      }
      if (filters.dueFilter === "clear" && (item.currentBalance || 0) > 0) {
        return false;
      }

      return true;
    });
  }, [suppliers, filters]);

  // Actions
  const handleOpenAddModal = () => {
    setEditingSupplier(null);
    setIsAddModalOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsAddModalOpen(true);
  };

  const handleViewDetails = (
    supplier: Supplier,
    tab: "overview" | "purchases" | "ledger" | "rma" = "overview"
  ) => {
    setSelectedSupplier(supplier);
    setDrawerTab(tab);
    setIsDrawerOpen(true);
  };

  const handleOpenLedger = (supplier: Supplier) => {
    handleViewDetails(supplier, "ledger");
  };

  const handleCreatePurchase = (_supplier: Supplier) => {
    openTab({
      path: "/purchase/create",
      title: "Purchase Entry",
      icon: "•",
    });
  };

  // Save (Create or Update) Supplier to Backend
  const handleSaveSupplier = async (data: Partial<Supplier>) => {
    const toastId = toast.loading(editingSupplier ? "Updating supplier..." : "Saving new supplier...");
    try {
      if (editingSupplier) {
        // Edit mode (PATCH)
        const targetId = editingSupplier.id || editingSupplier._id;
        const res = await fetch(`/api/suppliers/${targetId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.error || "Failed to update supplier.");
        }

        toast.success("Supplier updated successfully in database!", { id: toastId });

        // Update selected supplier in drawer if open
        if (selectedSupplier?.id === editingSupplier.id || selectedSupplier?._id === editingSupplier._id) {
          setSelectedSupplier(result.supplier);
        }
      } else {
        // Create mode (POST)
        const res = await fetch("/api/suppliers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.error || "Failed to create supplier.");
        }

        toast.success("New supplier saved successfully to database!", { id: toastId });
      }

      setIsAddModalOpen(false);
      setEditingSupplier(null);
      // Refresh list to update all live amounts, dues, and statistics
      await fetchSuppliers();
    } catch (err: unknown) {
      console.error("Save supplier error:", err);
      toast.error(err.message || "Something went wrong while saving.", { id: toastId });
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Supplier Code",
      "Supplier Name",
      "Type",
      "Contact Person",
      "Phone",
      "Email",
      "City",
      "Total Purchased",
      "Outstanding Due",
      "Credit Limit",
      "Status",
    ];

    const rows = filteredSuppliers.map((s) => [
      s.supplierCode,
      `"${(s.name || "").replace(/"/g, '""')}"`,
      s.type,
      `"${(s.contactPerson || "").replace(/"/g, '""')}"`,
      s.phone,
      s.email,
      s.city,
      s.totalPurchased || 0,
      s.currentBalance || 0,
      s.creditLimit || 0,
      s.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TechBasket_Suppliers_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <FadeUp className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Supplier Management
            </h1>
            <button
              onClick={() => fetchSuppliers(true)}
              title="Refresh suppliers from database"
              disabled={isRefreshing || isLoading}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 shadow-xs hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 transition-colors"
            >
              <RotateCw className={`h-4 w-4 ${isRefreshing || isLoading ? "animate-spin text-blue-600" : ""}`} />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage hardware distributors, procurement volumes, accounts payable, and RMA warranties.
          </p>
        </div>
      </div>

      {/* 1. KPI Stats Cards (Automatically calculated from backend suppliers data) */}
      <SupplierStats suppliers={suppliers} />

      {/* 2. Filters & Actions Bar */}
      <SupplierFilters
        filters={filters}
        onChange={setFilters}
        onOpenAddModal={handleOpenAddModal}
        onExport={handleExportCSV}
      />

      {/* 3. Suppliers Directory Table */}
      <SupplierTable
        suppliers={filteredSuppliers}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onEdit={handleEditSupplier}
        onOpenLedger={handleOpenLedger}
        onCreatePurchase={handleCreatePurchase}
      />

      {/* 4. Add / Edit Modal */}
      <AddSupplierModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSupplier(null);
        }}
        onSave={handleSaveSupplier}
        initialData={editingSupplier}
      />

      {/* 5. 360 Details Drawer */}
      <SupplierDetailsDrawer
        supplier={selectedSupplier}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedSupplier(null);
        }}
        defaultTab={drawerTab}
        onCreatePurchase={handleCreatePurchase}
      />
    </FadeUp>
  );
}
