import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { CATALOG_KEYS, TITLES_BY_LANG } from './recommendation-catalog-data.mjs'

const root = dirname(fileURLToPath(import.meta.url))
const outPath = join(root, '../src/i18n/catalog/byLocale.js')

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

function toCatalog(titles) {
  const catalog = {}
  CATALOG_KEYS.forEach((key, i) => {
    const title = titles[i] ?? titles[0] ?? key
    catalog[key] = { title, description: title }
  })
  return catalog
}

const CATALOG_BY_LOCALE = {}
for (const locale of LOCALES) {
  const titles =
    TITLES_BY_LANG[locale] ||
    TITLES_BY_LANG.en ||
    TITLES_BY_LANG.es
  CATALOG_BY_LOCALE[locale] = toCatalog(titles)
}

const body = `/** Generado por scripts/build-recommendation-catalog.mjs — no editar a mano. */
export const CATALOG_BY_LOCALE = ${JSON.stringify(CATALOG_BY_LOCALE, null, 2)}
`

writeFileSync(outPath, body, 'utf8')
console.log('Wrote', outPath, 'locales:', LOCALES.length, 'keys:', CATALOG_KEYS.length)
