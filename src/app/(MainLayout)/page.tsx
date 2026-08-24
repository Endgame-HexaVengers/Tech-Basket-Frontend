"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

// Icons Imports
import { BiSupport } from "react-icons/bi";
import { FcSettings } from "react-icons/fc";
import { FiBell, FiHelpCircle, FiUser, FiCheckCircle, FiShoppingCart, FiSettings, FiUsers, FiMapPin, FiSliders, FiX } from "react-icons/fi";

interface DashboardShellProps {
  children: ReactNode;
}

interface Tab {
  path: string;
  title: string;
  icon?: ReactNode;
}

// 1. Page Tabs Config
const pageTabs: Record<string, Tab> = {
  "/admin": {
    path: "/admin",
    title: "Admin",
    icon: <FiSettings className="h-4 w-4" />,
  },
  "/approval": {
    path: "/approval",
    title: "Approval",
    icon: <FiCheckCircle className="h-4 w-4" />,
  },
  "/purchase": {
    path: "/purchase",
    title: "Purchase",
    icon: <FiShoppingCart className="h-4 w-4" />,
  },
  "/admin/users-roles": {
    path: "/admin/users-roles",
    title: "Users & Roles",
    icon: <FiUsers className="h-4 w-4" />,
  },
  "/admin/branches-locations": {
    path: "/admin/branches-locations",
    title: "Branches / Locations",
    icon: <FiMapPin className="h-4 w-4" />,
  },
  "/admin/system-config": {
    path: "/admin/system-config",
    title: "System Config",
    icon: <FiSliders className="h-4 w-4" />,
  },
};

const sidebarItems: Tab[] = [
  {
    path: "/approval",
    title: "Approval",
    icon: <FiCheckCircle className="h-4 w-4" />,
  },
  {
    path: "/purchase",
    title: "Purchase",
    icon: <FiShoppingCart className="h-4 w-4" />,
  },
  {
    path: "/admin",
    title: "Admin",
    icon: <FiSettings className="h-4 w-4" />,
  },
];

const adminSubItems: Tab[] = [
  {
    path: "/admin/users-roles",
    title: "Users & Roles",
    icon: <FiUsers className="h-4 w-4" />,
  },
  {
    path: "/admin/branches-locations",
    title: "Branches / Locations",
    icon: <FiMapPin className="h-4 w-4" />,
  },
  {
    path: "/admin/system-config",
    title: "System Config",
    icon: <FiSliders className="h-4 w-4" />,
  },
];

