
import SmoothScroll from "@/components/SmoothScroll";
import DashboardShell from "./page";



const MainLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <div>
      <aside className="col-span-2"></aside>
      <DashboardShell>
        <SmoothScroll>
          <main className="col-span-10">{children}</main>
        </SmoothScroll>
      </DashboardShell>

    </div>
  );
};

export default MainLayout;
