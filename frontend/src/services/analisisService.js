import api from './api'
import { analizarConsumo as analizarLocal } from './iaService'
import { USE_MOCK_API, mockResponse } from './mock'

function mapMlResponse(data) {
  return {
    nivelKey: data.nivelKey || data.category || 'moderate',
    ahorro: data.ahorro ?? 15,
    tipKeys: data.tipKeys || [],
    benchmark: data.benchmark,
    confidence: data.confidence,
    source: data.source || 'api',
    emailStatus: data.emailStatus,
  }
}

/**
 * Analisis autenticado via Spring (guarda consulta + encola email).
 * Requiere token en localStorage (interceptor de api.js).
 */
export async function analizarConsumoAutenticado(datos) {
  const { data } = await api.post('/api/analisis', datos)
  return mapMlResponse({ ...data, source: 'api' })
}

/**
 * Fallback local (sin login / sin backend). No persiste ni envia email.
 */
export async function analizarConsumoLocal(datos) {
  if (USE_MOCK_API) {
    return mockResponse({ ...analizarLocal(datos), source: 'local' }, 600)
  }
  return { ...analizarLocal(datos), source: 'local' }
}
