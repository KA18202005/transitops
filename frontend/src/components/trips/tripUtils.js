import { initialVehicles } from "@/constants/vehicleData";
import { initialDrivers } from "@/constants/driverData";

export function formatDateTime(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatCurrency(value) {
  if (value == null || value === "") return "Not available";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getVehicleById(vehicleId) {
  return initialVehicles.find((vehicle) => vehicle.id === vehicleId) || null;
}

export function getDriverById(driverId) {
  return initialDrivers.find((driver) => driver.id === driverId) || null;
}

export function getTripStatusTone(status) {
  if (status === "Draft") return "slate";
  if (status === "Dispatched") return "indigo";
  if (status === "Completed") return "emerald";
  return "rose";
}

export function getCapacityUtilization(cargoWeight, capacity) {
  if (!capacity) return 0;
  return Math.round((cargoWeight / capacity) * 100);
}

export function getCapacityLabel(utilization) {
  if (utilization < 75) return "Normal";
  if (utilization <= 90) return "High";
  return "Near capacity";
}

export function getEligibility(vehicle, driver) {
  if (!vehicle || !driver) return "Unavailable";
  if (vehicle.status !== "Available") return "Vehicle unavailable";
  if (driver.status !== "Available") return "Driver unavailable";
  if (getDriverLicenceValidity(driver.license_expiry) !== "Valid") return "Driver licence invalid";
  return "Eligible";
}

export function getDriverLicenceValidity(dateString) {
  const expiry = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (expiry < today) return "Expired";
  const soon = new Date(today);
  soon.setDate(today.getDate() + 30);
  if (expiry <= soon) return "Expiring soon";
  return "Valid";
}

export function canEditTrip(trip) {
  return trip.status === "Draft";
}

export function canDispatchTrip(trip) {
  return trip.status === "Draft";
}

export function canCompleteTrip(trip) {
  return trip.status === "Dispatched";
}

export function canCancelTrip(trip) {
  return trip.status === "Draft" || trip.status === "Dispatched";
}
