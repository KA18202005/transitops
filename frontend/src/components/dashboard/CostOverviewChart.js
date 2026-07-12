"use client";

import {
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function CostOverviewChart({ data }) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_45px_-24px_rgba(2,6,23,0.35)]">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Operational Costs</h2>
        <p className="text-sm text-slate-500">Expense categories for the current period</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <Bar data={data} dataKey="value" radius={[8, 8, 0, 0]}>
            <CartesianGrid stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip formatter={(value) => `$${value}`} />
          </Bar>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
