"use client";

import { useTabs } from "@/context/TabContext";
import { PERMISSIONS } from "@/utils/Permission";
import { useState, type ReactNode } from "react";

import {
  BiChevronDown,
  BiChevronRight,
  BiPurchaseTag,
  BiStore,
  BiUserVoice,
} from "react-icons/bi";

import {
  FcApproval,
  FcDepartment,
  FcPackage,
  FcSettings,
} from "react-icons/fc";

import { FiCpu, FiRefreshCcw, FiSearch, FiTruck, FiUsers } from "react-icons/fi";
import { IoDiamondSharp } from "react-icons/io5";
import { GiDropletSplash } from "react-icons/gi";
import { LuChartColumnDecreasing } from "react-icons/lu";
import { GrEdit, GrSettingsOption } from "react-icons/gr";
import { FaBarsStaggered } from "react-icons/fa6";
import { MdAppRegistration } from "react-icons/md";

const SearchOptions = [
  {
    href: "/search",
    label: "Advance Search",
    query: "tab=advance",
    permission: PERMISSIONS.SEARCH_ADVANCE,
  },
];

const RmaOptions = [
  {
    href: "/rma/complain-received",
    label: "Complaint Received",
    permission: PERMISSIONS.RMA_COMPLAINT_RECEIVED,
  },
  {
    href: "/rma/customer-delivery",
    label: "Customer Delivery",
    permission: PERMISSIONS.RMA_CUSTOMER_DELIVERY,
  },
  {
    href: "/rma/replacement-out",
    label: "Replacement Out",
    permission: PERMISSIONS.RMA_REPLACEMENT_OUT,
  },
  {
    href: "/rma/replacement-in",
    label: "Replacement In",
    permission: PERMISSIONS.RMA_REPLACEMENT_IN,
  },
];

const SalesOptions = [
  {
    href: "/sales/create",
    label: "Sales Entry",
    permission: PERMISSIONS.SALES_CREATE,
  },
  {
    href: "/sales/invoice",
    label: "Sales Invoice",
    permission: PERMISSIONS.SALES_INVOICE,
  },
  {
    href: "/sales/return",
    label: "Sales Return",
    permission: PERMISSIONS.SALES_RETURN,
  },
];

const PurchaseOptions = [
  {
    href: "/purchase/create",
    label: "Purchase Entry",
    permission: PERMISSIONS.PURCHASE_CREATE,
  },
  {
    href: "/purchase/purchase-invoice",
    label: "Purchase Invoice",
    permission: PERMISSIONS.PURCHASE_INVOICE,
  },
  {
    href: "/purchase/return",
    label: "Purchase Return",
    permission: PERMISSIONS.PURCHASE_RETURN,
  },
];

const ApprovalOptions = [
  {
    href: "/approval/sales",
    label: "Sales Approval",
    permission: PERMISSIONS.SALES_APPROVE,
  },
  {
    href: "/approval/sales-return",
    label: "Sales Return Approval",
    permission: PERMISSIONS.SALES_RETURN_APPROVE,
  },
  {
    href: "/approval/add-product-approval",
    label: "Product Approval",
    permission: PERMISSIONS.PRODUCT_APPROVE,
  },
  {
    href: "/approval/purchase-approval",
    label: "Purchase Approval",
    permission: PERMISSIONS.PURCHASE_APPROVE,
  },
  {
    href: "/approval/purchase-return",
    label: "Purchase Return Approval",
    permission: PERMISSIONS.PURCHASE_RETURN_APPROVE,
  },
  {
    href: "/approval/stock-transfer",
    label: "Stock Transfer Approval",
    permission: PERMISSIONS.STOCK_TRANSFER_APPROVE,
  },
  {
    href: "/approval/rma/complain-received",
    label: "Complaint Received Approval",
    permission: PERMISSIONS.RMA_COMPLAINT_APPROVE,
  },
  {
    href: "/approval/rma/replacement-out",
    label: "Replacement Out Approval",
    permission: PERMISSIONS.RMA_REPLACEMENT_OUT_APPROVE,
  },
  {
    href: "/approval/rma/replacement-in",
    label: "Replacement In Approval",
    permission: PERMISSIONS.RMA_REPLACEMENT_IN_APPROVE,
  },
  {
    href: "/approval/rma/customer-delivery",
    label: "Customer Delivery Approval",
    permission: PERMISSIONS.RMA_CUSTOMER_DELIVERY,
  },
];

