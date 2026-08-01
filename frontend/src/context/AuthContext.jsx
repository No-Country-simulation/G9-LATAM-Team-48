import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  getCurrentUser,
  login as loginRequest,
  loginWithGoogle as loginWithGoogleRequest,
  logout as logoutRequest,
  register as registerRequest,
} from '../services/authService'
import api, { setupUnauthorizedInterceptor } from '../services/api'
import {
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
  clearStoredPagina,
  emitSessionExpired,
  getStoredUser,
  isAccessTokenExpired,
  normalizeUser,
} from '../utils/session'

const AuthContext = createContext()

function clearSession(setUser, setToken) {
  setUser(null)
  setToken(null)
  localStorage.removeItem(USER_STORAGE_KEY)
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  clearStoredPagina()
}

function persistSession(data, setUser, setToken, onRestored) {
  const user = normalizeUser(data.user)
  setUser(user)
  setToken(data.token)
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  localStorage.setItem(TOKEN_STORAGE_KEY, data.token)
  onRestored?.()
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY))
  const [loading, setLoading] = useState(false)
  const [hydrating, setHydrating] = useState(() =>
    Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)),
  )
  const [error, setError] = useState(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [sessionEpoch, setSessionEpoch] = useState(0)
  const sessionExpiredRef = useRef(false)

  const markSessionRestored = () => {
    sessionExpiredRef.current = false
  }

  const bumpSessionEpoch = () => {
    setSessionEpoch((n) => n + 1)
  }

  const isAuthenticated = Boolean(user && token)
  const openLogin = () => setLoginOpen(true)
  const closeLogin = () => setLoginOpen(false)

  const refreshUser = async () => {
    const currentToken = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!currentToken) {
      clearSession(setUser, setToken)
      return null
    }

    const profile = normalizeUser(await getCurrentUser(currentToken))
    setUser(profile)
    setToken(currentToken)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile))
    return profile
  }

  function expireSession() {
    if (sessionExpiredRef.current) return
    sessionExpiredRef.current = true
    clearSession(setUser, setToken)
    setError(null)
    setLoginOpen(false)
    bumpSessionEpoch()
    emitSessionExpired()
  }

  function checkTokenLifetime() {
    const currentToken = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!currentToken) return
    if (String(currentToken).startsWith('mock-token')) return
    if (isAccessTokenExpired(currentToken)) {
      expireSession()
    }
  }

  // Sesión vencida por tiempo (JWT exp) sin esperar un 401
  useEffect(() => {
    checkTokenLifetime()
    const intervalId = window.setInterval(checkTokenLifetime, 15000)
    const onFocus = () => checkTokenLifetime()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [])

  // Sesión vencida en cualquier llamada autenticada → dashboard + remount (sin modal login)
  useEffect(() => {
    const interceptorId = setupUnauthorizedInterceptor(() => {
      expireSession()
    })
    return () => {
      api.interceptors.response.eject(interceptorId)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      const currentToken = localStorage.getItem(TOKEN_STORAGE_KEY)
      const storedUser = getStoredUser()

      if (!currentToken) {
        if (!cancelled) setHydrating(false)
        return
      }

      if (isAccessTokenExpired(currentToken)) {
        if (!cancelled) expireSession()
        if (!cancelled) setHydrating(false)
        return
      }

      // Mantener sesion visible de inmediato (evita que el menu Admin parpadee/desaparezca)
      if (!cancelled && storedUser) {
        setUser(storedUser)
        setToken(currentToken)
      }

      if (String(currentToken).startsWith('mock-token')) {
        if (!cancelled) setHydrating(false)
        return
      }

      try {
        const profile = normalizeUser(await getCurrentUser(currentToken))
        if (!cancelled) {
          setUser(profile)
          setToken(currentToken)
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile))
        }
      } catch (err) {
        const status = err?.response?.status
        if (!cancelled) {
          // Solo cerrar si el token es invalido. Si el backend falla, conservar cache.
          if (status === 401) {
            expireSession()
          } else if (storedUser) {
            setUser(storedUser)
            setToken(currentToken)
          }
        }
      } finally {
        if (!cancelled) setHydrating(false)
      }
    }

    hydrate()
    return () => {
      cancelled = true
    }
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const data = await loginRequest({ email, password })
      persistSession(data, setUser, setToken, markSessionRestored)
      return { ...data, user: normalizeUser(data.user) }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async ({ name, email, password }) => {
    setLoading(true)
    setError(null)

    try {
      const data = await registerRequest({ name, email, password })
      // Registro ya no inicia sesion: hay que verificar el email
      if (data?.pendingVerification || !data?.token) {
        return data
      }
      persistSession(data, setUser, setToken, markSessionRestored)
      return { ...data, user: normalizeUser(data.user) }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (credential) => {
    setLoading(true)
    setError(null)
    try {
      const data = await loginWithGoogleRequest(credential)
      persistSession(data, setUser, setToken, markSessionRestored)
      return { ...data, user: normalizeUser(data.user) }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)

    try {
      await logoutRequest()
    } finally {
      clearSession(setUser, setToken)
      bumpSessionEpoch()
      setError(null)
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        hydrating,
        error,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshUser,
        sessionEpoch,
        loginOpen,
        openLogin,
        closeLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
