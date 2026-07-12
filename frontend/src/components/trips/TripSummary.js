import { CheckCircle2, CircleSlash, Clock3, Route, XCircle } from "lucide-react";

const cardStyles = {
  slate: "border-slate-200 bg-white text-slate-700",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
};

export default function TripSummary({ stats }) {
  const cards = [
    { title: "Total Trips", value: stats.total, icon: Route, tone: "slate" },
    { title: "Draft", value: stats.draft, icon: Clock3, tone: "slate" },
    { title: "Dispatched", value: stats.dispatched, icon: CircleSlash, tone: "indigo" },
    { title: "Completed", value: stats.completed, icon: CheckCircle2, tone: "emerald" },
    { title: "Cancelled", value: stats.cancelled, icon: XCircle, tone: "rose" },
    { title: "Total Planned Distance", value: `${stats.distance.toLocaleString()} km`, icon: Route, tone: "slate" },
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
            <div className="mt-4 text-3xl font-semibold">{card.value}</div>
          </div>
        );
      })}
    </div>
  );
}
