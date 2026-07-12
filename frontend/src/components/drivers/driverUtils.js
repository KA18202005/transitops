export function parseDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(dateString) {
  const date = parseDate(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getLicenceValidity(dateString) {
  const expiry = parseDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const soon = new Date(today);
  soon.setDate(today.getDate() + 30);

  if (expiry < today) return "Expired";
  if (expiry <= soon) return "Expiring soon";
  return "Valid";
}

export function getLicenceTone(validity) {
  if (validity === "Expired") return "red";
  if (validity === "Expiring soon") return "amber";
  return "emerald";
}

export function getEligibility(driver) {
  if (driver.status === "Suspended") return "Suspended";
  if (driver.status === "On Trip") return "Currently on trip";
  if (driver.status === "Off Duty") return "Off duty";
  if (getLicenceValidity(driver.license_expiry) === "Expired") return "Licence expired";
  return "Eligible";
}

export function getSafetyLabel(score) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  return "Needs attention";
}

export function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
