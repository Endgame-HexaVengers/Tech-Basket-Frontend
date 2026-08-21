"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BiSupport } from "react-icons/bi";
import { Button } from "@heroui/react";
import { FcSettings } from "react-icons/fc";

interface DashboardShellProps {
    children: ReactNode;
}

interface Tab {
    path: string;
    title: string;
    icon: string;
}

const pageTabs: Record<string, Tab> = {
    "/admin": {
        path: "/admin",
        title: "Admin",
        icon: "⚙",
    },

    "/approval": {
        path: "/approval",
        title: "Purchase Approval",
        icon: "✓",
    },

    "/purchase": {
        path: "/purchase",
        title: "Purchase",
        icon: "🛒",
    },

   
    "/admin/users-roles": {
        path: "/admin/user-role",
        title: "Users & Roles",
        icon: "⚙",
    },

    "/admin/branches-locations": {
        path: "/admin/branches",
        title: "Branches / Locations",
        icon: "⚙",

    },

    "/admin/system-config": {
        path: "/admin/system-config",
        title: "System Config",
        icon: "⚙",
    },
};

const sidebarItems: Tab[] = [

    {
        path: "/approval",
        title: "Approval",
        icon: "✓",
    },

    {
        path: "/purchase",
        title: "Purchase",
        icon: "🛒",
    },

    {
        path: "/admin",
        title: "Admin",
        icon: "⚙",
    },
];

const adminSubItems = [
    {
        path: "/admin/users-roles",
        title: "Users & Roles",
    },

    {
        path: "/admin/branches-locations",
        title: "Branches / Locations",
    },

    {
        path: "/admin/system-config",
        title: "System Config",
    },
];

