import Modal from "@/components/ui/Modal";

export default function DeleteDriverModal({ open, driver, onClose, onConfirm, isDeleting }) {
  if (!driver) return null;

  return (
    <Modal open={open} title="Delete Driver" onClose={onClose} size="md">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Delete <span className="font-semibold text-slate-900">{driver.full_name}</span> from this session? This action cannot be undone in the current session.
        </p>
        <div className="rounded-[20px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <div className="font-semibold">Licence number</div>
          <div className="mt-1">{driver.license_number}</div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={isDeleting} className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70">
            {isDeleting ? "Deleting..." : "Delete Driver"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
