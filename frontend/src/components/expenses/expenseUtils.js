export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function getExpenseTypeTone(type) {
  const tones = {
    Fuel: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Maintenance: "border-amber-200 bg-amber-50 text-amber-700",
    Toll: "border-violet-200 bg-violet-50 text-violet-700",
    Parking: "border-sky-200 bg-sky-50 text-sky-700",
    Miscellaneous: "border-slate-200 bg-slate-100 text-slate-700",
  };
  return tones[type] || tones.Miscellaneous;
}

export function getVehicleLabel(vehicle) {
  return vehicle ? `${vehicle.registration_number} · ${vehicle.vehicle_name}` : "Unknown vehicle";
}
