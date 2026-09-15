"use client";

import { useTabs } from "@/context/TabContext";
import {
  FiPlusCircle,
  FiShoppingBag,
  FiBox,
  FiRepeat,
  FiAlertCircle,
  FiCpu,
} from "react-icons/fi";

export default function DashboardQuickActions() {
  const { openTab } = useTabs();

  const actions = [
    {
      title: "New Sale Entry",
      desc: "Record customer invoice & payment",
      path: "/sales/create",
      icon: <FiShoppingBag className="h-5 w-5" style={{ color: "#059669" }} />,
      bg: "bg-[#ecfdf5] hover:bg-[#d1fae5] border-[#a7f3d0]",
    },
    {
      title: "Add Product",
      desc: "Register new item with barcode",
      path: "/admin/products/add",
      icon: <FiBox className="h-5 w-5" style={{ color: "#2563eb" }} />,
      bg: "bg-[#eff6ff] hover:bg-[#dbeafe] border-[#bfdbfe]",
    },
    {
      title: "Stock Transfer",
      desc: "Move stock between branches",
      path: "/inventory/transfer",
      icon: <FiRepeat className="h-5 w-5" style={{ color: "#9333ea" }} />,
      bg: "bg-[#faf5ff] hover:bg-[#f3e8ff] border-[#e9d5ff]",
    },
    {
      title: "RMA Ticket",
      desc: "Process customer warranty claim",
      path: "/rma/complain-received",
      icon: (
        <FiAlertCircle className="h-5 w-5" style={{ color: "#d97706" }} />
      ),
      bg: "bg-[#fffbeb] hover:bg-[#fef3c7] border-[#fde68a]",
    },
    {
      title: "AI Insights",
      desc: "Smart inventory forecasting & health",
      path: "/ai-insights",
      icon: <FiCpu className="h-5 w-5" style={{ color: "#4f46e5" }} />,
      bg: "bg-[#eef2ff] hover:bg-[#e0e7ff] border-[#c7d2fe]",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <FiPlusCircle
            className="h-5 w-5"
            style={{ color: "#4f46e5" }}
          />

          <h3
            className="text-base font-bold dark:!text-white"
            style={{ color: "#0f172a" }}
          >
            Quick ERP Operations
          </h3>
        </div>

        <span
          className="text-xs font-medium"
          style={{ color: "#94a3b8" }}
        >
          Fast navigation
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {actions.map((act) => (
          <button
            key={act.title}
            type="button"
            onClick={() =>
              openTab({
                path: act.path,
                title: act.title,
              })
            }
            className={`group flex flex-col items-start justify-between rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 ${act.bg}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-2xs">
              {act.icon}
            </div>

            <div className="mt-3">
              <h4 className="text-sm font-bold text-slate-900 dark:!text-white">
                {act.title}
              </h4>

              <p
                className="mt-0.5 line-clamp-1 text-xs"
                style={{ color: "#64748b" }}
              >
                {act.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}