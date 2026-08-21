import React from "react";

const MainLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <div className="grid grid-cols-12">
      <aside className="col-span-2"></aside>
      <main className="col-span-10">{children}</main>
    </div>
  );
};

export default MainLayout;
