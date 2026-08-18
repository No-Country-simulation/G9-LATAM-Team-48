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

/**
 * Recalcula un lote del historial con el modelo IA (solo ADMIN).
 *
 * Se procesa por lotes porque cada fila implica una llamada al ML service y el
 * proxy corta las requests largas.
 */
export async function recalcularAnalisis({ page = 0, size = 10 } = {}) {
  const { data } = await api.post('/api/v1/admin/analisis/recalcular', null, {
    params: { page, size },
  })
  return (
    unwrap(data) ?? {
      total: 0,
      updated: 0,
      unchanged: 0,
      skipped: 0,
      hasMore: false,
    }
  )
}
