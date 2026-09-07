"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Button, TextField, Label, InputGroup, FieldError } from "@heroui/react";
import { Eye, EyeSlash } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { FaChevronDown, FaLock, FaUser, FaChartLine, FaBoxes, FaShieldAlt } from "react-icons/fa";
import { IoMdPin } from "react-icons/io";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import FadeUp from "@/components/FadeUp";
import Link from "next/link";
import { TiArrowRight } from "react-icons/ti";

const BRANCHES = [
    "MPL Shop 1316",
    "Uttora Branch",
    "Progati Shoroni Branch",
    "Mirpur Branch",
    "Tangail Branch",
    "Chattogram Branch",
];

export default function LoginPage() {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const userData = Object.fromEntries(formData.entries());

        try {
            const { data, error } = await authClient.signIn.email({
                email: userData.userIdOrEmail as string,
                password: userData.password as string,
                rememberMe: true,
                callbackURL: "/",
            });

            if (error) {
                toast.error(error.message || "An error occurred during login.");
            } else if (data) {
                toast.success("Successfully logged in!");
                router.push("/");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
      
            <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 sm:p-6 lg:p-8">
                <FadeUp className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 min-h-[720px]">
                    
                    {/* LEFT SIDE: BANNER & BRANDING SECTION */}
                    <div className="lg:col-span-6 relative hidden lg:flex flex-col justify-between p-12 text-white bg-slate-900 overflow-hidden">
                        {/* Background Image with Overlay */}
                        <div 
                            className="absolute inset-0 z-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-1000 hover:scale-100"
                            style={{ 
                                backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop')` 
                            }}
                        />
                        <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-indigo-950/80 to-indigo-900/40" />

                        {/* Top Branding */}
                        <div className="relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 font-bold text-xl">
                                    TB
                                </div>
                                <span className="text-2xl font-extrabold tracking-wide text-white">
                                    TechBasket
                                </span>
                            </div>
                        </div>

                        {/* Middle Content / Feature Highlights */}
                        <div className="relative z-10 my-auto py-8">
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md mb-6">
                                ✨ Next-Gen Inventory OS 2.0
                            </span>
                            <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight mb-4 text-white">
                                Smart Stock Management & Real-time Analytics
                            </h2>
                            <p className="text-slate-300 text-sm xl:text-base leading-relaxed mb-8 max-w-md">
                                Streamline multi-branch logistics, automate reordering, and track inventory insights with AI-driven precision.
                            </p>

                            {/* Key Stats / Features */}
                            <div className="grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-6">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
                                        <FaChartLine className="size-4" />
                                        <span className="text-xs font-medium text-slate-400">Accuracy</span>
                                    </div>
                                    <span className="text-xl font-bold text-white">99.9%</span>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
                                        <FaBoxes className="size-4" />
                                        <span className="text-xs font-medium text-slate-400">Branches</span>
                                    </div>
                                    <span className="text-xl font-bold text-white">Sync Live</span>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
                                        <FaShieldAlt className="size-4" />
                                        <span className="text-xs font-medium text-slate-400">Security</span>
                                    </div>
                                    <span className="text-xl font-bold text-white">Enterprise</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Quote / Footer */}
                        <div className="relative z-10 text-xs text-slate-400 border-t border-slate-800/60 pt-4 flex justify-between items-center">
                            <span>© 2026 TechBasket Logistics Ltd.</span>
                            <span className="text-indigo-400 hover:underline cursor-pointer">System Normal v4.2</span>
                        </div>
                    </div>

                    {/* RIGHT SIDE: LOGIN FORM SECTION */}
                    <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white">
                        <div>
                            {/* BRAND HEADER (FOR MOBILE) */}
                            <div className="lg:hidden mb-6 text-center">
                                <h1 className="text-2xl font-bold tracking-tight text-indigo-600">
                                    TechBasket
                                </h1>
                                <p className="text-xs text-gray-500 mt-1">
                                    AI-Powered Inventory Management
                                </p>
                            </div>

                            {/* FORM HEADER */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                                    Welcome back 👋
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Please enter your credentials to access your dashboard.
                                </p>
                            </div>

                            <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
                                {/* COMPANY NAME */}
                                <TextField isRequired name="companyName" className="w-full">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1 block">
                                        Company Name
                                    </Label>
                                    <InputGroup className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all bg-gray-50/50">
                                        <InputGroup.Prefix className="pl-3.5 text-gray-400">
                                            <FaLock className="size-4" />
                                        </InputGroup.Prefix>
                                        <InputGroup.Input
                                            name="companyName"
                                            value="TechBasket Ltd."
                                            readOnly
                                            className="w-full py-2.5 px-3 text-sm text-gray-800 bg-transparent outline-none font-medium"
                                            placeholder="TechBasket Ltd."
                                        />
                                    </InputGroup>
                                    <FieldError />
                                </TextField>

                                {/* BRANCH / LOCATION */}
                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="branch"
                                        className="text-xs font-semibold uppercase tracking-wider text-gray-700 block"
                                    >
                                        Branch / Location
                                    </label>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                            <IoMdPin className="size-4" />
                                        </span>
                                        <select
                                            id="branch"
                                            name="branch"
                                            required
                                            defaultValue={BRANCHES[0]}
                                            className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-10 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
                                        >
                                            {BRANCHES.map((branch) => (
                                                <option key={branch} value={branch}>
                                                    {branch}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                            <FaChevronDown className="size-3" />
                                        </span>
                                    </div>
                                </div>

                                {/* USER ID / EMAIL */}
                                <TextField
                                    isRequired
                                    name="userIdOrEmail"
                                    className="w-full"
                                    validate={(value) => {
                                        if (!value || value.trim().length === 0) {
                                            return "User ID or Email is required";
                                        }
                                        return null;
                                    }}
                                >
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1 block">
                                        User ID / Email
                                    </Label>
                                    <InputGroup className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all bg-gray-50/50">
                                        <InputGroup.Prefix className="pl-3.5 text-gray-400">
                                            <FaUser className="size-4" />
                                        </InputGroup.Prefix>
                                        <InputGroup.Input
                                            name="userIdOrEmail"
                                            placeholder="admin@techbasket.com"
                                            className="w-full py-2.5 px-3 text-sm text-gray-800 bg-transparent outline-none"
                                        />
                                    </InputGroup>
                                    <FieldError />
                                </TextField>

                                {/* PASSWORD */}
                                <TextField
                                    className="w-full"
                                    name="password"
                                    isRequired
                                    validate={(value) => {
                                        if (value.length < 8) {
                                            return "Password must be at least 8 characters";
                                        }
                                        return null;
                                    }}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <Label className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                                            Password
                                        </Label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <InputGroup className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all bg-gray-50/50">
                                        <InputGroup.Prefix className="pl-3.5 text-gray-400">
                                            <FaLock className="size-4" />
                                        </InputGroup.Prefix>
                                        <InputGroup.Input
                                            name="password"
                                            type={isVisible ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="w-full py-2.5 px-3 text-sm text-gray-800 bg-transparent outline-none"
                                        />
                                        <InputGroup.Suffix className="pr-2">
                                            <Button
                                                isIconOnly
                                                type="button"
                                                variant="ghost"
                                                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                                                onPress={() => setIsVisible(!isVisible)}
                                            >
                                                {isVisible ? (
                                                    <Eye className="size-4" />
                                                ) : (
                                                    <EyeSlash className="size-4" />
                                                )}
                                            </Button>
                                        </InputGroup.Suffix>
                                    </InputGroup>
                                    <FieldError />
                                </TextField>

                                {/* SUBMIT BUTTON */}
                                <Button
                                    type="submit"
                                    isDisabled={isLoading}
                                    className="group w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded py-3 mt-3 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                                >
                                    {isLoading ? "Signing in..." : "Sign In to Dashboard"}
                                    {!isLoading && (
                                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    )}
                                </Button>

                                {/* SIGN UP LINK */}
                                <div className="text-center text-sm text-gray-600 mt-4 flex items-center justify-center gap-1">
                                    <span>New to TechBasket?</span>
                                    <Link
                                        href="/signup"
                                        className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-0.5 hover:underline transition-colors"
                                    >
                                        Create an account <TiArrowRight className="size-4" />
                                    </Link>
                                </div>
                            </Form>
                        </div>

                        {/* FOOTER LINKS */}
                        <div className="border-t border-gray-100 pt-6 mt-6 text-center">
                            <div className="flex items-center justify-center gap-4 text-xs font-medium text-gray-500 mb-2">
                                <Link href="/#" className="hover:text-gray-800 hover:underline">
                                    Security Policy
                                </Link>
                                <span>•</span>
                                <Link href="/#" className="hover:text-gray-800 hover:underline">
                                    System Status
                                </Link>
                                <span>•</span>
                                <Link href="/#" className="hover:text-gray-800 hover:underline">
                                    Support
                                </Link>
                            </div>
                            <p className="text-[11px] text-gray-400">
                                © 2026 TechBasket Logistics. Authorized personnel only.
                            </p>
                        </div>
                    </div>
                </FadeUp>
            </div>
       
    );
}