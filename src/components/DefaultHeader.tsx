"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { FiPlus, FiX } from "react-icons/fi";

import { useTabs, type Tab } from "@/context/TabContext";
import HeadingInfo from "./Header/HeadingInfo";

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
  const pathname = usePathname();
  const router = useRouter();

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
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

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
      {/*  HEADER */}

      <HeadingInfo />

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
