import { Filter, Search, X } from "lucide-react";
import { driverStatuses, licenseCategories } from "@/constants/driverData";

export default function DriverToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  validityFilter,
  onValidityChange,
  onClearFilters,
  hasActiveFilters,
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row">
          <label className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Search size={16} />
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by name, phone, or licence"
              className="w-full bg-transparent outline-none"
              aria-label="Search drivers"
            />
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Filter size={16} />
            <select
              value={statusFilter}
              onChange={(event) => onStatusChange(event.target.value)}
              className="bg-transparent outline-none"
              aria-label="Filter by driver status"
            >
              <option value="All">All status</option>
              {driverStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Filter size={16} />
            <select
              value={categoryFilter}
              onChange={(event) => onCategoryChange(event.target.value)}
              className="bg-transparent outline-none"
              aria-label="Filter by licence category"
            >
              <option value="All">All categories</option>
              {licenseCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Filter size={16} />
            <select
              value={validityFilter}
              onChange={(event) => onValidityChange(event.target.value)}
              className="bg-transparent outline-none"
              aria-label="Filter by licence validity"
            >
              <option value="All">All licences</option>
              <option value="Valid">Valid</option>
              <option value="Expiring soon">Expiring soon</option>
              <option value="Expired">Expired</option>
            </select>
          </label>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <X size={16} />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
