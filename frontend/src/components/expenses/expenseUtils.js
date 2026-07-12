export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function getExpenseTypeTone(type) {
  const tones = {
    Fuel: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Maintenance: "bg-amber-50 text-amber-700 border-amber-200",
    Toll: "bg-violet-50 text-violet-700 border-violet-200",
    Parking: "bg-sky-50 text-sky-700 border-sky-200",
    Miscellaneous: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return tones[type] || tones.Miscellaneous;
}
