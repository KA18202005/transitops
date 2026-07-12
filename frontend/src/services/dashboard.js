import api from "./api";

export async function getDashboardSummary(params = {}) {
  const { data } = await api.get("/dashboard/", { params });
  return {
    ...data,
    fuel_cost: Number(data.fuel_cost || 0),
    maintenance_cost: Number(data.maintenance_cost || 0),
    revenue: Number(data.revenue || 0),
    roi: data.roi == null ? null : Number(data.roi),
  };
}