export default function DashboardShell({ children }: DashboardShellProps) {
  // Session & User extraction
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const router = useRouter();
  const pathname = usePathname();
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAdminOpen(true);
    }
  }, [pathname]);

  // Sync active path with tabs
  useEffect(() => {
    if (!pathname) return;

    const tab = pageTabs[pathname];
    if (!tab) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTabs((currentTabs) => {
      const alreadyExists = currentTabs.some((item) => item.path === pathname);
      if (alreadyExists) {
        return currentTabs;
      }
      return [...currentTabs, tab];
    });
  }, [pathname]);

  // Open page
  const openPage = (item: Tab) => {
    const exists = tabs.some((tab) => tab.path === item.path);
    if (!exists) {
      setTabs((currentTabs) => [...currentTabs, item]);
    }
    router.push(item.path);
  };

  // Close tab
  const closeTab = (path: string) => {
    if (path === "/dashboard") {
      return;
    }

    const index = tabs.findIndex((tab) => tab.path === path);
    const newTabs = tabs.filter((tab) => tab.path !== path);

    setTabs(newTabs);

    if (pathname === path) {
      const nextTab = newTabs[index] || newTabs[index - 1] || newTabs[0];
      if (nextTab) {
        router.push(nextTab.path);
      }
    }
  };

  const activateTab = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-[#00175c] text-lg font-bold text-white">
            T
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Tech<span className="text-blue-600">Basket</span>
            </h1>
            <p className="text-xs text-slate-500">ERP Management</p>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto p-3 font-medium text-slate-700">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const active = pathname === item.path;

              if (item.path === "/admin") {
                const isAdminActive = pathname?.startsWith("/admin");

                return (
                  <div key={item.path}>
                    {/* Admin Parent Accordion Button */}
                    <Button
                      type="button"
                      onClick={() => setAdminOpen((prev) => !prev)}
                      className={`flex w-full justify-start items-center gap-3 rounded-md border border-dashed border-slate-300 px-4 py-3 transition-all cursor-pointer ${
                        isAdminActive || adminOpen
                          ? "!bg-[#d2e1fa] font-semibold !text-[#00175c]"
                          : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span className="flex items-center justify-center w-5">{item.icon}</span>
                      <span>{item.title}</span>
                    </Button>

                    {/* Admin Sub Items */}
                    {(adminOpen || isAdminActive) && (
                      <div className="ml-6 mt-2 border-l border-slate-300 pl-3">
                        <div className="space-y-1">
                          {adminSubItems.map((subItem) => {
                            const isSubActive = pathname === subItem.path;

                            return (
                              <Button
                                key={subItem.path}
                                type="button"
                                onClick={() => openPage(subItem)}
                                className={`flex w-full text-left rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm transition-all cursor-pointer items-center justify-start gap-2 ${
                                  isSubActive
                                    ? "!bg-[#d2e1fa] font-semibold !text-[#00175c]"
                                    : "bg-white text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                <span className="flex items-center justify-center">{subItem.icon}</span>
                                <span>{subItem.title}</span>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              {/* Normal Sidebar Items */}
              return (
                <Button
                  key={item.path}
                  type="button"
                  onClick={() => openPage(item)}
                  className={`flex w-full justify-start items-center gap-3 rounded-md border border-dashed border-slate-300 px-4 py-3 transition-all cursor-pointer ${
                    active
                      ? "!bg-[#d2e1fa] font-semibold !text-[#00175c]"
                      : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center justify-center w-5">{item.icon}</span>
                  <span>{item.title}</span>
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Bottom Items */}
        <div className="space-y-2 border-t border-slate-200 p-3">
          <Button
            type="button"
            className="flex w-full justify-start items-center gap-3 rounded-md border border-dashed border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
          >
            <FcSettings className="h-5 w-5" />
            <span>Settings</span>
          </Button>

          <Button
            type="button"
            className="flex w-full justify-start items-center gap-3 rounded-md border border-dashed
             border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
          >
            <BiSupport className="h-5 w-5 text-indigo-600" />
            <span>Support</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="ml-64">
        {/* Header Navbar */}
        <header className="fixed left-64 right-0 top-0 z-40 flex h-16 items-center justify-between border-b
         border-slate-200 bg-white px-6">
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
                    src={user.image}
                    alt={user.name || "User Avatar"}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-indigo-600 to-purple-600 font-bold text-white text-sm">
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

        {/* Tabs  Bar */}
        <div className="fixed left-64 right-0 top-16 z-30 flex h-12 items-end gap-1 overflow-x-auto border-b border-slate-300 bg-[#eceef0] px-3">
          {tabs.map((tab) => {
            const active = pathname === tab.path;

            return (
              <div
                key={tab.path}
                className={`group flex h-10 min-w-[150px] max-w-[220px] shrink-0 items-center gap-2 rounded-t-lg border border-b-0 px-3 ${
                  active
                    ? "border-slate-300 bg-white text-[#00175c]"
                    : "border-transparent bg-[#e6e8ea] text-slate-600 hover:bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => activateTab(tab.path)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span className="shrink-0 text-slate-500">{tab.icon}</span>
                  <span className={`truncate text-sm ${active ? "font-semibold" : "font-medium"}`}>
                    {tab.title}
                  </span>
                </button>

                {active && <span className="h-2 w-2 shrink-0 rounded-full bg-[#00175c]" />}

                {tab.path !== "/dashboard" && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      closeTab(tab.path);
                    }}
                    aria-label={`Close ${tab.title}`}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-slate-400 opacity-0 transition hover:bg-slate-200 hover:text-slate-900 group-hover:opacity-100"
                  >
                    <FiX className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Page Content */}
        <main className="min-h-screen px-6 pb-10 pt-[136px]">{children}</main>
      </div>
    </div>
  );
}