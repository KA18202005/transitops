import Modal from "@/components/ui/Modal";
import { formatDate, getEligibility, getLicenceValidity, getSafetyLabel } from "@/components/drivers/driverUtils";

export default function DriverDetailsModal({ open, driver, onClose }) {
  if (!driver) return null;

  const validity = getLicenceValidity(driver.license_expiry);

  return (
    <Modal open={open} title="Driver Details" onClose={onClose} size="md">
      <div className="space-y-5">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-medium text-slate-500">Full Name</div>
          <div className="mt-1 text-lg font-semibold text-slate-900">{driver.full_name}</div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Phone</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{driver.phone}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Status</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{driver.status}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Licence Number</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{driver.license_number}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Licence Category</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{driver.license_category}</div>
          </div>
          <div className="rounded-[24px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Licence Expiry</div>
            <div className={`mt-1 text-sm font-semibold ${validity === "Expired" ? "text-rose-600" : validity === "Expiring soon" ? "text-amber-600" : "text-emerald-600"}`}>
              {formatDate(driver.license_expiry)} · {validity}
            </div>
          </div>
          <div className="rounded-[24px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Safety Score</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{driver.safety_score}/100 · {getSafetyLabel(driver.safety_score)}</div>
          </div>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-medium text-slate-500">Assignment Eligibility</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">{getEligibility(driver)}</div>
        </div>
      </div>
    </Modal>
  );
}
