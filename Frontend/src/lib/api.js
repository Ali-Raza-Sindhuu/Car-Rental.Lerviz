const BASE_URL = (import.meta.env.VITE_API_URL || "/api/v1").replace(/\/$/, "");
const STORAGE_KEY = "lerviz-session";

export function getSession() {
  try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null"); }
  catch { return null; }
}

export function setSession(session) {
  if (session) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else sessionStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("lerviz-session-change"));
}

export function queryString(values = {}) {
  const query = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.set(key, String(value));
  });
  return query.size ? `?${query}` : "";
}

let refreshPromise;
async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const current = getSession();
      if (!current?.refreshToken) throw new Error("Please sign in again.");
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: current.refreshToken }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error?.message || "Session expired.");
      setSession({ ...current, ...payload.data });
      return payload.data.accessToken;
    })().finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

export async function api(path, { method = "GET", body, auth = true, retry = true, ...options } = {}) {
  const token = auth ? getSession()?.accessToken : null;
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method, ...options,
      headers: { ...(body !== undefined && { "Content-Type": "application/json" }), ...(token && { Authorization: `Bearer ${token}` }), ...options.headers },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });
  } catch {
    throw new Error("Cannot reach the API. Start the backend and try again.");
  }
  if (response.status === 401 && auth && retry && getSession()?.refreshToken) {
    try { await refreshSession(); return api(path, { method, body, auth, retry: false, ...options }); }
    catch { setSession(null); throw new Error("Your session expired. Please sign in again."); }
  }
  if (response.status === 204) return null;
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) {
    const detail = payload?.error?.details?.[0]?.message;
    const error = new Error(detail || payload?.error?.message || `Request failed (${response.status}).`);
    error.status = response.status;
    error.code = payload?.error?.code;
    throw error;
  }
  return payload;
}
