import { createContext, useContext, useState } from 'react'
import {
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from '../services/authService'

const AuthContext = createContext()

function getStoredUser() {
  const savedUser = localStorage.getItem('user')

  if (!savedUser) {
    return null
  }

  try {
    return JSON.parse(savedUser)
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

function persistSession(data, setUser, setToken) {
  setUser(data.user)
  setToken(data.token)
  localStorage.setItem('user', JSON.stringify(data.user))
  localStorage.setItem('token', data.token)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isAuthenticated = Boolean(user && token)

  const login = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const data = await loginRequest({ email, password })
      persistSession(data, setUser, setToken)
      return data
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
      persistSession(data, setUser, setToken)
      return data
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
      setUser(null)
      setToken(null)
      setError(null)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
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
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
