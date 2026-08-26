"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiBriefcase, FiEdit2, FiMail, FiMapPin, FiShield, FiUsers } from "react-icons/fi";

const MyProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const user = session?.user;
  const userRecord = user as (typeof user & { branch?: string; role?: string }) | undefined;
  const name = user?.name || "My Profile";
  const initial = name.trim().charAt(0).toUpperCase() || "U";
  const branch = userRecord?.branch || "MPL Shop 1316";
  const role = userRecord?.role || "Inventory Manager";
  const username = `@${name.toLowerCase().replace(/\s+/g, "")}`;

  if (isPending) return <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center bg-[#f7f9fc] text-sm text-slate-500">Loading profile...</div>;

  return (
    <main className="min-h-[calc(100vh-7rem)] bg-[#f7f9fc] px-4 py-6 text-[#0f172a] sm:px-7 lg:px-10">
      <div className="mx-auto max-w-295">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => router.back()} aria-label="Go back" className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"><FiArrowLeft /></button>
            <div><div className="flex items-center gap-2"><h1 className="text-xl font-bold sm:text-2xl">{name}</h1><span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">● Active</span></div><p className="text-xs text-slate-500">{username}</p></div>
          </div>
          <div className="flex gap-2"><button type="button" className="flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-xs font-medium"><FiEdit2 /> Edit User</button><button type="button" className="flex h-9 items-center gap-2 rounded-md bg-[#173b9b] px-3 text-xs font-medium text-white">Change Status <FiUsers /></button></div>
        </div>

        <section className="mt-7 grid gap-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-4 sm:p-5">
          <div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-md bg-indigo-100 text-xl font-bold text-indigo-700">{user?.image ? <Image src={user.image} alt={name} width={56} height={56} className="h-full w-full object-cover" /> : initial}</div><Summary label="Username" value={username} /></div>
          <Summary icon={<FiBriefcase />} label="Role" value={role} /><Summary icon={<FiMapPin />} label="Branch" value={branch} /><Summary icon={<FiMail />} label="Email" value={user?.email || "-"} />
        </section>

        <nav className="mt-5 flex gap-7 border-b border-slate-200 text-xs font-medium text-slate-500"><button type="button" className="border-b-2 border-[#173b9b] pb-3 text-[#173b9b]">Overview</button><button type="button" className="pb-3">Access &amp; Branch</button><button type="button" className="pb-3">Activity</button><button type="button" className="pb-3">Audit Logs</button></nav>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><h2 className="text-sm font-semibold">Personal Information</h2><div className="mt-4 grid gap-2 sm:grid-cols-2"><Info label="Full Name" value={name} /><Info label="Username" value={username} /><Info label="Email" value={user?.email || "-"} /><Info label="Phone" value="+1 (555) 019-2834" /><Info label="User ID" value={user?.id || "USR-8892-XTZ"} wide /></div></section>
          <div className="space-y-4"><section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><h2 className="text-sm font-semibold">Account Status</h2><div className="mt-4 divide-y divide-slate-100 text-[11px]"><Status label="Status" value="Active" badge /><Status label="Created" value="Oct 12, 2023" /><Status label="Last Active" value="2 hours ago" /></div></section><section className="rounded-lg border border-slate-200 border-l-2 border-l-[#315bd6] bg-white p-4 shadow-sm sm:p-5"><h2 className="text-sm font-semibold">Branch Access</h2><p className="mt-1 flex items-center gap-1 text-[9px] text-red-600"><FiShield /> Restricted to One Branch</p><div className="mt-4 rounded-md border border-indigo-100 bg-indigo-50/60 p-3"><p className="flex items-center gap-2 text-[11px] font-semibold"><FiMapPin className="text-indigo-600" />{branch}</p><p className="ml-6 text-[9px] text-slate-500">Primary Assignment</p></div><button type="button" className="mt-3 h-8 w-full rounded border border-slate-300 text-[10px] font-medium">Change Assigned Branch</button></section></div>
        </div>
      </div>
    </main>
  );
};

const Summary = ({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) => <div className="flex min-w-0 items-start gap-2"><span className="mt-0.5 text-slate-500">{icon}</span><div className="min-w-0"><p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 truncate text-xs text-slate-800">{value}</p></div></div>;
const Info = ({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) => <div className={`rounded-md bg-slate-100 px-3 py-2.5 ${wide ? "sm:col-span-2" : ""}`}><p className="text-[9px] font-semibold text-slate-500">{label}</p><p className="mt-1 truncate text-[10px] text-slate-800">{value}</p></div>;
const Status = ({ label, value, badge = false }: { label: string; value: string; badge?: boolean }) => <div className="flex items-center justify-between py-2"><span className="text-slate-500">{label}</span>{badge ? <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[9px] font-semibold text-indigo-700">{value}</span> : <span>{value}</span>}</div>;

export default MyProfilePage;