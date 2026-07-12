"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function TripsOverviewChart({ data }) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_45px_-24px_rgba(2,6,23,0.35)]">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Trip Activity</h2>
        <p className="text-sm text-slate-500">Dispatched and completed trips over the last seven days</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="dispatched" fill="#2563eb" radius={[6, 6, 0, 0]} />
            <Bar dataKey="completed" fill="#0f766e" radius={[6, 6, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
