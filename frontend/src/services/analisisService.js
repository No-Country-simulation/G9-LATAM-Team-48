import api from './api'
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

/** Analiza y persiste en backend (ML + reglas Spring). */
export async function analizarConsumo(datos) {
  const { data } = await api.post('/api/analisis', datos, {
    skipAuth: !hasStoredSession(),
  })
  return mapMlResponse({ ...data, source: 'api' })
}
