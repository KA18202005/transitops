import { Eye, Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatDate, getExpenseTypeTone, getVehicleLabel } from "@/components/expenses/expenseUtils";

function ActionButton({ label, onClick, tone = "slate", children }) {
  const classes = tone === "rose" ? "border-rose-200 text-rose-700 hover:bg-rose-50" : "border-slate-200 text-slate-600 hover:bg-slate-100";
  return <button type="button" onClick={onClick} className={`inline-flex items-center justify-center gap-1.5 border px-2.5 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-300 ${classes}`} aria-label={label}>{children}</button>;
}

export default function ExpenseTable({ expenses, vehicles, trips, onView, onEdit, onDelete }) {
  const resolve = (expense) => ({ vehicle: vehicles.find((item) => String(item.id) === String(expense.vehicle_id)), trip: trips.find((item) => String(item.id) === String(expense.trip_id)) });

  return (
    <section className="overflow-hidden border border-slate-200 bg-white shadow-sm" aria-label="Expense ledger">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[960px] divide-y divide-slate-200">
          <thead className="bg-slate-900 text-left">
            <tr>{["Date", "Expense Type", "Vehicle", "Trip", "Description", "Amount", "Actions"].map((heading) => <th key={heading} scope="col" className={`px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-300 ${heading === "Actions" ? "text-right" : ""}`}>{heading}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((expense) => {
              const { vehicle, trip } = resolve(expense);
              return <tr key={expense.id} className="transition hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{formatDate(expense.date)}</td>
                <td className="px-4 py-4"><span className={`inline-flex border px-2 py-1 text-xs font-bold ${getExpenseTypeTone(expense.type)}`}>{expense.type}</span></td>
                <td className="px-4 py-4 text-sm font-semibold text-slate-800">{getVehicleLabel(vehicle)}</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{trip?.trip_number || "Not linked"}</td>
                <td className="max-w-xs px-4 py-4 text-sm leading-5 text-slate-600">{expense.description}</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-slate-950">{formatCurrency(expense.amount)}</td>
                <td className="px-4 py-4"><div className="flex justify-end gap-1"><ActionButton label={`View ${expense.id}`} onClick={() => onView(expense)}><Eye size={15} aria-hidden="true" /> View</ActionButton><ActionButton label={`Edit ${expense.id}`} onClick={() => onEdit(expense)}><Pencil size={15} aria-hidden="true" /> Edit</ActionButton><ActionButton label={`Delete ${expense.id}`} onClick={() => onDelete(expense)} tone="rose"><Trash2 size={15} aria-hidden="true" /> Delete</ActionButton></div></td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 p-3 lg:hidden">
        {expenses.map((expense) => {
          const { vehicle, trip } = resolve(expense);
          return <article key={expense.id} className="border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3"><div><span className={`inline-flex border px-2 py-1 text-xs font-bold ${getExpenseTypeTone(expense.type)}`}>{expense.type}</span><p className="mt-2 text-sm text-slate-500">{formatDate(expense.date)}</p></div><p className="text-lg font-bold text-slate-950">{formatCurrency(expense.amount)}</p></div>
            <dl className="mt-4 grid gap-3 border-y border-slate-200 py-3 text-sm"><div><dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Vehicle</dt><dd className="mt-1 font-semibold text-slate-800">{getVehicleLabel(vehicle)}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Trip</dt><dd className="font-medium text-slate-700">{trip?.trip_number || "Not linked"}</dd></div><div><dt className="text-slate-500">Description</dt><dd className="mt-1 leading-5 text-slate-700">{expense.description}</dd></div></dl>
            <div className="mt-3 flex flex-wrap gap-2"><ActionButton label={`View ${expense.id}`} onClick={() => onView(expense)}><Eye size={15} aria-hidden="true" /> View</ActionButton><ActionButton label={`Edit ${expense.id}`} onClick={() => onEdit(expense)}><Pencil size={15} aria-hidden="true" /> Edit</ActionButton><ActionButton label={`Delete ${expense.id}`} onClick={() => onDelete(expense)} tone="rose"><Trash2 size={15} aria-hidden="true" /> Delete</ActionButton></div>
          </article>;
        })}
      </div>
    </section>
  );
}
