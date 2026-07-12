import { CheckCircle2, Eye, Route, Send, Trash2, XCircle } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDateTime, formatCurrency, getCapacityLabel, getCapacityUtilization, getDriverById, getVehicleById } from "@/components/trips/tripUtils";

export default function TripMobileCard({ trip, onView, onEdit, onDispatch, onComplete, onCancel }) {
  const vehicle = getVehicleById(trip.vehicle_id);
  const driver = getDriverById(trip.driver_id);
  const utilization = getCapacityUtilization(trip.cargo_weight, vehicle?.max_load_capacity);

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-slate-900">{trip.trip_number}</div>
          <div className="mt-1 text-sm text-slate-500">{trip.source} → {trip.destination}</div>
        </div>
        <StatusBadge status={trip.status} />
      </div>
      <div className="mt-4 space-y-3 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Vehicle</span>
          <span className="font-medium text-slate-700">{vehicle?.registration_number || "Unknown"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Driver</span>
          <span className="font-medium text-slate-700">{driver?.full_name || "Unknown"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Cargo</span>
          <span className="font-medium text-slate-700">{trip.cargo_weight.toLocaleString()} kg</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Departure</span>
          <span className="font-medium text-slate-700">{trip.departure_time ? formatDateTime(trip.departure_time) : "Not dispatched"}</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Capacity utilization</span>
            <span className="font-semibold text-slate-700">{utilization}% · {getCapacityLabel(utilization)}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => onView(trip)} className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
          <span className="inline-flex items-center gap-2"><Eye size={16} />View</span>
        </button>
        {trip.status === "Draft" && (
          <>
            <button type="button" onClick={() => onEdit(trip)} className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
              Edit
            </button>
            <button type="button" onClick={() => onDispatch(trip)} className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
              <span className="inline-flex items-center gap-2"><Send size={16} />Dispatch</span>
            </button>
            <button type="button" onClick={() => onCancel(trip)} className="flex-1 rounded-2xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600">
              <span className="inline-flex items-center gap-2"><Trash2 size={16} />Cancel</span>
            </button>
          </>
        )}
        {trip.status === "Dispatched" && (
          <>
            <button type="button" onClick={() => onComplete(trip)} className="flex-1 rounded-2xl border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700">
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} />Complete</span>
            </button>
            <button type="button" onClick={() => onCancel(trip)} className="flex-1 rounded-2xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600">
              <span className="inline-flex items-center gap-2"><XCircle size={16} />Cancel</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
