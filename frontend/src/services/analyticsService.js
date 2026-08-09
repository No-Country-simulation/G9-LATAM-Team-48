import api from './api'
import { analyticsMock } from '../data/analyticsMock'
import { USE_MOCK_API, mockResponse } from './mock'
import { TIPO_INMUEBLE_ALL } from '../utils/dashboardChartFilters'
import {
  filterBreakdownByTipo,
  scaleAnalyticsByTipo,
  scaleConsumosByTipo,
} from '../utils/dashboardTipoScale'

function tipoQueryParam(tipoInmueble) {
  if (!tipoInmueble || tipoInmueble === TIPO_INMUEBLE_ALL) return {}
  return { tipoInmueble }
}

export async function getAnalyticsOverview(options = {}) {
  const tipoInmueble = options.tipoInmueble
  if (USE_MOCK_API) {
    const base = { ...analyticsMock, fromDataset: false }
    return mockResponse(scaleAnalyticsByTipo(base, tipoInmueble))
  }

  const { data } = await api.get('/api/analytics/overview', {
    params: tipoQueryParam(tipoInmueble),
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
  const tipoInmueble = options.tipoInmueble
  if (USE_MOCK_API) {
    return mockResponse(filterBreakdownByTipo({ ...MOCK_BREAKDOWN }, tipoInmueble))
  }
  const { data } = await api.get('/api/analytics/breakdown', {
    params: {
      dimension: 'tipo_inmueble',
      ...tipoQueryParam(tipoInmueble),
      ...(monthKeys.length > 0 ? { months: monthKeys.join(',') } : {}),
    },
  })
  return data
}
