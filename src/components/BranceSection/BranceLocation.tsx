"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Users,
  X,
} from "lucide-react";
import FadeUp from "../FadeUp";
import { Button } from "@heroui/react";

type Branch = {
  _id?: string;
  id?: string;
  name?: string;
  branchName?: string;
  isActive?: boolean;
  active?: boolean;
  users?: string[];
  assignedUsers?: string[];
};

type BranchStats = {
  totalBranches: number;
  activeBranches: number;
  inactiveBranches: number;
  assignedUsers: number;
};

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);

  const [stats, setStats] = useState<BranchStats>({
    totalBranches: 0,
    activeBranches: 0,
    inactiveBranches: 0,
    assignedUsers: 0,
  });

  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);

  // Form
  const [branchName, setBranchName] = useState("");

  // Add loading
  const [addingBranch, setAddingBranch] = useState(false);

  const [error, setError] = useState("");

  const fetchBranches = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/branches`);

      if (!response.ok) {
        throw new Error("Failed to fetch branches");
      }

      const data = await response.json();

      const branchList: Branch[] = Array.isArray(data)
        ? data
        : data.branches || data.data || [];

      setBranches(branchList);

      calculateStats(branchList);
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (branchList: Branch[]) => {
    const totalBranches = branchList.length;

    const activeBranches = branchList.filter(
      (branch) =>
        branch.isActive === true || branch.active === true
    ).length;

    const inactiveBranches =
      totalBranches - activeBranches;

    const assignedUsers = branchList.reduce(
      (total, branch) => {
        const users =
          branch.assignedUsers ||
          branch.users ||
          [];

        return total + users.length;
      },
      0
    );

    setStats({
      totalBranches,
      activeBranches,
      inactiveBranches,
      assignedUsers,
    });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBranches();
  }, []);

  const handleAddBranch = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!branchName.trim()) {
      setError("Branch name is required.");
      return;
    }

    try {
      setAddingBranch(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/branches`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: branchName.trim(),
            isActive: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add branch");
      }

      const newBranch = await response.json();

      const createdBranch: Branch =
        newBranch.branch ||
        newBranch.data ||
        newBranch;

      // State update
      const updatedBranches = [
        ...branches,
        createdBranch,
      ];

      setBranches(updatedBranches);

      // Count update
      calculateStats(updatedBranches);

      // Form reset
      setBranchName("");

      // Modal close
      setShowModal(false);
    } catch (error) {
      console.error("Error adding branch:", error);

      setError(
        "Failed to add branch. Please try again."
      );
    } finally {
      setAddingBranch(false);
    }
  };
  const cards = [
    {
      title: "TOTAL BRANCHES",
      value: stats.totalBranches,
      icon: <Building2 size={17} />,
      iconClass: "bg-slate-100 text-slate-600",
    },
    {
      title: "ACTIVE BRANCHES",
      value: stats.activeBranches,
      icon: <CheckCircle2 size={17} />,
      iconClass: "bg-blue-100 text-blue-700",
    },
    {
      title: "INACTIVE BRANCHES",
      value: stats.inactiveBranches,
      icon: <XCircle size={17} />,
      iconClass: "bg-red-100 text-red-600",
    },
    {
      title: "ASSIGNED USERS",
      value: stats.assignedUsers,
      icon: <Users size={17} />,
      iconClass: "bg-slate-100 text-slate-600",
    },
  ];

  return (
    <FadeUp className="px-6 py-5">

      <div className="mb-12 flex items-start justify-between">

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Branches & Locations
          </h1>

          <p className="mt-1 text-sm text-slate-700">
            Manage company branches, store locations,
            assigned users, and branch information.
          </p>
        </div>

        {/* ADD BRANCH BUTTON */}

        <Button
          type="button"
          onClick={() => {
            setError("");
            setBranchName("");
            setShowModal(true);
          }}
          className="rounded-md bg-[#2948a8] px-5 py-2.5 text-sm font-semibold
           text-white shadow-sm transition cursor-pointer hover:bg-[#203b91]"
        >
          + Add New Branch
        </Button>

      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded border border-dashed border-slate-300 bg-white px-4 py-4 shadow-sm"
          >
            <div className="flex items-start justify-between">

              <p className="text-xs font-semibold tracking-wide text-slate-700">
                {card.title}
              </p>

              <div
                className={`flex h-7 w-7 items-center justify-center rounded-md ${card.iconClass}`}
              >
                {card.icon}
              </div>

            </div>

            <div className="mt-2">

              {loading ? (
                <div className="h-9 w-12 animate-pulse rounded bg-slate-200" />
              ) : (
                <p className="text-3xl font-bold text-slate-950">
                  {card.value}
                </p>
              )}

            </div>
          </div>
        ))}

      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Add New Branch
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Create a new company branch.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleAddBranch}
              className="p-6"
            >

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Branch Name
              </label>

              <input
                type="text"
                value={branchName}
                onChange={(e) =>
                  setBranchName(e.target.value)
                }
                placeholder="Enter branch name"
                className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#2948a8] focus:ring-2 focus:ring-[#2948a8]/20"
                autoFocus
              />

              {/* Error */}

              {error && (
                <p className="mt-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* Buttons */}

              <div className="mt-6 flex justify-end gap-3">

                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-md border border-slate-300 bg-white hover:bg-blue-700 hover:text-white duration-300
                   px-5 py-2.5 text-sm font-semibold
                   text-slate-700 transition"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  isDisabled={addingBranch}
                  className="rounded-md bg-[#2948a8] px-5 py-2.5 text-sm font-semibold text-white transition
                     hover:bg-[#203b91] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {addingBranch
                    ? "Adding..."
                    : "Add Branch"}
                </Button>

              </div>

            </form>
          </div>

        </div>
      )}

    </FadeUp>
  );
}