import {
  CircleCheck,
  CircleX,
  Users,
  UserRoundX,
} from "lucide-react";
import FadeUp from "../FadeUp";


const UserStats = () => {
  const totalUsers = 48;
  const unassignedUsers = 2;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Users",
      value: 42,
      icon: CircleCheck,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Inactive Users",
      value: 4,
      icon: CircleX,
      iconBg: "bg-red-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Unassigned",
      value: unassignedUsers,
      icon: UserRoundX,
      iconBg: "bg-gray-100",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <FadeUp className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
            >
              <Icon
                size={20}
                className={stat.iconColor}
              />
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">
                {stat.title}
              </p>

              <p className="mt-1 text-xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </FadeUp>
  );
};

export default UserStats;