import { readFileSync, writeFileSync } from 'fs'

const titles = {
  pt: 'Como está o seu consumo?',
  fr: 'Comment va votre consommation ?',
  it: 'Come va il tuo consumo?',
  de: 'Wie ist Ihr Verbrauch?',
  nl: 'Hoe staat je verbruik?',
  pl: 'Jak wygląda Twoje zużycie?',
  ro: 'Cum arată consumul tău?',
  ca: 'Com va el teu consum?',
  tr: 'Tüketimin nasıl?',
}

const exportNames = {
  pt: 'pagesPt',
  fr: 'pagesFr',
  it: 'pagesIt',
  de: 'pagesDe',
  nl: 'pagesNl',
  pl: 'pagesPl',
  ro: 'pagesRo',
  ca: 'pagesCa',
  tr: 'pagesTr',
}

for (const [lang, title] of Object.entries(titles)) {
  const file = `./src/i18n/sections/pages-${lang}.js`
  const raw = readFileSync(file, 'utf8')
  const match = raw.match(/export const (\w+) = (\{[\s\S]*\})\s*$/)
  const data = JSON.parse(match[2])
  data.insights.title = title
  writeFileSync(
    file,
    `export const ${exportNames[lang]} = ${JSON.stringify(data, null, 2)}\n`,
  )
  console.log(lang, title)
}
