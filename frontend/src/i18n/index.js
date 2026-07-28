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

import packAr from './packs/ar.js'
import packZh from './packs/zh.js'
import packJa from './packs/ja.js'
import packRu from './packs/ru.js'
import packHi from './packs/hi.js'
import packUk from './packs/uk.js'
import packVi from './packs/vi.js'
import packId from './packs/id.js'
import packKo from './packs/ko.js'
import packSv from './packs/sv.js'

import { APP_LANGUAGES, LOCALES, getLanguageMeta } from './languages'
import { deepMerge } from './deepMerge'

export { LOCALES, APP_LANGUAGES, getLanguageMeta }

const enBase = { ...en, ...pagesEn }

const fullDictionaries = {
  es: { ...es, ...pagesEs },
  en: enBase,
  pt: { ...pt, ...pagesPt },
  fr: { ...fr, ...pagesFr },
  it: { ...it, ...pagesIt },
  de: { ...de, ...pagesDe },
  nl: { ...nl, ...pagesNl },
  pl: { ...pl, ...pagesPl },
  ro: { ...ro, ...pagesRo },
  ca: { ...ca, ...pagesCa },
  tr: { ...tr, ...pagesTr },
  ar: deepMerge(enBase, packAr),
  zh: deepMerge(enBase, packZh),
  ja: deepMerge(enBase, packJa),
  ru: deepMerge(enBase, packRu),
  hi: deepMerge(enBase, packHi),
  uk: deepMerge(enBase, packUk),
  vi: deepMerge(enBase, packVi),
  id: deepMerge(enBase, packId),
  ko: deepMerge(enBase, packKo),
  sv: deepMerge(enBase, packSv),
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
    getByPath(fullDictionaries.en, key) ??
    getByPath(fullDictionaries.es, key)
  return value ?? fallback ?? key
}
