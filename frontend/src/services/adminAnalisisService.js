import api from './api'
import { DEFAULT_PAGE_SIZE, normalizePageResponse } from '../utils/pageResponse'

function unwrap(payload) {
  return payload?.data ?? payload
}

export async function listAnalisis({ page = 0, size = DEFAULT_PAGE_SIZE } = {}) {
  const { data } = await api.get('/api/v1/admin/analisis', {
    params: { page, size },
  })
  return normalizePageResponse(data)
}

/** Recalcula historial con la heurística actual (solo ADMIN). */
export async function recalcularAnalisis() {
  const { data } = await api.post('/api/v1/admin/analisis/recalcular')
  return unwrap(data) ?? { total: 0, updated: 0, unchanged: 0, skipped: 0 }
}
