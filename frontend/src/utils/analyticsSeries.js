import { analyticsMock } from '../data/analyticsMock'

export function resolveAnalyticsOverview(analytics) {
  if (analytics?.months?.length) {
    return analytics
  }
  return { ...analyticsMock, fromDataset: false }
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
