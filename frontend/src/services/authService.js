import api from './api'
import { formatDisplayName } from '../utils/formatDisplayName'
import { mockLogin, mockRegister } from './mockAuth'

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

function authErrorMessage(error, fallback) {
  return (
    error.response?.data?.message ||
    error.response?.data?.detail ||
    (error.code === 'ERR_NETWORK' ? 'network' : null) ||
    fallback
  )
}

function mapAuthResponse(payload, email, name) {
  const auth = payload?.data ?? payload
  const token = auth?.accessToken ?? auth?.token

  if (!token) {
    throw new Error('noToken')
  }

  return {
    token,
    user: {
      id: auth?.userId ?? 0,
      nombre:
        name?.trim() ||
        auth?.name ||
        formatDisplayName(email.split('@')[0]),
      email,
      rol: auth?.rol ?? 'operador',
    },
  }
}

export async function login(credentials) {
  if (USE_MOCK_AUTH) {
    return mockLogin(credentials)
  }

  try {
    const { data } = await api.post('/api/v1/auth/login', {
      email: credentials.email.trim(),
      password: credentials.password,
    })
    return mapAuthResponse(data, credentials.email.trim())
  } catch (error) {
    if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
      return mockLogin(credentials)
    }

    throw new Error(authErrorMessage(error, 'loginFailed'))
  }
}

export async function register(credentials) {
  const body = {
    name: credentials.name.trim(),
    email: credentials.email.trim(),
    password: credentials.password,
  }

  if (USE_MOCK_AUTH) {
    return mockRegister(body)
  }

  try {
    const { data } = await api.post('/api/v1/auth/register', body)
    return mapAuthResponse(data, body.email, body.name)
  } catch (error) {
    if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
      return mockRegister(body)
    }

    throw new Error(authErrorMessage(error, 'registerFailed'))
  }
}

export async function logout() {
  // El backend JWT no expone logout; la sesión se limpia en el cliente.
}
