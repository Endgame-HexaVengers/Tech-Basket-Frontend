import DefaultHeader from "@/components/DefaultHeader";
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
    <div className="grid min-h-screen grid-cols-12">
      <aside className="col-span-2">{/* Sidebar */}</aside>

      <div className="col-span-10">
        <header>
          <DefaultHeader />
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
