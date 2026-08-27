"use client";

import { useTabs, type Tab } from "@/context/TabContext";

import { FiPlus, FiX } from "react-icons/fi";

import HeadingInfo from "./Header/HeadingInfo";
import FadeUp from "./FadeUp";

const TAB_DEFINITIONS: Record<string, Tab> = {
  "/": {
    path: "/",
    title: "Home",
  },

  "/dashboard": {
    path: "/dashboard",
    title: "Dashboard",
  },

  "/approval": {
    path: "/approval",
    title: "Approval",
  },

  "/purchase": {
    path: "/purchase",
    title: "Purchase",
  },

  "/admin/users-roles": {
    path: "/admin/users-roles",
    title: "Users & Roles",
  },

  "/admin/branches-locations": {
    path: "/admin/branches-locations",
    title: "Branches / Locations",
  },

  "/admin/system-config": {
    path: "/admin/system-config",
    title: "System Config",
  },

  "/search": {
    path: "/search",
    title: "Search",
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

const getTabFullPath = (tab: Tab): string => {
  return tab.query ? `${tab.path}?${tab.query}` : tab.path;
};

const DefaultHeader = () => {
  const { tabs, activeTab, openTab, closeTab, setActiveTab } = useTabs();

  const handleCloseTab = (event: React.MouseEvent, fullPath: string) => {
    event.stopPropagation();

    const currentIndex = tabs.findIndex(
      (tab) => getTabFullPath(tab) === fullPath,
    );

    const isCurrentTab = activeTab === fullPath;

    closeTab(fullPath);

    if (isCurrentTab) {
      const remainingTabs = tabs.filter(
        (tab) => getTabFullPath(tab) !== fullPath,
      );

      const nextTab =
        remainingTabs[currentIndex - 1] ||
        remainingTabs[currentIndex] ||
        remainingTabs[0];

      if (nextTab) {
        setActiveTab(getTabFullPath(nextTab));
      }
    }
  };

  const handleNewTab = () => {
    const homeTab = createTabFromPath("/");
    openTab(homeTab);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
      <FadeUp>
        <HeadingInfo />

        <div
          role="tablist"
          aria-label="Open pages"
          className="flex h-11 items-end gap-1 overflow-x-auto border-b border-slate-200 bg-slate-100 px-2 pt-1"
        >
          {tabs.map((tab) => {
            const fullPath = getTabFullPath(tab);
            const isActive = activeTab === fullPath;

            return (
              <div
                key={fullPath}
                className={`group flex h-10 min-w-37.5 items-center justify-between gap-1 rounded-t-lg border px-2 text-sm transition-all ${
                  isActive
                    ? "border-slate-200 border-b-white bg-white font-medium text-slate-900"
                    : "border-transparent bg-slate-200/70 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab(fullPath)}
                  role="tab"
                  aria-selected={isActive}
                  className="flex h-full min-w-0 flex-1 items-center gap-2 px-1 text-left"
                >
                  {isActive && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  )}
                  <span className="truncate">{tab.title}</span>
                </button>

                <button
                  type="button"
                  onClick={(event) => handleCloseTab(event, fullPath)}
                  aria-label={`Close ${tab.title}`}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-500 opacity-0 transition-all duration-200 hover:bg-slate-200 hover:text-slate-700 group-hover:opacity-100"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            );
          })}

          <button
            type="button"
            onClick={handleNewTab}
            aria-label="New tab"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-t-lg border border-transparent text-slate-500 transition-all duration-200 hover:bg-slate-200/70 hover:text-slate-700"
          >
            <FiPlus className="h-5 w-5" />
          </button>
        </div>
      </FadeUp>
    </header>
  );
};

export default DefaultHeader;
