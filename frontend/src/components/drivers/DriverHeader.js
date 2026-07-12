import { PlusCircle } from "lucide-react";

export default function DriverHeader({ onAdd }) {
  return (
    <div className="flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-xl lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-100">
          Workforce operations
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Driver Management</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          Manage driver availability, licence compliance, safety performance, and operational status.
        </p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
      >
        <PlusCircle size={18} />
        Add Driver
      </button>
    </div>
  );
}
