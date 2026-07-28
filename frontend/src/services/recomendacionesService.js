import api from './api'
import { recomendaciones } from '../data/recomendaciones'
import { USE_MOCK_API, mockResponse } from './mock'

export async function getRecomendaciones() {
  if (USE_MOCK_API) {
    return mockResponse(recomendaciones)
  }

  const { data } = await api.get('/api/recomendaciones')
  return data
}
