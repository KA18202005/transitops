import api from "./api";

export function normalizeFuelLog(log) {
  return {
    ...log,
    vehicle_id: Number(log.vehicle_id),
    trip_id: log.trip_id == null ? null : Number(log.trip_id),
    liters: Number(log.liters || 0),
    cost: Number(log.cost || 0),
  };
}

export function toFuelLogPayload(values) {
  return {
    vehicle_id: Number(values.vehicle_id),
    trip_id: values.trip_id ? Number(values.trip_id) : null,
    liters: String(values.liters || 0),
    cost: String(values.cost || 0),
    fuel_station: values.fuel_station || null,
    date: values.date,
  };
}

export async function listFuelLogs(params = {}) {
  const { data } = await api.get("/fuel/", { params });
  return data.map(normalizeFuelLog);
}

export async function createFuelLog(values) {
  const { data } = await api.post("/fuel/", toFuelLogPayload(values));
  return normalizeFuelLog(data);
}

export async function updateFuelLog(id, values) {
  const { data } = await api.put(`/fuel/${id}`, toFuelLogPayload(values));
  return normalizeFuelLog(data);
}

export async function deleteFuelLog(id) {
  await api.delete(`/fuel/${id}`);
}
