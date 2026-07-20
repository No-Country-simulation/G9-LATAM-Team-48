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

export async function getCurrentUser(token = localStorage.getItem('token')) {
  if (!token) {
    throw new Error('noToken')
  }

  const { data } = await api.get('/api/v1/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  const profile = data?.data ?? data
  return {
    id: profile.id,
    nombre: profile.name || profile.nombre,
    email: profile.email,
    rol: String(profile.role || profile.rol || 'USER').toUpperCase(),
  }
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
      rol: String(auth?.role ?? auth?.rol ?? 'USER').toUpperCase(),
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
    const session = mapAuthResponse(data, credentials.email.trim())
    localStorage.setItem('token', session.token)
    try {
      session.user = await getCurrentUser(session.token)
    } catch {
      // Si /me falla, al menos queda la sesion basica
    }
    return session
  } catch (error) {
    // Solo mock si no hay backend; si el backend responde error, no enmascarar
    if (import.meta.env.DEV && error.code === 'ERR_NETWORK') {
      console.warn('Backend no disponible, usando mock auth')
      return mockLogin(credentials)
    }

    throw new Error(authErrorMessage(error, 'loginFailed'))
  }
}

/**
 * Registro: no inicia sesion. Requiere verificar email.
 * En dev el backend puede devolver verificationToken para abrir la pantalla.
 */
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
    const payload = data?.data ?? data
    return {
      pendingVerification: true,
      message:
        payload?.message ||
        data?.message ||
        'Cuenta creada. Revisa tu email para verificarla.',
      emailStatus: payload?.emailStatus,
      verificationToken: payload?.verificationToken ?? null,
      email: body.email,
    }
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
