import { initialVehicles } from "@/constants/vehicleData";

export const reportDateRanges = {
  ytd: { start: "2026-01-01", end: "2026-07-31" },
  q2: { start: "2026-04-01", end: "2026-06-30" },
  q3: { start: "2026-07-01", end: "2026-07-31" },
  all: { start: "", end: "" },
};

// Stable reporting periods; each record is a settled, local reporting snapshot.
export const vehiclePerformanceRecords = [
  { vehicle_id: 1, date: "2026-01-20", distance: 1840, fuel_used: 320, fuel_cost: 30720, maintenance_cost: 4500, revenue: 286000, expenses: { Fuel: 18800, Toll: 6400, Parking: 1800, Maintenance: 4500, Miscellaneous: 1200 } },
  { vehicle_id: 2, date: "2026-02-18", distance: 1520, fuel_used: 246, fuel_cost: 23616, maintenance_cost: 2800, revenue: 231000, expenses: { Fuel: 14800, Toll: 4200, Parking: 1200, Maintenance: 2800, Miscellaneous: 900 } },
  { vehicle_id: 3, date: "2026-03-12", distance: 980, fuel_used: 164, fuel_cost: 15744, maintenance_cost: 1200, revenue: 146000, expenses: { Fuel: 9700, Toll: 2600, Parking: 800, Maintenance: 1200, Miscellaneous: 750 } },
  { vehicle_id: 4, date: "2026-04-08", distance: 0, fuel_used: 0, fuel_cost: 0, maintenance_cost: 0, revenue: 0, expenses: { Fuel: 0, Toll: 0, Parking: 0, Maintenance: 0, Miscellaneous: 0 } },
  { vehicle_id: 5, date: "2026-04-25", distance: 1260, fuel_used: 210, fuel_cost: 20160, maintenance_cost: 3200, revenue: 194000, expenses: { Fuel: 12400, Toll: 3900, Parking: 1100, Maintenance: 3200, Miscellaneous: 1250 } },
  { vehicle_id: 6, date: "2026-05-16", distance: 2140, fuel_used: 365, fuel_cost: 35040, maintenance_cost: 4100, revenue: 338000, expenses: { Fuel: 21500, Toll: 6700, Parking: 1600, Maintenance: 4100, Miscellaneous: 1500 } },
  { vehicle_id: 7, date: "2026-05-29", distance: 1710, fuel_used: 278, fuel_cost: 26688, maintenance_cost: 3600, revenue: 264000, expenses: { Fuel: 16700, Toll: 4900, Parking: 1500, Maintenance: 3600, Miscellaneous: 1050 } },
  { vehicle_id: 8, date: "2026-06-11", distance: 780, fuel_used: 132, fuel_cost: 12672, maintenance_cost: 8600, revenue: 109000, expenses: { Fuel: 7800, Toll: 2100, Parking: 700, Maintenance: 8600, Miscellaneous: 650 } },
  { vehicle_id: 9, date: "2026-06-24", distance: 1190, fuel_used: 188, fuel_cost: 18048, maintenance_cost: 2600, revenue: 179000, expenses: { Fuel: 11000, Toll: 3400, Parking: 900, Maintenance: 2600, Miscellaneous: 1100 } },
  { vehicle_id: 10, date: "2026-07-09", distance: 1980, fuel_used: 332, fuel_cost: 31872, maintenance_cost: 5400, revenue: 312000, expenses: { Fuel: 19600, Toll: 6100, Parking: 1700, Maintenance: 5400, Miscellaneous: 1350 } },
  { vehicle_id: 11, date: "2026-07-18", distance: 0, fuel_used: 0, fuel_cost: 0, maintenance_cost: 0, revenue: 0, expenses: { Fuel: 0, Toll: 0, Parking: 0, Maintenance: 0, Miscellaneous: 0 } },
  { vehicle_id: 12, date: "2026-07-27", distance: 2380, fuel_used: 402, fuel_cost: 38592, maintenance_cost: 3900, revenue: 376000, expenses: { Fuel: 24100, Toll: 7200, Parking: 1900, Maintenance: 3900, Miscellaneous: 1600 } },
];

export const reportVehicles = initialVehicles;
