const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const apiRequest = async (path, { method = "GET", token, body, signal } = {}) => {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error?.message || "Request failed. Please try again.");
  }
  return data;
};
