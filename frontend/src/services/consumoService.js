import api from './api'
import { tiposInmuebleQueryValue } from '../utils/dashboardChartFilters'

function tipoQueryParam(tiposInmueble) {
  const value = tiposInmuebleQueryValue(tiposInmueble)
  if (!value) return {}
  return { tipoInmueble: value }
}

function normalizeConsumoResponse(data) {
  if (Array.isArray(data)) {
    return { consumos: data, fromDataset: false }
  }
  return {
    consumos: data?.consumos ?? [],
    fromDataset: Boolean(data?.fromDataset),
  }
}

/** @returns {Promise<{ consumos: Array, fromDataset: boolean }>} */
export async function getConsumos(options = {}) {
  const tiposInmueble = options.tiposInmueble ?? options.tipoInmueble
  const { data } = await api.get('/api/consumos', {
    params: tipoQueryParam(tiposInmueble),
  })
  return normalizeConsumoResponse(data)
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
