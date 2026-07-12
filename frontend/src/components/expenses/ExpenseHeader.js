import { Plus, ReceiptText } from "lucide-react";

export default function ExpenseHeader({ onCreate }) {
  return (
    <section className="border border-slate-800 bg-slate-950 p-5 shadow-lg sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-300">
            <ReceiptText size={15} aria-hidden="true" /> Financial operations
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Expense Management</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Monitor vehicle expenses, trip costs, spending categories, and operational outflow.
          </p>
        </div>
        <button type="button" onClick={onCreate} className="inline-flex items-center justify-center gap-2 bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950">
          <Plus size={18} aria-hidden="true" /> Add Expense
        </button>
      </div>
    </section>
  );
}
