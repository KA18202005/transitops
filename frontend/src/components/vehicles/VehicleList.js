import { PencilLine, Trash2, Search } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function VehicleList({ vehicles, onEdit, onDelete, onSearchChange, searchTerm, totalPages, currentPage, onPageChange }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
          <Search size={16} />
          <input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search vehicles"
            className="w-full bg-transparent outline-none md:w-64"
          />
        </div>
        <div className="text-sm text-slate-500">{vehicles.length} visible vehicles</div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Vehicle</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Region</th>
                <th className="px-4 py-3 font-semibold">Capacity</th>
                <th className="px-4 py-3 font-semibold">Odometer</th>
                <th className="px-4 py-3 font-semibold">Cost</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="transition hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{vehicle.vehicle_name}</div>
                    <div className="text-xs text-slate-500">{vehicle.registration_number}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{vehicle.vehicle_type}</td>
                  <td className="px-4 py-3 text-slate-600">{vehicle.region}</td>
                  <td className="px-4 py-3 text-slate-600">{vehicle.max_load_capacity.toLocaleString()} kg</td>
                  <td className="px-4 py-3 text-slate-600">{vehicle.current_odometer.toLocaleString()} km</td>
                  <td className="px-4 py-3 text-slate-600">{currency.format(vehicle.acquisition_cost)}</td>
                  <td className="px-4 py-3"><StatusBadge status={vehicle.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => onEdit(vehicle)} className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100">
                        <PencilLine size={16} />
                      </button>
                      <button onClick={() => onDelete(vehicle.id)} className="rounded-full border border-slate-200 p-2 text-rose-600 transition hover:bg-rose-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="rounded-[20px] border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">{vehicle.vehicle_name}</div>
                  <div className="text-sm text-slate-500">{vehicle.registration_number}</div>
                </div>
                <StatusBadge status={vehicle.status} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Type</div>
                  <div>{vehicle.vehicle_type}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Region</div>
                  <div>{vehicle.region}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Capacity</div>
                  <div>{vehicle.max_load_capacity.toLocaleString()} kg</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Odometer</div>
                  <div>{vehicle.current_odometer.toLocaleString()} km</div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => onEdit(vehicle)} className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                  Edit
                </button>
                <button onClick={() => onDelete(vehicle.id)} className="flex-1 rounded-2xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-slate-500">Page {currentPage} of {totalPages}</div>
        <div className="flex gap-2">
          <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-50">
            Previous
          </button>
          <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
