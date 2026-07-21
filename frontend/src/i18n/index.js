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

export const LOCALES = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
  { code: 'fr', label: 'FR' },
  { code: 'it', label: 'IT' },
  { code: 'de', label: 'DE' },
  { code: 'nl', label: 'NL' },
  { code: 'pl', label: 'PL' },
  { code: 'ro', label: 'RO' },
  { code: 'ca', label: 'CA' },
  { code: 'tr', label: 'TR' },
]

const dictionaries = {
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

const browserMap = [
  ['es', 'es'],
  ['pt', 'pt'],
  ['en', 'en'],
  ['fr', 'fr'],
  ['it', 'it'],
  ['de', 'de'],
  ['nl', 'nl'],
  ['pl', 'pl'],
  ['ro', 'ro'],
  ['ca', 'ca'],
  ['tr', 'tr'],
]

export function detectLocale() {
  const saved = localStorage.getItem('locale')
  if (saved && dictionaries[saved]) {
    return saved
  }

  const lang = (navigator.language || 'es').toLowerCase()
  for (const [prefix, code] of browserMap) {
    if (lang.startsWith(prefix)) return code
  }
  return 'es'
}

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

export function translate(locale, key, fallback) {
  const value =
    getByPath(dictionaries[locale], key) ??
    getByPath(dictionaries.en, key) ??
    getByPath(dictionaries.es, key)
  return value ?? fallback ?? key
}
