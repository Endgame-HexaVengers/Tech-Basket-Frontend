"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
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
  openNewTab: (tab: Tab) => void;
  closeTab: (path: string) => void;
  updateTabTitle: (path: string, title: string) => void;
  setActiveTab: (path: string, replace?: boolean) => void;
  registerPage: (path: string, component: ComponentType) => void;
  unregisterPage: (path: string) => void;
  getPageComponent: (path: string) => ComponentType | undefined;
  mountedPages: string[];
};

const TabContext = createContext<TabContextType | null>(null);

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

export const TabProvider = ({ children }: { children: ReactNode }) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTabState] = useState<string>("");

  useEffect(() => {
    const path = window.location.pathname;
    const query = window.location.search.slice(1) || undefined;
    const fullPath = query ? `${path}?${query}` : path;

    setTabs([{ path, title: titleFromPath(path), icon: "•", query }]);
    setActiveTabState(fullPath);
  }, []);
  const [pageRegistry, setPageRegistry] = useState<
    Map<string, ComponentType>
  >(new Map());
  const [mountedPages, setMountedPages] = useState<string[]>([]);

  const setActiveTab = useCallback((path: string, replace = false) => {
    setActiveTabState(path);

    if (replace) {
      window.history.replaceState(null, "", path);
    } else {
      window.history.pushState(null, "", path);
    }
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

  const openNewTab = useCallback((tab: Tab) => {
    const query = tab.query ?? `tab=${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const fullPath = `${tab.path}?${query}`;

    setTabs((prev) => [...prev, { ...tab, query }]);
    setActiveTabState(fullPath);
    window.history.pushState(null, "", fullPath);
  }, []);

  const closeTab = useCallback(
    (path: string) => {
      const basePath = path.split("?")[0];

      setTabs((prev) => {
        const nextTabs = prev.filter((tab) => {
          const fullPath = tab.query ? `${tab.path}?${tab.query}` : tab.path;
          return fullPath !== path;
        });

        if (!nextTabs.some((tab) => tab.path === basePath)) {
          unregisterPage(basePath);
        }

        return nextTabs;
      });

      setActiveTabState((current) => {
        if (current === path) {
          return "";
        }
        return current;
      });

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
        openNewTab,
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
