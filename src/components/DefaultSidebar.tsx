"use client";

import { User } from "@/types/user";
import { Permission, PERMISSIONS } from "@/utils/Permission";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import {
  BiChevronDown,
  BiChevronRight,
  BiPurchaseTag,
  BiStore,
  BiTransfer,
  BiUserVoice,
} from "react-icons/bi";

import {
  FcSettings,
  FcPackage,
  FcApproval,
  FcDepartment,
  FcHome,
} from "react-icons/fc";

import { FiTruck, FiUsers } from "react-icons/fi";

// RMA Options
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
// Sales Options
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

// Purchase Options
const PurchaseOptions = [
  {
    href: "/purchase/create",
    label: "Purchase Entry",
    permission: PERMISSIONS.PURCHASE_CREATE,
  },
  {
    href: "/purchase/invoice",
    label: "Purchase Invoice",
    permission: PERMISSIONS.PURCHASE_INVOICE,
  },
  {
    href: "/purchase/return",
    label: "Purchase Return",
    permission: PERMISSIONS.PURCHASE_RETURN,
  },
];

// Approval Options
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
    href: "/approval/purchase",
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

// Inventory Options
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

const sampleUser: User = {
  id: "USR-001",
  name: "Rahim Ahmed",
  email: "rahim@techbasket.com",
  role: "Purchase Executive",
  permissions: [
    PERMISSIONS.PRODUCT_CREATE,
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.PRODUCT_UPDATE,

    PERMISSIONS.PURCHASE_CREATE,
    PERMISSIONS.PURCHASE_INVOICE,
    PERMISSIONS.PURCHASE_RETURN,

    PERMISSIONS.INVENTORY_CURRENT_VIEW,
    PERMISSIONS.INVENTORY_RMA_VIEW,
    PERMISSIONS.INVENTORY_TRANSFER,
    PERMISSIONS.INVENTORY_TRANSFER_INVOICE,

    PERMISSIONS.RMA_COMPLAINT_RECEIVED,
    PERMISSIONS.RMA_CUSTOMER_DELIVERY,
  ],
};

// const sampleUser = {
//   id: "USR-001",
//   name: "Rahim Ahmed",
//   email: "rahim@techbasket.com",

//   role: "Purchase Executive",

//   permissions: [
//     PERMISSIONS.PRODUCT_CREATE,
//     PERMISSIONS.PRODUCT_VIEW,
//     PERMISSIONS.PRODUCT_UPDATE,

//     PERMISSIONS.PURCHASE_CREATE,
//     PERMISSIONS.PURCHASE_INVOICE,
//     PERMISSIONS.PURCHASE_RETURN,

//     PERMISSIONS.INVENTORY_CURRENT_VIEW,
//     PERMISSIONS.INVENTORY_RMA_VIEW,
//     PERMISSIONS.INVENTORY_TRANSFER,
//     PERMISSIONS.INVENTORY_TRANSFER_INVOICE,

//     PERMISSIONS.RMA_COMPLAINT_RECEIVED,
//     PERMISSIONS.RMA_CUSTOMER_DELIVERY,
//   ],
// };

