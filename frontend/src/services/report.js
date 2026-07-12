import api from "./api";

export async function getVehicleUtilization(params = {}) {
  const { data } = await api.get("/reports/vehicle-utilization", { params });
  return data;
}

export async function getDriverPerformance(params = {}) {
  const { data } = await api.get("/reports/driver-performance", { params });
  return data;
}

export async function getMonthlyExpenses(params = {}) {
  const { data } = await api.get("/reports/monthly-expenses", { params });
  return data;
}

export async function getFuelConsumption(params = {}) {
  const { data } = await api.get("/reports/fuel-consumption", { params });
  return data;
}

export async function getMaintenanceHistory(params = {}) {
  const { data } = await api.get("/reports/maintenance-history", { params });
  return data;
}
