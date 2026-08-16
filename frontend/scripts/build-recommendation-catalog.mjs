import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import {
  CATALOG_KEYS,
  TITLES_BY_LANG,
  PILOT_CATALOG_KEYS,
  PILOT_TITLES_BY_LANG,
} from './recommendation-catalog-data.mjs'
import {
  EFFICIENT_CATALOG_KEYS,
  EFFICIENT_TITLES_BY_LANG,
  INEFFICIENT_CATALOG_KEYS,
  INEFFICIENT_TITLES_BY_LANG,
} from './level-catalog-export.mjs'
import {
  FORM_CATALOG_KEYS,
  FORM_TITLES_BY_LANG,
} from './form-catalog-export.mjs'

const root = dirname(fileURLToPath(import.meta.url))
const outPath = join(root, '../src/i18n/catalog/byLocale.js')

const ALL_KEYS = [
  ...CATALOG_KEYS,
  ...PILOT_CATALOG_KEYS,
  ...EFFICIENT_CATALOG_KEYS,
  ...INEFFICIENT_CATALOG_KEYS,
  ...FORM_CATALOG_KEYS,
]

const LOCALES = [
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

function titlesForLocale(locale) {
  const base =
    TITLES_BY_LANG[locale] ||
    TITLES_BY_LANG.en ||
    TITLES_BY_LANG.es
  const moderate =
    PILOT_TITLES_BY_LANG[locale] ||
    PILOT_TITLES_BY_LANG.en ||
    PILOT_TITLES_BY_LANG.es
  const efficient =
    EFFICIENT_TITLES_BY_LANG[locale] ||
    EFFICIENT_TITLES_BY_LANG.en ||
    EFFICIENT_TITLES_BY_LANG.es
  const inefficient =
    INEFFICIENT_TITLES_BY_LANG[locale] ||
    INEFFICIENT_TITLES_BY_LANG.en ||
    INEFFICIENT_TITLES_BY_LANG.es
  const form =
    FORM_TITLES_BY_LANG[locale] ||
    FORM_TITLES_BY_LANG.en ||
    FORM_TITLES_BY_LANG.es
  return [...base, ...moderate, ...efficient, ...inefficient, ...form]
}

function toCatalog(titles) {
  const catalog = {}
  ALL_KEYS.forEach((key, i) => {
    const title = titles[i] ?? titles[0] ?? key
    catalog[key] = { title, description: title }
  })
  return catalog
}

const CATALOG_BY_LOCALE = {}
for (const locale of LOCALES) {
  CATALOG_BY_LOCALE[locale] = toCatalog(titlesForLocale(locale))
}

const body = `/** Generado por scripts/build-recommendation-catalog.mjs — no editar a mano. */
export const CATALOG_BY_LOCALE = ${JSON.stringify(CATALOG_BY_LOCALE, null, 2)}
`

writeFileSync(outPath, body, 'utf8')
console.log('Wrote', outPath, 'locales:', LOCALES.length, 'keys:', ALL_KEYS.length)
