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
    <header className="sticky top-0 z-50 w-full shrink-0 bg-white/95 shadow-[0_1px_3px_rgba(15,23,42,0.06)] backdrop-blur-sm dark:bg-slate-950/95 dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
      <FadeUp>
        <HeadingInfo />

        <div className="w-full overflow-hidden">
          <div
            role="tablist"
            aria-label="Open pages"
            className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 flex h-12 items-end gap-1.5 overflow-x-auto border-b border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100/80 px-3 pt-2 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800/90"
          >
            {tabs.map((tab) => {
              const fullPath = getTabFullPath(tab);
              const isActive = activeTab === fullPath;

              return (
                <div
                  key={fullPath}
                  className={`group relative flex h-10 min-w-[9.5rem] items-center justify-between gap-1 rounded-t-xl border px-3 text-sm transition-all duration-200 ease-out ${
                    isActive
                      ? "border-slate-200/80 border-b-white bg-white font-semibold text-slate-900 shadow-[0_-2px_6px_rgba(15,23,42,0.05)] dark:border-slate-600/80 dark:border-b-slate-800 dark:bg-slate-800 dark:text-white dark:shadow-[0_-2px_8px_rgba(0,0,0,0.2)]"
                      : "border-transparent bg-white/40 text-slate-600 hover:bg-white/80 hover:text-slate-900 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:bg-slate-700/80 dark:hover:text-white"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-x-2 top-0 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveTab(fullPath)}
                    role="tab"
                    aria-selected={isActive}
                    className="flex h-full min-w-0 flex-1 items-center gap-2 px-1 text-left"
                  >
                    {isActive && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.15)]" />
                    )}

                    <span className="truncate tracking-tight">{tab.title}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(event) => handleCloseTab(event, fullPath)}
                    aria-label={`Close ${tab.title}`}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 opacity-0 transition-all duration-200 hover:bg-slate-200 hover:text-slate-700 group-hover:opacity-100 dark:text-slate-500 dark:hover:bg-slate-600 dark:hover:text-white"
                  >
                    <FiX className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              onClick={handleNewTab}
              aria-label="New tab"
              className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-transparent text-slate-500 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:text-slate-900 hover:shadow-sm dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <FiPlus className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </FadeUp>
    </header>
  );
};

export default DefaultHeader;
