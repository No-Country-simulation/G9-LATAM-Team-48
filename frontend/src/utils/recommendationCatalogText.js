import { recommendationCatalogFor } from '../i18n/catalog/index.js'

function normalizeTitle(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
}

/** Índice título ES (V11) → tip_key para API sin tipKey. */
let titleToTipKeyCache = null

function titleToTipKeyMap() {
  if (titleToTipKeyCache) return titleToTipKeyCache
  titleToTipKeyCache = new Map()
  const esCatalog = recommendationCatalogFor('es')
  for (const [tipKey, entry] of Object.entries(esCatalog)) {
    const title = normalizeTitle(entry?.title)
    if (title) titleToTipKeyCache.set(title, tipKey)
  }
  return titleToTipKeyCache
}

export function resolveRecommendationTipKey(item) {
  const direct = item?.tipKey ?? item?.tip_key
  if (direct) return direct
  const apiTitle = normalizeTitle(item?.title)
  if (!apiTitle) return null
  return titleToTipKeyMap().get(apiTitle) ?? null
}

function catalogText(locale, tipKey, field) {
  if (!tipKey) return ''
  const entry = recommendationCatalogFor(locale)?.[tipKey]
  const text = entry?.[field]
  return text ? String(text) : ''
}

/**
 * Textos del catálogo V2 (tip_key). Prioriza i18n; el title del API queda como fallback (ES).
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
