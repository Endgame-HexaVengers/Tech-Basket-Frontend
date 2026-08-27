"use client";
import { authClient } from "@/lib/auth-client";
import { useTabs } from "@/context/TabContext";
import { Button } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiLogOut, FiUser } from "react-icons/fi";

const UserInfo = () => {
  const { data: session } = authClient.useSession();

  const user = session?.user;
  const router = useRouter();
  const { openTab, tabs } = useTabs();

  // Profile dropdown state
  const [profileOpen, setProfileOpen] = useState(false);

  // Logout loading state
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Dropdown reference
  const profileRef = useRef<HTMLDivElement>(null);

  // User initial
  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await authClient.signOut();

      setProfileOpen(false);

      toast.success("Logged out successfully!");

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);

      setIsLoggingOut(false);
    }
  };
  return (
    <div>
      <div ref={profileRef} className="relative ml-2">
        {user ? (
          <>
            {/* Avatar Button */}
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                profileOpen
                  ? "border-indigo-500"
                  : "border-slate-200 hover:border-indigo-400"
              }`}
              aria-label="Open profile menu"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
            >
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User avatar"}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-indigo-600 text-sm font-semibold text-white">
                  {userInitial}
                </div>
              )}
            </button>

            {/* Profile Dropdown */}
            <div
              className={`absolute top-12 right-0 z-50 w-56 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-lg transition-all duration-150 ${
                profileOpen
                  ? "visible translate-y-0 scale-100 opacity-100"
                  : "invisible -translate-y-1 scale-95 opacity-0"
              }`}
            >
              {/* User Information */}
              <div className="px-3 py-2">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {user?.name || "User"}
                </p>

                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>

              <div className="my-1 border-t border-slate-100" />

              {/* Profile */}
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  const exists = tabs.some((t) => t.path === "/my-profile");
                  openTab({ path: "/my-profile", title: "My Profile", icon: "👤" });
                  if (!exists) {
                    openTab({ path: "/my-profile", title: "My Profile", icon: "👤" });
                  }
                }}
                className="flex w-full items-center gap-3
                rounded-full px-3 py-2.5 text-sm my-3 border border-gray-100 text-slate-700 transition-colors  hover:bg-blue-100 hover:text-indigo-600"
              >
                <FiUser className="h-4 w-4" />
                <span>Profile</span>
              </button>

              {/* Logout */}
              <Button
                type="button"
                onClick={handleLogout}
                isDisabled={isLoggingOut}
                className="mt-1 flex w-full items-center gap-3 border border-gray-100 rounded-full bg-red-50
                 px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiLogOut className="h-4 w-4" />
                <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
              </Button>
            </div>
          </>
        ) : (
          <button
            type="button"
            aria-label="User account"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500"
          >
            <FiUser className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
