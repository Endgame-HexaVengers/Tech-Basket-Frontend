
import SmoothScroll from "@/components/SmoothScroll";
import DashboardShell from "./page";

const MainLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <div>
      <aside className="col-span-2"></aside>
      <DashboardShell>
        <SmoothScroll>{children}</SmoothScroll>
      </DashboardShell>
      <div className="grid grid-cols-12">
        <aside className="col-span-2"></aside>
        <main className="col-span-10">{children}</main>
      </div>
    </div>
    
  );
};

export default MainLayout;
