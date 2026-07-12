import { CheckCircle2, Eye, Send, Trash2, XCircle } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import TripMobileCard from "@/components/trips/TripMobileCard";
import { formatDateTime, getCapacityLabel, getCapacityUtilization, getDriverById, getVehicleById } from "@/components/trips/tripUtils";

export default function TripTable({ trips, onView, onEdit, onDispatch, onComplete, onCancel }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Trip Number</th>
              <th className="px-4 py-3 font-semibold">Route</th>
              <th className="px-4 py-3 font-semibold">Vehicle</th>
              <th className="px-4 py-3 font-semibold">Driver</th>
              <th className="px-4 py-3 font-semibold">Cargo</th>
              <th className="px-4 py-3 font-semibold">Planned Distance</th>
              <th className="px-4 py-3 font-semibold">Departure</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {trips.map((trip) => {
              const vehicle = getVehicleById(trip.vehicle_id);
              const driver = getDriverById(trip.driver_id);
              const utilization = getCapacityUtilization(trip.cargo_weight, vehicle?.max_load_capacity);
              return (
                <tr key={trip.id} className="transition hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{trip.trip_number}</div>
                    <div className="mt-1 text-xs text-slate-500">{trip.created_at ? formatDateTime(trip.created_at) : "-"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <span>{trip.source}</span>
                      <span className="text-slate-400">→</span>
                      <span>{trip.destination}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-700">{vehicle?.registration_number || "Unknown"}</div>
                    <div className="text-xs text-slate-500">{vehicle?.vehicle_name || "Unknown"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-700">{driver?.full_name || "Unknown"}</div>
                    <div className="text-xs text-slate-500">{driver?.license_category || "Unknown"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-700">{trip.cargo_weight.toLocaleString()} kg</div>
                    <div className="text-xs text-slate-500">{utilization}% of capacity</div>
                    <div className="mt-1 h-2.5 min-w-[90px] rounded-full bg-slate-200">
                      <div className={`h-2.5 rounded-full ${utilization > 90 ? "bg-rose-500" : utilization >= 75 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(100, utilization)}%` }} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{trip.planned_distance.toLocaleString()} km</td>
                  <td className="px-4 py-3 text-slate-600">{trip.departure_time ? formatDateTime(trip.departure_time) : "Not dispatched"}</td>
                  <td className="px-4 py-3"><StatusBadge status={trip.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" aria-label={`View ${trip.trip_number}`} onClick={() => onView(trip)} className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100">
                        <Eye size={16} />
                      </button>
                      {trip.status === "Draft" && (
                        <>
                          <button type="button" aria-label={`Edit ${trip.trip_number}`} onClick={() => onEdit(trip)} className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100">
                            <Send size={16} />
                          </button>
                          <button type="button" aria-label={`Dispatch ${trip.trip_number}`} onClick={() => onDispatch(trip)} className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100">
                            <Send size={16} />
                          </button>
                          <button type="button" aria-label={`Cancel ${trip.trip_number}`} onClick={() => onCancel(trip)} className="rounded-full border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                      {trip.status === "Dispatched" && (
                        <>
                          <button type="button" aria-label={`Complete ${trip.trip_number}`} onClick={() => onComplete(trip)} className="rounded-full border border-emerald-200 p-2 text-emerald-600 transition hover:bg-emerald-50">
                            <CheckCircle2 size={16} />
                          </button>
                          <button type="button" aria-label={`Cancel ${trip.trip_number}`} onClick={() => onCancel(trip)} className="rounded-full border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50">
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 p-4 lg:hidden">
        {trips.map((trip) => (
          <TripMobileCard key={trip.id} trip={trip} onView={onView} onEdit={onEdit} onDispatch={onDispatch} onComplete={onComplete} onCancel={onCancel} />
        ))}
      </div>
    </div>
  );
}
