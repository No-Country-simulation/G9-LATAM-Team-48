import api from './api'
import { formatDisplayName } from '../utils/formatDisplayName'

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

async function mockLogin({ email, password }) {
  await new Promise((resolve) => setTimeout(resolve, 600))

  if (!email || password.length < 4) {
    throw new Error('Credenciales inválidas')
  }

  const nombre = formatDisplayName(email.split('@')[0])

  return {
    token: `mock-token-${Date.now()}`,
    user: {
      id: 1,
      nombre,
      email,
      rol: 'operador',
    },
  }
}

export async function login(credentials) {
  if (USE_MOCK_AUTH) {
    return mockLogin(credentials)
  }

  try {
    const { data } = await api.post('/api/auth/login', credentials)
    return data
  } catch (error) {
    if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
      return mockLogin(credentials)
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      'No se pudo iniciar sesión'

    throw new Error(message)
  }
}

export async function logout() {
  if (USE_MOCK_AUTH) {
    return
  }

  try {
    await api.post('/api/auth/logout')
  } catch {
    // La sesión local se limpia aunque falle el backend.
  }
}
