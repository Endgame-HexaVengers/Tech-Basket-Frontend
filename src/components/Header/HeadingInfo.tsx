"use client";

import { useEffect, useState } from "react";
import { FiBell, FiHelpCircle, FiMoon, FiSun } from "react-icons/fi";
import UserInfo from "./UserInfo";

const HeadingInfo = () => {
  const [isDark, setIsDark] = useState(false);

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

  return (
    <header className="flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700 dark:bg-slate-900">
      {/* Brand */}
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white">
          TechBasket ERP
        </h2>
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Notification Button */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white sm:h-10 sm:w-10"
          aria-label="Notifications"
        >
          <FiBell className="h-5 w-5" />

          {/* Notification Indicator Dot */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Help */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Help"
        >
          <FiHelpCircle className="h-5 w-5" />
        </button>

        {/* Divider */}
        <div
          className="mx-1 h-5 w-[1px] bg-slate-200 dark:bg-slate-700"
          aria-hidden="true"
        />

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label={
            isDark ? "Switch to light mode" : "Switch to dark mode"
          }
          title={
            isDark ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {isDark ? (
            <FiSun className="h-5 w-5" />
          ) : (
            <FiMoon className="h-5 w-5" />
          )}
        </button>

        {/* User Profile */}
        <UserInfo />
      </div>
    </header>
  );
};

export default HeadingInfo;