import Modal from "@/components/ui/Modal";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate, getMaintenanceDuration } from "@/components/maintenance/maintenanceUtils";

export default function MaintenanceDetailsModal({ open, record, vehicle, onClose }) {
  if (!record) return null;

  return (
    <Modal open={open} title="Maintenance Details" onClose={onClose} size="md">
      <div className="space-y-4">
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-500">Vehicle</div>
              <div className="mt-1 text-base font-semibold text-slate-900">{vehicle ? `${vehicle.registration_number} · ${vehicle.vehicle_name}` : "Unknown"}</div>
            </div>
            <StatusBadge status={record.status} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[20px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Issue</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{record.issue}</div>
          </div>
          <div className="rounded-[20px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Cost</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{formatCurrency(record.maintenance_cost)}</div>
          </div>
          <div className="rounded-[20px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Start Date</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{formatDate(record.start_date)}</div>
          </div>
          <div className="rounded-[20px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">End Date</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{formatDate(record.end_date)}</div>
          </div>
        </div>
        <div className="rounded-[20px] border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Description</div>
          <div className="mt-1 text-sm leading-6 text-slate-700">{record.description}</div>
        </div>
        <div className="rounded-[20px] border border-slate-200 p-4 text-sm text-slate-600">
          Duration: {getMaintenanceDuration(record.start_date, record.end_date)}
        </div>
      </div>
    </Modal>
  );
}
