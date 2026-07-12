import { initialTrips } from "@/constants/tripData";
import { initialVehicles } from "@/constants/vehicleData";

const today = new Date();
const formatDate = (offsetDays) => {
  const date = new Date(today.getTime() + offsetDays * 24 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 10);
};

export const initialFuelLogs = [
  {
    id: 1,
    vehicle_id: initialVehicles[0].id,
    trip_id: initialTrips[0].id,
    liters: 92,
    cost: 8800,
    fuel_station: "Mumbai Hub Fuel Point",
    date: formatDate(-4),
  },
  {
    id: 2,
    vehicle_id: initialVehicles[1].id,
    trip_id: initialTrips[1].id,
    liters: 68,
    cost: 6120,
    fuel_station: "Delhi Express Station",
    date: formatDate(-3),
  },
  {
    id: 3,
    vehicle_id: initialVehicles[4].id,
    trip_id: initialTrips[2].id,
    liters: 81,
    cost: 7420,
    fuel_station: "Bengaluru North Fuel",
    date: formatDate(-7),
  },
  {
    id: 4,
    vehicle_id: initialVehicles[5].id,
    trip_id: null,
    liters: 57,
    cost: 5230,
    fuel_station: "Hyderabad City Pump",
    date: formatDate(-2),
  },
  {
    id: 5,
    vehicle_id: initialVehicles[6].id,
    trip_id: initialTrips[4].id,
    liters: 74,
    cost: 6780,
    fuel_station: "Kolkata Terminal Fuel",
    date: formatDate(-6),
  },
  {
    id: 6,
    vehicle_id: initialVehicles[8].id,
    trip_id: initialTrips[5].id,
    liters: 49,
    cost: 4510,
    fuel_station: "Ahmedabad Fast Fill",
    date: formatDate(-1),
  },
];
