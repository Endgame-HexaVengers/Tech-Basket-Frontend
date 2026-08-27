"use client";

import { PERMISSIONS } from "@/utils/Permission";
import { useTabs } from "@/context/TabContext";
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

import { FiSearch, FiTruck, FiUsers } from "react-icons/fi";

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
  // {
  //   href: "/purchase/purchase-order",
  //   label: "Purchase Order",
  //   permission: PERMISSIONS.PURCHASE_RETURN,
  // },
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

  return (
    <aside className="flex h-screen min-h-0 w-full flex-col overflow-hidden border-r border-slate-200 bg-white">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00175c] text-lg font-bold text-white">
          T
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Tech<span className="text-blue-600">Basket</span>
          </h1>
          <p className="text-xs text-slate-500">ERP Management</p>
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-scroll overscroll-contain p-3 scrollbar-gutter-stable">
        <div className="space-y-2">
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
              icon={<FiTruck />}
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
            <SidebarLink
              href="/admin/users-management"
              label="Users"
              icon={<FiUsers />}
              activeTab={activeTab}
              openTab={openTab}
            />
          </SidebarDropdown>

<<<<<<< HEAD
          {/*TASK */}
=======
          <SidebarDropdown label="Search" icon={<FiSearch />}>
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

>>>>>>> a5eceb3e00465051da2d60954c0c9dca0dd9e002
          <SidebarDropdown
            label="Task"
            icon={<BiStore className="text-blue-600" />}
          >
            <SidebarDropdown label="Purchase" icon={<BiPurchaseTag />} nested>
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

            <SidebarDropdown label="Sales" icon={<BiStore />} nested>
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

            <SidebarDropdown label="Rma" icon={<BiUserVoice />} nested>
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

            <SidebarDropdown label="Inventory" icon={<BiStore />} nested>
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

            <SidebarDropdown label="Approval" icon={<FcApproval />} nested>
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
          </SidebarDropdown>
        </div>
      </nav>

      <div className="shrink-0 border-t border-slate-200 p-3">
        <p className="text-center text-xs text-slate-400">TechBasket ERP</p>
      </div>
    </aside>
  );
};

export default DefaultSidebar;

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
  nested = false,
}: SidebarDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={nested ? "ml-3" : ""}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-all ${
          nested
            ? "text-slate-600 hover:bg-slate-100"
            : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          {icon && <span className="shrink-0 text-lg">{icon}</span>}
          <span className="truncate">{label}</span>
        </div>
        {isOpen ? (
          <BiChevronDown className="shrink-0 text-lg" />
        ) : (
          <BiChevronRight className="shrink-0 text-lg" />
        )}
      </button>

      {isOpen && (
        <div
          className={
            nested
              ? "ml-5 mt-1 space-y-1 border-l border-slate-200 pl-3"
              : "ml-4 mt-1 space-y-1 border-l border-slate-200 pl-3"
          }
        >
          {children}
        </div>
      )}
    </div>
  );
};

type SidebarLinkProps = {
  href: string;
  label: string;
  icon?: ReactNode;
  query?: string;
  activeTab: string;
  openTab: (tab: { path: string; title: string; icon?: ReactNode; query?: string }) => void;
};

const SidebarLink = ({ href, label, icon, query, activeTab, openTab }: SidebarLinkProps) => {
  const fullPath = query ? `${href}?${query}` : href;
  const isActive = activeTab === fullPath || (query && activeTab.startsWith(`${href}?`));

  const handleClick = () => {
    openTab({ path: href, title: label, icon: "•", query });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all ${
        isActive
          ? "bg-blue-50 font-semibold text-blue-600"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {icon && <span className="shrink-0 text-base">{icon}</span>}
      <span className="truncate">{label}</span>
    </button>
  );
};
