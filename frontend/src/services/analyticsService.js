import api from './api'
import { analyticsMock } from '../data/analyticsMock'
import { USE_MOCK_API, mockResponse } from './mock'
import {
  filterBreakdownByTipo,
  scaleAnalyticsByTipo,
  scaleConsumosByTipo,
} from '../utils/dashboardTipoScale'
import { tiposInmuebleQueryValue } from '../utils/dashboardChartFilters'

function tipoQueryParam(tiposInmueble) {
  const value = tiposInmuebleQueryValue(tiposInmueble)
  if (!value) return {}
  return { tipoInmueble: value }
}

export async function getAnalyticsOverview(options = {}) {
  const tiposInmueble = options.tiposInmueble ?? options.tipoInmueble
  if (USE_MOCK_API) {
    const base = { ...analyticsMock, fromDataset: false }
    return mockResponse(scaleAnalyticsByTipo(base, tiposInmueble))
  }

  const { data } = await api.get('/api/analytics/overview', {
    params: tipoQueryParam(tiposInmueble),
  })
  return data
}

const MOCK_BREAKDOWN = {
  dimension: 'tipo_inmueble',
  fromDataset: false,
  items: [
    { segment: 'Casa Unifamiliar', avgKwh: 350, sampleCount: 120 },
    { segment: 'Apartamento', avgKwh: 285, sampleCount: 95 },
    { segment: 'Pequeño Establecimiento Comercial', avgKwh: 410, sampleCount: 60 },
  ],
}

export async function getAnalyticsBreakdown(monthKeys = [], options = {}) {
  const tiposInmueble = options.tiposInmueble ?? options.tipoInmueble
  if (USE_MOCK_API) {
    return mockResponse(filterBreakdownByTipo({ ...MOCK_BREAKDOWN }, tiposInmueble))
  }
  const { data } = await api.get('/api/analytics/breakdown', {
    params: {
      dimension: 'tipo_inmueble',
      ...tipoQueryParam(tiposInmueble),
      ...(monthKeys.length > 0 ? { months: monthKeys.join(',') } : {}),
    },
  })
  return data
}
