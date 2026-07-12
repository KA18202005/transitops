import { Eye, Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatDate, formatLitres, formatPricePerLitre } from "@/components/fuel/fuelUtils";

export default function FuelTable({ logs, vehicles, trips, onView, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Vehicle</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Trip</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Fuel Station</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Litres</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Cost</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Price/L</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {logs.map((log) => {
              const vehicle = vehicles.find((item) => item.id === log.vehicle_id);
              const trip = trips.find((item) => item.id === log.trip_id);
              return (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-600">{formatDate(log.date)}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    <div className="font-semibold">{vehicle ? `${vehicle.registration_number} · ${vehicle.vehicle_name}` : "Unknown"}</div>
                    <div className="text-xs text-slate-500">{vehicle?.vehicle_type}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{trip ? trip.trip_number : "Not linked"}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{log.fuel_station}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{formatLitres(log.liters)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{formatCurrency(log.cost)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{formatPricePerLitre(log.cost, log.liters)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => onView(log)} className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100" aria-label="View fuel log" title="View">
                        <Eye size={16} />
                      </button>
                      <button type="button" onClick={() => onEdit(log)} className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100" aria-label="Edit fuel log" title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button type="button" onClick={() => onDelete(log)} className="rounded-full border border-slate-200 p-2 text-rose-600 transition hover:bg-rose-50" aria-label="Delete fuel log" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-3 lg:hidden">
        {logs.map((log) => {
          const vehicle = vehicles.find((item) => item.id === log.vehicle_id);
          const trip = trips.find((item) => item.id === log.trip_id);
          return (
            <div key={log.id} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{vehicle ? `${vehicle.registration_number} · ${vehicle.vehicle_name}` : "Unknown"}</div>
                  <div className="mt-1 text-xs text-slate-500">{formatDate(log.date)}</div>
                </div>
                <div className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{formatCurrency(log.cost)}</div>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-600">
                <div className="flex justify-between"><span>Trip</span><span>{trip ? trip.trip_number : "Not linked"}</span></div>
                <div className="flex justify-between"><span>Fuel Station</span><span>{log.fuel_station}</span></div>
                <div className="flex justify-between"><span>Litres</span><span>{formatLitres(log.liters)}</span></div>
                <div className="flex justify-between"><span>Price/L</span><span>{formatPricePerLitre(log.cost, log.liters)}</span></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => onView(log)} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600">View</button>
                <button type="button" onClick={() => onEdit(log)} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600">Edit</button>
                <button type="button" onClick={() => onDelete(log)} className="rounded-2xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600">Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
