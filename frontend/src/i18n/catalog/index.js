import { CATALOG_BY_LOCALE } from './byLocale.js'

const FULL_UI_LOCALES = [
  'es',
  'en',
  'pt',
  'fr',
  'it',
  'de',
  'nl',
  'pl',
  'ro',
  'ca',
  'tr',
  'ar',
  'zh',
  'ja',
  'ko',
  'ru',
  'hi',
  'uk',
  'vi',
  'id',
  'sv',
]

export function recommendationCatalogFor(locale) {
  const code = String(locale || 'en').split('-')[0].toLowerCase()
  return (
    CATALOG_BY_LOCALE[code] ||
    CATALOG_BY_LOCALE.en ||
    CATALOG_BY_LOCALE.es ||
    {}
  )
}

/** Inyecta recommendations.catalog en el diccionario ya mergeado. */
export function attachRecommendationCatalog(dict, locale) {
  if (!dict) return dict
  const catalog = recommendationCatalogFor(locale)
  return {
    ...dict,
    recommendations: {
      ...(dict.recommendations || {}),
      catalog,
    },
  }
}

export { FULL_UI_LOCALES }
