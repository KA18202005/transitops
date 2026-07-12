import api from "./api";

const DRIVER_ROLE_ID = 3;
const DEFAULT_PASSWORD = "TransitOps123";

export function normalizeDriver(driver) {
  return {
    ...driver,
    full_name: driver.full_name || `Driver #${driver.user_id || driver.id}`,
    phone: driver.phone || "",
    safety_score: Number(driver.safety_score || 0),
  };
}

export function toDriverPayload(values) {
  return {
    user_id: Number(values.user_id),
    license_number: values.license_number,
    license_category: values.license_category,
    license_expiry: values.license_expiry,
    safety_score: String(values.safety_score || 100),
    status: values.status || "Available",
  };
}

export async function listDrivers(params = {}) {
  const { data } = await api.get("/drivers/", { params });
  return data.map(normalizeDriver);
}

export async function createDriver(values) {
  const email = values.email || `${values.license_number.replace(/[^a-z0-9]/gi, "").toLowerCase()}@drivers.transitops.com`;
  const { data: user } = await api.post("/users/", {
    role_id: DRIVER_ROLE_ID,
    full_name: values.full_name,
    email,
    password: values.password || DEFAULT_PASSWORD,
    phone: values.phone,
    is_active: true,
  });

  const { data } = await api.post("/drivers/", toDriverPayload({ ...values, user_id: user.id }));
  return normalizeDriver({ ...data, full_name: user.full_name, phone: user.phone });
}

export async function updateDriver(id, values) {
  if (values.user_id && (values.full_name || values.phone)) {
    await api.put(`/users/${values.user_id}`, {
      full_name: values.full_name,
      phone: values.phone,
      role_id: DRIVER_ROLE_ID,
      is_active: true,
    });
  }

  const { data } = await api.put(`/drivers/${id}`, toDriverPayload(values));
  return normalizeDriver({ ...data, full_name: values.full_name, phone: values.phone });
}

export async function deleteDriver(id) {
  await api.delete(`/drivers/${id}`);
}