const InventoryOptions = [
  {
    href: "/inventory/current-stock",
    label: "Current Stock",
    permission: PERMISSIONS.INVENTORY_CURRENT_VIEW,
  },
  {
    href: "/inventory/rma-stock",
    label: "RMA Stock",
    permission: PERMISSIONS.INVENTORY_RMA_VIEW,
  },
  {
    href: "/inventory/transfer",
    label: "Stock Transfer",
    permission: PERMISSIONS.INVENTORY_TRANSFER,
  },
  {
    href: "/inventory/transfer-invoice",
    label: "Transfer Invoice",
    permission: PERMISSIONS.INVENTORY_TRANSFER_INVOICE,
  },
];

const DefaultSidebar = () => {
  const { activeTab, openTab } = useTabs();

  const handleLogoClick = () => {
    openTab({
      path: "/",
      title: "Home",
      icon: "•",
    });
  };

  return (
    <aside className="flex h-screen min-h-0 w-full flex-col overflow-hidden border-r border-slate-200/80 bg-slate-50/50">
      {/* TechBasket Logo */}
      <button
        type="button"
        onClick={handleLogoClick}
        className="group flex h-16 w-full cursor-pointer shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white px-5 text-left transition-all duration-200 hover:bg-slate-50"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#00175c] to-blue-600 font-bold text-white shadow-md shadow-blue-900/10 transition-transform duration-200 group-hover:scale-105">
          T
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            Tech<span className="text-blue-600">Basket</span>
          </h1>

          <p className="text-[11px] font-medium tracking-wide text-slate-400">ERP Management</p>
        </div>
      </button>

      {/* Sidebar Navigation */}
      <nav
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 space-y-1 scrollbar-gutter-stable"
        onWheel={(event) => {
          event.stopPropagation();
          event.preventDefault();
          event.currentTarget.scrollTop += event.deltaY;
        }}
      >
        {/* Setup */}
        <SidebarDropdown label="Setup" icon={<FcSettings />}>
          <SidebarLink
            href="/admin/products"
            label="Products"
            icon={<FcPackage />}
            activeTab={activeTab}
            openTab={openTab}
          />

          <SidebarLink
            href="/admin/suppliers"
            label="Suppliers"
            icon={<FiTruck className="text-slate-600" />}
            activeTab={activeTab}
            openTab={openTab}
          />

          <SidebarLink
            href="/admin/branches"
            label="Branches"
            icon={<FcDepartment />}
            activeTab={activeTab}
            openTab={openTab}
          />
        </SidebarDropdown>

        {/* Users */}
        <SidebarLink
          href="/admin/users"
          label="Users & Permissions"
          icon={<FiUsers className="text-slate-500" />}
          activeTab={activeTab}
          openTab={openTab}
        />

        {/* Search */}
        <SidebarDropdown label="Search" icon={<FiSearch className="text-slate-500" />}>
          {SearchOptions.map((item) => (
            <SidebarLink
              key={`${item.href}-${item.query}`}
              href={item.href}
              label={item.label}
              query={item.query}
              activeTab={activeTab}
              openTab={openTab}
            />
          ))}
        </SidebarDropdown>

        {/* AI Insights */}
        <SidebarLink
          href="/ai-insights"
          label="AI Insights"
          icon={<FiCpu className="text-indigo-500" />}
          activeTab={activeTab}
          openTab={openTab}
        />

        {/* Task */}
        {/* <SidebarDropdown
          label="Task"
          icon={<BiStore className="text-blue-600" />}> */}

        {/* Purchase */}
        <SidebarDropdown
          label="Purchase"
          icon={<BiPurchaseTag className="text-amber-500" />}
        >
          {PurchaseOptions.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              label={item.label}
              activeTab={activeTab}
              openTab={openTab}
            />
          ))}
        </SidebarDropdown>

        {/* Sales */}
        <SidebarDropdown label="Sales" icon={<BiStore className="text-emerald-500" />}>
          {SalesOptions.map((item) => (
            <SidebarLink
              key={`${item.href}-${item.label}`}
              href={item.href}
              label={item.label}
              activeTab={activeTab}
              openTab={openTab}
            />
          ))}
        </SidebarDropdown>

        {/* RMA */}
        <SidebarDropdown label="Rma" icon={<BiUserVoice className="text-rose-500" />}>
          {RmaOptions.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              label={item.label}
              activeTab={activeTab}
              openTab={openTab}
            />
          ))}
        </SidebarDropdown>

        {/* Inventory */}
        <SidebarDropdown label="Inventory" icon={<BiStore className="text-cyan-500" />}>
          {InventoryOptions.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              label={item.label}
              activeTab={activeTab}
              openTab={openTab}
            />
          ))}
        </SidebarDropdown>

        {/* Approval */}
        <SidebarDropdown label="Approval" icon={<FcApproval />}>
          {ApprovalOptions.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              label={item.label}
              activeTab={activeTab}
              openTab={openTab}
            />
          ))}
        </SidebarDropdown>

        {/* </SidebarDropdown> */}

        {/* Resell */}
        <SidebarDropdown
          label="Resell"
          icon={<FiRefreshCcw className="text-purple-500" />}
        >
          <SidebarLink
            href="/admin/Dashboard"
            label="Dashboard"
            icon={<LuChartColumnDecreasing />}
            activeTab={activeTab}
            openTab={openTab}
          />
          <SidebarLink
            href="/admin/Browse-Catalog"
            label="Browse Catalog"
            icon={<FaBarsStaggered />}
            activeTab={activeTab}
            openTab={openTab}
          />
          <SidebarLink
            href="/admin/My-Listings"
            label="My Listings"
            icon={<GrEdit />}
            activeTab={activeTab}
            openTab={openTab}
          />
        </SidebarDropdown>

        {/* Subscription */}
        <SidebarDropdown
          label="Subscription"
          icon={<IoDiamondSharp className="text-blue-500" />}
        >
          <SidebarLink
            href="/admin/Plans"
            label="Plans"
            icon={<GiDropletSplash />}
            activeTab={activeTab}
            openTab={openTab}
          />
          <SidebarLink
            href="/admin/Manage-Plan"
            label="Manage Plan"
            icon={<MdAppRegistration />}
            activeTab={activeTab}
            openTab={openTab}
          />
        </SidebarDropdown>
        <SidebarLink
          href="/Setting"
          label="Setting"
          icon={<GrSettingsOption />}
          activeTab={activeTab}
          openTab={openTab}
        />
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-slate-200/80 bg-white p-3">
        <p className="text-center text-[11px] font-medium text-slate-400">
          TechBasket ERP
        </p>
      </div>
    </aside>
  );
};

