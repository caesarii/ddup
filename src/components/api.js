const SESSION_KEY = 'ddup_current_user'
const API_BASE = import.meta.env.VITE_API_BASE || '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || '请求失败')
  }
  return data
}

export async function login(payload) {
  const user = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export function getCurrentUser() {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export async function getUserCourseProgress(username) {
  return request(`/progress/${encodeURIComponent(username)}`)
}

export async function saveUserCourseProgress(payload) {
  return request(`/progress/${encodeURIComponent(payload.username)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function patchUserCourseProgress(username, patch) {
  return request(`/progress/${encodeURIComponent(username)}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}
