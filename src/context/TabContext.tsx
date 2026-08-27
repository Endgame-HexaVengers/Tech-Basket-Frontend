"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";

export type Tab = {
  path: string;
  title: string;
  icon?: ReactNode;
  query?: string;
};

type TabContextType = {
  tabs: Tab[];
  activeTab: string;
  openTab: (tab: Tab) => void;
  closeTab: (path: string) => void;
  updateTabTitle: (path: string, title: string) => void;
  setActiveTab: (path: string) => void;
  registerPage: (path: string, component: ComponentType) => void;
  unregisterPage: (path: string) => void;
  getPageComponent: (path: string) => ComponentType | undefined;
  mountedPages: string[];
};

const TabContext = createContext<TabContextType | null>(null);

const getInitialPath = () => {
  if (typeof window !== "undefined") {
    return window.location.pathname + window.location.search;
  }
  return "/";
};

const getBasePath = (fullPath: string) => fullPath.split("?")[0];

const titleFromPath = (path: string): string => {
  const segments = path.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  if (!last) return "Home";
  return last
    .split(/[-_]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
};

const getInitialTabs = (): Tab[] => {
  if (typeof window === "undefined") return [];
  const path = window.location.pathname;
  const query = window.location.search.slice(1) || undefined;
  return [{ path, title: titleFromPath(path), icon: "•", query }];
};

export const TabProvider = ({ children }: { children: ReactNode }) => {
  const [tabs, setTabs] = useState<Tab[]>(getInitialTabs);
  const [activeTab, setActiveTabState] = useState<string>(getInitialPath);
  const [pageRegistry, setPageRegistry] = useState<
    Map<string, ComponentType>
  >(new Map());
  const [mountedPages, setMountedPages] = useState<string[]>([]);

  const setActiveTab = useCallback((path: string) => {
    setActiveTabState(path);
    window.history.pushState(null, "", path);
  }, []);

  const registerPage = useCallback((path: string, component: ComponentType) => {
    setPageRegistry((prev) => {
      const next = new Map(prev);
      next.set(path, component);
      return next;
    });

    setMountedPages((prev) => {
      if (prev.includes(path)) return prev;
      return [...prev, path];
    });
  }, []);

  const unregisterPage = useCallback((path: string) => {
    setPageRegistry((prev) => {
      const next = new Map(prev);
      next.delete(path);
      return next;
    });

    setMountedPages((prev) => prev.filter((p) => p !== path));
  }, []);

  const openTab = useCallback(
    (tab: Tab) => {
      const fullPath = tab.query ? `${tab.path}?${tab.query}` : tab.path;
      const basePath = getBasePath(fullPath);

      setTabs((prev) => {
        const existingIndex = prev.findIndex(
          (item) => getBasePath(item.query ? `${item.path}?${item.query}` : item.path) === basePath,
        );

        if (existingIndex !== -1) {
          return prev.map((item, i) =>
            i === existingIndex ? { ...item, query: tab.query } : item,
          );
        }

        return [...prev, tab];
      });

      setActiveTab(fullPath);
    },
    [setActiveTab],
  );

  const closeTab = useCallback(
    (path: string) => {
      setTabs((prev) =>
        prev.filter((tab) => {
          const fullPath = tab.query ? `${tab.path}?${tab.query}` : tab.path;
          return fullPath !== path;
        }),
      );

      setActiveTabState((current) => {
        if (current === path) {
          return "";
        }
        return current;
      });

      const basePath = path.split("?")[0];
      unregisterPage(basePath);
    },
    [unregisterPage],
  );

  const updateTabTitle = useCallback((path: string, title: string) => {
    setTabs((prev) =>
      prev.map((tab) => {
        const fullPath = tab.query ? `${tab.path}?${tab.query}` : tab.path;
        return fullPath === path || tab.path === path
          ? { ...tab, title }
          : tab;
      }),
    );
  }, []);

  const getPageComponent = useCallback(
    (path: string) => {
      return pageRegistry.get(path);
    },
    [pageRegistry],
  );

  return (
    <TabContext.Provider
      value={{
        tabs,
        activeTab,
        openTab,
        closeTab,
        updateTabTitle,
        setActiveTab,
        registerPage,
        unregisterPage,
        getPageComponent,
        mountedPages,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export const useTabs = () => {
  const context = useContext(TabContext);

  if (!context) {
    throw new Error("useTabs must be used inside TabProvider");
  }

  return context;
};
