/**
 * Patch recommendations.category in all locale sections/packs with form-aligned keys.
 * Run: node scripts/patch-recommendation-categories.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../src/i18n')

const EXTRA = {
  es: { insulation: 'Aislamiento', occupancy: 'Ocupación', building: 'Inmueble', peak: 'Horario pico', zone: 'Zona' },
  en: { insulation: 'Insulation', occupancy: 'Occupancy', building: 'Building', peak: 'Peak hours', zone: 'Zone' },
  pt: { insulation: 'Isolamento', occupancy: 'Ocupação', building: 'Imóvel', peak: 'Horário de pico', zone: 'Zona' },
  fr: { insulation: 'Isolation', occupancy: 'Occupation', building: 'Bâtiment', peak: 'Heures de pointe', zone: 'Zone' },
  it: { insulation: 'Isolamento', occupancy: 'Occupazione', building: 'Immobile', peak: 'Ore di punta', zone: 'Zona' },
  de: { insulation: 'Isolierung', occupancy: 'Belegung', building: 'Gebäude', peak: 'Spitzenzeiten', zone: 'Zone' },
  nl: { insulation: 'Isolatie', occupancy: 'Bezetting', building: 'Gebouw', peak: 'Spitsuren', zone: 'Zone' },
  pl: { insulation: 'Izolacja', occupancy: 'Zajętość', building: 'Budynek', peak: 'Godziny szczytu', zone: 'Strefa' },
  ro: { insulation: 'Izolație', occupancy: 'Ocupare', building: 'Clădire', peak: 'Ore de vârf', zone: 'Zonă' },
  ca: { insulation: 'Aïllament', occupancy: 'Ocupació', building: 'Immoble', peak: 'Horari punta', zone: 'Zona' },
  tr: { insulation: 'Yalıtım', occupancy: 'Doluluk', building: 'Bina', peak: 'Yoğun saatler', zone: 'Bölge' },
  ar: { insulation: 'العزل', occupancy: 'الإشغال', building: 'المبنى', peak: 'ساعات الذروة', zone: 'المنطقة' },
  zh: { insulation: '隔热', occupancy: '入住', building: '建筑', peak: '高峰时段', zone: '区域' },
  ja: { insulation: '断熱', occupancy: '居住', building: '建物', peak: 'ピーク時間', zone: '地域' },
  ko: { insulation: '단열', occupancy: '거주', building: '건물', peak: '피크 시간', zone: '지역' },
  ru: { insulation: 'Изоляция', occupancy: 'Заселённость', building: 'Здание', peak: 'Часы пик', zone: 'Зона' },
  hi: { insulation: 'इन्सुलेशन', occupancy: 'अधिभोग', building: 'भवन', peak: 'पीक घंटे', zone: 'क्षेत्र' },
  uk: { insulation: 'Ізоляція', occupancy: 'Заселеність', building: 'Будівля', peak: 'Пікові години', zone: 'Зона' },
  vi: { insulation: 'Cách nhiệt', occupancy: 'Cư trú', building: 'Tòa nhà', peak: 'Giờ cao điểm', zone: 'Khu vực' },
  id: { insulation: 'Isolasi', occupancy: 'Okupansi', building: 'Bangunan', peak: 'Jam sibuk', zone: 'Zona' },
  sv: { insulation: 'Isolering', occupancy: 'Beläggning', building: 'Byggnad', peak: 'Topptimmar', zone: 'Zon' },
}

const FILES = [
  ...['es', 'en', 'pt', 'fr', 'it', 'de', 'nl', 'pl', 'ro', 'ca', 'tr'].map((l) => ({
    locale: l,
    path: join(root, 'sections', `pages-${l}.js`),
  })),
  ...['ar', 'zh', 'ja', 'ko', 'ru', 'hi', 'uk', 'vi', 'id', 'sv'].map((l) => ({
    locale: l,
    path: join(root, 'packs', `${l}.js`),
  })),
]

function patchCategoryBlock(source, extra) {
  const re = /(category:\s*\{)([\s\S]*?)(\n\s*\},)/
  const reJson = /("category":\s*\{)([\s\S]*?)(\n\s*\},)/
  const match = source.match(re) || source.match(reJson)
  if (!match) return { ok: false, source }

  const body = match[2]
  const usesDouble = body.includes('"lighting"') || body.includes('"tech"')
  let next = body

  for (const [key, value] of Object.entries(extra)) {
    const keyRe = usesDouble
      ? new RegExp(`"${key}"\\s*:\\s*"[^"]*"`)
      : new RegExp(`${key}\\s*:\\s*'[^']*'`)
    const line = usesDouble ? `"${key}": "${value}"` : `${key}: '${value}'`
    if (keyRe.test(next)) {
      next = next.replace(keyRe, line)
    } else {
      // insert before closing of tech line's trailing content — append after tech
      const techRe = usesDouble
        ? /("tech"\s*:\s*"[^"]*")/
        : /(tech\s*:\s*'[^']*')/
      if (!techRe.test(next)) return { ok: false, source }
      next = next.replace(techRe, `$1,\n      ${line}`)
    }
  }

  // ensure commas between entries (simple cleanup for trailing before })
  next = next.replace(/,(\s*,)+/g, ',')
  const replaced = source.replace(match[0], match[1] + next + match[3])
  return { ok: true, source: replaced }
}

let patched = 0
for (const file of FILES) {
  const extra = EXTRA[file.locale]
  if (!extra) continue
  let text = readFileSync(file.path, 'utf8')
  const result = patchCategoryBlock(text, extra)
  if (!result.ok) {
    console.error('FAIL', file.path)
    continue
  }
  writeFileSync(file.path, result.source, 'utf8')
  patched++
  console.log('OK', file.locale, file.path)
}
console.log('patched', patched, '/', FILES.length)
