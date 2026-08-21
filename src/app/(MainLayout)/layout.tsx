import DashboardShell from "@/components/dashboard/DashboardShell";
import SmoothScroll from "@/components/SmoothScroll";



const MainLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <div>
      <aside></aside>
      <DashboardShell>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </DashboardShell>
    </div>
  );
};

export default MainLayout;
