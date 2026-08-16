import api from './api'
import { tiposInmuebleQueryValue } from '../utils/dashboardChartFilters'

function tipoQueryParam(tiposInmueble) {
  const value = tiposInmuebleQueryValue(tiposInmueble)
  if (!value) return {}
  return { tipoInmueble: value }
}

export async function getAnalyticsOverview(options = {}) {
  const tiposInmueble = options.tiposInmueble ?? options.tipoInmueble
  const { data } = await api.get('/api/analytics/overview', {
    params: tipoQueryParam(tiposInmueble),
  })
  return data
}

export async function getAnalyticsBreakdown(monthKeys = [], options = {}) {
  const tiposInmueble = options.tiposInmueble ?? options.tipoInmueble
  const { data } = await api.get('/api/analytics/breakdown', {
    params: {
      dimension: 'tipo_inmueble',
      ...tipoQueryParam(tiposInmueble),
      ...(monthKeys.length > 0 ? { months: monthKeys.join(',') } : {}),
    },
  })
  return data
}
