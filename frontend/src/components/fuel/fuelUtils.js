export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

export function formatLitres(value) {
  return `${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })} L`;
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatPricePerLitre(cost, liters) {
  if (!liters) return formatCurrency(0);
  return formatCurrency(Number(cost || 0) / Number(liters));
}
