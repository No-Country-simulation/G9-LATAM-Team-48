import { formatMonthLabel } from './monthLabels'

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
  return EMPTY_OVERVIEW
}

export function buildActualVsPredictedSeries(t, analytics, locale = 'en') {
  const source = resolveAnalyticsOverview(analytics)
  return source.months.map((month, index) => ({
    mes: formatMonthLabel(t, month, 'short', locale),
    mesFull: formatMonthLabel(t, month, 'full', locale),
    mesKey: month,
    actual: source.actualKwh[index],
    predicted: source.predictedKwh[index],
  }))
}

export function buildPeakOffPeakSeries(t, analytics, locale = 'en') {
  const source = resolveAnalyticsOverview(analytics)
  return source.months.map((month, index) => ({
    mes: formatMonthLabel(t, month, 'short', locale),
    mesFull: formatMonthLabel(t, month, 'full', locale),
    mesKey: month,
    peak: source.peakKwh[index],
    offPeak: source.offPeakKwh[index],
  }))
}
