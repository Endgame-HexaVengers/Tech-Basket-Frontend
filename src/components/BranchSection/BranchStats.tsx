"use client";

import { Building2, CheckCircle2, XCircle, Users } from "lucide-react";
import { BranchStatsData } from "@/types/branch";

interface BranchStatsProps {
  stats: BranchStatsData;
  loading: boolean;
}

export default function BranchStats({ stats, loading }: BranchStatsProps) {
  const cards = [
    {
      title: "TOTAL BRANCHES",
      value: stats.totalBranches,
      icon: <Building2 className="h-4 w-4" />,
      iconClass: "bg-slate-100 text-slate-600 border-slate-200",
    },
    {
      title: "ACTIVE BRANCHES",
      value: stats.activeBranches,
      icon: <CheckCircle2 className="h-4 w-4" />,
      iconClass: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "INACTIVE BRANCHES",
      value: stats.inactiveBranches,
      icon: <XCircle className="h-4 w-4" />,
      iconClass: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      title: "ASSIGNED USERS",
      value: stats.assignedUsers,
      icon: <Users className="h-4 w-4" />,
      iconClass: "bg-slate-100 text-slate-600 border-slate-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-dashed border-slate-300 bg-white p-4 shadow-2xs transition-all hover:border-slate-400 hover:shadow-xs"
        >
          <div className="flex items-start justify-between">
            <p className="text-[11px] font-semibold tracking-wider uppercase text-slate-500">
              {card.title}
            </p>
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg border ${card.iconClass}`}
            >
              {card.icon}
            </div>
          </div>

          <div className="mt-3">
            {loading ? (
              <div className="h-8 w-14 animate-pulse rounded-md bg-slate-100" />
            ) : (
              <p className="text-2xl font-bold tracking-tight text-slate-900">
                {card.value}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
