import api from './api'
import consumoData from '../data/consumo.json'
import { USE_MOCK_API, mockResponse } from './mock'

export async function getConsumos() {
  if (USE_MOCK_API) {
    return mockResponse(consumoData)
  }

  const { data } = await api.get('/api/consumos')
  return data
}

export function calcularResumen(consumos) {
  if (!consumos?.length) {
    return { total: 0, costo: 0, promedio: 0, mesMayor: null, ultimo: null }
  }

  const total = consumos.reduce((sum, item) => sum + item.consumo, 0)
  const costo = consumos.reduce((sum, item) => sum + item.costo, 0)
  const promedio = Math.round(total / consumos.length)
  const mesMayor = consumos.reduce((max, item) =>
    item.consumo > max.consumo ? item : max
  )
  const ultimo = consumos[consumos.length - 1]

  return { total, costo, promedio, mesMayor, ultimo }
}
