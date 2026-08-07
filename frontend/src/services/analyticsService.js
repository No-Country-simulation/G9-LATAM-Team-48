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
