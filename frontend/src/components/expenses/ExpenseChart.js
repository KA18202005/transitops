import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3 } from "lucide-react";
import { formatCurrency } from "@/components/expenses/expenseUtils";

const colors = { Fuel: "#059669", Maintenance: "#d97706", Toll: "#7c3aed", Parking: "#0284c7", Miscellaneous: "#64748b" };

export default function ExpenseChart({ data }) {
  const hasSpend = data.some((entry) => entry.value > 0);

  return (
    <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><BarChart3 size={18} className="text-violet-600" aria-hidden="true" /> Spend by category</div>
          <p className="mt-1 text-sm text-slate-500">Live category totals across the current expense ledger.</p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">INR</span>
      </div>
      <div className="mt-4 h-72 min-w-0" aria-label="Expense totals by category chart">
        {hasSpend ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} width={72} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(value) => `₹${Number(value / 1000).toFixed(0)}k`} />
              <Tooltip cursor={{ fill: "#f8fafc" }} formatter={(value) => [formatCurrency(value), "Spend"]} contentStyle={{ border: "1px solid #cbd5e1", borderRadius: 0, boxShadow: "0 8px 24px rgba(15, 23, 42, 0.10)" }} />
              <Bar dataKey="value" radius={[2, 2, 0, 0]} maxBarSize={54}>
                {data.map((entry) => <Cell key={entry.name} fill={colors[entry.name]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : <div className="flex h-full items-center justify-center border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">No expense totals available for this ledger.</div>}
      </div>
    </section>
  );
}
