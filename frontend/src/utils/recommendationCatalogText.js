import { recommendationCatalogFor } from '../i18n/catalog/index.js'

function catalogText(locale, tipKey, field) {
  if (!tipKey) return ''
  const entry = recommendationCatalogFor(locale)?.[tipKey]
  const text = entry?.[field]
  return text ? String(text) : ''
}

export function resolveRecommendationTipKey(item) {
  return item?.tipKey ?? item?.tip_key ?? null
}

/** Sugerencia por clave: catálogo V2 primero; analysis.tipsList solo para claves cortas (ac, led, …). */
export function tipSuggestionText(t, locale, key) {
  if (!key) return ''
  const fromCatalog = catalogText(locale, key, 'title')
  if (fromCatalog) return fromCatalog
  const catalogI18n = `recommendations.catalog.${key}.title`
  const viaCatalog = t(catalogI18n, '')
  if (viaCatalog && viaCatalog !== catalogI18n) return viaCatalog
  const listKey = `analysis.tipsList.${key}`
  const viaList = t(listKey, '')
  if (viaList && viaList !== listKey) return viaList
  return key
}

/**
 * Textos del catálogo V2 (tip_key). Requiere tipKey en el API; title del API solo como fallback ES.
 */
export function recommendationCatalogTitle(t, item, locale = 'es') {
  const tipKey = resolveRecommendationTipKey(item)
  if (tipKey) {
    const fromCatalog = catalogText(locale, tipKey, 'title')
    if (fromCatalog) return fromCatalog
    const key = `recommendations.catalog.${tipKey}.title`
    const viaT = t(key, '')
    if (viaT && viaT !== key) return viaT
  }
  if (item?.title) return item.title
  return tipKey || String(item?.id ?? '')
}

export function recommendationCatalogDescription(t, item, locale = 'es') {
  const tipKey = resolveRecommendationTipKey(item)
  if (tipKey) {
    const fromCatalog = catalogText(locale, tipKey, 'description')
    if (fromCatalog) return fromCatalog
    const key = `recommendations.catalog.${tipKey}.description`
    const viaT = t(key, '')
    if (viaT && viaT !== key) return viaT
    return recommendationCatalogTitle(t, item, locale)
  }
  if (item?.description) return item.description
  return recommendationCatalogTitle(t, item, locale)
}
