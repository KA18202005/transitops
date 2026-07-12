import { BarChart3, Fuel as FuelIcon, Gauge, IndianRupee, Users } from "lucide-react";

const cardStyles = {
  slate: "border-slate-200 bg-white text-slate-700",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
};

export default function FuelSummary({ stats }) {
  const cards = [
    { title: "Total Fuel Logs", value: stats.totalLogs, icon: BarChart3, tone: "slate" },
    { title: "Total Fuel Consumed", value: stats.totalLitres, icon: FuelIcon, tone: "blue" },
    { title: "Total Fuel Cost", value: stats.totalCost, icon: IndianRupee, tone: "amber" },
    { title: "Average Price per Litre", value: stats.averagePrice, icon: Gauge, tone: "emerald" },
    { title: "Vehicles Refuelled", value: stats.refuelledVehicles, icon: Users, tone: "slate" },
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
            <div className="mt-4 text-2xl font-semibold">{card.value}</div>
          </div>
        );
      })}
    </div>
  );
}
