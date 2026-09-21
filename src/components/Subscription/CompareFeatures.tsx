"use client";

import {
    Check,
    Minus,
    Package,
    Store,
    Megaphone,
} from "lucide-react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const plans = [
    {
        name: "Free",
        price: "৳0.00",
        current: true,
    },
    {
        name: "Starter",
        price: "৳599.00",
    },
    {
        name: "Growth",
        price: "৳2,499.00",
    },
    {
        name: "Pro",
        price: "৳1,099.00",
        popular: true,
    },
];

const sections = [
    {
        title: "FEES PER ORDER",
        description: "Deducted per order based on product type",
        icon: Package,
        rows: [
            ["Own physical products", "5%", "0%", "0%", "0%"],
            ["Own digital products", "10%", "6%", "3%", "4%"],
            ["Resell supplier products", "3%", "1.9%", "0.75%", "1%"],
        ],
    },
    {
        title: "SELLING",
        icon: Store,
        rows: [
            ["Sell your own physical products", false, true, true, true],
            ["Sell your own digital products", true, true, true, true],
            ["Resell supplier products", true, true, true, true],
            ["Own product limit", "10", "500", "Unlimited", "2,000"],
            ["Resell product limit", "100", "500", "Unlimited", "Unlimited"],
            ["Orders", "20", "Unlimited", "Unlimited", "Unlimited"],
        ],
    },
    {
        title: "STORE & BRANDING",
        icon: Store,
        rows: [
            ["Subdomain", "Single", "All", "All", "All"],
            ["Custom domain", false, true, true, true],
            ["Preset themes", "2", "Unlimited", "Unlimited", "Unlimited"],
            ["Theme builder", false, false, true, true],
            ["Spotlight", false, false, true, false],
            ["Customer login page", false, false, true, false],
        ],
    },
    {
        title: "MARKETING & GROWTH",
        icon: Megaphone,
        rows: [
            ["Marketing pixels & GTM", true, true, true, true],
        ],
    },
];

// Variants for Animations
const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function FeatureValue({
    value,
}: {
    value: string | boolean;
}) {
    if (value === true) {
        return (
            <div className="flex justify-center">
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-500"
                >
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                </motion.div>
            </div>
        );
    }

    if (value === false) {
        return (
            <div className="flex justify-center">
                <Minus className="h-5 w-5 text-slate-300" />
            </div>
        );
    }

    return (
        <div className="text-center text-base font-semibold text-slate-900">
            {value}
        </div>
    );
}

export default function CompareFeatures() {
    const router = useRouter();

    const handleUpgrade = (plan: string) => {
        router.push(`/payment?plan=${plan.toLowerCase()}`);
    };

    return (
        <motion.section 
            id="compare-features"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className=" my-18"
        >
            <div className="w-full max-w-7xl mx-auto">
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-10 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                        Compare all features
                    </h2>

                    <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 md:text-lg">
                        Every feature and per-order fee, side by side — pick the plan
                        that fits how you sell.
                    </p>
                </motion.div>

                {/* Table */}
                <motion.div 
                    variants={itemVariants}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                    {/* Plan Header */}
                    <div className="grid grid-cols-5 border-b border-slate-200">
                        {/* Features */}
                        <div className="flex items-end px-5 py-6 text-base font-semibold text-slate-700">
                            Features
                        </div>

                        {/* Plans */}
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative px-4 py-6 text-center ${plan.current ? "bg-purple-50/70" : ""
                                    }`}
                            >
                                {/* Popular Badge with pulse effect */}
                                {plan.popular && (
                                    <motion.span 
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute right-3 top-3 rounded-full bg-purple-700 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm"
                                    >
                                        ✦ Popular
                                    </motion.span>
                                )}

                                {/* Plan Name */}
                                <h3
                                    className={`text-base font-bold ${plan.current
                                        ? "text-purple-700"
                                        : "text-slate-800"
                                        }`}
                                >
                                    {plan.name}
                                </h3>

                                {/* Price */}
                                <p className="mt-2 text-sm text-slate-500">
                                    {plan.price} / month
                                </p>

                                {/* Button */}
                                {plan.current ? (
                                    <Button
                                        size="sm"
                                        variant="tertiary"
                                        isDisabled
                                        className="mt-3"
                                    >
                                        Current plan
                                    </Button>
                                ) : (
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                        <Button
                                            size="sm"
                                            variant={plan.popular ? "primary" : "outline"}
                                            className="mt-3 font-semibold w-full"
                                            onPress={() => handleUpgrade(plan.name)}
                                        >
                                            Upgrade
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Feature Sections */}
                    {sections.map((section) => {
                        const Icon = section.icon;

                        return (
                            <div key={section.title}>
                                {/* Section Header */}
                                <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3">
                                    <Icon className="h-4 w-4 text-slate-500" />

                                    <span className="text-sm font-bold tracking-wide text-slate-600">
                                        {section.title}
                                    </span>

                                    {section.description && (
                                        <span className="text-xs text-slate-400">
                                            {section.description}
                                        </span>
                                    )}
                                </div>

                                {/* Rows */}
                                {section.rows.map((row, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.8)" }}
                                        transition={{ duration: 0.15 }}
                                        className="grid grid-cols-5 border-b border-slate-200 last:border-b-0"
                                    >
                                        {/* Feature Name */}
                                        <div className="flex items-center px-5 py-4 text-sm text-slate-700">
                                            {row[0]}
                                        </div>

                                        {/* Values */}
                                        {row.slice(1).map((value, valueIndex) => (
                                            <div
                                                key={valueIndex}
                                                className={`flex min-h-[52px] items-center justify-center border-l border-slate-200 px-3 py-4 ${valueIndex === 0
                                                    ? "bg-purple-50/50"
                                                    : ""
                                                    }`}
                                            >
                                                <FeatureValue
                                                    value={value as string | boolean}
                                                />
                                            </div>
                                        ))}
                                    </motion.div>
                                ))}
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </motion.section>
    );
}