"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  FiBell,
  FiChevronDown,
  FiHelpCircle,
  FiLogOut,
  FiPlus,
  FiUser,
  FiX,
} from "react-icons/fi";

import { useTabs, type Tab } from "@/context/TabContext";

const TAB_DEFINITIONS: Record<string, Tab> = {
  "/dashboard": { path: "/dashboard", title: "Dashboard", icon: "⌂" },
  "/approval": { path: "/approval", title: "Approval", icon: "✓" },
  "/purchase": { path: "/purchase", title: "Purchase", icon: "🛒" },
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

  return { path, title, icon: "•" };
};

const DefaultHeader = () => {
  const { data: session } = authClient.useSession();

  const user = session?.user;

  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

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

  return (
    <div className="sticky top-0 z-40 bg-white">
      {/* Header */}
      <header className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6">
        <div>
          <h2 className="font-semibold text-slate-900">TechBasket ERP</h2>

          <p className="text-xs text-slate-500">
            Inventory & Management System
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100"
            aria-label="Notifications"
          >
            <FiBell className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100"
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
        </div>
      </header>

      {/* Chrome Style Tabs */}
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

              <button
                type="button"
                onClick={(event) => handleCloseTab(event, tab.path)}
                aria-label={`Close ${tab.title}`}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-500 opacity-0 transition hover:bg-slate-200 group-hover:opacity-100"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="New dashboard tab"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-t-lg border border-transparent text-slate-500 transition hover:bg-slate-200/70 hover:text-slate-700"
        >
          <FiPlus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default DefaultHeader;
