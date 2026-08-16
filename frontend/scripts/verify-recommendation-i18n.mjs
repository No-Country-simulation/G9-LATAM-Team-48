import { readFileSync } from 'fs'
import { join } from 'path'
import { CATALOG_BY_LOCALE } from '../src/i18n/catalog/byLocale.js'
import { FORM_CATALOG_KEYS } from './form-catalog-export.mjs'

const needed = ['lighting', 'habits', 'climate', 'equipment', 'tech', 'insulation', 'occupancy', 'building', 'peak', 'zone']
const root = join(process.cwd(), 'src/i18n')
const files = [
  ...['es', 'en', 'pt', 'fr', 'it', 'de', 'nl', 'pl', 'ro', 'ca', 'tr'].map((l) => ({
    locale: l,
    path: join(root, 'sections', `pages-${l}.js`),
  })),
  ...['ar', 'zh', 'ja', 'ko', 'ru', 'hi', 'uk', 'vi', 'id', 'sv'].map((l) => ({
    locale: l,
    path: join(root, 'packs', `${l}.js`),
  })),
]

function extractRecommendationsCategory(text) {
  const marker = text.includes('"recommendations"') ? '"recommendations"' : 'recommendations:'
  const start = text.indexOf(marker)
  if (start < 0) return ''
  const chunk = text.slice(start, start + 4000)
  const catMarker = chunk.includes('"category"') ? '"category"' : 'category:'
  const c = chunk.indexOf(catMarker)
  if (c < 0) return ''
  return chunk.slice(c, c + 800)
}

const missing = []
for (const file of files) {
  const block = extractRecommendationsCategory(readFileSync(file.path, 'utf8'))
  for (const k of needed) {
    const ok =
      new RegExp(`${k}\\s*:`).test(block) || new RegExp(`"${k}"\\s*:`).test(block)
    if (!ok) missing.push(`${file.locale}:${k}`)
  }
}

const formMissingEs = FORM_CATALOG_KEYS.filter((k) => !CATALOG_BY_LOCALE.es?.[k])
const formMissingEn = FORM_CATALOG_KEYS.filter((k) => !CATALOG_BY_LOCALE.en?.[k])
const localesWithoutForm = Object.keys(CATALOG_BY_LOCALE).filter(
  (loc) => !CATALOG_BY_LOCALE[loc]?.INSULATION_MOD_01,
)

console.log('category_gaps', missing.length ? missing : 'none')
console.log('form_es_missing', formMissingEs.length ? formMissingEs : 'none')
console.log('form_en_missing', formMissingEn.length ? formMissingEn : 'none')
console.log('locales_without_form_tip', localesWithoutForm.length ? localesWithoutForm : 'none')
console.log('catalog_keys_per_locale', Object.keys(CATALOG_BY_LOCALE.es).length)
console.log('sample_es', CATALOG_BY_LOCALE.es.INSULATION_MOD_04?.title)
console.log('sample_en', CATALOG_BY_LOCALE.en.PEAK_MOD_01?.title)
console.log('sample_pt_fallback_en', CATALOG_BY_LOCALE.pt.OCCUPANCY_MOD_01?.title)
