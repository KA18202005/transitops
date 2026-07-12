export default function DashboardFilters({ filters, onChange }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <label className="rounded-[18px] border border-slate-200 bg-white px-3 py-2.5 shadow-[0_10px_24px_-16px_rgba(15,23,42,0.35)] transition-colors focus-within:border-slate-400">
        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Vehicle type
        </span>
        <select
          value={filters.vehicleType}
          onChange={(event) => onChange("vehicleType", event.target.value)}
          className="w-full bg-transparent text-sm text-slate-700 outline-none"
        >
          <option value="All">All vehicle types</option>
          <option value="Truck">Truck</option>
          <option value="Van">Van</option>
          <option value="Bus">Bus</option>
        </select>
      </label>

      <label className="rounded-[18px] border border-slate-200 bg-white px-3 py-2.5 shadow-[0_10px_24px_-16px_rgba(15,23,42,0.35)] transition-colors focus-within:border-slate-400">
        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Vehicle status
        </span>
        <select
          value={filters.status}
          onChange={(event) => onChange("status", event.target.value)}
          className="w-full bg-transparent text-sm text-slate-700 outline-none"
        >
          <option value="All">All statuses</option>
          <option value="Available">Available</option>
          <option value="On Trip">On Trip</option>
          <option value="In Shop">In Shop</option>
        </select>
      </label>

      <label className="rounded-[18px] border border-slate-200 bg-white px-3 py-2.5 shadow-[0_10px_24px_-16px_rgba(15,23,42,0.35)] transition-colors focus-within:border-slate-400">
        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          Region
        </span>
        <select
          value={filters.region}
          onChange={(event) => onChange("region", event.target.value)}
          className="w-full bg-transparent text-sm text-slate-700 outline-none"
        >
          <option value="All">All regions</option>
          <option value="North">North</option>
          <option value="Central">Central</option>
          <option value="South">South</option>
        </select>
      </label>
    </div>
  );
}
