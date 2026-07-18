import axios from 'axios'
import api from './api'
import { analizarConsumo as analizarLocal } from './iaService'
import { USE_MOCK_API, mockResponse } from './mock'

const ML_API_URL = (import.meta.env.VITE_ML_API_URL || '').replace(/\/$/, '')

function mapMlResponse(data) {
  return {
    nivelKey: data.nivelKey || data.category || 'moderate',
    ahorro: data.ahorro ?? 15,
    tipKeys: data.tipKeys || [],
    benchmark: data.benchmark,
    confidence: data.confidence,
    source: data.source || 'ml',
  }
}

async function analyzeWithMlDirect(datos) {
  const { data } = await axios.post(`${ML_API_URL}/analyze`, datos, {
    timeout: 8000,
  })
  return mapMlResponse({ ...data, source: 'ml' })
}

async function analyzeWithBackend(datos) {
  const { data } = await api.post('/api/analisis', datos)
  return mapMlResponse({ ...data, source: 'api' })
}

/**
 * Prioridad:
 * 1) VITE_ML_API_URL → FastAPI directo
 * 2) VITE_USE_MOCK_API=false → Spring → FastAPI
 * 3) mock local (iaService) como fallback
 */
export async function analizarConsumo(datos) {
  if (ML_API_URL) {
    try {
      return await analyzeWithMlDirect(datos)
    } catch (err) {
      console.warn('ML service unavailable, using local rules', err?.message)
      return mockResponse({ ...analizarLocal(datos), source: 'local-fallback' }, 400)
    }
  }

  if (!USE_MOCK_API) {
    try {
      return await analyzeWithBackend(datos)
    } catch (err) {
      console.warn('Backend prediction unavailable, using local rules', err?.message)
      return mockResponse({ ...analizarLocal(datos), source: 'local-fallback' }, 400)
    }
  }

  return mockResponse({ ...analizarLocal(datos), source: 'local' }, 800)
}
