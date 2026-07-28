export const PAGE_STORAGE_KEY = 'energyai_pagina'
export const USER_STORAGE_KEY = 'user'
export const TOKEN_STORAGE_KEY = 'token'

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
