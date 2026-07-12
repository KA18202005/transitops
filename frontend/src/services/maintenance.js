import api from "./api";

export function normalizeMaintenance(record) {
  return {
    ...record,
    vehicle_id: Number(record.vehicle_id),
    maintenance_cost: Number(record.maintenance_cost || 0),
  };
}

export function toMaintenancePayload(values) {
  return {
    vehicle_id: Number(values.vehicle_id),
    issue: values.issue,
    description: values.description || null,
    maintenance_cost: String(values.maintenance_cost || 0),
    start_date: values.start_date || null,
    end_date: values.end_date || null,
    status: values.status || "Pending",
    created_by: values.created_by || null,
  };
}

export async function listMaintenance(params = {}) {
  const { data } = await api.get("/maintenance/", { params });
  return data.map(normalizeMaintenance);
}

export async function createMaintenance(values) {
  const { data } = await api.post("/maintenance/", toMaintenancePayload(values));
  return normalizeMaintenance(data);
}

export async function updateMaintenance(id, values) {
  const { data } = await api.put(`/maintenance/${id}`, toMaintenancePayload(values));
  return normalizeMaintenance(data);
}

export async function deleteMaintenance(id) {
  await api.delete(`/maintenance/${id}`);
}
