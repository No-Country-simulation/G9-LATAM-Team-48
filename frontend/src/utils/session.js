export const PAGE_STORAGE_KEY = 'energyai_pagina'
export const USER_STORAGE_KEY = 'user'
export const TOKEN_STORAGE_KEY = 'token'
export const SESSION_EXPIRED_EVENT = 'energyai:session-expired'

export function emitSessionExpired() {
  try {
    window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT))
  } catch {
    // ignore
  }
}

export function normalizeUser(user) {
  if (!user || typeof user !== 'object') return null
  return {
    ...user,
    rol: String(user.rol || user.role || 'USER').toUpperCase(),
  }
}

export function getStoredUser() {
  const savedUser = localStorage.getItem(USER_STORAGE_KEY)
  if (!savedUser) return null
  try {
    return normalizeUser(JSON.parse(savedUser))
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY)
    return null
  }
}

export function getStoredPagina(fallback = 'dashboard') {
  try {
    return sessionStorage.getItem(PAGE_STORAGE_KEY) || fallback
  } catch {
    return fallback
  }
}

export function setStoredPagina(pagina) {
  try {
    if (!pagina || pagina === 'reset-password' || pagina === 'verify-email') {
      sessionStorage.removeItem(PAGE_STORAGE_KEY)
      return
    }
    sessionStorage.setItem(PAGE_STORAGE_KEY, pagina)
  } catch {
    // ignore
  }
}

export function clearStoredPagina() {
  try {
    sessionStorage.removeItem(PAGE_STORAGE_KEY)
  } catch {
    // ignore
  }
}

/** Exp del JWT en ms (solo UX; la API sigue siendo la fuente de verdad). */
export function getJwtExpirationMs(token) {
  if (!token || String(token).startsWith('mock-token')) return null
  try {
    const segment = String(token).split('.')[1]
    if (!segment) return null
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    if (typeof payload.exp !== 'number') return null
    return payload.exp * 1000
  } catch {
    return null
  }
}

export function isAccessTokenExpired(token, skewMs = 2000) {
  const expMs = getJwtExpirationMs(token)
  if (expMs == null) return false
  return Date.now() >= expMs - skewMs
}

/** Páginas que no deben mostrarse sin sesión (alineado con menuItems). */
export const AUTH_REQUIRED_PAGES = new Set([
  'historia-consumos',
  'admin-usuarios',
  'admin-analisis',
])

export function paginaRequiresAuth(pagina) {
  return AUTH_REQUIRED_PAGES.has(pagina)
}
