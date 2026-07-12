import { Eye, PencilLine, Trash2 } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDate, getEligibility, getInitials, getLicenceValidity, getSafetyLabel } from "@/components/drivers/driverUtils";

export default function DriverMobileCard({ driver, onView, onEdit, onDelete }) {
  const validity = getLicenceValidity(driver.license_expiry);

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {getInitials(driver.full_name)}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{driver.full_name}</div>
            <div className="text-sm text-slate-500">{driver.phone}</div>
          </div>
        </div>
        <StatusBadge status={driver.status} />
      </div>
      <div className="mt-4 space-y-3 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Licence</span>
          <span className="font-medium text-slate-700">{driver.license_number}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Category</span>
          <span className="font-medium text-slate-700">{driver.license_category}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Expiry</span>
          <span className={`font-medium ${validity === "Expired" ? "text-rose-600" : validity === "Expiring soon" ? "text-amber-600" : "text-emerald-600"}`}>
            {formatDate(driver.license_expiry)} · {validity}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Safety</span>
          <span className="font-medium text-slate-700">{driver.safety_score}/100 · {getSafetyLabel(driver.safety_score)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Eligibility</span>
          <span className="font-medium text-slate-700">{getEligibility(driver)}</span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => onView(driver)} className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
          <span className="inline-flex items-center gap-2"><Eye size={16} />View</span>
        </button>
        <button type="button" onClick={() => onEdit(driver)} className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
          <span className="inline-flex items-center gap-2"><PencilLine size={16} />Edit</span>
        </button>
        <button type="button" onClick={() => onDelete(driver)} className="flex-1 rounded-2xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600">
          <span className="inline-flex items-center gap-2"><Trash2 size={16} />Delete</span>
        </button>
      </div>
    </div>
  );
}