const DefaultSidebar = () => {
  const pathname = usePathname();

  const hasPermission = (permission: Permission) => {
    return sampleUser.permissions.includes(permission);
  };

  const allowedPurchaseOptions = PurchaseOptions.filter((item) =>
    hasPermission(item.permission),
  );
  const allowedSalesOptions = SalesOptions.filter((item) =>
    hasPermission(item.permission),
  );
  const allowedInventoryOptions = InventoryOptions.filter((item) =>
    hasPermission(item.permission),
  );
  const allowedApprovalOptions = ApprovalOptions.filter((item) =>
    hasPermission(item.permission),
  );
  const allowedRmaOptions = RmaOptions.filter((item) =>
    hasPermission(item.permission),
  );

  return (
    <aside className="flex h-screen w-full flex-col overflow-hidden border-r border-slate-200 bg-white">
      {/* ================= LOGO ================= */}
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

      {/* ================= SCROLLABLE NAVIGATION ================= */}
      <nav className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {/* ================= DASHBOARD ================= */}
          <SidebarLink
            href="/dashboard"
            label="Dashboard"
            icon={<FcHome />}
            pathname={pathname}
          />

          {/* ================= SETUP ================= */}
          <SidebarDropdown label="Setup" icon={<FcSettings />}>
            <SidebarLink
              href="/admin/products"
              label="Products"
              icon={<FcPackage />}
              pathname={pathname}
            />

            <SidebarLink
              href="/admin/suppliers"
              label="Suppliers"
              icon={<FiTruck />}
              pathname={pathname}
            />

            <SidebarLink
              href="/admin/branches"
              label="Branches"
              icon={<FcDepartment />}
              pathname={pathname}
            />

            <SidebarLink
              href="/admin/users"
              label="Users"
              icon={<FiUsers />}
              pathname={pathname}
            />
          </SidebarDropdown>

          {/* ================= TASK ================= */}
          <SidebarDropdown
            label="Task"
            icon={<BiStore className="text-blue-600" />}
          >
            {/* ========== PURCHASE ========== */}
            {/* {allowedPurchaseOptions.length > 0 && (
              <SidebarDropdown label="Purchase" icon={<BiPurchaseTag />} nested>
                {allowedPurchaseOptions.map((item) => (
                  <SidebarLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    pathname={pathname}
                  />
                ))}
              </SidebarDropdown>
            )} */}

            <SidebarDropdown label="Purchase" icon={<BiPurchaseTag />} nested>
              {PurchaseOptions.map((item) => (
                <SidebarLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  pathname={pathname}
                />
              ))}
            </SidebarDropdown>

            {/* ========== Sales ========== */}

            {/* {allowedSalesOptions.length > 0 && (
              <SidebarDropdown label="Sales" icon={<BiStore />} nested>
                {allowedSalesOptions.map((item) => (
                  <SidebarLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    pathname={pathname}
                  />
                ))}
              </SidebarDropdown>
            )} */}

            <SidebarDropdown label="Sales" icon={<BiStore />} nested>
              {SalesOptions.map((item) => (
                <SidebarLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  pathname={pathname}
                />
              ))}
            </SidebarDropdown>

            {/* ========== Rma ========== */}
            {/* {allowedRmaOptions.length > 0 && (
              <SidebarDropdown label="Rma" icon={<BiUserVoice />} nested>
                {allowedRmaOptions.map((item) => (
                  <SidebarLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    pathname={pathname}
                  />
                ))}
              </SidebarDropdown>
            )} */}

            <SidebarDropdown label="Rma" icon={<BiUserVoice />} nested>
              {RmaOptions.map((item) => (
                <SidebarLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  pathname={pathname}
                />
              ))}
            </SidebarDropdown>

            {/* ========== INVENTORY ========== */}

            {/* {allowedInventoryOptions.length > 0 && (
              <SidebarDropdown label="Inventory" icon={<BiStore />} nested>
                {allowedInventoryOptions.map((item) => (
                  <SidebarLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    pathname={pathname}
                  />
                ))}
              </SidebarDropdown>
            )} */}

            <SidebarDropdown label="Inventory" icon={<BiStore />} nested>
              {InventoryOptions.map((item) => (
                <SidebarLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  pathname={pathname}
                />
              ))}
            </SidebarDropdown>

            {/* ========== APPROVAL ========== */}

            {/* {allowedApprovalOptions.length > 0 && (
              <SidebarDropdown label="Approval" icon={<FcApproval />} nested>
                {allowedApprovalOptions.map((item) => (
                  <SidebarLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    pathname={pathname}
                  />
                ))}
              </SidebarDropdown>
            )} */}

            <SidebarDropdown label="Approval" icon={<FcApproval />} nested>
              {ApprovalOptions.map((item) => (
                <SidebarLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  pathname={pathname}
                />
              ))}
            </SidebarDropdown>

            {/* ========== STOCK TRANSFER ========== */}
            {/* <SidebarDropdown
              label="Stock Transfer"
              icon={<BiTransfer />}
              nested
            >
              <SidebarLink
                href="/stock-transfer/new"
                label="New Transfer"
                pathname={pathname}
              />

              <SidebarLink
                href="/stock-transfer/list"
                label="Transfer List"
                pathname={pathname}
              />
            </SidebarDropdown> */}
          </SidebarDropdown>
        </div>
      </nav>

      {/* ================= OPTIONAL BOTTOM MENU ================= */}
      <div className="shrink-0 border-t border-slate-200 p-3">
        <p className="text-center text-xs text-slate-400">TechBasket ERP</p>
      </div>
    </aside>
  );
};

export default DefaultSidebar;

/* =====================================================
   REUSABLE SIDEBAR DROPDOWN
===================================================== */

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

/* =====================================================
   REUSABLE SIDEBAR LINK
===================================================== */

type SidebarLinkProps = {
  href: string;
  label: string;
  icon?: ReactNode;
  pathname: string;
};

const SidebarLink = ({ href, label, icon, pathname }: SidebarLinkProps) => {
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all ${
        isActive
          ? "bg-blue-50 font-semibold text-blue-600"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {icon && <span className="shrink-0 text-base">{icon}</span>}

      <span className="truncate">{label}</span>
    </Link>
  );
};
