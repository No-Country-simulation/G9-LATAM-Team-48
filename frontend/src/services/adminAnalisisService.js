import api from './api'

function unwrap(payload) {
  return payload?.data ?? payload
}

export async function listAnalisis() {
  const { data } = await api.get('/api/v1/admin/analisis')
  const value = unwrap(data)
  return Array.isArray(value) ? value : []
}

/** Recalcula historial con la heurística actual (solo ADMIN). */
export async function recalcularAnalisis() {
  const { data } = await api.post('/api/v1/admin/analisis/recalcular')
  return unwrap(data) ?? { total: 0, updated: 0, unchanged: 0, skipped: 0 }
}
