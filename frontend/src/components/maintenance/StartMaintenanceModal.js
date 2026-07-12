import Modal from "@/components/ui/Modal";

export default function StartMaintenanceModal({ open, record, onClose, onConfirm, isStarting }) {
  if (!record) return null;

  return (
    <Modal open={open} title="Start Maintenance" onClose={onClose} size="md">
      <div className="space-y-4">
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-medium text-slate-500">Maintenance Request</div>
          <div className="mt-1 text-base font-semibold text-slate-900">{record.issue}</div>
        </div>
        <div className="rounded-[20px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Starting this work will move the maintenance record to In Progress and set the assigned vehicle status to In Shop.
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={isStarting} className="rounded-2xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-70">
            {isStarting ? "Starting..." : "Start Maintenance"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
