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

const AUTH_PUBLIC_PATHS = ['/api/v1/auth/login', '/api/v1/auth/register']

/**
 * Registra un handler global para 401 (sesión vencida).
 * @returns {number} id del interceptor (para eject)
 */
export function setupUnauthorizedInterceptor(onUnauthorized) {
  return api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status
      const url = String(error?.config?.url || '')
      const skipAuth = Boolean(error?.config?.skipAuth)
      const isPublicAuth = AUTH_PUBLIC_PATHS.some((path) => url.includes(path))
      const hadToken = Boolean(localStorage.getItem('token'))

      if (status === 401 && hadToken && !skipAuth && !isPublicAuth) {
        onUnauthorized?.(error)
      }

      return Promise.reject(error)
    },
  )
}

export default api
