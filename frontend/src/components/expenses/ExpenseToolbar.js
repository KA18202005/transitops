import { Filter, Search, X } from "lucide-react";
import { expenseTypes } from "@/constants/expenseData";
import { getVehicleLabel } from "@/components/expenses/expenseUtils";

const controlClass = "mt-1 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

export default function ExpenseToolbar({ filters, onChange, vehicles, onClearFilters, hasActiveFilters }) {
  return (
    <section className="border border-slate-200 bg-white p-4 shadow-sm" aria-label="Expense filters">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-semibold text-slate-700">
        <Filter size={16} aria-hidden="true" /> Search & filters
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="xl:col-span-2">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Search ledger</span>
          <span className="relative mt-1 block">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} aria-hidden="true" />
            <input value={filters.search} onChange={(event) => onChange("search", event.target.value)} placeholder="Vehicle, trip number, or description" className="w-full border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" aria-label="Search by vehicle, trip number, or description" />
          </span>
        </label>
        <label>
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Expense type</span>
          <select value={filters.type} onChange={(event) => onChange("type", event.target.value)} className={controlClass} aria-label="Filter by expense type">
            <option value="all">All types</option>
            {expenseTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <label>
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Vehicle</span>
          <select value={filters.vehicle} onChange={(event) => onChange("vehicle", event.target.value)} className={controlClass} aria-label="Filter by vehicle">
            <option value="all">All vehicles</option>
            {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{getVehicleLabel(vehicle)}</option>)}
          </select>
        </label>
        <label>
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Trip association</span>
          <select value={filters.association} onChange={(event) => onChange("association", event.target.value)} className={controlClass} aria-label="Filter by trip association">
            <option value="all">All expenses</option>
            <option value="linked">Linked to trip</option>
            <option value="unlinked">Not linked to trip</option>
          </select>
        </label>
      </div>
      <div className="mt-3 flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-end sm:justify-between">
        <label className="w-full sm:w-56">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Month</span>
          <input type="month" value={filters.month} onChange={(event) => onChange("month", event.target.value)} className={controlClass} aria-label="Filter by month" />
        </label>
        {hasActiveFilters ? <button type="button" onClick={onClearFilters} className="inline-flex items-center justify-center gap-2 border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"><X size={16} aria-hidden="true" /> Clear Filters</button> : null}
      </div>
    </section>
  );
}
