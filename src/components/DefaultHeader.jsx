"use client";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { FiBell, FiHelpCircle, FiUser } from "react-icons/fi";

const DefaultHeader = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  return (
    <header
      className="fixed left-64 right-0 top-0 z-40 flex h-16 items-center justify-between border-b
         border-slate-200 bg-white px-6"
    >
      <div>
        <h2 className="font-semibold text-slate-900">TechBasket ERP</h2>
        <p className="text-xs text-slate-500">Inventory & Management System</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <FiBell className="h-5 w-5" />
        </button>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Help"
        >
          <FiHelpCircle className="h-5 w-5" />
        </button>

        {/* Profile / Dynamic Avatar */}
        {user ? (
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-indigo-500/20 hover:opacity-90 transition-all cursor-pointer"
          >
            {user.image ? (
              <Image
                src={user?.image}
                alt={user?.name || "User Avatar"}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-tr from-indigo-600 to-purple-600 font-bold text-white text-sm">
                {userInitial}
              </div>
            )}
          </button>
        ) : (
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            aria-label="Guest Profile"
          >
            <FiUser className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  );
};

export default DefaultHeader;
