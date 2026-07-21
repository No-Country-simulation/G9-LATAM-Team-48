import { readFileSync, writeFileSync } from 'fs'

const labels = {
  pt: 'Mês',
  fr: 'Mois',
  it: 'Mese',
  de: 'Monat',
  nl: 'Maand',
  pl: 'Miesiąc',
  ro: 'Lună',
  ca: 'Mes',
  tr: 'Ay',
}

for (const [lang, axisMonth] of Object.entries(labels)) {
  const file = `./src/i18n/sections/pages-${lang}.js`
  const raw = readFileSync(file, 'utf8')
  const match = raw.match(/export const (\w+) = (\{[\s\S]*\})\s*$/)
  if (!match) throw new Error(file)
  const [, name, json] = match
  const data = JSON.parse(json)
  data.chart = data.chart || {}
  data.chart.axisMonth = axisMonth
  data.chart.axisKwh = 'kWh'
  writeFileSync(file, `export const ${name} = ${JSON.stringify(data, null, 2)}\n`)
  console.log(lang, axisMonth)
}
