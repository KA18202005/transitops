import { initialTrips } from "@/constants/tripData";
import { initialVehicles } from "@/constants/vehicleData";

const today = new Date();
const formatDate = (offsetDays) => {
  const date = new Date(today.getTime() + offsetDays * 24 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 10);
};

export const expenseTypes = ["Fuel", "Maintenance", "Toll", "Parking", "Miscellaneous"];

export const initialExpenses = [
  {
    id: 1,
    trip_id: initialTrips[0].id,
    vehicle_id: initialVehicles[0].id,
    type: "Fuel",
    amount: 8800,
    description: "Refuel for port dispatch",
    date: formatDate(-4),
  },
  {
    id: 2,
    trip_id: initialTrips[1].id,
    vehicle_id: initialVehicles[1].id,
    type: "Maintenance",
    amount: 12400,
    description: "Brake service and inspection",
    date: formatDate(-3),
  },
  {
    id: 3,
    trip_id: initialTrips[2].id,
    vehicle_id: initialVehicles[4].id,
    type: "Toll",
    amount: 6400,
    description: "Expressway toll charge",
    date: formatDate(-7),
  },
  {
    id: 4,
    trip_id: null,
    vehicle_id: initialVehicles[5].id,
    type: "Parking",
    amount: 3200,
    description: "Depot overnight parking",
    date: formatDate(-2),
  },
  {
    id: 5,
    trip_id: initialTrips[4].id,
    vehicle_id: initialVehicles[6].id,
    type: "Miscellaneous",
    amount: 5000,
    description: "Driver welfare replenishment",
    date: formatDate(-6),
  },
  {
    id: 6,
    trip_id: initialTrips[5].id,
    vehicle_id: initialVehicles[8].id,
    type: "Fuel",
    amount: 4510,
    description: "Mid-route refuel",
    date: formatDate(-1),
  },
];
