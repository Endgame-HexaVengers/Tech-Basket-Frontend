"use client";

import { useState, useMemo } from "react";
import { Supplier, INITIAL_SUPPLIERS } from "@/types/supplier";
import SupplierStats from "./SupplierStats";
import SupplierFilters, { SupplierFilterValues } from "./SupplierFilters";
import SupplierTable from "./SupplierTable";
import AddSupplierModal from "./AddSupplierModal";
import SupplierDetailsDrawer from "./SupplierDetailsDrawer";
import FadeUp from "../FadeUp";
import { useTabs } from "@/context/TabContext";

export default function SuppliersPageClient() {
  const { openTab } = useTabs();
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
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

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((item) => {
      // Search check
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCode = item.supplierCode.toLowerCase().includes(query);
        const matchesPerson = item.contactPerson.toLowerCase().includes(query);
        const matchesPhone = item.phone.toLowerCase().includes(query);
        const matchesEmail = item.email.toLowerCase().includes(query);
        const matchesCity = item.city.toLowerCase().includes(query);
        const matchesBrand = item.brands.some((b) => b.toLowerCase().includes(query));

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
      if (filters.dueFilter === "due" && item.currentBalance <= 0) {
        return false;
      }
      if (filters.dueFilter === "clear" && item.currentBalance > 0) {
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

  const handleCreatePurchase = (supplier: Supplier) => {
    openTab({
      path: "/purchase/create",
      title: "Purchase Entry",
      icon: "•",
    });
  };

  const handleSaveSupplier = (data: Partial<Supplier>) => {
    if (editingSupplier) {
      // Edit mode
      setSuppliers((prev) =>
        prev.map((s) => (s.id === editingSupplier.id ? ({ ...s, ...data } as Supplier) : s))
      );
      if (selectedSupplier?.id === editingSupplier.id) {
        setSelectedSupplier((prev) => (prev ? ({ ...prev, ...data } as Supplier) : null));
      }
    } else {
      // Create mode
      const nextId = `sup-${Date.now()}`;
      const nextCodeNumber = String(suppliers.length + 101).padStart(3, "0");
      const newSupplier: Supplier = {
        id: nextId,
        supplierCode: `SUP-00${nextCodeNumber}`,
        name: data.name || "Unnamed Supplier",
        companyName: data.companyName || data.name || "Unnamed Supplier",
        type: data.type || "Distributor",
        tradeLicense: data.tradeLicense || "",
        binNumber: data.binNumber || "",
        contactPerson: data.contactPerson || "",
        designation: data.designation || "Executive",
        phone: data.phone || "",
        alternatePhone: data.alternatePhone || "",
        email: data.email || "",
        address: data.address || "",
        city: data.city || "Dhaka",
        paymentTerms: data.paymentTerms || "Net 30",
        creditLimit: data.creditLimit || 500000,
        currentBalance: data.currentBalance || 0,
        totalPurchased: 0,
        totalOrders: 0,
        bankName: data.bankName || "",
        accountNumber: data.accountNumber || "",
        routingNumber: data.routingNumber || "",
        branchName: data.branchName || "",
        bkashNumber: data.bkashNumber || "",
        brands: data.brands || [],
        status: data.status || "Active",
        rating: 5.0,
        pendingRmaCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
        purchases: [],
        ledger:
          data.currentBalance && data.currentBalance > 0
            ? [
                {
                  id: `led-${Date.now()}`,
                  date: new Date().toISOString().split("T")[0],
                  referenceNo: "OB-NEW",
                  type: "Opening Balance",
                  debit: 0,
                  credit: data.currentBalance,
                  balance: data.currentBalance,
                },
              ]
            : [],
        rmaItems: [],
      };

      setSuppliers((prev) => [newSupplier, ...prev]);
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
      `"${s.name.replace(/"/g, '""')}"`,
      s.type,
      `"${s.contactPerson.replace(/"/g, '""')}"`,
      s.phone,
      s.email,
      s.city,
      s.totalPurchased,
      s.currentBalance,
      s.creditLimit,
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
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Supplier Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage hardware distributors, credit lines, accounts payable, and RMA claims.
          </p>
        </div>
      </div>

      {/* 1. KPI Stats Cards */}
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
