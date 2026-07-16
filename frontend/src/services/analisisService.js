import api from './api'
import { analizarConsumo as analizarLocal } from './iaService'
import { USE_MOCK_API, mockResponse } from './mock'

export async function analizarConsumo(datos) {
  if (USE_MOCK_API) {
    return mockResponse(analizarLocal(datos), 800)
  }

  const { data } = await api.post('/api/analisis', datos)
  return data
}
