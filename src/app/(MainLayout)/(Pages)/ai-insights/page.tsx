"use client";

import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  Package,
  RefreshCcw,
  Sparkles,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";

import { AI_PRODUCTS } from "@/lib/ai/aiData";
import { analyzeInventory } from "@/lib/ai/inventoryAnalysis";
import { getReorderRecommendations } from "@/lib/ai/reorderRecommendation";
import { analyzeRMA } from "@/lib/ai/rmaAnalysis";

export default function AIInsightsPage() {
  const inventoryRisks = analyzeInventory(AI_PRODUCTS);
  const reorderRecommendations =
    getReorderRecommendations(AI_PRODUCTS);
  const rmaInsights = analyzeRMA(AI_PRODUCTS);

  const critical = inventoryRisks.filter(
    (item) => item.status === "critical"
  ).length;

  const warning = inventoryRisks.filter(
    (item) => item.status === "warning"
  ).length;

  const overstock = inventoryRisks.filter(
    (item) => item.status === "overstock"
  ).length;

  const healthy = inventoryRisks.filter(
    (item) => item.status === "healthy"
  ).length;

  const totalProducts = inventoryRisks.length;

  const healthPercentage =
    totalProducts > 0
      ? Math.round((healthy / totalProducts) * 100)
      : 0;

  return (
    <div className="min-h-screen space-y-6 bg-slate-50/50 p-1">
      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-xl">
        {/* Decorative background */}
        <div className="absolute -right-10 -top-20 h-60 w-60 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-60 w-60 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                <BrainCircuit size={20} />
              </div>

              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-indigo-100">
                AI Powered
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              AI Insights
            </h1>

            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Intelligent inventory analysis, smart reorder
              recommendations and RMA pattern detection.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
            <Sparkles size={18} className="text-indigo-300" />

            <div>
              <p className="text-xs text-slate-400">
                AI System Status
              </p>

              <p className="text-sm font-semibold">
                Analysis Ready
              </p>
            </div>

            <span className="ml-2 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
          </div>
        </div>
      </div>

      {/* ================= OVERVIEW ================= */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Healthy */}
        <div className="group rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={21} />
            </div>

            <ArrowUpRight
              size={18}
              className="text-emerald-500"
            />
          </div>

          <p className="mt-4 text-2xl font-bold text-slate-900">
            {healthy}
          </p>

          <p className="text-sm text-slate-500">
            Healthy Products
          </p>
        </div>

        {/* Warning */}
        <div className="group rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <TriangleAlert size={21} />
            </div>

            <ArrowDownRight
              size={18}
              className="text-amber-500"
            />
          </div>

          <p className="mt-4 text-2xl font-bold text-slate-900">
            {warning}
          </p>

          <p className="text-sm text-slate-500">
            Warning
          </p>
        </div>

        {/* Critical */}
        <div className="group rounded-2xl border border-red-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle size={21} />
            </div>

            <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600">
              ACTION
            </span>
          </div>

          <p className="mt-4 text-2xl font-bold text-slate-900">
            {critical}
          </p>

          <p className="text-sm text-slate-500">
            Critical Stock
          </p>
        </div>

        {/* Overstock */}
        <div className="group rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Package size={21} />
            </div>

            <span className="text-xs font-medium text-indigo-500">
              Monitor
            </span>
          </div>

          <p className="mt-4 text-2xl font-bold text-slate-900">
            {overstock}
          </p>

          <p className="text-sm text-slate-500">
            Overstocked
          </p>
        </div>
      </div>

      {/* ================= INVENTORY HEALTH ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <BrainCircuit size={19} />
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                AI Inventory Health
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              AI analysis of your current inventory condition.
            </p>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">
              {healthPercentage}%
            </p>

            <p className="text-xs text-slate-500">
              Overall Health
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs">
            <span className="font-medium text-slate-600">
              Inventory health score
            </span>

            <span className="font-semibold text-emerald-600">
              {healthPercentage}%
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-700"
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        </div>

        {/* Risk List */}
        <div className="mt-6 space-y-3">
          {inventoryRisks.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-slate-200 hover:bg-white sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    item.status === "critical"
                      ? "bg-red-50 text-red-600"
                      : item.status === "warning"
                      ? "bg-amber-50 text-amber-600"
                      : item.status === "overstock"
                      ? "bg-indigo-50 text-indigo-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {item.status === "critical" ? (
                    <AlertTriangle size={18} />
                  ) : item.status === "warning" ? (
                    <TriangleAlert size={18} />
                  ) : item.status === "overstock" ? (
                    <Package size={18} />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    {item.productName}
                  </p>

                  <p className="text-xs text-slate-500">
                    {item.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    item.status === "critical"
                      ? "bg-red-50 text-red-600"
                      : item.status === "warning"
                      ? "bg-amber-50 text-amber-600"
                      : item.status === "overstock"
                      ? "bg-indigo-50 text-indigo-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {item.status}
                </span>

                <span className="text-xs font-medium text-slate-500">
                  {item.stockoutDays === 999
                    ? "No stockout risk"
                    : `${item.stockoutDays} days`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= REORDER + RMA ================= */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Smart Reorder */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <RefreshCcw size={19} />
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  Smart Reorder
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                AI recommended products for restocking.
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              {reorderRecommendations.length} Items
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {reorderRecommendations.length > 0 ? (
              reorderRecommendations.map((item) => (
                <div
                  key={item.productId}
                  className="rounded-xl border border-slate-100 p-4 transition hover:border-blue-100 hover:bg-blue-50/30"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800">
                        {item.productName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Current stock:{" "}
                        <span className="font-semibold text-red-500">
                          {item.currentStock}
                        </span>
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {item.reason}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {item.recommendedQuantity}
                      </p>

                      <p className="text-[11px] text-slate-400">
                        Recommended Qty
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-emerald-50 p-5 text-center">
                <CheckCircle2
                  className="mx-auto text-emerald-600"
                  size={28}
                />

                <p className="mt-2 font-semibold text-emerald-700">
                  No reorder required
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RMA Insights */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <TrendingUp size={19} />
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  AI RMA Insights
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Products with unusual return rates.
              </p>
            </div>

            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
              RMA Analysis
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {rmaInsights.map((item) => (
              <div
                key={item.productId}
                className="rounded-xl border border-slate-100 p-4 transition hover:border-red-100 hover:bg-red-50/20"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">
                      {item.productName}
                    </p>

                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                      {item.message}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {item.rmaRate}%
                    </p>

                    <span
                      className={`text-[11px] font-bold uppercase ${
                        item.severity === "high"
                          ? "text-red-600"
                          : item.severity === "medium"
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= AI SUMMARY ================= */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <Sparkles size={21} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              AI Summary
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Your inventory currently has{" "}
              <span className="font-semibold text-emerald-600">
                {healthy} healthy
              </span>{" "}
              products,{" "}
              <span className="font-semibold text-amber-600">
                {warning} warnings
              </span>{" "}
              and{" "}
              <span className="font-semibold text-red-600">
                {critical} critical
              </span>{" "}
              stock alerts. AI has identified{" "}
              <span className="font-semibold text-blue-600">
                {reorderRecommendations.length} products
              </span>{" "}
              that may require restocking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}