export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function getMaintenanceDuration(startDate, endDate) {
  if (!startDate) return "—";
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "—";
  const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
  return `${days} day${days === 1 ? "" : "s"}`;
}
