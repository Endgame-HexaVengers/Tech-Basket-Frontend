"use client";

import { useEffect, useState } from "react";
import { FiBell, FiMoon, FiSun } from "react-icons/fi";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import UserInfo from "./UserInfo";
import { Button } from "@heroui/react";

interface NotificationItem {
  id: string | number;
  message: string;
  read: boolean;
}

interface CartItem {
  id: string | number;
  name?: string;
  quantity?: number;
}

const HeadingInfo = () => {
  const [isDark, setIsDark] = useState(false);

  // Cart Items
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    [],
  );

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("techbasket-theme");
    const shouldUseDark = savedTheme === "dark";

    document.documentElement.classList.toggle("dark", shouldUseDark);
    document.documentElement.classList.toggle("light", !shouldUseDark);

    document.documentElement.dataset.theme = shouldUseDark
      ? "dark"
      : "light";

    const frameId = window.requestAnimationFrame(() => {
      setIsDark(shouldUseDark);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;

    setIsDark(nextIsDark);

    window.localStorage.setItem(
      "techbasket-theme",
      nextIsDark ? "dark" : "light",
    );

    document.documentElement.classList.toggle("dark", nextIsDark);
    document.documentElement.classList.toggle("light", !nextIsDark);

    document.documentElement.dataset.theme = nextIsDark
      ? "dark"
      : "light";
  };

  // Count only unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <header className="flex h-20 w-full items-center justify-end border-b border-slate-200 bg-white px-6 dark:border-slate-700 dark:bg-slate-900">
  
      {/* Header Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3">

        {/* Notification Button */}
        <button
          type="button"
          className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white sm:h-10 sm:w-10"
          aria-label={
            unreadCount > 0
              ? `${unreadCount} unread notifications`
              : "Notifications"
          }
        >
          <FiBell className="h-5 w-5" />

          {/* Unread Notification Count */}
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Add to Cart Button */}
        <button
          type="button"
          className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white sm:h-10 sm:w-10"
          aria-label={`Cart (${cartItems.length} items)`}
        >
          <MdOutlineLocalGroceryStore className="h-5 w-5" />

          {/* Cart Count */}
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
            {cartItems.length}
          </span>
        </button>

        {/* Divider */}
        <div
          className="mx-1 h-5 w-[1px] bg-slate-200 dark:bg-slate-700"
          aria-hidden="true"
        />

        {/* Theme Toggle */}
        <Button
          isIconOnly
          type="button"
          onPress={toggleTheme}
          variant="ghost"
          className="h-10 w-10 min-w-10 rounded-full text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <FiSun className="h-5 w-5" />
          ) : (
            <FiMoon className="h-5 w-5" />
          )}
        </Button>

        {/* User Profile */}
        <UserInfo />
      </div>
    </header>
  );
};

export default HeadingInfo;