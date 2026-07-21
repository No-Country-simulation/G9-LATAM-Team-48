import { readFileSync } from 'fs'
import { pagesEs } from '../src/i18n/sections/pages-es.js'
import { pagesEn } from '../src/i18n/sections/pages-en.js'

const langs = ['pt', 'fr', 'it', 'de', 'nl', 'pl', 'ro', 'ca', 'tr']
const chartKeys = [
  'title',
  'actualVsPredicted',
  'actualVsPredictedHint',
  'peakVsOffPeak',
  'peakVsOffPeakHint',
  'seriesActual',
  'seriesPredicted',
  'seriesPeak',
  'seriesOffPeak',
  'axisMonth',
  'axisKwh',
  'confidence',
]
const monthKeys = ['january', 'february', 'march', 'april', 'may', 'june']

function loadJsonLocale(lang) {
  const raw = readFileSync(`./src/i18n/sections/pages-${lang}.js`, 'utf8')
  const match = raw.match(/export const (\w+) = (\{[\s\S]*\})\s*$/)
  if (!match) throw new Error(`parse fail ${lang}`)
  return JSON.parse(match[2])
}

const enActual = pagesEn.chart.actualVsPredicted
let anyIssue = false

console.log('code | actualVsPredicted | january | issues')
for (const lang of langs) {
  const data = loadJsonLocale(lang)
  const missing = []
  for (const k of chartKeys) {
    if (!data.chart?.[k]) missing.push(`chart.${k}`)
  }
  if (!data.chart?.categories?.MEDIUM_CONSUMPTION) {
    missing.push('chart.categories')
  }
  for (const k of monthKeys) {
    if (!data.months?.[k]) missing.push(`months.${k}`)
  }
  if (!data.insights?.title) missing.push('insights.title')
  if (!data.insights?.tip?.ok) missing.push('insights.tip.ok')

  const stillEn = data.chart.actualVsPredicted === enActual
  const stillEnMonth = data.months.january === 'January'
  if (missing.length || stillEn || stillEnMonth) anyIssue = true

  console.log(
    [
      lang,
      data.chart.actualVsPredicted,
      data.months.january,
      missing.length ? `MISSING:${missing.join(',')}` : stillEn || stillEnMonth ? 'FALLBACK_EN' : 'OK',
    ].join(' | '),
  )
}

console.log('es |', pagesEs.chart.actualVsPredicted, '|', pagesEs.months.january)
console.log('en |', pagesEn.chart.actualVsPredicted, '|', pagesEn.months.january)
console.log(anyIssue ? 'RESULT: hay gaps' : 'RESULT: todos los idiomas de la lista tienen textos propios')
