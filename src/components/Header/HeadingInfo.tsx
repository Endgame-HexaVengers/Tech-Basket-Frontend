import { FiBell, FiHelpCircle } from "react-icons/fi";
import UserInfo from "./UserInfo";

const HeadingInfo = () => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-4 backdrop-blur-md sm:px-6">
      {/* Title / Brand Placeholder (Optional) */}
      <div className="flex items-center gap-2">
        {/* If needed, add page title or mobile menu trigger here */}
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Notification Button with Indicator Badge */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 active:scale-95 sm:h-10 sm:w-10"
          aria-label="Notifications"
        >
          <FiBell className="h-5 w-5" />
          {/* Notification Indicator Dot */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
        </button>

        {/* Help Button */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 active:scale-95 sm:h-10 sm:w-10"
          aria-label="Help"
        >
          <FiHelpCircle className="h-5 w-5" />
        </button>

        {/* Divider */}
        <div className="mx-1 h-5 w-[1px] bg-slate-200" aria-hidden="true" />

        {/* User Profile Component */}
        <div className="flex items-center">
          <UserInfo />
        </div>
      </div>
    </header>
  );
};

export default HeadingInfo;