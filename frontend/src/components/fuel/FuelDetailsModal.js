import Modal from "@/components/ui/Modal";
import { formatCurrency, formatDate, formatLitres, formatPricePerLitre } from "@/components/fuel/fuelUtils";

export default function FuelDetailsModal({ open, log, vehicle, trip, onClose }) {
  if (!log) return null;

  return (
    <Modal open={open} title="Fuel Log Details" onClose={onClose} size="md">
      <div className="space-y-4">
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-medium text-slate-500">Vehicle</div>
          <div className="mt-1 text-base font-semibold text-slate-900">{vehicle ? `${vehicle.registration_number} · ${vehicle.vehicle_name}` : "Unknown"}</div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[20px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Date</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{formatDate(log.date)}</div>
          </div>
          <div className="rounded-[20px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Trip</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{trip ? trip.trip_number : "Not linked"}</div>
          </div>
          <div className="rounded-[20px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Fuel Station</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{log.fuel_station}</div>
          </div>
          <div className="rounded-[20px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Litres</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{formatLitres(log.liters)}</div>
          </div>
          <div className="rounded-[20px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Total Cost</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{formatCurrency(log.cost)}</div>
          </div>
          <div className="rounded-[20px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Price per Litre</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{formatPricePerLitre(log.cost, log.liters)}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
