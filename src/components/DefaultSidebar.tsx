"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import {
  BiChevronDown,
  BiChevronRight,
  BiPurchaseTag,
  BiStore,
  BiTransfer,
} from "react-icons/bi";

import {
  FcSettings,
  FcPackage,
  FcApproval,
  FcDepartment,
  FcHome,
} from "react-icons/fc";

import { FiTruck, FiUsers } from "react-icons/fi";

const DefaultSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-full flex-col overflow-hidden border-r border-slate-200 bg-white">
      {/* LOGO  */}
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

      {/*  SCROLLABLE NAVIGATION */}
      <nav className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {/* DASHBOARD */}
          <SidebarLink
            href="/dashboard"
            label="Dashboard"
            icon={<FcHome />}
            pathname={pathname}
          />

          {/*SETUP  */}
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
            <SidebarDropdown label="Purchase" icon={<BiPurchaseTag />} nested>
              <SidebarLink
                href="/purchase/new"
                label="New Purchase"
                pathname={pathname}
              />

              <SidebarLink
                href="/purchase/orders"
                label="Purchase Orders"
                pathname={pathname}
              />

              <SidebarLink
                href="/purchase/approval"
                label="Purchase Approval"
                pathname={pathname}
              />

              <SidebarLink
                href="/purchase/return"
                label="Purchase Return"
                pathname={pathname}
              />
            </SidebarDropdown>

            {/* ========== INVENTORY ========== */}
            <SidebarDropdown label="Inventory" icon={<BiStore />} nested>
              <SidebarLink
                href="/inventory/current-stock"
                label="Current Stock"
                pathname={pathname}
              />

              <SidebarLink
                href="/inventory/rma-stock"
                label="RMA Stock"
                pathname={pathname}
              />

              <SidebarLink
                href="/inventory/transfer"
                label="Stock Transfer"
                pathname={pathname}
              />
            </SidebarDropdown>

            {/* ========== APPROVAL ========== */}
            <SidebarDropdown label="Approval" icon={<FcApproval />} nested>
              <SidebarLink
                href="/approval/add-product-approval"
                label="Product Approval"
                pathname={pathname}
              />

              <SidebarLink
                href="/approval/purchase"
                label="Purchase Approval"
                pathname={pathname}
              />

              <SidebarLink
                href="/approval/rma"
                label="RMA Approval"
                pathname={pathname}
              />
            </SidebarDropdown>

            {/* ========== STOCK TRANSFER ========== */}
            <SidebarDropdown
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
            </SidebarDropdown>
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


  //  REUSABLE SIDEBAR LINK


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
