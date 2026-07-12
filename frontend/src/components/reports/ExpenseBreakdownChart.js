import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Chart } from "@/components/reports/UtilizationChart";
import { formatCurrency } from "@/components/reports/reportUtils";
const colors = ["#0891b2", "#4f46e5", "#d97706", "#38bdf8", "#64748b"];
export default function ExpenseBreakdownChart({ data }) { const hasData = data.some((item) => item.value > 0); return <Chart title="Expense breakdown" subtitle="Operational spend by category">{hasData ? <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={2}>{data.map((entry, index) => <Cell key={entry.name} fill={colors[index]} />)}</Pie><Tooltip formatter={(v) => [formatCurrency(v)]} /><Legend wrapperStyle={{ fontSize: 12 }} /></PieChart></ResponsiveContainer> : <div className="flex h-full items-center justify-center bg-slate-50 text-sm text-slate-500">No expense data</div>}</Chart>; }
