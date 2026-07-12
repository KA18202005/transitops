import Modal from "@/components/ui/Modal";
import { formatCurrency, formatDateTime, getCapacityLabel, getCapacityUtilization, getDriverById, getVehicleById } from "@/components/trips/tripUtils";

export default function TripDetailsModal({ open, trip, onClose }) {
  if (!trip) return null;

  const vehicle = getVehicleById(trip.vehicle_id);
  const driver = getDriverById(trip.driver_id);
  const utilization = getCapacityUtilization(trip.cargo_weight, vehicle?.max_load_capacity);

  return (
    <Modal open={open} title="Trip Details" onClose={onClose} size="lg">
      <div className="space-y-5">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-medium text-slate-500">Trip Number</div>
          <div className="mt-1 text-lg font-semibold text-slate-900">{trip.trip_number}</div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Status</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{trip.status}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Route</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{trip.source} → {trip.destination}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Vehicle</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{vehicle?.registration_number || "Not available"} · {vehicle?.vehicle_name || "Not available"}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Driver</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{driver?.full_name || "Not available"}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Cargo Weight</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{trip.cargo_weight ? `${trip.cargo_weight.toLocaleString()} kg` : "Not available"}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Capacity Utilization</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{utilization}% · {getCapacityLabel(utilization)}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Planned Distance</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{trip.planned_distance ? `${trip.planned_distance.toLocaleString()} km` : "Not available"}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Actual Distance</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{trip.actual_distance ? `${trip.actual_distance.toLocaleString()} km` : "Not available"}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Fuel Used</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{trip.fuel_used ? `${trip.fuel_used.toLocaleString()} L` : "Not available"}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Revenue</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{formatCurrency(trip.revenue)}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Departure Time</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{trip.departure_time ? formatDateTime(trip.departure_time) : "Not dispatched"}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Arrival Time</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{trip.arrival_time ? formatDateTime(trip.arrival_time) : "Not completed"}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 p-4 md:col-span-2">
            <div className="text-sm font-medium text-slate-500">Created</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{trip.created_at ? formatDateTime(trip.created_at) : "Not available"}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
