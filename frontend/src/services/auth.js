import api from "./api";

export async function login(credentials) {
  const { data } = await api.post("/auth/login", credentials);
  if (typeof window !== "undefined" && data.access_token) {
    window.localStorage.setItem("transitops_token", data.access_token);
  }
  return data;
}

export function logout() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("transitops_token");
  }
}

export async function signup(userData) {
  const { data } = await api.post("/users/", userData);
  return data;
}

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}

