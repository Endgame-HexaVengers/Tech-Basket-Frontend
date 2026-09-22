"use client";

import { useState } from "react";
import { useTabs } from "@/context/TabContext";
import {
  FiAlertTriangle,
  FiArrowUpRight,
  FiCheckCircle,
  FiClock,
  FiCode,
  FiDatabase,
  FiPlus,
  FiRefreshCw,
  FiShoppingBag,
  FiTag,
} from "react-icons/fi";

const chartBars = [42, 54, 49, 63, 52, 70, 62, 76, 68, 81, 73, 92];

export default function DashboardView() {
  const { openTab } = useTabs();
  const [period, setPeriod] = useState("This Month");

  const goTo = (path: string, title: string) =>
    openTab({ path, title, icon: "•" });

  return (
    <div className="min-h-screen space-y-3  pb-8 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Company control center
          </p>
          <h1 className="mt-0.5 text-xl font-bold tracking-tight">
            Good morning, <span className="text-indigo-600">TechBasket</span>
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionButton
            label="New Sale"
            icon={<FiPlus />}
            onClick={() => goTo("/sales/create", "Sales Entry")}
          />
          <ActionButton
            label="Add Product"
            icon={<FiPlus />}
            onClick={() => goTo("/admin/products/add", "Add Product")}
          />
          <ActionButton
            label="Create RMA"
            icon={<FiRefreshCw />}
            onClick={() => goTo("/rma/complain-received", "Complaint Received")}
          />
          <ActionButton
            label="New Purchase Order"
            icon={<FiPlus />}
            onClick={() => goTo("/purchase/create", "Purchase Entry")}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Sales Today"
          value="$12,450.00"
          note="(+14% vs yesterday)"
          icon={<FiShoppingBag />}
          tone="indigo"
        />
        <MetricCard
          title="Total Purchases"
          value="$4,200.00"
          note="This month"
          icon={<FiTag />}
          tone="violet"
        />
        <MetricCard
          title="Pending Approvals"
          value="18 Items"
          note="Requiring attention"
          icon={<FiCheckCircle />}
          tone="amber"
          badge="Amber"
        />
        <MetricCard
          title="Low Stock Warning"
          value="7 Products"
          note="Needs replenishment"
          icon={<FiAlertTriangle />}
          tone="rose"
          badge="!"
        />
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.7fr_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold">Sales vs. Purchase Overview</h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Compare business movement across the year
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                Sales
              </span>
              <span className="flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 rounded-full bg-teal-500" />
                Purchase
              </span>
              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs outline-none"
              >
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
          </div>
          <div className="mt-5 flex h-52 items-end gap-2 border-b border-slate-100 px-1 sm:gap-4">
            {chartBars.map((height, index) => (
              <div
                key={index}
                className="flex h-full flex-1 items-end justify-center gap-1"
              >
                <div
                  className="w-2.5 rounded-t-md bg-indigo-600/90 transition hover:bg-indigo-500 sm:w-4"
                  style={{ height: `${height}%` }}
                />
                <div
                  className="w-2.5 rounded-t-md bg-teal-500/90 transition hover:bg-teal-400 sm:w-4"
                  style={{ height: `${Math.max(22, height - 18)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between px-1 text-[10px] text-slate-400">
            <span>Jan</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
            <span>Sep</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
          <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100">
            <SummaryValue
              icon={<FiArrowUpRight />}
              label="Total Revenue"
              value="$12,450.00"
              tone="text-indigo-600"
            />
            <SummaryValue
              icon={<FiTag />}
              label="Gross Profit"
              value="$4,200.00"
              tone="text-teal-600"
            />
            <SummaryValue
              icon={<FiDatabase />}
              label="Total Expenses"
              value="$1,200.00"
              tone="text-rose-500"
            />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <FiCode className="text-cyan-600" /> AI Insights Panel
          </h2>
          <div className="mt-3 space-y-2">
            <Insight
              title="Demand Forecast"
              text={
                'Demand for "Wireless Headphones" expected to rise by 25% next week. Reorder recommended.'
              }
              tone="text-teal-600"
            />
            <Insight
              title="Price Alert"
              text="Supplier TechCorp reduced prices on RAM modules by 5%."
              tone="text-cyan-600"
            />
            <Insight
              title="Deadstock Warning"
              text={
                '15 units of "Model X keyboards" have not moved in 60 days.'
              }
              tone="text-rose-500"
            />
          </div>
        </section>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.7fr_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Inventory Stock Alerts</h2>
            <button
              type="button"
              onClick={() => goTo("/inventory/current-stock", "Current Stock")}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              View inventory
            </button>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-155 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500">
                <tr>
                  <th className="p-2">Product Name</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Remaining Stock</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <StockRow
                  product="Logitech MX Master 3"
                  category="Peripherals"
                  stock="3 Units"
                  status="Critical"
                  color="bg-red-500"
                  action="Reorder"
                />
                <StockRow
                  product={'Dell 27" Monitor'}
                  category="Displays"
                  stock="8 Units"
                  status="Low Stock"
                  color="bg-amber-400"
                  action="Reorder"
                />
                <StockRow
                  product="NVMe SSD 1TB"
                  category="Storage"
                  stock="0 Units"
                  status="Out of Stock"
                  color="bg-slate-800"
                  action="View PO"
                />
              </tbody>
            </table>
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold">Recent System Activity</h2>
          <div className="mt-3 divide-y divide-slate-100">
            <Activity
              text="Order #1094 - Sold to Apex Ltd ($1,200)"
              time="2 mins ago"
            />
            <Activity
              text="RMA Request #442 - Replacement approved"
              time="15 mins ago"
            />
            <Activity
              text="Purchase Order #882 - Delivered"
              time="1 hour ago"
            />
            <Activity
              text="New team member joined workspace"
              time="3 hours ago"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
    >
      {icon}
      {label}
    </button>
  );
}
function MetricCard({
  title,
  value,
  note,
  icon,
  tone,
  badge,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ReactNode;
  tone: string;
  badge?: string;
}) {
  const tones: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          {icon}
        </span>
        {badge && (
          <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-3 text-xs font-medium text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{note}</p>
    </div>
  );
}
function SummaryValue({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="px-2 sm:px-4">
      <div className={`flex items-center gap-1 text-xs font-bold ${tone}`}>
        {icon}
        {label}
      </div>
      <p className="mt-1 text-lg font-bold sm:text-xl">{value}</p>
    </div>
  );
}
function Insight({
  title,
  text,
  tone,
}: {
  title: string;
  text: string;
  tone: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
      <h3 className={`flex items-center gap-2 text-sm font-bold ${tone}`}>
        <FiCheckCircle />
        {title}
      </h3>
      <p className="mt-1 text-xs leading-5 text-slate-600">{text}</p>
    </div>
  );
}
function StockRow({
  product,
  category,
  stock,
  status,
  color,
  action,
}: {
  product: string;
  category: string;
  stock: string;
  status: string;
  color: string;
  action: string;
}) {
  return (
    <tr>
      <td className="p-2 font-semibold">{product}</td>
      <td className="p-2 text-slate-500">{category}</td>
      <td className="p-2">{stock}</td>
      <td className="p-2">
        <span className="inline-flex items-center gap-1.5">
          <i className={`h-2.5 w-2.5 rounded-full ${color}`} />
          {status}
        </span>
      </td>
      <td className="p-2">
        <button
          type="button"
          className="font-semibold text-indigo-600 hover:underline"
        >
          {action}
        </button>
      </td>
    </tr>
  );
}
function Activity({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 text-sm">
      <span className="flex min-w-0 items-center gap-2 truncate">
        <FiClock className="shrink-0 text-slate-400" />
        {text}
      </span>
      <span className="shrink-0 text-xs text-slate-400">{time}</span>
    </div>
  );
}
