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
      icon: <FiShoppingBag className="h-5 w-5 text-emerald-600" />,
      bg: "bg-emerald-50 hover:bg-emerald-100/70 border-emerald-100",
    },
    {
      title: "Add Product",
      desc: "Register new item with barcode",
      path: "/admin/products/add",
      icon: <FiBox className="h-5 w-5 text-blue-600" />,
      bg: "bg-blue-50 hover:bg-blue-100/70 border-blue-100",
    },
    {
      title: "Stock Transfer",
      desc: "Move stock between branches",
      path: "/inventory/transfer",
      icon: <FiRepeat className="h-5 w-5 text-purple-600" />,
      bg: "bg-purple-50 hover:bg-purple-100/70 border-purple-100",
    },
    {
      title: "RMA Ticket",
      desc: "Process customer warranty claim",
      path: "/rma/complain-received",
      icon: <FiAlertCircle className="h-5 w-5 text-amber-600" />,
      bg: "bg-amber-50 hover:bg-amber-100/70 border-amber-100",
    },
    {
      title: "AI Insights",
      desc: "Smart inventory forecasting & health",
      path: "/ai-insights",
      icon: <FiCpu className="h-5 w-5 text-indigo-600" />,
      bg: "bg-indigo-50 hover:bg-indigo-100/70 border-indigo-100",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <FiPlusCircle className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            Quick ERP Operations
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">Fast navigation</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {actions.map((act) => (
          <button
            key={act.title}
            type="button"
            onClick={() => openTab({ path: act.path, title: act.title })}
            className={`flex flex-col items-start justify-between rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 active:scale-95 ${act.bg}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-2xs">
              {act.icon}
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-bold text-slate-900">{act.title}</h4>
              <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{act.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
