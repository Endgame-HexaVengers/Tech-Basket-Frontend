"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Form,
    Button,
    TextField,
    Label,
    InputGroup,
    FieldError,
} from "@heroui/react";
import { FaLock } from "react-icons/fa";
import { ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import FadeUp from "@/components/FadeUp";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";


const ForgotPasswordPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;

        try {
            const { data, error } = await authClient.requestPasswordReset({
                email,
                redirectTo: "/reset-password", 
            });

            if (error) {
                toast.error(
                    error.message || "Unable to send password reset link."
                );
                return;
            }

            toast.success("Password reset link sent to your email!");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <FadeUp>
            <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="w-full max-w-md bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
                    <div className="p-8 sm:p-10">
                        {/* BRAND HEADER */}
                        <div className="mb-8 text-center flex flex-col items-center">
                            <h1 className="text-3xl font-bold tracking-tight text-indigo-700">
                                TechBasket
                            </h1>

                            <p className="text-sm mt-1 text-gray-600">
                                AI-Powered Inventory Management
                            </p>
                        </div>

                        {/* TITLE */}
                        <div className="text-center mb-7">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Forgot Password?
                            </h2>

                            <p className="text-sm text-gray-500 mt-2 leading-6">
                                Enter your email address and we&apos;ll send you instructions
                                to reset your password.
                            </p>
                        </div>

                        {/* FORM */}
                        <Form
                            className="flex flex-col gap-5"
                            onSubmit={onSubmit}
                        >
                            <TextField
                                isRequired
                                name="email"
                                type="email"
                                className="w-full"
                                validate={(value) => {
                                    if (!value || value.trim().length === 0) {
                                        return "Email is required";
                                    }

                                    if (!/^\S+@\S+\.\S+$/.test(value)) {
                                        return "Please enter a valid email address";
                                    }

                                    return null;
                                }}
                            >
                                <Label className="text-sm font-medium text-default-700">
                                    User ID / Email
                                </Label>

                                <InputGroup className="border rounded-lg overflow-hidden mt-1">
                                    <InputGroup.Prefix className="pl-3 text-default-400">
                                        <FaLock />
                                    </InputGroup.Prefix>

                                    <InputGroup.Input
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                    />
                                </InputGroup>

                                <FieldError />
                            </TextField>

                            {/* SEND RESET LINK */}
                            <Button
                                type="submit"
                                isDisabled={isLoading}
                                className="group w-full bg-indigo-700 rounded-lg hover:bg-indigo-800 text-white py-6 flex items-center justify-center gap-2 font-medium cursor-pointer"
                            >
                                {isLoading ? "Sending..." : "Send Reset Link"}

                                {!isLoading && (
                                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                )}
                            </Button>
                        </Form>

                        {/* BACK TO LOGIN */}
                        <div className="text-center mt-6">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-700 font-medium transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Login
                            </Link>
                        </div>
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
};

export default ForgotPasswordPage;