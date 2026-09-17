"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, RotateCw } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import FadeUp from "@/components/FadeUp";
import { Branch, FilterParams, BranchStatsData, INITIAL_BRANCHES } from "@/types/branch";
import BranchStats from "./BranchStats";
import BranchFilters from "./BranchFilters";
import BranchTable from "./BranchTable";
import BranchModal from "./BranchModal";
import BranchDetailsDrawer from "./BranchDetailsDrawer";

export default function BranchesPageClient() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [stats, setStats] = useState<BranchStatsData>({
    totalBranches: 0,
    activeBranches: 0,
    inactiveBranches: 0,
    assignedUsers: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Filters state
  const [filters, setFilters] = useState<FilterParams>({
    search: "",
    status: "",
    type: "",
    location: "",
  });

  // Modal & Drawer states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Helper to recompute stats
  const recalculateStats = (list: Branch[]): BranchStatsData => {
    const totalBranches = list.length;
    const activeBranches = list.filter((b) => b.status === "ACTIVE").length;
    const inactiveBranches = totalBranches - activeBranches;
    const assignedUsers = list.reduce(
      (sum, b) =>
        sum + (typeof b.users === "number" ? b.users : (Array.isArray(b.assignedUsers) ? b.assignedUsers.length : 0)),
      0
    );

    return { totalBranches, activeBranches, inactiveBranches, assignedUsers };
  };

  // Fetch branches from internal API route
  const fetchBranches = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    try {
      const res = await fetch("/api/branches", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.branches) && data.branches.length > 0) {
        setBranches(data.branches);
        if (data.stats) {
          setStats(data.stats);
        } else {
          setStats(recalculateStats(data.branches));
        }
      } else {
        // Fallback to initial seeds
        setBranches(INITIAL_BRANCHES);
        setStats(recalculateStats(INITIAL_BRANCHES));
      }
    } catch (err) {
      console.error("Failed to load branches from API:", err);
      // Ensure UI always has data from initial fallback
      setBranches((prev) => {
        if (prev.length > 0) return prev;
        setStats(recalculateStats(INITIAL_BRANCHES));
        return INITIAL_BRANCHES;
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  // Distinct available locations for filter dropdown
  const availableLocations = useMemo(() => {
    const set = new Set<string>();
    branches.forEach((b) => {
      if (b.location) set.add(b.location.trim());
    });
    return Array.from(set);
  }, [branches]);

  // Filtered branches list
  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      // Search
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesName = branch.name?.toLowerCase().includes(query);
        const matchesCode = branch.code?.toLowerCase().includes(query);
        const matchesLocation = branch.location?.toLowerCase().includes(query);
        const matchesManager = branch.manager?.toLowerCase().includes(query);
        const matchesAddress = branch.address?.toLowerCase().includes(query);

        if (
          !matchesName &&
          !matchesCode &&
          !matchesLocation &&
          !matchesManager &&
          !matchesAddress
        ) {
          return false;
        }
      }

      // Status
      if (filters.status && filters.status !== "all" && branch.status !== filters.status) {
        return false;
      }

      // Type
      if (filters.type && filters.type !== "all" && branch.type !== filters.type) {
        return false;
      }

      // Location
      if (
        filters.location &&
        filters.location !== "all" &&
        !branch.location?.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [branches, filters]);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const handleViewDetails = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDrawerOpen(true);
  };

  const handleSaveBranch = async (formData: Partial<Branch>) => {
    try {
      if (editingBranch) {
        // Edit existing branch
        const targetId = editingBranch.id || editingBranch._id;
        const res = await fetch(`/api/branches/${targetId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error("Failed to update branch");
        }

        const data = await res.json();
        const updatedBranch = data.branch || { ...editingBranch, ...formData };

        setBranches((prev) => {
          const next = prev.map((b) =>
            b.id === targetId || b._id === targetId ? updatedBranch : b
          );
          setStats(recalculateStats(next));
          return next;
        });

        if (selectedBranch && (selectedBranch.id === targetId || selectedBranch._id === targetId)) {
          setSelectedBranch(updatedBranch);
        }

        toast.success("Branch updated successfully");
      } else {
        // Create new branch
        const res = await fetch("/api/branches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error("Failed to create branch");
        }

        const data = await res.json();
        const newBranch = data.branch;

        setBranches((prev) => {
          const next = [newBranch, ...prev];
          setStats(recalculateStats(next));
          return next;
        });

        toast.success("New branch created successfully");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save branch");
      throw err;
    }
  };

  const handleToggleStatus = async (branch: Branch) => {
    const targetId = branch.id || branch._id;
    const newStatus = branch.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      const res = await fetch(`/api/branches/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to toggle status");
      }

      setBranches((prev) => {
        const next = prev.map((b) =>
          b.id === targetId || b._id === targetId ? { ...b, status: newStatus } : b
        );
        setStats(recalculateStats(next));
        return next;
      });

      toast.success(`Branch is now ${newStatus}`);
    } catch (err: any) {
      toast.error("Could not update status");
    }
  };

  const handleDelete = async (branch: Branch) => {
    const targetId = branch.id || branch._id;

    const result = await Swal.fire({
      title: "Delete Branch?",
      text: `Are you sure you want to delete "${branch.name}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/branches/${targetId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to delete branch");
        }

        setBranches((prev) => {
          const next = prev.filter((b) => b.id !== targetId && b._id !== targetId);
          setStats(recalculateStats(next));
          return next;
        });

        toast.success("Branch deleted successfully");
      } catch (err: any) {
        toast.error("Could not delete branch");
      }
    }
  };

  return (
    <FadeUp className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Branches & Locations
            </h1>
            <button
              type="button"
              onClick={() => fetchBranches(true)}
              title="Refresh database"
              className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition"
            >
              <RotateCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin text-blue-600" : ""}`}
              />
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Manage company branches, store locations, assigned users, and branch information.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-[#2948a8] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#203b91] cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Branch</span>
        </button>
      </div>

      {/* Stats Cards */}
      <BranchStats stats={stats} loading={loading} />

      {/* Filters Bar */}
      <BranchFilters
        filters={filters}
        onFilterChange={setFilters}
        availableLocations={availableLocations}
      />

      {/* Branches Table */}
      <BranchTable
        branches={filteredBranches}
        loading={loading}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      {/* Add / Edit Branch Modal */}
      <BranchModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBranch(null);
        }}
        onSave={handleSaveBranch}
        initialData={editingBranch}
      />

      {/* Branch Details Drawer */}
      <BranchDetailsDrawer
        branch={selectedBranch}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedBranch(null);
        }}
        onEdit={handleEdit}
      />
    </FadeUp>
  );
}
