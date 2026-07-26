import es from './locales/es'
import en from './locales/en'
import pt from './locales/pt'
import fr from './locales/fr'
import it from './locales/it'
import de from './locales/de'
import nl from './locales/nl'
import pl from './locales/pl'
import ro from './locales/ro'
import ca from './locales/ca'
import tr from './locales/tr'

import { pagesEs } from './sections/pages-es.js'
import { pagesEn } from './sections/pages-en.js'
import { pagesPt } from './sections/pages-pt.js'
import { pagesFr } from './sections/pages-fr.js'
import { pagesIt } from './sections/pages-it.js'
import { pagesDe } from './sections/pages-de.js'
import { pagesNl } from './sections/pages-nl.js'
import { pagesPl } from './sections/pages-pl.js'
import { pagesRo } from './sections/pages-ro.js'
import { pagesCa } from './sections/pages-ca.js'
import { pagesTr } from './sections/pages-tr.js'

import { APP_LANGUAGES, LOCALES, getLanguageMeta } from './languages'

export { LOCALES, APP_LANGUAGES, getLanguageMeta }

const fullDictionaries = {
  es: { ...es, ...pagesEs },
  en: { ...en, ...pagesEn },
  pt: { ...pt, ...pagesPt },
  fr: { ...fr, ...pagesFr },
  it: { ...it, ...pagesIt },
  de: { ...de, ...pagesDe },
  nl: { ...nl, ...pagesNl },
  pl: { ...pl, ...pagesPl },
  ro: { ...ro, ...pagesRo },
  ca: { ...ca, ...pagesCa },
  tr: { ...tr, ...pagesTr },
}

const localeSet = new Set(LOCALES.map((item) => item.code))

function dictionaryFor(locale) {
  return fullDictionaries[locale] || fullDictionaries.en
}

export function detectLocale() {
  const saved = localStorage.getItem('locale')
  if (saved && localeSet.has(saved)) {
    return saved
  }

  const lang = (navigator.language || 'es').toLowerCase()
  // Prefijos más largos primero (zh-CN, pt-BR, etc.)
  const sorted = [...APP_LANGUAGES].sort(
    (a, b) => b.code.length - a.code.length,
  )
  for (const item of sorted) {
    if (lang === item.code || lang.startsWith(`${item.code}-`)) {
      return item.code
    }
  }
  // Casos especiales del navegador
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
    getByPath(fullDictionaries.en, key) ??
    getByPath(fullDictionaries.es, key)
  return value ?? fallback ?? key
}
