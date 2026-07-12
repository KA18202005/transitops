import Modal from "@/components/ui/Modal";
import { formatCurrency, formatDate } from "@/components/expenses/expenseUtils";

export default function ExpenseDetailsModal({ open, expense, vehicle, trip, onClose }) {
  if (!expense) return null;

  return (
    <Modal open={open} title="Expense Details" onClose={onClose} size="md">
      <div className="space-y-4">
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-medium text-slate-500">Expense Type</div>
          <div className="mt-1 text-base font-semibold text-slate-900">{expense.type}</div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[20px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Amount</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{formatCurrency(expense.amount)}</div>
          </div>
          <div className="rounded-[20px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Date</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{formatDate(expense.date)}</div>
          </div>
          <div className="rounded-[20px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Vehicle</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{vehicle ? `${vehicle.registration_number} · ${vehicle.vehicle_name}` : "Unknown"}</div>
          </div>
          <div className="rounded-[20px] border border-slate-200 p-4">
            <div className="text-sm font-medium text-slate-500">Trip</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{trip ? trip.trip_number : "Not linked"}</div>
          </div>
        </div>
        <div className="rounded-[20px] border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Description</div>
          <div className="mt-1 text-sm leading-6 text-slate-700">{expense.description}</div>
        </div>
        <div className="rounded-[20px] border border-slate-200 p-4 text-sm text-slate-600">
          Record ID: {expense.id}
        </div>
      </div>
    </Modal>
  );
}
