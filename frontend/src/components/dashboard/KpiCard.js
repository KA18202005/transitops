import {
  Car,
  CheckCircle2,
  Clock3,
  Gauge,
  Route,
  Users,
  Wrench,
} from "lucide-react";

const iconMap = {
  Car,
  CheckCircle2,
  Clock3,
  Gauge,
  Route,
  Users,
  Wrench,
};

const toneClasses = {
  emerald: "bg-emerald-50 text-emerald-600",
  sky: "bg-sky-50 text-sky-600",
  amber: "bg-amber-50 text-amber-600",
  indigo: "bg-indigo-50 text-indigo-600",
  slate: "bg-slate-100 text-slate-600",
  violet: "bg-violet-50 text-violet-600",
  teal: "bg-teal-50 text-teal-600",
};

export default function KpiCard({ label, value, detail, icon, tone, onClick, selected }) {
  const Icon = iconMap[icon] || Gauge;
  return (
    <article className={`rounded-[22px] border bg-white p-4 shadow-[0_12px_30px_-18px_rgba(2,6,23,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-18px_rgba(2,6,23,0.35)] ${selected ? "border-sky-400 ring-2 ring-sky-100" : "border-slate-200"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
          <p className="mt-1 text-sm text-slate-500">{detail}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${toneClasses[tone] || toneClasses.slate}`}>
          <Icon size={18} />
        </div>
      </div>
      {onClick ? <button type="button" onClick={onClick} aria-expanded={selected} className="mt-3 text-xs font-semibold text-sky-700 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-300">{selected ? "Hide breakdown" : "View breakdown"}</button> : null}
    </article>
  );
}
