"use client";

import { Form, InputGroup } from "@heroui/react";
import { Eye, EyeSlash } from "@gravity-ui/icons";
import { Button, FieldError, Label, TextField } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import FadeUp from "@/components/FadeUp";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiCheckCircle } from "react-icons/fi";
import { ArrowRight } from "lucide-react";
import { TiArrowRight } from "react-icons/ti";
import { FaChartPie, FaCogs, FaUsersCog } from "react-icons/fa";

const RegisterPage = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData.entries()) as {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    };

    if (userData.password !== userData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp.email({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        companyName: "N/A",
        branch: "Main Branch",
        role: "user",
      });

      if (!error) {
        toast.success("Signup successful!");
        router.push("/login");
      } else {
        toast.error(error.message || "Something went wrong");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FadeUp>
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 min-h-[720px]">
          
          {/* LEFT SIDE: BANNER & BRANDING SECTION */}
          <div className="lg:col-span-6 relative hidden lg:flex flex-col justify-between p-12 text-white bg-slate-900 overflow-hidden">
            {/* Background Image with Gradient Overlay */}
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
            <div className="relative z-10 my-auto py-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md mb-6">
                🚀 Join the Enterprise Network
              </span>
              <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight mb-4 text-white">
                Start Managing Your Inventory Smarter Today
              </h2>
              <p className="text-slate-300 text-sm xl:text-base leading-relaxed mb-6 max-w-md">
                Get full visibility into your supply chain, track multi-branch orders, and automate warehouse operations.
              </p>

              {/* Feature Bullet Points */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <FiCheckCircle className="text-indigo-400 size-5 shrink-0" />
                  <span>Real-time stock tracking across multiple locations</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <FiCheckCircle className="text-indigo-400 size-5 shrink-0" />
                  <span>Automated stock alerts & low inventory warnings</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <FiCheckCircle className="text-indigo-400 size-5 shrink-0" />
                  <span>Role-based access control for team management</span>
                </div>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-6">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
                    <FaChartPie className="size-4" />
                    <span className="text-xs font-medium text-slate-400">Reports</span>
                  </div>
                  <span className="text-xl font-bold text-white">Automated</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
                    <FaCogs className="size-4" />
                    <span className="text-xs font-medium text-slate-400">Workflows</span>
                  </div>
                  <span className="text-xl font-bold text-white">Customizable</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
                    <FaUsersCog className="size-4" />
                    <span className="text-xs font-medium text-slate-400">Teams</span>
                  </div>
                  <span className="text-xl font-bold text-white">Multi-Role</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer Text */}
            <div className="relative z-10 text-xs text-slate-400 border-t border-slate-800/60 pt-4 flex justify-between items-center">
              <span>© 2026 TechBasket Logistics Ltd.</span>
              <span className="text-indigo-400 hover:underline cursor-pointer">Enterprise Ready</span>
            </div>
          </div>

          {/* RIGHT SIDE: REGISTER FORM SECTION */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white overflow-y-auto">
            <div>
              {/* BRAND HEADER (FOR MOBILE) */}
              <div className="lg:hidden mb-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-indigo-600">
                  TechBasket
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Create your inventory management account
                </p>
              </div>

              {/* FORM HEADER */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Create an account ✨
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in your details to start managing your inventory.
                </p>
              </div>

              <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
                {/* NAME */}
                <TextField
                  isRequired
                  name="name"
                  className="w-full"
                  validate={(value) => {
                    if (value.length < 3) {
                      return "Name must be at least 3 characters";
                    }
                    return null;
                  }}
                >
                  <Label className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1 block">
                    Full Name
                  </Label>
                  <InputGroup className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all bg-gray-50/50">
                    <InputGroup.Prefix className="pl-3.5 text-gray-400">
                      <FiUser className="size-4" />
                    </InputGroup.Prefix>
                    <InputGroup.Input 
                      name="name" 
                      placeholder="Enter your full name" 
                      className="w-full py-2.5 px-3 text-sm text-gray-800 bg-transparent outline-none"
                    />
                  </InputGroup>
                  <FieldError />
                </TextField>

                {/* EMAIL */}
                <TextField
                  isRequired
                  name="email"
                  type="email"
                  className="w-full"
                  validate={(value) => {
                    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                      return "Please enter a valid email";
                    }
                    return null;
                  }}
                >
                  <Label className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1 block">
                    Email Address
                  </Label>
                  <InputGroup className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all bg-gray-50/50">
                    <InputGroup.Prefix className="pl-3.5 text-gray-400">
                      <FiMail className="size-4" />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
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
                    if (!/[A-Z]/.test(value)) {
                      return "Password must contain uppercase letter";
                    }
                    if (!/[0-9]/.test(value)) {
                      return "Password must contain number";
                    }
                    return null;
                  }}
                >
                  <Label className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1 block">
                    Password
                  </Label>
                  <InputGroup className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all bg-gray-50/50">
                    <InputGroup.Prefix className="pl-3.5 text-gray-400">
                      <FiLock className="size-4" />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                      name="password"
                      type={isVisible ? "text" : "password"}
                      placeholder="Enter your password"
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

                {/* CONFIRM PASSWORD */}
                <TextField
                  className="w-full"
                  name="confirmPassword"
                  isRequired
                  validate={(value) => {
                    if (value.length < 8) {
                      return "Confirm password must be at least 8 characters";
                    }
                    return null;
                  }}
                >
                  <Label className="text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1 block">
                    Confirm Password
                  </Label>
                  <InputGroup className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all bg-gray-50/50">
                    <InputGroup.Prefix className="pl-3.5 text-gray-400">
                      <FiLock className="size-4" />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                      name="confirmPassword"
                      type={isConfirmVisible ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="w-full py-2.5 px-3 text-sm text-gray-800 bg-transparent outline-none"
                    />
                    <InputGroup.Suffix className="pr-2">
                      <Button
                        isIconOnly
                        type="button"
                        variant="ghost"
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                        onPress={() => setIsConfirmVisible(!isConfirmVisible)}
                      >
                        {isConfirmVisible ? (
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
                  className="group w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded py-3 mt-2 flex
                  items-center justify-center gap-2 font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  {isLoading ? "Registering..." : "Register Account"}
                  {!isLoading && (
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  )}
                </Button>
              </Form>

              {/* LOGIN LINK */}
              <div className="text-center text-sm text-gray-600 mt-4 flex items-center justify-center gap-1">
                <span>Already have an account?</span>
                <Link
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-0.5 hover:underline transition-colors"
                >
                  Login <TiArrowRight className="size-4" />
                </Link>
              </div>
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
        </div>
      </div>
    </FadeUp>
  );
};

export default RegisterPage;