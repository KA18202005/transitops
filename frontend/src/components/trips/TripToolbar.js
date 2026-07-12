import { Filter, Search, X } from "lucide-react";
import { vehicleTypes } from "@/constants/vehicleData";

export default function TripToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  vehicleTypeFilter,
  onVehicleTypeChange,
  regionFilter,
  onRegionChange,
  onClearFilters,
  hasActiveFilters,
}) {
  const regions = ["North", "South", "East", "West", "Central"];

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row">
          <label className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Search size={16} />
            <input value={searchTerm} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search trip, route, vehicle, or driver" className="w-full bg-transparent outline-none" aria-label="Search trips" />
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Filter size={16} />
            <select value={statusFilter} onChange={(event) => onStatusChange(event.target.value)} className="bg-transparent outline-none" aria-label="Filter by trip status">
              <option value="All">All status</option>
              <option value="Draft">Draft</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Filter size={16} />
            <select value={vehicleTypeFilter} onChange={(event) => onVehicleTypeChange(event.target.value)} className="bg-transparent outline-none" aria-label="Filter by vehicle type">
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
            <select value={regionFilter} onChange={(event) => onRegionChange(event.target.value)} className="bg-transparent outline-none" aria-label="Filter by region">
              <option value="All">All regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>
        </div>
        {hasActiveFilters && (
          <button type="button" onClick={onClearFilters} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            <X size={16} />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
