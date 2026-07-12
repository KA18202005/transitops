import { CheckCircle2, CircleSlash, Clock3, DollarSign, Wrench } from "lucide-react";

const cardStyles = {
  slate: "border-slate-200 bg-white text-slate-700",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
};

export default function MaintenanceSummary({ stats }) {
  const cards = [
    { title: "Total Records", value: stats.total, icon: Wrench, tone: "slate" },
    { title: "Pending", value: stats.pending, icon: Clock3, tone: "amber" },
    { title: "In Progress", value: stats.inProgress, icon: CircleSlash, tone: "indigo" },
    { title: "Completed", value: stats.completed, icon: CheckCircle2, tone: "emerald" },
    { title: "Total Maintenance Cost", value: stats.totalCost, icon: DollarSign, tone: "slate" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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
            <div className="mt-4 text-3xl font-semibold">{card.value}</div>
          </div>
        );
      })}
    </div>
  );
}
