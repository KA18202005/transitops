import { AlertTriangle, ShieldCheck, Truck, UserRound, Users } from "lucide-react";

const cardStyles = {
  slate: "border-slate-200 bg-white text-slate-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
};

export default function DriverSummary({ stats }) {
  const cards = [
    { title: "Total Drivers", value: stats.total, icon: Users, tone: "slate" },
    { title: "Available", value: stats.available, icon: ShieldCheck, tone: "emerald" },
    { title: "On Trip", value: stats.onTrip, icon: Truck, tone: "indigo" },
    { title: "Off Duty", value: stats.offDuty, icon: UserRound, tone: "amber" },
    { title: "Suspended", value: stats.suspended, icon: AlertTriangle, tone: "rose" },
    { title: "Expiring Licences", value: stats.expiring, icon: AlertTriangle, tone: "amber" },
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
