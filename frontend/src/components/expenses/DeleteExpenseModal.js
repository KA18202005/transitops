import { AlertTriangle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { formatCurrency } from "@/components/expenses/expenseUtils";

export default function DeleteExpenseModal({ open, expense, onClose, onConfirm, isDeleting }) {
  if (!expense) return null;
  return <Modal open={open} title="Delete expense" onClose={isDeleting ? () => {} : onClose} size="sm"><div className="space-y-5"><div className="flex gap-3 border border-rose-200 bg-rose-50 p-4 text-rose-800"><AlertTriangle className="mt-0.5 shrink-0" size={19} aria-hidden="true" /><p className="text-sm leading-6">This removes the expense from the current local ledger. This action cannot be undone in this session.</p></div><div className="border border-slate-200 bg-slate-50 p-4"><p className="font-semibold text-slate-900">{expense.type} · {formatCurrency(expense.amount)}</p><p className="mt-1 text-sm text-slate-600">{expense.description}</p></div><div className="flex justify-end gap-3"><button type="button" onClick={onClose} disabled={isDeleting} className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">Cancel</button><button type="button" onClick={onConfirm} disabled={isDeleting} className="bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:opacity-60">{isDeleting ? "Deleting…" : "Delete expense"}</button></div></div></Modal>;
}
