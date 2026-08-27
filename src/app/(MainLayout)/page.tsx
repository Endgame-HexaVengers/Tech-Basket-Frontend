"use client";

import FadeUp from "@/components/FadeUp";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import {
  FiBriefcase,
  FiHome,
  FiCalendar,
  FiCheckCircle,
  FiHash,
  FiMail,
  FiMapPin,
  FiShield,
  FiUser,
} from "react-icons/fi";

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 text-slate-400">{icon}</span>
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  </div>
);

export default function HomePage() {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const userRecord = user as
    | (typeof user & {
        employeeId?: string;
        department?: string;
        designation?: string;
        branch?: string;
        role?: string;
        company?: string;
        status?: string;
        joiningDate?: string;
        location?: string;
      })
    | undefined;

  const firstName = (user?.name || "Chan Badsha").split(" ")[0];
  const company = userRecord?.company || "TechLand Bangladesh Ltd.";
  const employeeName = user?.name || "Chan Badsha";
  const employeeId = userRecord?.employeeId || "EMP-001";
  const department = userRecord?.department || "Inventory & RMA";
  const designation = userRecord?.designation || "Inventory Manager";
  const branch = userRecord?.branch || "MPL Shop 1316";
  const role = userRecord?.role || "Administrator";
  const status = userRecord?.status || "Active";
  const location = userRecord?.location || "Dhaka, Bangladesh";
  const email = user?.email || "chan@example.com";
  const joiningDate = userRecord?.joiningDate || "15 January 2026";

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center gap-3">
        <Spinner size="lg" color="accent" />
        <span className="text-sm font-medium text-slate-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-4xl flex-col items-center justify-center px-4 py-12">
      {/* WELCOME SECTION */}
      <FadeUp>
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-3 text-lg font-semibold text-slate-700">
            {company}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            AI-Powered Inventory &amp; RMA Management System
          </p>
        </div>
      </FadeUp>

      {/* INFORMATION CARD */}
      <FadeUp delay={100}>
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Card Title */}
          <h2 className="text-base font-semibold text-slate-900">
            My Information
          </h2>
          <div className="mt-3 border-t border-slate-100" />

          {/* Two Column Grid */}
          <div className="mt-5 grid gap-8 sm:grid-cols-2">
            {/* LEFT COLUMN */}
            <div className="space-y-5">
              <InfoRow
                icon={<FiUser className="h-4 w-4" />}
                label="Employee Name"
                value={employeeName}
              />
              <InfoRow
                icon={<FiHash className="h-4 w-4" />}
                label="Employee ID"
                value={employeeId}
              />
              <InfoRow
                icon={<FiBriefcase className="h-4 w-4" />}
                label="Department"
                value={department}
              />
              <InfoRow
                icon={<FiShield className="h-4 w-4" />}
                label="Designation"
                value={designation}
              />
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-5">
              <InfoRow
                icon={<FiHome className="h-4 w-4" />}
                label="Company"
                value={company}
              />
              <InfoRow
                icon={<FiMapPin className="h-4 w-4" />}
                label="Branch / Location"
                value={branch}
              />
              <InfoRow
                icon={<FiShield className="h-4 w-4" />}
                label="Role"
                value={role}
              />
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-slate-400">
                  <FiCheckCircle className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Account Status
                  </p>
                  <p className="mt-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </span>
                      {status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTACT INFORMATION */}
          <div className="mt-5 border-t border-slate-100 pt-5">
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <FiMapPin className="h-3.5 w-3.5 text-slate-400" />
                {location}
              </span>
              <span className="flex items-center gap-1.5">
                <FiMail className="h-3.5 w-3.5 text-slate-400" />
                {email}
              </span>
              <span className="flex items-center gap-1.5">
                <FiCalendar className="h-3.5 w-3.5 text-slate-400" />
                {joiningDate}
              </span>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* BOTTOM MESSAGE */}
      <FadeUp delay={200}>
        <p className="mt-8 max-w-lg text-center text-sm leading-relaxed text-slate-400">
          Manage your inventory, purchases, sales, serial tracking, and complete
          RMA operations from one centralized platform.
        </p>
      </FadeUp>
    </div>
  );
}
