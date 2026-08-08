import api from './api'
import { analyticsMock } from '../data/analyticsMock'
import { USE_MOCK_API, mockResponse } from './mock'

export async function getAnalyticsOverview() {
  if (USE_MOCK_API) {
    return mockResponse({ ...analyticsMock, fromDataset: false })
  }

  const { data } = await api.get('/api/analytics/overview')
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

export async function getAnalyticsBreakdown(monthKeys = []) {
  if (USE_MOCK_API) {
    return mockResponse({ ...MOCK_BREAKDOWN })
  }
  const { data } = await api.get('/api/analytics/breakdown', {
    params: {
      dimension: 'tipo_inmueble',
      ...(monthKeys.length > 0 ? { months: monthKeys.join(',') } : {}),
    },
  })
  return data
}
