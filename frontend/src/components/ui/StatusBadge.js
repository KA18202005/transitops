const toneClasses = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "On Trip": "bg-sky-50 text-sky-700 border-sky-200",
  "In Shop": "bg-amber-50 text-amber-700 border-amber-200",
  Retired: "bg-slate-100 text-slate-700 border-slate-200",
  "Off Duty": "bg-amber-50 text-amber-700 border-amber-200",
  Suspended: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses[status] || toneClasses.Retired}`}>
      {status}
    </span>
  );
}
