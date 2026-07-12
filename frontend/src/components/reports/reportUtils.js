export const formatCurrency = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));
export const formatNumber = (value) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number(value || 0));
export const formatPercent = (value) => Number.isFinite(value) ? `${(value * 100).toFixed(1)}%` : "Not available";
export const safeDivide = (numerator, denominator) => denominator > 0 ? numerator / denominator : null;

export function buildPerformanceRows(records, vehicles) {
  return records.map((record) => {
    const vehicle = vehicles.find((item) => item.id === record.vehicle_id);
    const operationalCost = record.fuel_cost + record.maintenance_cost;
    return { ...record, vehicle, operationalCost, fuelEfficiency: safeDivide(record.distance, record.fuel_used), roi: vehicle ? safeDivide(record.revenue - operationalCost, vehicle.acquisition_cost) : null };
  });
}

export function getReportMetrics(rows) {
  const total = (key) => rows.reduce((sum, row) => sum + Number(row[key] || 0), 0);
  const distance = total("distance");
  const fuel = total("fuel_used");
  const revenue = total("revenue");
  const operationalCost = total("operationalCost");
  const maintenanceCost = total("maintenance_cost");
  const available = rows.filter((row) => row.vehicle?.status === "Available").length;
  const validRois = rows.map((row) => row.roi).filter(Number.isFinite);
  return { fleetUtilization: rows.length ? rows.filter((row) => row.distance > 0).length / rows.length : null, totalOperationalCost: operationalCost, totalRevenue: revenue, averageFuelEfficiency: safeDivide(distance, fuel), maintenanceCost, averageVehicleRoi: validRois.length ? validRois.reduce((sum, roi) => sum + roi, 0) / validRois.length : null, available };
}

export function groupByMonth(rows) {
  const groups = new Map();
  rows.forEach((row) => { const month = new Date(`${row.date}T00:00:00`).toLocaleString("en-IN", { month: "short" }); const current = groups.get(month) || { name: month, utilization: 0, revenue: 0, operationalCost: 0, distance: 0, fuel: 0, count: 0 }; current.utilization += row.distance > 0 ? 100 : 0; current.revenue += row.revenue; current.operationalCost += row.operationalCost; current.distance += row.distance; current.fuel += row.fuel_used; current.count += 1; groups.set(month, current); }); return [...groups.values()].map((item) => ({ ...item, utilization: item.count ? item.utilization / item.count : 0, efficiency: safeDivide(item.distance, item.fuel) || 0 }));
}

export function expenseBreakdown(rows) { const totals = { Fuel: 0, Maintenance: 0, Toll: 0, Parking: 0, Miscellaneous: 0 }; rows.forEach((row) => Object.entries(row.expenses).forEach(([key, value]) => { totals[key] += value; })); return Object.entries(totals).map(([name, value]) => ({ name, value })); }
export function statusDistribution(rows) { const statuses = ["Available", "On Trip", "In Shop", "Retired"]; return statuses.map((name) => ({ name, value: rows.filter((row) => row.vehicle?.status === name).length })); }
