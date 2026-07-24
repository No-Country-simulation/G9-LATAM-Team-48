import axios from 'axios'

// Vacío = misma origen (nginx proxea /api → backend).
// Solo en DEV sin variable usamos localhost del backend.
const envUrl = import.meta.env.VITE_API_URL
const baseURL =
  envUrl !== undefined
    ? envUrl
    : import.meta.env.DEV
      ? 'http://localhost:8080'
      : ''

const api = axios.create({
  baseURL,
})

api.interceptors.request.use((config) => {
  if (config.skipAuth) {
    return config
  }

  const token = localStorage.getItem('token')
  const headers = config.headers || {}
  const existing =
    headers.Authorization ||
    headers.authorization ||
    (typeof headers.get === 'function' ? headers.get('Authorization') : null)

  // No pisar un Authorization ya enviado (ej. login → /me con token nuevo)
  if (token && !existing) {
    headers.Authorization = `Bearer ${token}`
    config.headers = headers
  }

  return config
})

export default api
