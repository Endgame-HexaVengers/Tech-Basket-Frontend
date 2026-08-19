"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Button, TextField, Label, InputGroup, FieldError } from "@heroui/react";
import { Eye, EyeSlash } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { FaChevronDown, FaLock, FaUser, } from "react-icons/fa";
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
        console.log("data:", userData);

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
                toast.success("Login successful!");
                router.push("/");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }

        // const companyName = "TechBasket Ltd.";
    };

    return (
        <FadeUp>
            <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="w-full max-w-md bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
                    <div className="p-8 sm:p-10">
                        {/* BRAND HEADER */}
                        <div className="mb-8 text-center flex flex-col items-center">
                            <div className="">
                                <h1 className="text-3xl font-bold tracking-tight text-indigo-700">
                                    TechBasket
                                </h1>
                            </div>

                            <p className="text-default-500 text-sm mt-1 text-gray-600">
                                AI-Powered Inventory Management
                            </p>
                        </div>

                        <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
                            {/* COMPANY NAME */}
                            <TextField isRequired name="companyName" className="w-full">
                                <Label className="text-sm font-medium text-default-700">
                                    Company Name
                                </Label>
                                <InputGroup className="border rounded-lg overflow-hidden mt-1">
                                    <InputGroup.Prefix className="pl-3 text-default-400">
                                        <FaLock />
                                    </InputGroup.Prefix>
                                    <InputGroup.Input
                                        name="companyName"
                                        value="TechBasket Ltd."
                                        readOnly 
                                        placeholder="TechBasket Ltd."
                                    />
                                </InputGroup>
                                <FieldError />
                            </TextField>

                            {/* BRANCH / LOCATION */}
                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="branch"
                                    className="text-sm font-medium text-default-700"
                                >
                                    Branch / Location
                                </label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-default-400">
                                        <IoMdPin />
                                    </span>
                                    <select
                                        id="branch"
                                        name="branch"
                                        required
                                        defaultValue={BRANCHES[0]}
                                        className="w-full appearance-none rounded-lg border border-default-200 bg-white py-2.5 pl-10 pr-10 text-sm text-default-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {BRANCHES.map((branch) => (
                                            <option key={branch} value={branch}>
                                                {branch}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-default-400">
                                        <FaChevronDown />
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
                                <Label className="text-sm font-medium text-default-700">
                                    User ID / Email
                                </Label>
                                <InputGroup className="border rounded-lg overflow-hidden mt-1">
                                    <InputGroup.Prefix className="pl-3 text-default-400">
                                        <FaUser />
                                    </InputGroup.Prefix>
                                    <InputGroup.Input
                                        name="userIdOrEmail"
                                        placeholder="Enter your user ID or email"
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
                                <Label className="text-sm font-medium text-default-700">
                                    Password
                                </Label>
                                <InputGroup className="border rounded-lg overflow-hidden mt-1">
                                    <InputGroup.Prefix className="pl-3 text-default-400">
                                        <FaLock />
                                    </InputGroup.Prefix>
                                    <InputGroup.Input
                                        name="password"
                                        type={isVisible ? "text" : "password"}
                                        placeholder="Enter your password"
                                    />
                                    <InputGroup.Suffix>
                                        <Button
                                            isIconOnly
                                            type="button"
                                            variant="ghost"
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

                            {/* SIGN IN */}

                            <Button
                                type="submit"
                                isDisabled={isLoading}
                                className="group w-full bg-indigo-700 rounded hover:bg-indigo-800
                                 text-white py-6 mt-2 flex items-center justify-center gap-2 font-medium cursor-pointer"
                            >
                                {isLoading ? "Signing in..." : "Sign In"}

                                {!isLoading && (
                                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                )}
                            </Button>


                            <div className="text-center mt-1 ">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-red-500 hover:underline font-medium"
                                >
                                    Forgot Password?
                                </Link>

                                <div className="text-center text-sm text-default-500 mt-8 flex gap-1">
                                    <p className="font-medium text-gray-500">New to TechBasket?{" "}</p>
                                    <Link
                                        href="/signup"
                                        className="text-blue-600 hover:underline font-semibold transition-colors"
                                    >
                                        <p className="flex items-center">Create an account <TiArrowRight /></p>
                                    </Link>
                                </div>
                            </div>
                        </Form>
                    </div>

                    {/* FOOTER */}
                    <div className="border-t border-default-100 bg-default-50 px-8 py-4 text-center">
                        <div className="flex items-center justify-center gap-4 text-xs text-default-500 mb-1">
                            <Link href="/#" className="hover:underline">
                                Security Policy
                            </Link>
                            <Link href="/#" className="hover:underline">
                                System Status
                            </Link>
                            <Link href="/#" className="hover:underline">
                                Support
                            </Link>
                        </div>
                        <p className="text-[11px] text-default-400">
                            © 2026 TechBasket Logistics. Authorized personnel only.
                        </p>
                    </div>
                </div>
            </div>
        </FadeUp>
    );
}
