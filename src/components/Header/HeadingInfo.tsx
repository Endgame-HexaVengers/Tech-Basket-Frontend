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
    document.documentElement.dataset.theme = shouldUseDark ? "dark" : "light";

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
    document.documentElement.dataset.theme = nextIsDark ? "dark" : "light";
  };

  return (
    <div>
      <header className="flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white px-6 transition-colors duration-200">
        {/* Brand */}
        <div>
          <h2 className="font-semibold text-slate-900">TechBasket ERP</h2>

          <p className="text-xs text-slate-500">
            Inventory & Management System
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* Notification */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Notifications"
          >
            <FiBell className="h-5 w-5" />
          </button>

          {/* Help */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Help"
          >
            <FiHelpCircle className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>

          {/*   USER PROFILE */}
          <UserInfo />
        </div>
      </header>
    </div>
  );
};

export default HeadingInfo;
