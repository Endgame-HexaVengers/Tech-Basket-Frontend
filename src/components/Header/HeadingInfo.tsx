import Image from "next/image";
import React from "react";
import { FiBell, FiHelpCircle } from "react-icons/fi";
import UserInfo from "./UserInfo";

const HeadingInfo = () => {
  return (
    <div>
      <header className="flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white px-6">
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

          {/*   USER PROFILE */}
          <UserInfo />
        </div>
      </header>
    </div>
  );
};

export default HeadingInfo;
