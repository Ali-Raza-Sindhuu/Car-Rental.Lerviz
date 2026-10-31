const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const authRequest = async (path, body, token) => {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_BASE}/api/auth/${path}`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error?.message || 'Request failed. Please try again.')
  return data
}

export const googleAuthRequest = (credential) =>
  authRequest('google', { credential })
