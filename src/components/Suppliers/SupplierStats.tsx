"use client";

import { Supplier } from "@/types/supplier";
import { Truck, DollarSign, AlertTriangle, ShieldCheck, TrendingUp, Users } from "lucide-react";

interface SupplierStatsProps {
  suppliers: Supplier[];
}

export default function SupplierStats({ suppliers }: SupplierStatsProps) {
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter((s) => s.status === "Active").length;
  const inactiveSuppliers = totalSuppliers - activeSuppliers;

  const totalPurchases = suppliers.reduce((acc, s) => acc + (s.totalPurchased || 0), 0);
  const totalDues = suppliers.reduce((acc, s) => acc + (s.currentBalance || 0), 0);
  const totalPendingRma = suppliers.reduce((acc, s) => acc + (s.pendingRmaCount || 0), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(amount).replace("BDT", "৳");
  };

  const statCards = [
    {
      title: "Total Suppliers",
      value: totalSuppliers.toString(),
      subtitle: `${activeSuppliers} Active • ${inactiveSuppliers} Inactive`,
      icon: Truck,
      color: "blue",
      bg: "bg-blue-50 text-blue-600 border-blue-100",
      accent: "text-blue-600",
    },
    {
      title: "Total Purchases",
      value: formatCurrency(totalPurchases),
      subtitle: "Lifetime procurement volume",
      icon: TrendingUp,
      color: "emerald",
      bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      accent: "text-emerald-600",
    },
    {
      title: "Total Outstanding / Payable",
      value: formatCurrency(totalDues),
      subtitle: totalDues > 0 ? "Pending supplier payments" : "All payments cleared",
      icon: DollarSign,
      color: "amber",
      bg: "bg-amber-50 text-amber-600 border-amber-100",
      accent: "text-amber-600",
    },
    {
      title: "Active RMA / Claims",
      value: `${totalPendingRma} Items`,
      subtitle: "Sent to supplier for replacement",
      icon: AlertTriangle,
      color: "rose",
      bg: "bg-rose-50 text-rose-600 border-rose-100",
      accent: "text-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                  {card.value}
                </h3>
                <p className="mt-1 text-xs text-slate-500 font-medium">
                  {card.subtitle}
                </p>
              </div>
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl border ${card.bg} shadow-xs transition-transform duration-200 group-hover:scale-110`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div
              className={`absolute bottom-0 left-0 h-0.5 w-full bg-linear-to-r from-transparent via-${card.color}-500 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
            />
          </div>
        );
      })}
    </div>
  );
}
