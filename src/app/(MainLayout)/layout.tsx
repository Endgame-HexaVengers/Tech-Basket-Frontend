"use client";

import DefaultHeader from "@/components/DefaultHeader";
import DefaultSidebar from "@/components/DefaultSidebar";
import { TabProvider, useTabs } from "@/context/TabContext";
import { useEffect, useState, type ComponentType } from "react";

import HomePage from "@/app/(MainLayout)/page";
import DashboardPage from "@/app/(MainLayout)/(Pages)/dashboard/page";
import SearchPage from "@/app/(MainLayout)/(Pages)/search/page";
import MyProfilePage from "@/app/(MainLayout)/(Pages)/my-profile/page";
import SalesCreatePage from "@/app/(MainLayout)/(Pages)/sales/create/page";
import SalesInvoicePage from "@/app/(MainLayout)/(Pages)/sales/invoice/page";
import SalesReturnPage from "@/app/(MainLayout)/(Pages)/sales/return/page";
import SalesApprovalPage from "@/app/(MainLayout)/(Pages)/sales/sales/page";
import SalesPersonInfoPage from "@/app/(MainLayout)/(Pages)/sales/person-info/page";
import PurchaseCreatePage from "@/app/(MainLayout)/(Pages)/purchase/create/page";
import PurchaseInvoicePage from "@/app/(MainLayout)/(Pages)/purchase/purchase-invoice/page";
import PurchaseReturnPage from "@/app/(MainLayout)/(Pages)/purchase/return/page";
import PurchaseListPage from "@/app/(MainLayout)/(Pages)/purchase/purchaseList/page";
import AddPurchaseOrderPage from "@/app/(MainLayout)/(Pages)/purchase/addPurcheseOrder/page";
import OrderDetailsPage from "@/app/(MainLayout)/(Pages)/purchase/order-details/page";
import PurchaseHistoryPage from "@/app/(MainLayout)/(Pages)/purchase/History/page";
import PurchaseFinalInvoicePage from "@/app/(MainLayout)/(Pages)/purchase/invoice/page";
import RmaReplacementInPage from "@/app/(MainLayout)/(Pages)/rma/replacement-in/page";
import ApprovalPage from "@/app/(MainLayout)/(Pages)/approval/page";
import SalesReturnApprovalPage from "@/app/(MainLayout)/(Pages)/approval/sales-return/page";
import PurchaseApprovalPage from "@/app/(MainLayout)/(Pages)/approval/purchase-approval/page";
import UserManagementPage from "@/app/(MainLayout)/(Pages)/admin/users/page";
import ProductsPage from "@/app/(MainLayout)/(Pages)/admin/products/page";
import AddProductPage from "@/app/(MainLayout)/(Pages)/admin/products/add/page";
import BranchesPage from "@/app/(MainLayout)/(Pages)/admin/branches/page";
import SystemConfigPage from "@/app/(MainLayout)/(Pages)/admin/system-config/page";

const ROUTE_MAP: Record<string, ComponentType> = {
  "/": HomePage,
  "/dashboard": DashboardPage,
  "/search": SearchPage,
  "/my-profile": MyProfilePage,
  "/sales/create": SalesCreatePage,
  "/sales/invoice": SalesInvoicePage,
  "/sales/return": SalesReturnPage,
  "/sales/sales": SalesApprovalPage,
  "/sales/person-info": SalesPersonInfoPage,
  "/purchase/create": PurchaseCreatePage,
  "/purchase/purchase-invoice": PurchaseInvoicePage,
  "/purchase/return": PurchaseReturnPage,
  "/purchase/purchaseList": PurchaseListPage,
  "/purchase/addPurcheseOrder": AddPurchaseOrderPage,
  "/purchase/order-details": OrderDetailsPage,
  "/purchase/History": PurchaseHistoryPage,
  "/purchase/invoice": PurchaseFinalInvoicePage,
  "/rma/replacement-in": RmaReplacementInPage,
  "/approval": ApprovalPage,
  "/approval/sales-return": SalesReturnApprovalPage,
  "/approval/purchase-approval": PurchaseApprovalPage,
  "/admin/users": UserManagementPage,
  "/admin/products": ProductsPage,
  "/admin/products/add": AddProductPage,
  "/admin/branches": BranchesPage,
  "/admin/branches-locations": BranchesPage,
  "/admin/system-config": SystemConfigPage,
};

const MainLayout = () => {
  return (
    <TabProvider>
      <div className="min-h-screen w-full bg-slate-50 flex">
        <aside className="fixed left-0 top-0 z-50 flex h-screen min-h-0 w-64 flex-col border-r border-slate-200 bg-white">
          <DefaultSidebar />
        </aside>

        <div className="ml-64 flex-1 min-h-screen flex flex-col">
          <DefaultHeader />
          <PageRenderer routeMap={ROUTE_MAP} />
        </div>
      </div>
    </TabProvider>
  );
};

type PageRendererProps = {
  routeMap: Record<string, ComponentType>;
};

const resolveRoute = (
  routeMap: Record<string, ComponentType>,
): { path: string; component: ComponentType } => {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  const matchedRoute = Object.keys(routeMap).find((route) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(`${route}/`);
  });

  const route = matchedRoute || "/";

  return { path: route, component: routeMap[route] };
};

const PageRenderer = ({ routeMap }: PageRendererProps) => {
  const { activeTab, mountedPages, registerPage } = useTabs();
  const [initialRoute] = useState(() => resolveRoute(routeMap));

  const activeBasePath = activeTab.split("?")[0];

  useEffect(() => {
    if (!mountedPages.includes(initialRoute.path)) {
      registerPage(initialRoute.path, initialRoute.component);
    }
  }, [initialRoute, mountedPages, registerPage]);

  useEffect(() => {
    if (activeBasePath && !mountedPages.includes(activeBasePath)) {
      const component = routeMap[activeBasePath];
      if (component) {
        registerPage(activeBasePath, component);
      }
    }
  }, [activeBasePath, mountedPages, registerPage, routeMap]);

  return (
    <main className="flex-1 p-6">
      {mountedPages.map((path) => {
        const PageComponent = routeMap[path];

        if (!PageComponent) return null;

        return (
          <div key={path} className={path === activeBasePath ? "block" : "hidden"}>
            <PageComponent />
          </div>
        );
      })}
    </main>
  );
};

export default MainLayout;
