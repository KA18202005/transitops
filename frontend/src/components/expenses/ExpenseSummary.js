import { CalendarDays, Fuel, ReceiptIndianRupee, Settings2, TrendingUp, WalletCards } from "lucide-react";

const cards = [
  { key: "totalExpenses", title: "Total Expenses", icon: WalletCards, tone: "slate" },
  { key: "currentMonthSpend", title: "Current Month Spend", icon: CalendarDays, tone: "amber" },
  { key: "fuelExpenses", title: "Fuel Expenses", icon: Fuel, tone: "emerald" },
  { key: "maintenanceExpenses", title: "Maintenance Expenses", icon: Settings2, tone: "violet" },
  { key: "otherExpenses", title: "Other Expenses", icon: ReceiptIndianRupee, tone: "slate" },
  { key: "averageExpense", title: "Average Expense", icon: TrendingUp, tone: "emerald" },
];

const tones = {
  slate: "border-slate-200 bg-white text-slate-700",
  emerald: "border-emerald-200 bg-emerald-50/70 text-emerald-800",
  amber: "border-amber-200 bg-amber-50/70 text-amber-800",
  violet: "border-violet-200 bg-violet-50/70 text-violet-800",
};

export default function ExpenseSummary({ stats }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Expense summary">
      {cards.map(({ key, title, icon: Icon, tone }) => (
        <article key={key} className={`border p-4 shadow-sm ${tones[tone]}`}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.13em]">{title}</p>
            <span className="border border-current/15 bg-white/80 p-2"><Icon size={17} aria-hidden="true" /></span>
          </div>
          <p className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">{stats[key]}</p>
        </article>
      ))}
    </section>
  );
}
