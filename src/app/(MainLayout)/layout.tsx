import DefaultHeader from "@/components/DefaultHeader";
import DefaultSidebar from "@/components/DefaultSidebar";
import { TabProvider } from "@/context/TabContext";

import type { ReactNode } from "react";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <TabProvider>
      <div className="min-h-screen w-full bg-slate-50 flex">
        {/* Fixed Sidebar */}
        <aside className="fixed left-0 top-0 z-50 flex h-screen min-h-0 w-64 flex-col border-r border-slate-200 bg-white">
          <DefaultSidebar />
        </aside>

        {/* Main Content Area */}
        <div className="ml-64 flex-1 min-h-screen flex flex-col">
          <DefaultHeader />

          {/* Page Content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </TabProvider>
  );
};

export default MainLayout;