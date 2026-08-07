import api from './api'
import { recomendaciones } from '../data/recomendaciones'
import { USE_MOCK_API, mockResponse } from './mock'

export async function getRecomendaciones() {
  if (USE_MOCK_API) {
    return mockResponse(recomendaciones)
  }

  try {
    const { data } = await api.get('/api/recomendaciones', { timeout: 12_000 })
    return data
  } catch {
    return recomendaciones
  }
}
