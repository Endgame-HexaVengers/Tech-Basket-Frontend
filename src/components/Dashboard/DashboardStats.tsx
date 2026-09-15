"use client";

import { FiDollarSign, FiShoppingCart, FiBox, FiUsers, FiGlobe } from "react-icons/fi";

interface DashboardStatsProps {
  revenueToday?: string;
  revenueMonth?: string;
  ordersToday?: number;
  ordersMonth?: number;
  activeProducts?: number;
  totalCustomers?: number;
  websiteVisits?: number;
}

export default function DashboardStats({
  revenueToday = "BDT 0",
  revenueMonth = "BDT 0 this month",
  ordersToday = 0,
  ordersMonth = 0,
  activeProducts = 1,
  totalCustomers = 0,
  websiteVisits = 1,
}: DashboardStatsProps) {
  const stats = [
    {
      id: "revenue",
      title: "Revenue Today",
      value: revenueToday,
      subtext: revenueMonth,
      icon: <FiDollarSign className="h-5 w-5" />,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      id: "orders",
      title: "Orders Today",
      value: ordersToday.toString(),
      subtext: `${ordersMonth} this month`,
      icon: <FiShoppingCart className="h-5 w-5" />,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      id: "products",
      title: "Active Products",
      value: activeProducts.toString(),
      subtext: "In catalog",
      icon: <FiBox className="h-5 w-5" />,
      iconBg: "bg-purple-50 text-purple-600",
    },
    {
      id: "customers",
      title: "Total Customers",
      value: totalCustomers.toString(),
      subtext: "Registered",
      icon: <FiUsers className="h-5 w-5" />,
      iconBg: "bg-orange-50 text-orange-600",
    },
    {
      id: "visits",
      title: "Website Visits",
      value: websiteVisits.toString(),
      subtext: "Live traffic",
      icon: <FiGlobe className="h-5 w-5" />,
      iconBg: "bg-slate-100 text-slate-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {stats.map((item) => (
        <div
          key={item.id}
          className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
        >
          <div className="flex items-start gap-3.5">
            {/* Round Icon Badge */}
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${item.iconBg}`}
            >
              {item.icon}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-slate-500">
                {item.title}
              </p>
              <h3 className="mt-1 truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {item.value}
              </h3>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3">
            <p className="text-xs font-medium text-slate-400">
              {item.subtext}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
