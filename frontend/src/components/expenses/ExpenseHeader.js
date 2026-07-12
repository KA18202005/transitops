import { ReceiptText } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ExpenseHeader({ onCreate }) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#111827_55%,#1e293b_100%)] p-6 text-white shadow-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-100">
            Financial operations
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Expense Management</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            Monitor vehicle expenses, trip costs, spending categories, and operational outflow.
          </p>
        </div>
        <Button onClick={onCreate} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-slate-900 shadow-none hover:bg-slate-100">
          <ReceiptText size={18} />
          Add Expense
        </Button>
      </div>
    </div>
  );
}
