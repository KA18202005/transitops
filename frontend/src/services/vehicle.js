import api from "./api";

export const vehicleTypeIds = {
  Truck: 1,
  "Mini Truck": 2,
  Van: 3,
  Pickup: 4,
  Trailer: 5,
};

export const regionIds = {
  North: 1,
  South: 2,
  East: 3,
  West: 4,
  Central: 5,
};

const vehicleTypeNames = Object.fromEntries(Object.entries(vehicleTypeIds).map(([name, id]) => [id, name]));
const regionNames = Object.fromEntries(Object.entries(regionIds).map(([name, id]) => [id, name]));

export function normalizeVehicle(vehicle) {
  return {
    ...vehicle,
    vehicle_type: vehicle.vehicle_type || vehicleTypeNames[vehicle.vehicle_type_id] || "Truck",
    region: vehicle.region || regionNames[vehicle.region_id] || "North",
    max_load_capacity: Number(vehicle.max_load_capacity || 0),
    current_odometer: Number(vehicle.current_odometer || 0),
    acquisition_cost: Number(vehicle.acquisition_cost || 0),
  };
}

export function toVehiclePayload(values) {
  return {
    registration_number: values.registration_number,
    vehicle_name: values.vehicle_name,
    vehicle_type_id: values.vehicle_type_id || vehicleTypeIds[values.vehicle_type] || 1,
    region_id: values.region_id || regionIds[values.region] || 1,
    max_load_capacity: String(values.max_load_capacity),
    current_odometer: String(values.current_odometer || 0),
    acquisition_cost: String(values.acquisition_cost || 0),
    purchase_date: values.purchase_date || null,
    status: values.status || "Available",
    is_active: values.status !== "Retired",
    created_by: values.created_by || null,
  };
}

export async function listVehicles(params = {}) {
  const { data } = await api.get("/vehicles/", { params });
  return data.map(normalizeVehicle);
}

export async function createVehicle(values) {
  const { data } = await api.post("/vehicles/", toVehiclePayload(values));
  return normalizeVehicle(data);
}

export async function updateVehicle(id, values) {
  const { data } = await api.put(`/vehicles/${id}`, toVehiclePayload(values));
  return normalizeVehicle(data);
}

export async function deleteVehicle(id) {
  await api.delete(`/vehicles/${id}`);
}
