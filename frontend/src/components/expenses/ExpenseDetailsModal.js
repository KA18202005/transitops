import Modal from "@/components/ui/Modal";
import { formatCurrency, formatDate, getVehicleLabel } from "@/components/expenses/expenseUtils";

export default function ExpenseDetailsModal({ open, expense, vehicle, trip, onClose }) {
  if (!expense) return null;
  const fields = [["Expense type", expense.type], ["Amount", formatCurrency(expense.amount)], ["Vehicle", getVehicleLabel(vehicle)], ["Trip", trip?.trip_number || "Not linked"], ["Date", formatDate(expense.date)], ["Expense ID", expense.id]];
  return <Modal open={open} title="Expense details" onClose={onClose} size="md"><div className="grid gap-3 sm:grid-cols-2">{fields.map(([label, value]) => <div key={label} className="border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">{label}</p><p className="mt-2 break-words text-sm font-semibold text-slate-900">{value}</p></div>)}</div><div className="mt-3 border border-slate-200 p-4"><p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Description</p><p className="mt-2 text-sm leading-6 text-slate-700">{expense.description}</p></div></Modal>;
}
