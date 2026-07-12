import { Filter, Search, X } from "lucide-react";
import { vehicleTypes } from "@/constants/vehicleData";

export default function FuelToolbar({
  searchTerm,
  onSearchChange,
  vehicleTypeFilter,
  onVehicleTypeChange,
  vehicleFilter,
  onVehicleChange,
  tripFilter,
  onTripFilterChange,
  monthFilter,
  onMonthFilterChange,
  vehicles,
  trips,
  onClearFilters,
  hasActiveFilters,
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Search size={16} />
            <input value={searchTerm} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search fuel log" className="w-full bg-transparent outline-none" aria-label="Search fuel logs" />
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Filter size={16} />
            <select value={vehicleTypeFilter} onChange={(event) => onVehicleTypeChange(event.target.value)} className="w-full bg-transparent outline-none" aria-label="Filter by vehicle type">
              <option value="All">All vehicle types</option>
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Filter size={16} />
            <select value={vehicleFilter} onChange={(event) => onVehicleChange(event.target.value)} className="w-full bg-transparent outline-none" aria-label="Filter by vehicle">
              <option value="All">All vehicles</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.registration_number} · {vehicle.vehicle_name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Filter size={16} />
            <select value={tripFilter} onChange={(event) => onTripFilterChange(event.target.value)} className="w-full bg-transparent outline-none" aria-label="Filter by trip association">
              <option value="All">All logs</option>
              <option value="Linked">Linked to trip</option>
              <option value="Unlinked">Not linked to trip</option>
            </select>
          </label>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <label className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <div className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-400">Month</div>
            <input type="month" value={monthFilter} onChange={(event) => onMonthFilterChange(event.target.value)} className="w-full bg-transparent outline-none" aria-label="Filter by month" />
          </label>
          {hasActiveFilters && (
            <button type="button" onClick={onClearFilters} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
