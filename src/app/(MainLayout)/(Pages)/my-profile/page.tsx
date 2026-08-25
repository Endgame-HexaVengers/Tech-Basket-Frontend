"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { FiMail, FiUser } from "react-icons/fi";

const MyProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center bg-slate-50 p-6 text-sm text-slate-500">
        Loading profile...
      </div>
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-7rem)] items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)]">
        <div className="h-28 bg-linear-to-r from-slate-900 via-indigo-900 to-indigo-700" />

        <div className="px-6 pb-7 sm:px-8">
          <div className="-mt-12 flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-indigo-100 text-2xl font-bold text-indigo-700 shadow-md">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User Avatar"}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.name?.trim()?.charAt(0)?.toUpperCase() || <FiUser />
              )}
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-slate-900">
              {user?.name || "My Profile"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">Account information</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                <FiUser className="h-4 w-4 text-indigo-600" />
                Name
              </div>
              <p className="mt-2 truncate font-medium text-slate-900">
                {user?.name || "-"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                <FiMail className="h-4 w-4 text-indigo-600" />
                Email
              </div>
              <p className="mt-2 truncate font-medium text-slate-900">
                {user?.email || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyProfilePage;