"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type Tab = {
  path: string;
  title: string;
  icon?: ReactNode;
};

type TabContextType = {
  tabs: Tab[];
  activeTab: string;
  openTab: (tab: Tab) => void;
  closeTab: (path: string) => void;
};

const TabContext = createContext<TabContextType | null>(null);

export const TabProvider = ({ children }: { children: ReactNode }) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState("");

  const openTab = useCallback((tab: Tab) => {
    setTabs((prev) => {
      const exists = prev.some((item) => item.path === tab.path);

      return exists ? prev : [...prev, tab];
    });

    setActiveTab(tab.path);
  }, []);

  const closeTab = useCallback((path: string) => {
    setTabs((prev) => prev.filter((tab) => tab.path !== path));

    setActiveTab((current) => (current === path ? "" : current));
  }, []);

  return (
    <TabContext.Provider
      value={{
        tabs,
        activeTab,
        openTab,
        closeTab,
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
