import Link from "next/link";
import { Car, Route, Users, Wrench } from "lucide-react";

const iconMap = {
  Car,
  Users,
  Route,
  Wrench,
};

export default function QuickActions({ actions }) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_45px_-24px_rgba(2,6,23,0.35)]">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
        <p className="text-sm text-slate-500">Jump to common operations</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = iconMap[action.icon] || Route;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <div className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm">
                <Icon size={16} />
              </div>
              <span className="text-sm font-medium text-slate-700">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