export default function DashboardShell({
    children,
}: DashboardShellProps) {
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

    // Add current page to tabs
    useEffect(() => {
        if (!pathname) return;

        const tab = pageTabs[pathname];

        if (!tab) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTabs((currentTabs) => {
            const alreadyExists = currentTabs.some(
                (item) => item.path === pathname
            );

            if (alreadyExists) {
                return currentTabs;
            }

            return [...currentTabs, tab];
        });
    }, [pathname]);

    // Open page
    const openPage = (item: Tab) => {
        const exists = tabs.some(
            (tab) => tab.path === item.path
        );

        if (!exists) {
            setTabs((currentTabs) => [
                ...currentTabs,
                item,
            ]);
        }

        router.push(item.path);
    };

    // Close tab
    const closeTab = (path: string) => {
        if (path === "/dashboard") {
            return;
        }

        const index = tabs.findIndex(
            (tab) => tab.path === path
        );

        const newTabs = tabs.filter(
            (tab) => tab.path !== path
        );

        setTabs(newTabs);

        if (pathname === path) {
            const nextTab =
                newTabs[index] ||
                newTabs[index - 1] ||
                newTabs[0];

            router.push(nextTab.path);
        }
    };

    // Activate tab
    const activateTab = (path: string) => {
        router.push(path);
    };

    return (
        <div className="min-h-screen bg-[#f7f9fb] text-slate-900">

            <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">

                {/* Logo */}
                <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00175c] text-lg font-bold text-white">
                        T
                    </div>

                    <div>
                        <h1 className="font-bold text-slate-900">
                            TechBasket
                        </h1>

                        <p className="text-xs text-slate-500">
                            ERP Management
                        </p>
                    </div>

                </div>
                <nav className="flex-1 overflow-y-auto p-3">

                    <div className="space-y-3">

                        {sidebarItems.map((item) => {

                            const active =
                                pathname === item.path;

                            if (item.path === "/admin") {

                                return (
                                    <div key={item.path}>

                                        {/* Admin Button */}

                                        <Button
                                            type="button"
                                            onClick={() => {

                                                setAdminOpen(
                                                    (prev) => !prev
                                                );

                                                openPage(item);
                                            }}
                                            className={`flex w-full items-center gap-3 rounded-md border border-dashed border-slate-200 px-4 py-3 transition-all ${
                                                active ||
                                                adminOpen ||
                                                pathname?.startsWith(
                                                    "/admin/"
                                                )
                                                    ? "bg-[#d2e1fa] font-semibold text-[#00175c]"
                                                    : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                            }`}
                                        >

                                            {/* Icon */}

                                            <span className="w-5 text-center">
                                                {item.icon}
                                            </span>

                                            {/* Title */}

                                            <span>
                                                {item.title}
                                            </span>

                                        </Button>

                                        {(adminOpen ||
                                            pathname?.startsWith(
                                                "/admin/"
                                            )) && (

                                            <div className="ml-12 mt-2 border-l border-slate-300 pl-3">

                                                <div className="space-y-1">

                                                    {adminSubItems.map(
                                                        (subItem) => {

                                                            const subActive =
                                                                pathname ===
                                                                subItem.path;

                                                            return (
                                                                <Button
                                                                    key={
                                                                        subItem.path
                                                                    }
                                                                    type="button"
                                                                    onClick={() => {

                                                                        const tab =
                                                                            pageTabs[
                                                                                subItem
                                                                                    .path
                                                                            ];

                                                                        if (
                                                                            tab
                                                                        ) {
                                                                            openPage(
                                                                                tab
                                                                            );
                                                                        } else {
                                                                            router.push(
                                                                                subItem.path
                                                                            );
                                                                        }
                                                                    }}
                                                                    className={`w-full rounded-md px-2 py-1.5 bg-white border border-dashed text-left text-sm transition-all ${
                                                                        subActive
                                                                            ? "bg-[#e3e8f2] font-semibold text-[#00175c]"
                                                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                                    }`}
                                                                >
                                                                    {
                                                                        subItem.title
                                                                    }
                                                                </Button>
                                                            );
                                                        }
                                                    )}

                                                </div>

                                            </div>
                                        )}

                                    </div>
                                );
                            }

                            return (
                                <Button
                                    key={item.path}
                                    type="button"
                                    onClick={() =>
                                        openPage(item)
                                    }
                                    className={`flex w-full items-center gap-3 rounded-md border border-dashed border-slate-200 bg-white px-4 py-3 transition-all ${
                                        active
                                            ? "bg-[#d2e1fa] font-semibold text-[#00175c]"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                                >

                                    <span className="w-5 text-center">
                                        {item.icon}
                                    </span>

                                    <span>
                                        {item.title}
                                    </span>

                                </Button>
                            );
                        })}

                    </div>

                </nav>

             

                <div className="space-y-3 border-t border-slate-200 p-3">

                    {/* Settings */}

                    <Button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-md border border-dashed border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
                    >
                        <span>
                            <FcSettings />
                        </span>

                        Settings
                    </Button>

                    {/* Support */}

                    <Button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-md border border-dashed border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 hover:bg-slate-100"
                    >
                        <span>
                            <BiSupport />
                        </span>

                        Support
                    </Button>

                </div>

            </aside>

            <div className="ml-64">

                <header className="fixed left-64 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">

                    <div>

                        <h2 className="font-semibold text-slate-900">
                            TechBasket ERP
                        </h2>

                        <p className="text-xs text-slate-500">
                            Inventory & Management System
                        </p>

                    </div>

                    <div className="flex items-center gap-2">

                        {/* Notification */}

                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
                        >
                            🔔
                        </button>

                        {/* Help */}

                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
                        >
                            ?
                        </button>

                        {/* User */}

                        <button
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                            👤
                        </button>

                    </div>

                </header>

                <div className="fixed left-64 right-0 top-16 z-30 flex h-12 items-end gap-1 overflow-x-auto border-b border-slate-300 bg-[#eceef0] px-3">

                    {tabs.map((tab) => {

                        const active =
                            pathname === tab.path;

                        return (
                            <div
                                key={tab.path}
                                className={`group flex h-10 min-w-[150px] max-w-[220px] shrink-0 items-center gap-2 rounded-t-lg border border-b-0 px-3 ${
                                    active
                                        ? "border-slate-300 bg-white text-[#00175c]"
                                        : "border-transparent bg-[#e6e8ea] text-slate-600 hover:bg-white"
                                }`}
                            >

                                {/* Tab body */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        activateTab(
                                            tab.path
                                        )
                                    }
                                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                                >

                                    <span className="shrink-0">
                                        {tab.icon}
                                    </span>

                                    <span
                                        className={`truncate text-sm ${
                                            active
                                                ? "font-semibold"
                                                : "font-medium"
                                        }`}
                                    >
                                        {tab.title}
                                    </span>

                                </button>

                                {/* Active dot */}

                                {active && (
                                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#00175c]" />
                                )}

                                {/* Close button */}

                                {tab.path !==
                                    "/dashboard" && (

                                    <button
                                        type="button"
                                        onClick={(event) => {

                                            event.stopPropagation();

                                            closeTab(
                                                tab.path
                                            );
                                        }}
                                        aria-label={`Close ${tab.title}`}
                                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-slate-200 hover:text-slate-900"
                                    >
                                        ×
                                    </button>

                                )}

                            </div>
                        );
                    })}
                    {/* <button
                        type="button"
                        onClick={() =>
                            openPage(defaultTab)
                        }
                        className="mb-1 ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg text-slate-600 hover:bg-slate-200"
                        aria-label="Open dashboard"
                    >
                        +
                    </button> */}

                </div>

                <main className="min-h-screen px-6 pb-10 pt-[136px]">
                    {children}
                </main>

            </div>

        </div>
    );
}