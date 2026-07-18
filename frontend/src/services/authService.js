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

function mapAuthResponse(payload, email) {
  const auth = payload?.data ?? payload
  const token = auth?.accessToken ?? auth?.token

  if (!token) {
    throw new Error('El backend no devolvió un token')
  }

  return {
    token,
    user: {
      id: auth?.userId ?? 0,
      nombre: auth?.name ?? formatDisplayName(email.split('@')[0]),
      email,
      rol: auth?.rol ?? 'operador',
    },
  }
}

async function loginAgainstApi(credentials) {
  const { data } = await api.post('/api/v1/auth/login', credentials)
  return mapAuthResponse(data, credentials.email)
}

async function registerThenLogin(credentials) {
  await api.post('/api/v1/auth/register', {
    name: formatDisplayName(credentials.email.split('@')[0]),
    email: credentials.email,
    password: credentials.password,
  })
  return loginAgainstApi(credentials)
}

export async function login(credentials) {
  if (USE_MOCK_AUTH) {
    return mockLogin(credentials)
  }

  try {
    return await loginAgainstApi(credentials)
  } catch (error) {
    // Primera vez en memoria: si no existe el usuario, lo registramos y reintentamos.
    if (error.response?.status === 401 || error.response?.status === 404) {
      try {
        return await registerThenLogin(credentials)
      } catch {
        // Seguir con el error original de login.
      }
    }

    if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
      return mockLogin(credentials)
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      (error.code === 'ERR_NETWORK'
        ? 'No se pudo conectar con el backend'
        : 'No se pudo iniciar sesión')

    throw new Error(message)
  }
}

export async function logout() {
  if (USE_MOCK_AUTH) {
    return
  }

  // El backend JWT no expone logout; la sesión se limpia en el cliente.
}
