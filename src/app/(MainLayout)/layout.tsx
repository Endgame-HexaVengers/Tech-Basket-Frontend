import React from "react";

const MainLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <div>
      <aside></aside>
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
