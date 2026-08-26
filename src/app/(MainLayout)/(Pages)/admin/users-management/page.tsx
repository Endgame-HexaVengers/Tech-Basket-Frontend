"use client";

import { useState } from "react";
import FadeUp from "@/components/FadeUp";
import UserBreadcrumb from "@/components/UserManagement/UserBreadcrumb";
import UserFilters from "@/components/UserManagement/UserFilters";
import UserPagination from "@/components/UserManagement/UserPagination";
import UserStats from "@/components/UserManagement/UserStats";
import UserTable from "@/components/UserManagement/UserTable";
import CreateUserDrawer, {UserType,} from "@/components/UserManagement/CreateUserDrawer";
import { Plus } from "lucide-react";


const INITIAL_USERS: UserType[] = [
  {
    id: "1",
    fullName: "Jane Doe",
    username: "janedoe",
    email: "jane@techbasket.com",
    phone: "+1 (555) 000-0000",
    systemRole: "Store Manager",
    assignedBranch: "MPL Shop 1316",
    status: "Active",
    createdAt: "2026-08-25",
  },
];

const UserManagementPage = () => {
  const [users, setUsers] = useState<UserType[]>(INITIAL_USERS);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAddUser = (newUser: UserType) => {
    setUsers((prevUsers) => [newUser, ...prevUsers]);
    console.log("Current Static Users Array:", [newUser, ...users]);
  };

  return (
    <FadeUp className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <FadeUp className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <UserBreadcrumb />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            User Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            Manage users, roles, branches and account access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="inline-flex h-10 items-center cursor-pointer justify-center gap-2 rounded
           bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
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
        <UserTable users={users} />
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