/**
 * Textos del catálogo V2 (tip_key). Prioriza i18n; el title del API queda como fallback (ES).
 */
export function recommendationCatalogTitle(t, item) {
  const tipKey = item?.tipKey
  if (tipKey) {
    const key = `recommendations.catalog.${tipKey}.title`
    const translated = t(key, item?.title ?? '')
    if (translated && translated !== key) return translated
  }
  if (item?.title) return item.title
  return tipKey || String(item?.id ?? '')
}

export function recommendationCatalogDescription(t, item) {
  const tipKey = item?.tipKey
  if (tipKey) {
    const key = `recommendations.catalog.${tipKey}.description`
    const translated = t(key, '')
    if (translated && translated !== key) return translated
    return recommendationCatalogTitle(t, item)
  }
  if (item?.description) return item.description
  return recommendationCatalogTitle(t, item)
}
