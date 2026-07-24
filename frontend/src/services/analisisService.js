import api from './api'
import { analizarConsumo as analizarLocal } from './iaService'
import { USE_MOCK_API, mockResponse } from './mock'
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../utils/session'

function mapMlResponse(data) {
  return {
    nivelKey: data.nivelKey || data.category || 'moderate',
    ahorro: data.ahorro ?? 15,
    tipKeys: data.tipKeys || [],
    benchmark: data.benchmark,
    confidence: data.confidence,
    source: data.source || 'api',
    emailStatus: data.emailStatus,
    consultaId: data.consultaId,
  }
}

function hasStoredSession() {
  return Boolean(
    localStorage.getItem(TOKEN_STORAGE_KEY) && localStorage.getItem(USER_STORAGE_KEY),
  )
}

/**
 * Analiza y siempre persiste en backend.
 * Con sesion: asocia usuario + email. Sin login: consulta anonima (emailStatus SKIPPED).
 */
export async function analizarConsumo(datos) {
  if (USE_MOCK_API) {
    return mockResponse(
      { ...analizarLocal(datos), source: 'local', emailStatus: 'SKIPPED' },
      600,
    )
  }

  // Sin sesion: no enviar Bearer (evita 401 por token vencido en backends viejos)
  const { data } = await api.post('/api/analisis', datos, {
    skipAuth: !hasStoredSession(),
  })
  return mapMlResponse({ ...data, source: 'api' })
}

/**
 * Fallback local (backend caido). No persiste ni envia email.
 */
export async function analizarConsumoLocal(datos) {
  if (USE_MOCK_API) {
    return mockResponse(
      { ...analizarLocal(datos), source: 'local', emailStatus: 'SKIPPED' },
      600,
    )
  }
  return { ...analizarLocal(datos), source: 'local', emailStatus: 'SKIPPED' }
}
