import { Eye, Pencil, PlayCircle, Trash2, CheckCircle2 } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate, getMaintenanceDuration } from "@/components/maintenance/maintenanceUtils";

export default function MaintenanceTable({ records, vehicles, onView, onEdit, onStart, onComplete, onDelete }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Vehicle</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Issue</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Start Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">End Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Cost</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Duration</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {records.map((record) => {
              const vehicle = vehicles.find((item) => item.id === record.vehicle_id);
              return (
                <tr key={record.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700">
                    <div className="font-semibold">{vehicle ? `${vehicle.registration_number} · ${vehicle.vehicle_name}` : "Unknown"}</div>
                    <div className="text-xs text-slate-500">{vehicle?.vehicle_type}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    <div className="font-medium">{record.issue}</div>
                    <div className="text-xs text-slate-500">{record.description}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{formatDate(record.start_date)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{formatDate(record.end_date)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{formatCurrency(record.maintenance_cost)}</td>
                  <td className="px-4 py-3"><StatusBadge status={record.status} /></td>
                  <td className="px-4 py-3 text-sm text-slate-600">{getMaintenanceDuration(record.start_date, record.end_date)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => onView(record)} className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100" aria-label="View maintenance" title="View">
                        <Eye size={16} />
                      </button>
                      {record.status === "Pending" ? (
                        <>
                          <button type="button" onClick={() => onEdit(record)} className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100" aria-label="Edit maintenance" title="Edit">
                            <Pencil size={16} />
                          </button>
                          <button type="button" onClick={() => onStart(record)} className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100" aria-label="Start maintenance" title="Start">
                            <PlayCircle size={16} />
                          </button>
                          <button type="button" onClick={() => onDelete(record)} className="rounded-full border border-slate-200 p-2 text-rose-600 transition hover:bg-rose-50" aria-label="Delete maintenance" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : null}
                      {record.status === "In Progress" ? (
                        <button type="button" onClick={() => onComplete(record)} className="rounded-full border border-slate-200 p-2 text-emerald-600 transition hover:bg-emerald-50" aria-label="Complete maintenance" title="Complete">
                          <CheckCircle2 size={16} />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-3 lg:hidden">
        {records.map((record) => {
          const vehicle = vehicles.find((item) => item.id === record.vehicle_id);
          return (
            <div key={record.id} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{vehicle ? `${vehicle.registration_number} · ${vehicle.vehicle_name}` : "Unknown"}</div>
                  <div className="mt-1 text-xs text-slate-500">{record.issue}</div>
                </div>
                <StatusBadge status={record.status} />
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-600">
                <div className="flex justify-between"><span>Start</span><span>{formatDate(record.start_date)}</span></div>
                <div className="flex justify-between"><span>End</span><span>{formatDate(record.end_date)}</span></div>
                <div className="flex justify-between"><span>Cost</span><span>{formatCurrency(record.maintenance_cost)}</span></div>
                <div className="flex justify-between"><span>Duration</span><span>{getMaintenanceDuration(record.start_date, record.end_date)}</span></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => onView(record)} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600">View</button>
                {record.status === "Pending" ? (
                  <>
                    <button type="button" onClick={() => onEdit(record)} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600">Edit</button>
                    <button type="button" onClick={() => onStart(record)} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600">Start</button>
                    <button type="button" onClick={() => onDelete(record)} className="rounded-2xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600">Delete</button>
                  </>
                ) : null}
                {record.status === "In Progress" ? <button type="button" onClick={() => onComplete(record)} className="rounded-2xl border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700">Complete</button> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
