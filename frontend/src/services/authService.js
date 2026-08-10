import api from './api'
import { formatDisplayName } from '../utils/formatDisplayName'

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
    throw new Error(authErrorMessage(error, 'loginFailed'))
  }
}

/**
 * Registro: no inicia sesion. Requiere verificar email.
 */
export async function register(credentials) {
  const body = {
    name: credentials.name.trim(),
    email: credentials.email.trim(),
    password: credentials.password,
  }

  try {
    const { data } = await api.post('/api/v1/auth/register', body)
    const payload = data?.data ?? data
    return {
      pendingVerification: true,
      message: payload?.message || data?.message || null,
      emailStatus: payload?.emailStatus,
      verificationToken: payload?.verificationToken ?? null,
      email: body.email,
    }
  } catch (error) {
    throw new Error(authErrorMessage(error, 'registerFailed'))
  }
}

export async function logout() {
  // El backend JWT no expone logout; la sesión se limpia en el cliente.
}

export async function loginWithGoogle(credential) {
  try {
    const { data } = await api.post('/api/v1/auth/google', { credential })
    const auth = data?.data ?? data
    const token = auth?.accessToken ?? auth?.token
    if (!token) throw new Error('noToken')

    localStorage.setItem('token', token)
    let user
    try {
      user = await getCurrentUser(token)
    } catch {
      user = { id: 0, nombre: 'Google', email: '', rol: 'USER' }
    }
    return { token, user }
  } catch (error) {
    throw new Error(authErrorMessage(error, 'googleLoginFailed'))
  }
}
