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
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { ArrowRight } from "lucide-react";
import { TiArrowRight } from "react-icons/ti";

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
      const { data, error } = await signUp.email({
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
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FadeUp>
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
          <div className="p-8 sm:p-12">
            {/* BRAND HEADER */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-indigo-700">
                TechBasket
              </h1>
              <p className="text-default-500 text-sm mt-2">
                Create your inventory management account
              </p>
            </div>

            <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
              {/* NAME */}
              <TextField
                isRequired
                name="name"
                validate={(value) => {
                  if (value.length < 3) {
                    return "Name must be at least 3 characters";
                  }
                  return null;
                }}
              >
                <Label>Name</Label>
                <InputGroup className="border rounded-lg overflow-hidden">
                  <InputGroup.Prefix className="pl-3 text-default-400">
                    <FiUser className="size-4" />
                  </InputGroup.Prefix>
                  <InputGroup.Input name="name" placeholder="Enter your name" />
                </InputGroup>
                <FieldError />
              </TextField>

              {/* EMAIL */}
              <TextField
                isRequired
                name="email"
                type="email"
                validate={(value) => {
                  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                    return "Please enter a valid email";
                  }
                  return null;
                }}
              >
                <Label>Email</Label>
                <InputGroup className="border rounded-lg overflow-hidden">
                  <InputGroup.Prefix className="pl-3 text-default-400">
                    <FiMail className="size-4" />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
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
                <Label>Password</Label>
                <InputGroup className="border rounded-lg overflow-hidden">
                  <InputGroup.Prefix className="pl-3 text-default-400">
                    <FiLock className="size-4" />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    name="password"
                    type={isVisible ? "text" : "password"}
                    placeholder="Your Password"
                  />
                  <InputGroup.Suffix>
                    <Button
                      isIconOnly
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
                <Label>Confirm Password</Label>
                <InputGroup className="border rounded-lg overflow-hidden">
                  <InputGroup.Prefix className="pl-3 text-default-400">
                    <FiLock className="size-4" />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    name="confirmPassword"
                    type={isConfirmVisible ? "text" : "password"}
                    placeholder="Confirm Password"
                  />
                  <InputGroup.Suffix>
                    <Button
                      isIconOnly
                      variant="ghost"
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

              <Button
                type="submit"
                isDisabled={isLoading}
                className="group w-full bg-indigo-700 rounded hover:bg-indigo-800
                                                             text-white py-6 mt-2 flex items-center justify-center gap-2 font-medium cursor-pointer"
              >
                {isLoading ? "Registering..." : "Register Account"}

                {!isLoading && (
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </Button>
            </Form>

            <div className="text-center text-sm text-default-500 mt-8 flex gap-1">
              <p className="font-medium text-gray-500">
                Already have an account?{" "}
              </p>

              <Link
                href="/login"
                className="text-blue-600 hover:underline font-semibold transition-colors"
              >
                <p className="flex items-center">
                  Login <TiArrowRight />
                </p>
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

export default RegisterPage;
