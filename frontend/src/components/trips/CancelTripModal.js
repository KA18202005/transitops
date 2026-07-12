import Modal from "@/components/ui/Modal";

export default function CancelTripModal({ open, trip, onClose, onConfirm, isCancelling }) {
  if (!trip) return null;

  return (
    <Modal open={open} title="Cancel Trip" onClose={onClose} size="md">
      <div className="space-y-4">
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-medium text-slate-500">Trip</div>
          <div className="mt-1 text-base font-semibold text-slate-900">{trip.trip_number} · {trip.source} → {trip.destination}</div>
        </div>
        <div className="rounded-[20px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Cancelling this trip will update its status and restore the assigned vehicle and driver when the trip was already dispatched.
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={isCancelling} className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70">
            {isCancelling ? "Cancelling..." : "Cancel Trip"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
