import api from './api'
import consumoData from '../data/consumo.json'
import { USE_MOCK_API, mockResponse } from './mock'
import { TIPO_INMUEBLE_ALL } from '../utils/dashboardChartFilters'
import { scaleConsumosByTipo } from '../utils/dashboardTipoScale'

function tipoQueryParam(tipoInmueble) {
  if (!tipoInmueble || tipoInmueble === TIPO_INMUEBLE_ALL) return {}
  return { tipoInmueble }
}

export async function getConsumos(options = {}) {
  const tipoInmueble = options.tipoInmueble
  if (USE_MOCK_API) {
    return mockResponse(scaleConsumosByTipo(consumoData, tipoInmueble))
  }

  const { data } = await api.get('/api/consumos', {
    params: tipoQueryParam(tipoInmueble),
  })
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

/** Totales del rango visible (p. ej. KPIs con filtro de periodo). */
export function calcularResumenPeriodo(consumos) {
  const base = calcularResumen(consumos)
  if (!consumos?.length) {
    return { ...base, totalCosto: 0, mesesEnPeriodo: 0 }
  }
  const totalCosto = consumos.reduce((sum, item) => sum + Number(item.costo ?? 0), 0)
  return {
    ...base,
    totalCosto,
    mesesEnPeriodo: consumos.length,
  }
}
