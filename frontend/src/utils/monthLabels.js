import { monthsFull, monthsShort, resolveMonthLang } from '../i18n/shared/monthsCalendar'

/**
 * Etiqueta de mes unificada (API: january … december).
 * @param {'full'|'short'} variant — tabla/historial vs eje de gráfico
 */
export function formatMonthLabel(t, monthKey, variant = 'full', localeCode = 'en') {
  const key = String(monthKey || '').trim().toLowerCase()
  if (!key) return ''

  const ns = variant === 'short' ? 'monthsShort' : 'months'
  const fromDict = t(`${ns}.${key}`)
  if (fromDict !== `${ns}.${key}`) {
    return fromDict
  }

  const lang = resolveMonthLang(localeCode)
  const catalog = variant === 'short' ? monthsShort[lang] : monthsFull[lang]
  if (catalog?.[key]) {
    return catalog[key]
  }

  const enCatalog = variant === 'short' ? monthsShort.en : monthsFull.en
  return enCatalog?.[key] || key
}
