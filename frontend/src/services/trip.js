import api from "./api";

export function normalizeTrip(trip) {
  return {
    ...trip,
    vehicle_id: Number(trip.vehicle_id),
    driver_id: Number(trip.driver_id),
    cargo_weight: Number(trip.cargo_weight || 0),
    planned_distance: Number(trip.planned_distance || 0),
    actual_distance: Number(trip.actual_distance || 0),
    fuel_used: Number(trip.fuel_used || 0),
    revenue: Number(trip.revenue || 0),
  };
}

export function toTripPayload(values) {
  return {
    trip_number: values.trip_number,
    vehicle_id: Number(values.vehicle_id),
    driver_id: Number(values.driver_id),
    source: values.source,
    destination: values.destination,
    cargo_weight: String(values.cargo_weight || 0),
    planned_distance: String(values.planned_distance || 0),
    actual_distance: String(values.actual_distance || 0),
    fuel_used: String(values.fuel_used || 0),
    revenue: String(values.revenue || 0),
    status: values.status || "Draft",
    departure_time: values.departure_time || null,
    arrival_time: values.arrival_time || null,
    created_by: values.created_by || null,
  };
}

export async function listTrips(params = {}) {
  const { data } = await api.get("/trips/", { params });
  return data.map(normalizeTrip);
}

export async function createTrip(values) {
  const { data } = await api.post("/trips/", toTripPayload(values));
  return normalizeTrip(data);
}

export async function updateTrip(id, values) {
  const { data } = await api.put(`/trips/${id}`, toTripPayload(values));
  return normalizeTrip(data);
}

export async function deleteTrip(id) {
  await api.delete(`/trips/${id}`);
}
