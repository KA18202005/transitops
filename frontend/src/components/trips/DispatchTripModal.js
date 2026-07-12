import Modal from "@/components/ui/Modal";
import { formatDateTime, formatCurrency, getDriverById, getVehicleById } from "@/components/trips/tripUtils";

export default function DispatchTripModal({ open, trip, onClose, onConfirm, isDispatching }) {
  if (!trip) return null;

  const vehicle = getVehicleById(trip.vehicle_id);
  const driver = getDriverById(trip.driver_id);

  return (
    <Modal open={open} title="Dispatch Trip" onClose={onClose} size="md">
      <div className="space-y-4">
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-medium text-slate-500">Trip</div>
          <div className="mt-1 text-base font-semibold text-slate-900">{trip.trip_number} · {trip.source} → {trip.destination}</div>
        </div>
        <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
          <div className="rounded-[20px] border border-slate-200 p-3">
            <div className="text-slate-400">Vehicle</div>
            <div className="mt-1 font-semibold text-slate-900">{vehicle?.registration_number || "Unknown"}</div>
          </div>
          <div className="rounded-[20px] border border-slate-200 p-3">
            <div className="text-slate-400">Driver</div>
            <div className="mt-1 font-semibold text-slate-900">{driver?.full_name || "Unknown"}</div>
          </div>
          <div className="rounded-[20px] border border-slate-200 p-3">
            <div className="text-slate-400">Cargo</div>
            <div className="mt-1 font-semibold text-slate-900">{trip.cargo_weight.toLocaleString()} kg</div>
          </div>
          <div className="rounded-[20px] border border-slate-200 p-3">
            <div className="text-slate-400">Planned distance</div>
            <div className="mt-1 font-semibold text-slate-900">{trip.planned_distance.toLocaleString()} km</div>
          </div>
        </div>
        <div className="rounded-[20px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Dispatching will mark the selected vehicle and driver as On Trip.
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={isDispatching} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
            {isDispatching ? "Dispatching..." : "Dispatch Trip"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
