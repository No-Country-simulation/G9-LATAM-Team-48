import api from './api'
import { DEFAULT_PAGE_SIZE, normalizePageResponse } from '../utils/pageResponse'

function unwrap(payload) {
  return payload?.data ?? payload
}

export async function listMisAnalisis({ page = 0, size = DEFAULT_PAGE_SIZE } = {}) {
  const { data } = await api.get('/api/analisis/mis', {
    params: { page, size },
  })
  return normalizePageResponse(data)
}

/** Puntos ligeros para gráficos (todas las consultas del usuario). */
export async function listMisAnalisisChartPoints() {
  const { data } = await api.get('/api/analisis/mis/chart-points')
  const value = unwrap(data)
  return Array.isArray(value) ? value : []
}

export async function reenviarEmailAnalisis(consultaId) {
  const { data } = await api.post(`/api/analisis/mis/${consultaId}/reenviar-email`)
  return unwrap(data)
}