export default DefaultSidebar;

// Sidebar Dropdown

type SidebarDropdownProps = {
  label: string;
  icon?: ReactNode;
  children: ReactNode;
  nested?: boolean;
};

const SidebarDropdown = ({
  label,
  icon,
  children,
}: SidebarDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isOpen
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-600 hover:bg-white hover:text-slate-900"
          }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          {icon && (
            <span className="shrink-0 text-lg transition-transform duration-200 group-hover:scale-105">
              {icon}
            </span>
          )}

          <span className="truncate">{label}</span>
        </div>

        <div className="shrink-0 text-slate-400 transition-transform duration-200 group-hover:text-slate-600">
          {isOpen ? (
            <BiChevronDown className="text-lg" />
          ) : (
            <BiChevronRight className="text-lg" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-200/70 pl-2">
          {children}
        </div>
      )}
    </div>
  );
};

// Sidebar Link

type SidebarLinkProps = {
  href: string;
  label: string;
  icon?: ReactNode;
  query?: string;
  activeTab: string;
  openTab: (tab: {
    path: string;
    title: string;
    icon?: ReactNode;
    query?: string;
  }) => void;
};

const SidebarLink = ({
  href,
  label,
  icon,
  query,
  activeTab,
  openTab,
}: SidebarLinkProps) => {
  const fullPath = query ? `${href}?${query}` : href;

  const isActive =
    activeTab === fullPath ||
    (query && activeTab.startsWith(`${href}?`));

  const handleClick = () => {
    openTab({
      path: href,
      title: label,
      icon: "•",
      query,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${isActive
          ? "bg-blue-50/80 font-semibold text-blue-600 shadow-xs"
          : "text-slate-600 hover:bg-white hover:text-slate-900"
        }`}
    >
      {/* Active Left Line Indicator */}
      {isActive && (
        <span className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-r-full bg-blue-600" />
      )}

      {icon ? (
        <span className={`shrink-0 text-base ${isActive ? "text-blue-600" : "text-slate-400"}`}>
          {icon}
        </span>
      ) : (
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isActive ? "bg-blue-600" : "bg-slate-300"}`} />
      )}

      <span className="truncate">{label}</span>
    </button>
  );
};