import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { getExpenseTypeTone } from "@/components/expenses/expenseUtils";

const palette = ["#10b981", "#f59e0b", "#8b5cf6", "#38bdf8", "#64748b"];

export default function ExpenseChart({ data }) {
  const chartData = data.filter((item) => item.value > 0);

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Expense Breakdown</h2>
          <p className="text-sm text-slate-500">Category spend by current expense state</p>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={palette[index % palette.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
