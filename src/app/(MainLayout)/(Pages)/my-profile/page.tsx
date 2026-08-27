"use client";

import FadeUp from "@/components/FadeUp";
import { authClient } from "@/lib/auth-client";
import { useTabs } from "@/context/TabContext";
import { Spinner } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiBriefcase,
  FiEdit2,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiShield,
  FiUser,
  FiUsers
} from "react-icons/fi";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=500&auto=format&fit=crop";

const MyProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const { tabs, activeTab, setActiveTab } = useTabs();
  const user = session?.user;

  // Custom type definitions
  const userRecord = user as (typeof user & {
    branch?: string;
    role?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
  }) | undefined;

  const name = user?.name || "Alex Morgan";
  const branch = userRecord?.branch || "MPL Shop 1316";
  const role = userRecord?.role || "Inventory Manager";
  const username = `@${name.toLowerCase().replace(/\s+/g, "")}`;
  const profileImage = user?.image || DEFAULT_AVATAR;

  // Created On Formatting
  const createdDate = userRecord?.createdAt
    ? new Date(userRecord.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
    : "Oct 12, 2023";

  // Last Active Time Formatting
  const lastActiveTime = userRecord?.updatedAt
    ? new Date(userRecord.updatedAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }) + " (" + new Date(userRecord.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ")"
    : "Just now";

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center gap-3 bg-slate-50">
        <Spinner size="lg" color="accent" />
        <span className="text-sm font-medium text-slate-600">Loading profile...</span>
      </div>
    );
  }

  return (
    <FadeUp className=" bg-slate-50/50 px-4 text-slate-800 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                const currentIndex = tabs.findIndex((t) => t.path === activeTab);
                const prevTab = tabs[currentIndex - 1] || tabs[0];
                if (prevTab) {
                  setActiveTab(prevTab.path);
                }
              }}
              aria-label="Go back"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{name}</h1>

                {/* Animated Green Active Badge */}
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50
                 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  Active
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">{username}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="flex h-10 cursor-pointer items-center gap-2 rounded border
               border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-100 active:scale-95"
            >
              <FiEdit2 className="h-4 w-4" /> Edit User
            </button>

            <button
              type="button"
              className="flex h-10 cursor-pointer items-center gap-2 rounded bg-blue-700
               px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-800 active:scale-95"
            >
              Change Status <FiUsers className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex h-10 cursor-pointer items-center gap-2 rounded
               bg-red-500 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-red-600 active:scale-95"
            >
              <FiLogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>

        {/* Quick Summary Card */}
        <section className="grid gap-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded border border-slate-100 shadow-sm">
              <Image
                src={profileImage}
                alt={name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <Summary label="Username" value={username} />
          </div>
          <Summary icon={<FiBriefcase className="h-4 w-4" />} label="Role" value={role} />
          <Summary icon={<FiMapPin className="h-4 w-4" />} label="Branch" value={branch} />
          <Summary icon={<FiMail className="h-4 w-4" />} label="Email" value={user?.email || "alex@example.com"} />
        </section>

        {/* Tabs */}
        <nav className="flex border-b border-slate-200 text-sm font-medium text-slate-500">
          <button type="button" className="cursor-pointer border-b-2 border-[#173b9b] pb-3 font-semibold text-[#173b9b]">
            Overview
          </button>
          <button type="button" className="ml-8 cursor-pointer pb-3 transition-colors hover:text-slate-800">
            Access &amp; Branch
          </button>
          <button type="button" className="ml-8 cursor-pointer pb-3 transition-colors hover:text-slate-800">
            Activity
          </button>
          <button type="button" className="ml-8 cursor-pointer pb-3 transition-colors hover:text-slate-800">
            Audit Logs
          </button>
        </nav>

        {/* Details Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main Info Section */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Personal Information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Info label="Full Name" value={name} icon={<FiUser />} />
              <Info label="Username" value={username} />
              <Info label="Email Address" value={user?.email || "alex@example.com"} icon={<FiMail />} />
              <Info label="Phone Number" value="+1 (555) 019-2834" />
              <Info label="User ID" value={user?.id || "USR-8892-XTZ"} wide />
            </div>
          </section>

          {/* Right Column / Sidebar */}
          <div className="space-y-6">
            {/* Account Status Card */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Account Status</h2>
              <div className="mt-4 divide-y divide-slate-100 text-xs">
                <Status label="Status" value="Active" badge />
                <Status label="Created On" value={createdDate} />
                <Status label="Last Active" value={lastActiveTime} />
              </div>
            </section>

            {/* Branch Access Card */}
            <section className="rounded-2xl border border-slate-200/80 border-l-4 border-l-blue-700 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Branch Access</h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-amber-600">
                <FiShield className="h-3.5 w-3.5" /> Restricted Access
              </p>

              <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold text-indigo-950">
                  <FiMapPin className="h-4 w-4 text-indigo-600" />
                  {branch}
                </p>
                <p className="mt-1 text-xs text-slate-500">Primary Assigned Branch</p>
              </div>

              <button
                type="button"
                className="mt-4 h-9 w-full cursor-pointer rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
              >
                Change Assigned Branch
              </button>
            </section>
          </div>
        </div>

      </div>
    </FadeUp>
  );
};

// Helper Components
const Summary = ({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) => (
  <div className="flex min-w-0 items-center gap-3">
    {icon && (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        {icon}
      </div>
    )}
    <div className="min-w-0">
      <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">{value}</p>
    </div>
  </div>
);

const Info = ({ label, value, icon, wide = false }: { label: string; value: string; icon?: React.ReactNode; wide?: boolean }) => (
  <div className={`rounded-xl bg-slate-50 p-3.5 border border-slate-100 ${wide ? "sm:col-span-2" : ""}`}>
    <div className="flex items-center gap-2 text-slate-400">
      {icon}
      <p className="text-xs font-medium">{label}</p>
    </div>
    <p className="mt-1 truncate text-sm font-semibold text-slate-800">{value}</p>
  </div>
);

const Status = ({ label, value, badge = false }: { label: string; value: string; badge?: boolean }) => (
  <div className="flex items-center justify-between py-2.5">
    <span className="font-medium text-slate-500">{label}</span>
    {badge ? (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100/70 px-2 py-0.5 text-xs font-semibold text-emerald-700">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        </span>
        {value}
      </span>
    ) : (
      <span className="font-semibold text-slate-800">{value}</span>
    )}
  </div>
);

export default MyProfilePage;