import { Eye, PencilLine, Trash2 } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import DriverMobileCard from "@/components/drivers/DriverMobileCard";
import { formatDate, getEligibility, getInitials, getLicenceValidity, getSafetyLabel } from "@/components/drivers/driverUtils";

export default function DriverTable({ drivers, onView, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Driver</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Licence Number</th>
              <th className="px-4 py-3 font-semibold">Licence Category</th>
              <th className="px-4 py-3 font-semibold">Licence Expiry</th>
              <th className="px-4 py-3 font-semibold">Safety Score</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Eligibility</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {drivers.map((driver) => {
              const validity = getLicenceValidity(driver.license_expiry);
              return (
                <tr key={driver.id} className="transition hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                        {getInitials(driver.full_name)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{driver.full_name}</div>
                        <div className="text-xs text-slate-500">{driver.license_number}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{driver.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{driver.license_number}</td>
                  <td className="px-4 py-3 text-slate-600">{driver.license_category}</td>
                  <td className="px-4 py-3">
                    <div className={`font-medium ${validity === "Expired" ? "text-rose-600" : validity === "Expiring soon" ? "text-amber-600" : "text-emerald-600"}`}>
                      {formatDate(driver.license_expiry)}
                    </div>
                    <div className="text-xs text-slate-500">{validity}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold text-slate-700">{driver.safety_score}</div>
                      <div className="h-2.5 min-w-[80px] rounded-full bg-slate-200">
                        <div className={`h-2.5 rounded-full ${driver.safety_score >= 90 ? "bg-emerald-500" : driver.safety_score >= 75 ? "bg-sky-500" : "bg-amber-500"}`} style={{ width: `${driver.safety_score}%` }} />
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{getSafetyLabel(driver.safety_score)}</div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={driver.status} /></td>
                  <td className="px-4 py-3 text-slate-600">{getEligibility(driver)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" aria-label={`View ${driver.full_name}`} onClick={() => onView(driver)} className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100">
                        <Eye size={16} />
                      </button>
                      <button type="button" aria-label={`Edit ${driver.full_name}`} onClick={() => onEdit(driver)} className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100">
                        <PencilLine size={16} />
                      </button>
                      <button type="button" aria-label={`Delete ${driver.full_name}`} onClick={() => onDelete(driver)} className="rounded-full border border-slate-200 p-2 text-rose-600 transition hover:bg-rose-50">
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
      <div className="space-y-3 p-4 lg:hidden">
        {drivers.map((driver) => (
          <DriverMobileCard key={driver.id} driver={driver} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
