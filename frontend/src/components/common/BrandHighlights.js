import { Gauge, Route, Wrench } from "lucide-react";

const highlights = [
  {
    title: "Real-time fleet visibility",
    description: "Track vehicles and activity across the network.",
    icon: Gauge,
  },
  {
    title: "Smarter dispatch operations",
    description: "Coordinate crews, routes, and timing from one place.",
    icon: Route,
  },
  {
    title: "Maintenance and cost control",
    description: "Keep operations efficient with proactive oversight.",
    icon: Wrench,
  },
];

export default function BrandHighlights() {
  return (
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
      {highlights.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="rounded-xl border border-slate-800/70 bg-slate-900/70 p-3">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-100">
              <Icon size={16} />
            </div>
            <p className="text-sm font-semibold text-slate-100">{item.title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-400">{item.description}</p>
          </div>
        );
      })}
    </div>
  );
}
