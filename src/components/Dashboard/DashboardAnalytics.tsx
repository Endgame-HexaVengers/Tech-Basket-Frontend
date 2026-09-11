"use client";

import { useState } from "react";
import { FiTrendingUp, FiClock, FiShoppingBag, FiChevronDown } from "react-icons/fi";
import { BsArrowUpRight } from "react-icons/bs";

interface AnalyticsProps {
  onNewSale?: () => void;
}

export default function DashboardAnalytics({ onNewSale }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState("Last 30 days");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Revenue chart data points
  const chartData = [
    { day: "Day 1", rev: 1200 },
    { day: "Day 5", rev: 2800 },
    { day: "Day 10", rev: 1900 },
    { day: "Day 15", rev: 4200 },
    { day: "Day 20", rev: 3100 },
    { day: "Day 25", rev: 5400 },
    { day: "Day 30", rev: 3900 },
  ];

  const maxRev = Math.max(...chartData.map((d) => d.rev));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* LEFT: Revenue Overview Card (7 cols) */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all lg:col-span-7 sm:p-6">
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <FiTrendingUp className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Revenue Overview
              </h3>
            </div>

            {/* Timeframe Selector */}
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 pl-3 pr-8 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-100"
              >
                <option value="Last 7 days">Last 7 days</option>
                <option value="Last 30 days">Last 30 days</option>
                <option value="This Month">This Month</option>
                <option value="This Year">This Year</option>
              </select>
              <FiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
            </div>
          </div>

          {/* Revenue KPI Summary */}
          <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-slate-400">Total Period Revenue</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  ৳ 22,500
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                  <BsArrowUpRight className="h-3 w-3" />
                  +14.8%
                </span>
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6 text-right">
              <div>
                <p className="text-xs text-slate-400 font-medium">Avg. Ticket</p>
                <p className="text-sm font-bold text-slate-800">৳ 3,214</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Completed Sales</p>
                <p className="text-sm font-bold text-slate-800">7 Orders</p>
              </div>
            </div>
          </div>

          {/* Interactive Bar/Trend Chart */}
          <div className="mt-6 flex h-48 items-end gap-3 sm:gap-4 pt-6 pb-2 border-b border-slate-100">
            {chartData.map((item, index) => {
              const heightPercent = (item.rev / maxRev) * 100;
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={item.day}
                  className="group relative flex flex-1 flex-col items-center h-full justify-end"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-10 z-20 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white shadow-md">
                      ৳ {item.rev.toLocaleString()}
                    </div>
                  )}

                  {/* Animated Bar */}
                  <div
                    className="w-full max-w-[36px] rounded-t-lg bg-gradient-to-t from-indigo-500/80 to-purple-500 transition-all duration-300 group-hover:from-indigo-600 group-hover:to-purple-600"
                    style={{ height: `${heightPercent}%` }}
                  />

                  {/* Label */}
                  <span className="mt-2 text-[10px] font-medium text-slate-400 group-hover:text-slate-700">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span>Real-time POS & Online data</span>
          <span className="font-semibold text-indigo-600 cursor-pointer hover:underline">
            View full report →
          </span>
        </div>
      </div>

      {/* RIGHT: Orders by Status Card (5 cols) matching screenshot */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all lg:col-span-5 sm:p-6">
        <div>
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <FiClock className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Orders by Status
              </h3>
            </div>
          </div>

          {/* Status Breakdown Pills */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 text-center">
              <span className="text-[10px] font-semibold text-slate-400">Pending</span>
              <p className="text-base font-bold text-amber-600">0</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 text-center">
              <span className="text-[10px] font-semibold text-slate-400">Processing</span>
              <p className="text-base font-bold text-blue-600">0</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 text-center">
              <span className="text-[10px] font-semibold text-slate-400">Completed</span>
              <p className="text-base font-bold text-emerald-600">0</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 text-center">
              <span className="text-[10px] font-semibold text-slate-400">Cancelled</span>
              <p className="text-base font-bold text-rose-500">0</p>
            </div>
          </div>

          {/* Empty State matching screenshot "No data available" */}
          <div className="mt-6 flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FiShoppingBag className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-600">
              No data available
            </p>
            <p className="mt-1 max-w-xs text-xs text-slate-400">
              New customer orders and POS transactions will appear here automatically.
            </p>
            {onNewSale && (
              <button
                type="button"
                onClick={onNewSale}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
              >
                + Create First Sale
              </button>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3 text-center text-xs text-slate-400">
          Syncs with Courier & POS channels
        </div>
      </div>
    </div>
  );
}
