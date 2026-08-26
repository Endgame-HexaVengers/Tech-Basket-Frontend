import { ChevronRight } from "lucide-react";
import FadeUp from "../FadeUp";

const UserBreadcrumb = () => {
  return (
    <FadeUp className="mb-5 flex items-center gap-2 text-sm">
      <span className="text-gray-500">Admin</span>

      <ChevronRight
        size={15}
        className="text-gray-400"
      />

      <span className="rounded-md bg-blue-50 px-2.5 py-1 font-medium text-blue-600">
        Users
      </span>
    </FadeUp>
  );
};

export default UserBreadcrumb;