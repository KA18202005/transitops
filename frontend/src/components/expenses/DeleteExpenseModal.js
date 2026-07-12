import Modal from "@/components/ui/Modal";

export default function DeleteExpenseModal({ open, expense, onClose, onConfirm, isDeleting }) {
  if (!expense) return null;

  return (
    <Modal open={open} title="Delete Expense" onClose={onClose} size="md">
      <div className="space-y-4">
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-medium text-slate-500">Expense</div>
          <div className="mt-1 text-base font-semibold text-slate-900">{expense.type} · {expense.description}</div>
        </div>
        <div className="rounded-[20px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          This action will remove the expense from the current client-side ledger view.
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={isDeleting} className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70">
            {isDeleting ? "Deleting..." : "Delete Expense"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
