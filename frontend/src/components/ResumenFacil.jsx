import { useLocale } from '../context/LocaleContext'
import DemoSampleBadge from './DemoSampleBadge'
import { resolveAnalyticsOverview } from '../utils/analyticsSeries'
import { formatMonthLabel } from '../utils/monthLabels'
import {
  categoryToInsightLevelKey,
  categoryToTipKey,
  formatConsumptionProfile,
} from '../utils/consumptionProfile'

function fill(template, values) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  )
}

function buildInsights(t, analytics, locale) {
  const overview = resolveAnalyticsOverview(analytics)
  const { actualKwh, peakKwh, cost, category, months } = overview
  const last = actualKwh.length - 1
  if (last < 1) {
    return []
  }
  const current = actualKwh[last]
  const previous = actualKwh[last - 1]
  const diff = current - previous
  const diffPct = previous ? Math.round((Math.abs(diff) / previous) * 100) : 0
  const monthName = formatMonthLabel(t, months[last], 'full', locale)
  const prevMonthName = formatMonthLabel(t, months[last - 1], 'full', locale)

  const peakShare = current ? Math.round((peakKwh[last] / current) * 100) : 0
  const bill = cost[last]
  const billDiff = bill - cost[last - 1]

  const trendKey = diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat'
  const billKey = billDiff > 0 ? 'up' : billDiff < 0 ? 'down' : 'flat'
  const levelKey = categoryToInsightLevelKey(category)
  const profileLabel = formatConsumptionProfile(t, category)

  return [
    {
      id: 'trend',
      icon: diff > 0 ? '📈' : diff < 0 ? '📉' : '➡️',
      tone: diff > 0 ? 'warning' : 'success',
      text: fill(t(`insights.trend.${trendKey}`), {
        month: monthName,
        prevMonth: prevMonthName,
        pct: diffPct,
        kwh: Math.abs(diff),
      }),
    },
    {
      id: 'peak',
      icon: '⏰',
      tone: peakShare >= 35 ? 'warning' : 'info',
      text: fill(t('insights.peak'), {
        pct: peakShare,
        month: monthName,
      }),
    },
    {
      id: 'bill',
      icon: '💵',
      tone: billDiff > 0 ? 'warning' : 'success',
      text: fill(t(`insights.bill.${billKey}`), {
        amount: bill,
        diff: Math.abs(billDiff),
        month: monthName,
      }),
    },
    {
      id: 'level',
      icon: levelKey === 'good' ? '✅' : levelKey === 'high' ? '⚠️' : 'ℹ️',
      tone:
        levelKey === 'good'
          ? 'success'
          : levelKey === 'high'
            ? 'danger'
            : 'info',
      text: `${profileLabel}: ${t(`insights.level.${levelKey}`)}`,
    },
    {
      id: 'tip',
      icon: '💡',
      tone: 'primary',
      text: t(`insights.tip.${categoryToTipKey(category)}`),
    },
  ]
}

const toneClass = {
  success: 'border-success',
  warning: 'border-warning',
  danger: 'border-danger',
  info: 'border-info',
  primary: 'border-primary',
}

function ResumenFacil({ analytics, chartBadgeVariant = 'demo' }) {
  const { t, locale } = useLocale()
  const insights = buildInsights(t, analytics, locale)

  if (!insights.length) {
    return null
  }

  return (
    <div className="card shadow mt-4">
      <div className="card-body">
        <h2 className="mb-3 d-flex flex-wrap align-items-center gap-2">
          <span>{t('insights.title')}</span>
          <DemoSampleBadge variant={chartBadgeVariant} />
        </h2>

        <div className="row g-3">
          {insights.map((item) => (
            <div className="col-12 col-md-6 col-xl" key={item.id}>
              <div
                className={`h-100 p-3 rounded border-start border-4 bg-body-tertiary ${toneClass[item.tone]}`}
              >
                <div className="fs-4 mb-2" aria-hidden="true">
                  {item.icon}
                </div>
                <p className="mb-0 small lh-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ResumenFacil
