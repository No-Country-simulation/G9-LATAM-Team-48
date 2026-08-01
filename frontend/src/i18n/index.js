import es from './locales/es'
import en from './locales/en'
import { pagesEs } from './sections/pages-es.js'
import { pagesEn } from './sections/pages-en.js'
import { loadLocaleDictionary } from './loadLocale.js'
import { APP_LANGUAGES, LOCALES, getLanguageMeta } from './languages'

export { LOCALES, APP_LANGUAGES, getLanguageMeta }

/** Solo es + en en el bundle inicial (mobile / FCP). */
const dictionaryCache = {
  es: { ...es, ...pagesEs },
  en: { ...en, ...pagesEn },
}

const localeSet = new Set(LOCALES.map((item) => item.code))

const pendingLoads = new Map()

export function ensureLocale(locale) {
  if (dictionaryCache[locale]) {
    return Promise.resolve(dictionaryCache[locale])
  }

  const existing = pendingLoads.get(locale)
  if (existing) return existing

  const job = loadLocaleDictionary(locale).then((dict) => {
    pendingLoads.delete(locale)
    if (dict) {
      dictionaryCache[locale] = dict
      return dict
    }
    return dictionaryCache.en
  })

  pendingLoads.set(locale, job)
  return job
}

function dictionaryFor(locale) {
  return dictionaryCache[locale] || dictionaryCache.en || dictionaryCache.es
}

export function detectLocale() {
  const saved = localStorage.getItem('locale')
  if (saved && localeSet.has(saved)) {
    return saved
  }

  const lang = (navigator.language || 'es').toLowerCase()
  const sorted = [...APP_LANGUAGES].sort(
    (a, b) => b.code.length - a.code.length,
  )
  for (const item of sorted) {
    if (lang === item.code || lang.startsWith(`${item.code}-`)) {
      return item.code
    }
  }
  if (lang.startsWith('zh')) return 'zh'
  if (lang.startsWith('nb') || lang.startsWith('nn')) return 'no'
  if (lang.startsWith('fil')) return 'tl'
  return 'es'
}

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

export function translate(locale, key, fallback) {
  if (key.startsWith('common.languages.')) {
    const code = key.slice('common.languages.'.length)
    const meta = getLanguageMeta(code)
    if (meta?.name) return meta.name
  }

  const value =
    getByPath(dictionaryFor(locale), key) ??
    getByPath(dictionaryCache.en, key) ??
    getByPath(dictionaryCache.es, key)
  return value ?? fallback ?? key
}
