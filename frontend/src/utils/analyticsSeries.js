import { analyticsMock } from '../data/analyticsMock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true'

const EMPTY_OVERVIEW = {
  months: [],
  actualKwh: [],
  predictedKwh: [],
  peakKwh: [],
  offPeakKwh: [],
  cost: [],
  category: 'MEDIUM_CONSUMPTION',
  fromDataset: false,
}

export function resolveAnalyticsOverview(analytics) {
  if (analytics?.months?.length) {
    return analytics
  }
  if (USE_MOCK) {
    return { ...analyticsMock, fromDataset: false }
  }
  return EMPTY_OVERVIEW
}

export function buildActualVsPredictedSeries(t, analytics) {
  const source = resolveAnalyticsOverview(analytics)
  return source.months.map((month, index) => ({
    mes: t(`months.${month}`).slice(0, 3),
    actual: source.actualKwh[index],
    predicted: source.predictedKwh[index],
  }))
}

export function buildPeakOffPeakSeries(t, analytics) {
  const source = resolveAnalyticsOverview(analytics)
  return source.months.map((month, index) => ({
    mes: t(`months.${month}`).slice(0, 3),
    peak: source.peakKwh[index],
    offPeak: source.offPeakKwh[index],
  }))
}
