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
  reorderTabs: (draggedPath: string, targetPath: string) => void;
  closeTab: (path: string) => void;
  updateTabTitle: (path: string, title: string) => void;
  setActiveTab: (path: string, replace?: boolean) => void;
  registerPage: (path: string, component: ComponentType) => void;
  unregisterPage: (path: string) => void;
  getPageComponent: (path: string) => ComponentType | undefined;
  mountedPages: string[];
};

const TabContext = createContext<TabContextType | null>(null);
const TABS_STORAGE_KEY = "techbasket-open-tabs";

const getBasePath = (fullPath: string) => fullPath.split("?")[0];
const getTabFullPath = (tab: Tab) =>
  tab.query ? `${tab.path}?${tab.query}` : tab.path;

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
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    const query = window.location.search.slice(1) || undefined;
    const fullPath = query ? `${path}?${query}` : path;

    try {
      const storedTabs = JSON.parse(
        window.localStorage.getItem(TABS_STORAGE_KEY) || "null",
      ) as Tab[] | null;

      if (Array.isArray(storedTabs) && storedTabs.length > 0) {
        const hasCurrentPath = storedTabs.some(
          (tab) => tab.path === path,
        );
        const restoredTabs = hasCurrentPath
          ? storedTabs
          : [...storedTabs, { path, title: titleFromPath(path), query }];
        const storedActiveTab = window.localStorage.getItem(
          `${TABS_STORAGE_KEY}-active`,
        );
        const restoredActiveTab = restoredTabs.some(
          (tab) => getTabFullPath(tab) === storedActiveTab,
        )
          ? storedActiveTab!
          : fullPath;

        setTabs(restoredTabs);
        setActiveTabState(restoredActiveTab);
        window.history.replaceState(null, "", restoredActiveTab);
      } else {
        setTabs([{ path, title: titleFromPath(path), icon: "•", query }]);
        setActiveTabState(fullPath);
      }
    } catch {
      setTabs([{ path, title: titleFromPath(path), icon: "•", query }]);
      setActiveTabState(fullPath);
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const serializableTabs = tabs.map(({ path, title, query }) => ({
      path,
      title,
      query,
    }));
    window.localStorage.setItem(
      TABS_STORAGE_KEY,
      JSON.stringify(serializableTabs),
    );
    window.localStorage.setItem(`${TABS_STORAGE_KEY}-active`, activeTab);
  }, [activeTab, isHydrated, tabs]);
  const [pageRegistry, setPageRegistry] = useState<
    Map<string, ComponentType>
  >(new Map());
  const [mountedPages, setMountedPages] = useState<string[]>([]);

  const setActiveTab = useCallback((path: string, replace = false) => {
    setActiveTabState(path);

    const basePath = getBasePath(path);
    const query = path.split("?")[1] || undefined;
    setTabs((prev) =>
      prev.map((tab) =>
        tab.path === basePath ? { ...tab, query } : tab
      )
    );

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

  const reorderTabs = useCallback(
    (draggedPath: string, targetPath: string) => {
      if (draggedPath === targetPath) return;

      setTabs((prev) => {
        const draggedIndex = prev.findIndex(
          (tab) => getTabFullPath(tab) === draggedPath,
        );
        const targetIndex = prev.findIndex(
          (tab) => getTabFullPath(tab) === targetPath,
        );

        if (draggedIndex === -1 || targetIndex === -1) return prev;

        const next = [...prev];
        const [draggedTab] = next.splice(draggedIndex, 1);
        next.splice(targetIndex, 0, draggedTab);
        return next;
      });
    },
    [],
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
        reorderTabs,
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
