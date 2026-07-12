import { initialTrips } from "@/constants/tripData";
import { initialVehicles } from "@/constants/vehicleData";

export const expenseTypes = ["Fuel", "Maintenance", "Toll", "Parking", "Miscellaneous"];

const dateFromToday = (daysAgo) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
};

// The ledger is intentionally deterministic: values and relationships never change
// during render, while dates keep the current-month metric useful in the demo.
export const initialExpenses = [
  { id: "EXP-1001", trip_id: initialTrips[0].id, vehicle_id: initialVehicles[0].id, type: "Fuel", amount: 18800, description: "Diesel top-up before port dispatch", date: dateFromToday(2) },
  { id: "EXP-1002", trip_id: initialTrips[1].id, vehicle_id: initialVehicles[1].id, type: "Maintenance", amount: 12400, description: "Brake service and safety inspection", date: dateFromToday(4) },
  { id: "EXP-1003", trip_id: initialTrips[2].id, vehicle_id: initialVehicles[4].id, type: "Toll", amount: 6400, description: "Expressway tolls for Chennai route", date: dateFromToday(6) },
  { id: "EXP-1004", trip_id: null, vehicle_id: initialVehicles[5].id, type: "Parking", amount: 3200, description: "Secured depot overnight parking", date: dateFromToday(1) },
  { id: "EXP-1005", trip_id: initialTrips[4].id, vehicle_id: initialVehicles[6].id, type: "Miscellaneous", amount: 5000, description: "Driver welfare replenishment", date: dateFromToday(8) },
  { id: "EXP-1006", trip_id: initialTrips[5].id, vehicle_id: initialVehicles[8].id, type: "Fuel", amount: 14510, description: "Mid-route refuel at Surat fuel stop", date: dateFromToday(3) },
  { id: "EXP-1007", trip_id: initialTrips[6].id, vehicle_id: initialVehicles[9].id, type: "Toll", amount: 7800, description: "Noida to Lucknow toll receipts", date: dateFromToday(11) },
  { id: "EXP-1008", trip_id: initialTrips[7].id, vehicle_id: initialVehicles[2].id, type: "Maintenance", amount: 8900, description: "Tyre rotation and wheel alignment", date: dateFromToday(13) },
  { id: "EXP-1009", trip_id: null, vehicle_id: initialVehicles[0].id, type: "Parking", amount: 1800, description: "City loading zone parking fee", date: dateFromToday(16) },
  { id: "EXP-1010", trip_id: null, vehicle_id: initialVehicles[4].id, type: "Miscellaneous", amount: 2750, description: "Safety kit and consumables", date: dateFromToday(19) },
];
