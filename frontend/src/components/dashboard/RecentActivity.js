import { CheckCircle2, Fuel, Route, Users, Wrench } from "lucide-react";

const iconMap = {
  Route,
  Wrench,
  Fuel,
  Users,
  CheckCircle2,
};

const statusClasses = {
  Scheduled: "bg-sky-50 text-sky-700",
  "Needs review": "bg-amber-50 text-amber-700",
  Logged: "bg-emerald-50 text-emerald-700",
  Updated: "bg-violet-50 text-violet-700",
  Completed: "bg-emerald-50 text-emerald-700",
};

export default function RecentActivity({ activities }) {
  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_45px_-24px_rgba(2,6,23,0.35)]">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
        <p className="text-sm text-slate-500">Latest operational updates</p>
      </div>
      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = iconMap[activity.icon] || Route;
          return (
            <div key={activity.id} className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 transition-colors hover:bg-slate-100/70">
              <div className="mt-0.5 rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm">
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[activity.status] || "bg-slate-100 text-slate-600"}`}>
                    {activity.status}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span>{activity.module}</span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
