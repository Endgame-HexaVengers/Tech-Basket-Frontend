"use client";

import { useState, useEffect } from "react";
import FadeUp from "@/components/FadeUp";
import UserFilters from "@/components/UserManagement/UserFilters";
import UserPagination from "@/components/UserManagement/UserPagination";
import UserStats from "@/components/UserManagement/UserStats";
import UserTable from "@/components/UserManagement/UserTable";
import CreateUserDrawer, {
  UserType,
} from "@/components/UserManagement/CreateUserDrawer";
import { Plus, Loader2 } from "lucide-react";

// Local Backend API URL
const API_BASE_URL = "http://localhost:5000/api/users";

const UserManagementPage = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);


      const token = localStorage.getItem("token");

      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users from backend");
      }

      const data = await response.json();
      

      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err: unknown) {
      console.error("Error fetching users:", err);
      setError((err as Error).message || "Something went wrong while fetching users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  // 2. Add User to Local Backend and Update UI
  const handleAddUser = async (newUser: UserType) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Failed to save user in backend");
      }

      const createdUser = await response.json();

      setUsers((prevUsers) => [createdUser.user || createdUser, ...prevUsers]);
    } catch (err: unknown) {
      console.error("Error creating user:", err);
     
      setUsers((prevUsers) => [newUser, ...prevUsers]);
    }
  };

  return (
    <FadeUp className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <FadeUp className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            User Management
          </h1>
          <p className="mt-1 text-sm font-medium text-gray-500">
            Manage users, roles, branches and account access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
        >
          <Plus size={17} />
          Create User
        </button>
      </FadeUp>

      {/* Stats */}
      <UserStats />

      {/* Table Section */}
      <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <UserFilters />

        {/* Loading State */}
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium">Loading users from server...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-red-500">
            <p className="font-semibold">{error}</p>
            <button
              onClick={fetchUsers}
              className="mt-2 rounded bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200"
            >
              Try Again
            </button>
          </div>
        ) : (
          /* User Table */
          <UserTable users={users} />
        )}

        <UserPagination />
      </section>

      {/* Static Slider Drawer */}
      <CreateUserDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAddUser={handleAddUser}
      />
    </FadeUp>
  );
};

export default UserManagementPage;