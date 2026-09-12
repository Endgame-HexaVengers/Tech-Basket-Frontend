"use client";

import React, { useState } from "react";
import { Button, Card, Chip } from "@heroui/react";
import { FiCheck, FiArrowDown } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

type BillingCycle = "monthly" | "sixMonths" | "yearly";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    sixMonths: number;
    yearly: number;
  };
  features: string[];
  fees: string;
  isPopular?: boolean;
  badge?: string;
}

const PLANS_DATA: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Start selling today",
    price: { monthly: 0, sixMonths: 0, yearly: 0 },
    badge: "Current",
    features: [
      "10 products",
      "2 preset themes",
      "Marketing pixels & GTM",
      "Resell supplier products",
      "Zatiq Courier",
    ],
    fees: "Fees per order: 5% physical · 10% digital · 3% resell",
  },
  {
    id: "starter",
    name: "Starter",
    description: "For growing businesses",
    price: { monthly: 599, sixMonths: 527, yearly: 449 },
    features: [
      "500 products",
      "Unlimited preset themes",
      "Custom domain",
      "Zatiq SecurePay",
      "1 free third-party courier",
      "Report exports",
    ],
    fees: "Fees per order: 0% physical · 6% digital · 1.9% resell",
  },
  {
    id: "growth",
    name: "Growth",
    description: "Everything unlocked",
    price: { monthly: 2499, sixMonths: 2199, yearly: 1874 },
    badge: "BETA PRICING",
    isPopular: true,
    features: [
      "Unlimited products",
      "Unlimited preset themes",
      "Custom domain",
      "Theme builder",
      "Zatiq SecurePay",
      "Unlimited free third-party couriers",
    ],
    fees: "Fees per order: 0% physical · 3% digital · 0.75% resell",
  },
  {
    id: "pro",
    name: "Pro Business",
    description: "For advanced scaling brands",
    price: { monthly: 4999, sixMonths: 4399, yearly: 3749 },
    features: [
      "Unlimited products",
      "Dedicated account manager",
      "0% platform fees",
      "Advanced analytics & AI",
      "API & Webhook access",
      "Priority 24/7 support",
    ],
    fees: "Fees per order: 0% physical · 1% digital · 0% resell",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom solutions for large corporations",
    price: { monthly: 9999, sixMonths: 8799, yearly: 7499 },
    isPopular: true,
    features: [
      "Custom infrastructure",
      "SLA guarantee",
      "Custom ERP integration",
      "Dedicated server setup",
      "Multi-store management",
      "White-label branding",
    ],
    fees: "Fees per order: 0% across all categories",
  },
  {
    id: "custom",
    name: "Agency / Reseller",
    description: "For managing multiple client stores",
    price: { monthly: 14999, sixMonths: 13199, yearly: 11249 },
    features: [
      "Manage up to 50 stores",
      "Client dashboard access",
      "Custom billing for clients",
      "Agency partner support",
      "Custom plugin development",
    ],
    fees: "Fees per order: Custom agreed rates",
  },
];

export default function PlansPage() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4">
      {/* Header with Fade-in Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3 mb-8"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-100 dark:bg-purple-950/50 px-3 py-1 rounded-full">
          PRICING
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Choose the plan that grows with you
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
          Prices shown for Bangladesh. Pick the plan that fits your store — change it anytime.
        </p>
      </motion.div>

      {/* Animated Tab Switcher */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setCycle("monthly")}
            className={`relative px-5 py-2 text-sm font-semibold rounded-full transition-colors ${
              cycle === "monthly" ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            {cycle === "monthly" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white dark:bg-slate-900 rounded-full shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10">Monthly</span>
          </button>

          <button
            type="button"
            onClick={() => setCycle("sixMonths")}
            className={`relative px-5 py-2 text-sm font-semibold rounded-full transition-colors flex items-center gap-2 ${
              cycle === "sixMonths" ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            {cycle === "sixMonths" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white dark:bg-slate-900 rounded-full shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              6 Months
              <Chip size="sm" variant="soft" color="success" className="font-bold text-xs">
                Save 10%
              </Chip>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCycle("yearly")}
            className={`relative px-5 py-2 text-sm font-semibold rounded-full transition-colors flex items-center gap-2 ${
              cycle === "yearly" ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            {cycle === "yearly" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white dark:bg-slate-900 rounded-full shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              Yearly
              <Chip size="sm" variant="soft" color="success" className="font-bold text-xs">
                Save 30%
              </Chip>
            </span>
          </button>
        </div>
      </div>

      {/* Compare features link */}
      <div className="flex justify-center mb-10">
        <button type="button" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-transform hover:translate-y-0.5">
          Compare all features <FiArrowDown />
        </button>
      </div>

      {/* Staggered Grid Animation for Cards */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4"
      >
        {PLANS_DATA.map((plan) => {
          const currentPrice = plan.price[cycle];

          return (
            <motion.div
              key={plan.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              whileHover={{ y: -6 }}
              className="relative flex flex-col h-full"
            >
              {/* Most Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                    <HiSparkles className="w-3.5 h-3.5" /> Most popular
                  </span>
                </div>
              )}

              <Card
                className={`h-full flex flex-col justify-between border-2 transition-all duration-200 ${
                  plan.isPopular
                    ? "border-purple-600 shadow-lg shadow-purple-100 dark:shadow-none"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                {/* Header Section */}
                <div className="flex flex-col items-start px-6 pt-6 pb-2 space-y-1">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                    {plan.badge && (
                      <Chip size="sm" variant="soft" color={plan.id === "free" ? "success" : "accent"}>
                        {plan.badge}
                      </Chip>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{plan.description}</p>
                </div>

                {/* Body Section */}
                <div className="px-6 py-4 flex-grow">
                  {/* Animated Price Counter/Transition */}
                  <div className="my-2 h-10 flex items-baseline">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={currentPrice}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="text-3xl font-extrabold text-slate-900 dark:text-white"
                      >
                        ৳{currentPrice.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-xs text-slate-500 font-medium ml-1"> / month</span>
                  </div>

                  {/* Action Button */}
                  <div className="my-6">
                    {plan.id === "free" ? (
                      <Button fullWidth variant="outline" isDisabled className="font-semibold text-slate-500">
                        Current plan
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant={plan.isPopular ? "primary" : "outline"}
                        className="font-semibold"
                      >
                        Upgrade
                      </Button>
                    )}
                  </div>

                  {/* Feature List */}
                  <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <FiCheck className="text-emerald-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Section */}
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] text-slate-400 font-medium">{plan.fees}</p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}