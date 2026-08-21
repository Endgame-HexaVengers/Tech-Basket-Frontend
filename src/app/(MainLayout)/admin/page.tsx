export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Admin
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage system administration.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Admin Panel
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Admin related features will appear here.
        </p>
      </div>
    </div>
  );
}