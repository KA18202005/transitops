import { BarChart3, CalendarRange, CircleDollarSign, ReceiptText, TrendingUp } from "lucide-react";

const cardStyles = {
  slate: "border-slate-200 bg-white text-slate-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
};

export default function ExpenseSummary({ stats }) {
  const cards = [
    { title: "Total Expenses", value: stats.totalExpenses, icon: ReceiptText, tone: "slate" },
    { title: "Current Month Spend", value: stats.currentMonthSpend, icon: CalendarRange, tone: "amber" },
    { title: "Fuel Expenses", value: stats.fuelExpenses, icon: TrendingUp, tone: "emerald" },
    { title: "Maintenance Expenses", value: stats.maintenanceExpenses, icon: BarChart3, tone: "violet" },
    { title: "Other Expenses", value: stats.otherExpenses, icon: CircleDollarSign, tone: "slate" },
    { title: "Average Expense", value: stats.averageExpense, icon: BarChart3, tone: "emerald" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className={`rounded-[24px] border p-4 shadow-sm ${cardStyles[card.tone]}`}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{card.title}</div>
              <div className="rounded-2xl bg-white/80 p-2">
                <Icon size={16} />
              </div>
            </div>
            <div className="mt-4 text-2xl font-semibold">{card.value}</div>
          </div>
        );
      })}
    </div>
  );
}
