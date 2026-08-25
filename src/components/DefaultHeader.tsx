"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useRef, useState } from "react";

import {
  FiBell,
  FiChevronDown,
  FiHelpCircle,
  FiLogOut,
  FiPlus,
  FiUser,
  FiX,
} from "react-icons/fi";
import { FiBell, FiHelpCircle, FiPlus, FiUser, FiX } from "react-icons/fi";

import { useTabs, type Tab } from "@/context/TabContext";
import toast from "react-hot-toast";
import { Button } from "@heroui/react";

const TAB_DEFINITIONS: Record<string, Tab> = {
  "/dashboard": {
    path: "/dashboard",
    title: "Dashboard",
    icon: "⌂",
  },

  "/approval": {
    path: "/approval",
    title: "Approval",
    icon: "✓",
  },

  "/purchase": {
    path: "/purchase",
    title: "Purchase",
    icon: "🛒",
  },

  "/admin/users-roles": {
    path: "/admin/users-roles",
    title: "Users & Roles",
    icon: "⚙",
  },

  "/admin/branches-locations": {
    path: "/admin/branches-locations",
    title: "Branches / Locations",
    icon: "⚙",
  },

  "/admin/system-config": {
    path: "/admin/system-config",
    title: "System Config",
    icon: "⚙",
  },
};

const createTabFromPath = (path: string): Tab => {
  const configuredTab = TAB_DEFINITIONS[path];

  if (configuredTab) {
    return configuredTab;
  }

  const segments = path.split("/").filter(Boolean);

  const lastSegment = segments[segments.length - 1];

  const title = lastSegment
    ? lastSegment
        .split(/[-_]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Dashboard";

  return {
    path,
    title,
    icon: "•",
  };
};

const DefaultHeader = () => {
  const { data: session } = authClient.useSession();

  const user = session?.user;

  const pathname = usePathname();
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { tabs, openTab, closeTab } = useTabs();

  useEffect(() => {
    if (pathname && pathname !== "/") {
      openTab(createTabFromPath(pathname));
    }
  }, [openTab, pathname]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const handleSignOut = async () => {
    setIsProfileMenuOpen(false);
    await authClient.signOut();
    router.push("/login");
  };

  const handleCloseTab = (event: React.MouseEvent, path: string) => {
    event.stopPropagation();

    const currentIndex = tabs.findIndex((tab) => tab.path === path);

    const isCurrentTab = pathname === path;

    closeTab(path);

    if (isCurrentTab) {
      const remainingTabs = tabs.filter((tab) => tab.path !== path);

      const nextTab =
        remainingTabs[currentIndex - 1] ||
        remainingTabs[currentIndex] ||
        remainingTabs[0];

      router.push(nextTab?.path || "/dashboard");
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await authClient.signOut();

      setProfileOpen(false);

      toast.success("Logged out successfully!");

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);

      setIsLoggingOut(false);
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-white">
      {/*  HEADER */}
      <header className="flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white px-6">
        {/* Brand */}
        <div>
          <h2 className="font-semibold text-slate-900">TechBasket ERP</h2>

          <p className="text-xs text-slate-500">
            Inventory & Management System
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* Notification */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Notifications"
          >
            <FiBell className="h-5 w-5" />
          </button>

          {/* Help */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Help"
          >
            <FiHelpCircle className="h-5 w-5" />
          </button>

          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
              aria-label="Open profile menu"
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="menu"
              className="flex items-center gap-1 rounded-full p-1 text-slate-600 transition-colors hover:bg-slate-100"
            >
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-indigo-500/20">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User Avatar"}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : user ? (
                  <span className="flex h-full w-full items-center justify-center bg-linear-to-tr from-indigo-600 to-purple-600 text-sm font-bold text-white">
                    {userInitial}
                  </span>
                ) : (
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-slate-100">
                    <FiUser className="h-5 w-5" />
                  </span>
                )}
              </span>
              <FiChevronDown
                className={`mr-1 h-4 w-4 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isProfileMenuOpen && (
              <div
                role="menu"
                aria-label="Profile menu"
                className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
              >
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user?.name || "User"}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {user?.email || "No email available"}
                  </p>
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    router.push("/my-profile");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <FiUser className="h-4 w-4" />
                  Profile
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <FiLogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
          {/*   USER PROFILE */}
          <div ref={profileRef} className="relative ml-2">
            {user ? (
              <>
                {/* Avatar Button */}
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className={`flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full ring-2 duration-300 ${
                    profileOpen
                      ? "scale-105 ring-indigo-500/40"
                      : "ring-indigo-500/40 hover:ring-indigo-500/80"
                  }`}
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User Avatar"}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center
                     bg-linear-to-tr from-indigo-600 to-purple-600 text-sm font-bold text-white"
                    >
                      {userInitial}
                    </div>
                  )}
                </button>

                {/* PROFILE DROPDOWN*/}
                <div
                  className={`absolute right-0 top-12 z-50 w-56 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_10px_35px_rgba(15,23,42,0.15)] transition-all duration-200 ease-out ${
                    profileOpen
                      ? "visible translate-y-0 scale-100 opacity-100"
                      : "invisible -translate-y-2 scale-95 opacity-0"
                  }`}
                >
                  {/* User Information */}
                  <div className="px-3 py-2.5">
                    <p className="text-xs font-medium text-slate-400">
                      Signed in as
                    </p>

                    <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                      {user.name || "User"}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="my-1 border-t border-slate-100" />

                  {/* Profile Button */}
                  <Button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      router.push("/profile");
                    }}
                    className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-left text-sm font-medium text-slate-600 transition-all duration-200 hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Profile
                  </Button>

                  {/* Logout Button */}
                  <Button
                    type="button"
                    onClick={handleLogout}
                    isDisabled={isLoggingOut}
                    className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-left text-sm font-medium text-red-600 transition-all duration-200 hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoggingOut ? "Logging out..." : "Log Out"}
                  </Button>
                </div>
              </>
            ) : (
              /* User not logged in */
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600"
              >
                <FiUser className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/*
          TABS
     */}
      <div
        role="tablist"
        aria-label="Open pages"
        className="flex h-11 items-end gap-1 overflow-x-auto border-b border-slate-200 bg-slate-100 px-2 pt-1"
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;

          return (
            <div
              key={tab.path}
              className={`group flex h-10 min-w-[150px] items-center justify-between gap-1 rounded-t-lg border px-2 text-sm transition-all ${
                isActive
                  ? "border-slate-200 border-b-white bg-white font-medium text-slate-900"
                  : "border-transparent bg-slate-200/70 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {/* Tab Button */}
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => router.push(tab.path)}
                className="flex h-full min-w-0 flex-1 items-center gap-2 px-1 text-left"
              >
                <span className="shrink-0">{tab.icon}</span>

                <span className="truncate">{tab.title}</span>
              </button>

              {/* Close Tab */}
              <button
                type="button"
                onClick={(event) => handleCloseTab(event, tab.path)}
                aria-label={`Close ${tab.title}`}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-500 opacity-0 transition-all duration-200 hover:bg-slate-200 hover:text-slate-700 group-hover:opacity-100"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          );
        })}

        {/*   NEW TAB*/}
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="New dashboard tab"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-t-lg border border-transparent text-slate-500 transition-all duration-200 hover:bg-slate-200/70 hover:text-slate-700"
        >
          <FiPlus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default DefaultHeader;
