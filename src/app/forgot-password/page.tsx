"use client";

import React, { useState } from "react";
import {
  Form,
  Button,
  TextField,
  Label,
  InputGroup,
  FieldError,
} from "@heroui/react";
import { FiMail, FiKey, FiCheckCircle, FiShield } from "react-icons/fi";
import { ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import FadeUp from "@/components/FadeUp";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    setSubmittedEmail(email);

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (error) {
        toast.error(
          error.message || "Unable to send password reset link."
        );
        return;
      }

      setIsSubmitted(true);
      toast.success("Password reset link sent to your email!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen relative flex items-center justify-center bg-slate-950 p-4 sm:p-6 overflow-hidden">
        
        {/* BACKGROUND GLOW DECORATIONS */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <FadeUp className="w-full max-w-lg relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100/80">
          
          {/* TOP ACCENT STRIP */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 w-full" />

          <div className="p-8 sm:p-12">
            
            {/* BRANDING */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20">
                  TB
                </div>
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                  TechBasket
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <FiShield className="size-3.5" /> Account Recovery
              </span>
            </div>

            {!isSubmitted ? (
              <>
                {/* ICON & TITLE SECTION */}
                <div className="text-center mb-8">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-inner">
                    <FiKey className="size-8 stroke-[1.75]" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Forgot Your Password?
                  </h2>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto">
                    No worries! Enter your registered email address below and we&apos;ll send you instructions to reset it.
                  </p>
                </div>

                {/* FORM */}
                <Form className="flex flex-col gap-5" onSubmit={onSubmit}>
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
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 block">
                      Email Address
                    </Label>

                    <InputGroup className="border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all bg-slate-50/50">
                      <InputGroup.Prefix className="pl-4 text-slate-400">
                        <FiMail className="size-4" />
                      </InputGroup.Prefix>

                      <InputGroup.Input
                        name="email"
                        type="email"
                        placeholder="name@company.com"
                        className="w-full py-3 px-3 text-sm text-slate-800 bg-transparent outline-none"
                      />
                    </InputGroup>

                    <FieldError />
                  </TextField>

                  {/* SUBMIT BUTTON */}
                  <Button
                    type="submit"
                    isDisabled={isLoading}
                    className="group w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl py-3.5 mt-2 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
                  >
                    {isLoading ? "Sending Instructions..." : "Send Reset Link"}
                    {!isLoading && (
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    )}
                  </Button>
                </Form>
              </>
            ) : (
              /* SUCCESS STATE (WHEN LINK IS SENT) */
              <div className="text-center py-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
                  <FiCheckCircle className="size-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Check Your Email
                </h2>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  We have sent password reset instructions to:
                </p>
                <div className="mt-3 py-2 px-4 bg-slate-100 rounded-xl font-medium text-slate-800 text-sm inline-block border border-slate-200">
                  {submittedEmail}
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    try again
                  </button>
                </p>
              </div>
            )}

            {/* BACK TO LOGIN LINK */}
            <div className="text-center mt-8 pt-6 border-t border-slate-100">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 font-semibold transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                Back to Login
              </Link>
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t border-slate-100 bg-slate-50/80 px-8 py-4 text-center">
            <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-500 mb-1">
              <Link href="/#" className="hover:text-slate-800 hover:underline">
                Security Policy
              </Link>
              <span>•</span>
              <Link href="/#" className="hover:text-slate-800 hover:underline">
                System Status
              </Link>
              <span>•</span>
              <Link href="/#" className="hover:text-slate-800 hover:underline">
                Support
              </Link>
            </div>
            <p className="text-[11px] text-slate-400">
              © 2026 TechBasket Logistics. Authorized personnel only.
            </p>
          </div>
        </FadeUp>
      </div>
  );
};

export default ForgotPasswordPage;