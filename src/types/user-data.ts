export type UserStatus = "Active" | "Inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  branch: string;
  status: UserStatus;
  lastActive: string;
  initials: string;
  avatarColor: string;
}

export const users: User[] = [
  {
    id: "1",
    name: "Chan Badsha",
    email: "chan.b@techbasket.com",
    username: "chan.badsha",
    role: "Inventory Manager",
    branch: "MPL Shop 1316",
    status: "Active",
    lastActive: "2 hours ago",
    initials: "CB",
    avatarColor: "bg-indigo-100 text-indigo-600",
  },
  {
    id: "2",
    name: "Rakib Hasan",
    email: "rakib.h@techbasket.com",
    username: "rakib.hasan",
    role: "Sales Person",
    branch: "Uttara Branch",
    status: "Active",
    lastActive: "5 mins ago",
    initials: "RH",
    avatarColor: "bg-orange-100 text-orange-600",
  },
  {
    id: "3",
    name: "Nusrat Jahan",
    email: "nusrat.j@techbasket.com",
    username: "nusrat.jahan",
    role: "RMA Officer",
    branch: "Dhaka Service Center",
    status: "Inactive",
    lastActive: "12 days ago",
    initials: "NJ",
    avatarColor: "bg-slate-100 text-slate-600",
  },
  {
    id: "4",
    name: "Tanvir Ahmed",
    email: "tanvir.a@techbasket.com",
    username: "tanvir.ahmed",
    role: "Warehouse Staff",
    branch: "Dhaka Main Branch",
    status: "Active",
    lastActive: "30 mins ago",
    initials: "TA",
    avatarColor: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "5",
    name: "Mehedi Hasan",
    email: "mehedi.h@techbasket.com",
    username: "mehedi.hasan",
    role: "Accountant",
    branch: "Gulshan Branch",
    status: "Active",
    lastActive: "1 hour ago",
    initials: "MH",
    avatarColor: "bg-purple-100 text-purple-600",
  },
  {
    id: "6",
    name: "Sadia Islam",
    email: "sadia.i@techbasket.com",
    username: "sadia.islam",
    role: "Admin",
    branch: "Banani Branch",
    status: "Inactive",
    lastActive: "8 days ago",
    initials: "SI",
    avatarColor: "bg-pink-100 text-pink-600",
  },
];