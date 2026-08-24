import DefaultHeader from "@/components/DefaultHeader";
import DefaultSidebar from "@/components/DefaultSidebar";
import { TabProvider } from "@/context/TabContext";
// const MainLayout = ({ children }: LayoutProps<"/">) => {
//   return (
//     <div>
//       <aside className="col-span-2"></aside>
//       <DashboardShell>
//         <SmoothScroll>{children}</SmoothScroll>
//       </DashboardShell>
//       <div className="grid grid-cols-12">
//         <aside className="col-span-2"></aside>

//         <main className="col-span-10">
//           <header>
//             <h1>TechBasket</h1>
//           </header>
//           <main>{children}</main>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;

import type { ReactNode } from "react";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <TabProvider>
      {" "}
      <div className="min-h-screen w-full">
        {/* Fixed Sidebar */}
        <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
          <DefaultSidebar />
        </aside>

        {/* Main Content */}
        <div className="ml-64 min-h-screen">
          <header>
            <DefaultHeader />
          </header>

          <main>{children}</main>
        </div>
      </div>
    </TabProvider>
  );
};

export default MainLayout;
