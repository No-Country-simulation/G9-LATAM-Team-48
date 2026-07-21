import { readFileSync, writeFileSync } from 'fs'

const chartByLang = {
  pt: {
    title: 'Consumo energético mensal (kWh)',
    actualVsPredicted: 'Real vs previsão (kWh)',
    actualVsPredictedHint:
      'Mock para Data Analysis: comparar consumo medido com a previsão do modelo.',
    peakVsOffPeak: 'Pico vs fora de pico (kWh)',
    peakVsOffPeakHint:
      'Mock para Data Analysis: separar consumo em horário de pico e fora de pico.',
    seriesActual: 'Real',
    seriesPredicted: 'Previsto',
    seriesPeak: 'Pico',
    seriesOffPeak: 'Fora de pico',
    axisMonth: 'Mês',
    axisKwh: 'kWh',
    confidence: 'Confiança do modelo',
    categories: {
      LOW_CONSUMPTION: 'Consumo baixo',
      MEDIUM_CONSUMPTION: 'Consumo médio',
      HIGH_CONSUMPTION: 'Consumo alto',
    },
  },
  fr: {
    title: 'Consommation énergétique mensuelle (kWh)',
    actualVsPredicted: 'Réel vs prévision (kWh)',
    actualVsPredictedHint:
      'Mock pour Data Analysis : comparer la conso mesurée à la prévision du modèle.',
    peakVsOffPeak: 'Pointe vs heures creuses (kWh)',
    peakVsOffPeakHint:
      'Mock pour Data Analysis : séparer la conso en heures de pointe et creuses.',
    seriesActual: 'Réel',
    seriesPredicted: 'Prévu',
    seriesPeak: 'Pointe',
    seriesOffPeak: 'Heures creuses',
    axisMonth: 'Mois',
    axisKwh: 'kWh',
    confidence: 'Confiance du modèle',
    categories: {
      LOW_CONSUMPTION: 'Faible consommation',
      MEDIUM_CONSUMPTION: 'Consommation moyenne',
      HIGH_CONSUMPTION: 'Forte consommation',
    },
  },
  it: {
    title: 'Consumo energetico mensile (kWh)',
    actualVsPredicted: 'Reale vs previsione (kWh)',
    actualVsPredictedHint:
      'Mock per Data Analysis: confrontare il consumo misurato con la previsione del modello.',
    peakVsOffPeak: 'Picco vs fuori picco (kWh)',
    peakVsOffPeakHint:
      'Mock per Data Analysis: suddividere il consumo in ore di punta e fuori punta.',
    seriesActual: 'Reale',
    seriesPredicted: 'Previsto',
    seriesPeak: 'Picco',
    seriesOffPeak: 'Fuori picco',
    axisMonth: 'Mese',
    axisKwh: 'kWh',
    confidence: 'Affidabilità del modello',
    categories: {
      LOW_CONSUMPTION: 'Consumo basso',
      MEDIUM_CONSUMPTION: 'Consumo medio',
      HIGH_CONSUMPTION: 'Consumo alto',
    },
  },
  de: {
    title: 'Monatlicher Energieverbrauch (kWh)',
    actualVsPredicted: 'Ist vs Prognose (kWh)',
    actualVsPredictedHint:
      'Mock für Data Analysis: gemessenen Verbrauch mit der Modellprognose vergleichen.',
    peakVsOffPeak: 'Spitze vs Nebenzeit (kWh)',
    peakVsOffPeakHint:
      'Mock für Data Analysis: Verbrauch in Spitzen- und Nebenzeiten aufteilen.',
    seriesActual: 'Ist',
    seriesPredicted: 'Prognose',
    seriesPeak: 'Spitze',
    seriesOffPeak: 'Nebenzeit',
    axisMonth: 'Monat',
    axisKwh: 'kWh',
    confidence: 'Modellvertrauen',
    categories: {
      LOW_CONSUMPTION: 'Niedriger Verbrauch',
      MEDIUM_CONSUMPTION: 'Mittlerer Verbrauch',
      HIGH_CONSUMPTION: 'Hoher Verbrauch',
    },
  },
  nl: {
    title: 'Maandelijks energieverbruik (kWh)',
    actualVsPredicted: 'Werkelijk vs voorspelling (kWh)',
    actualVsPredictedHint:
      'Mock voor Data Analysis: gemeten verbruik vergelijken met de modelvoorspelling.',
    peakVsOffPeak: 'Piek vs daluren (kWh)',
    peakVsOffPeakHint:
      'Mock voor Data Analysis: verbruik splitsen in piek- en daluren.',
    seriesActual: 'Werkelijk',
    seriesPredicted: 'Voorspeld',
    seriesPeak: 'Piek',
    seriesOffPeak: 'Daluren',
    axisMonth: 'Maand',
    axisKwh: 'kWh',
    confidence: 'Modelbetrouwbaarheid',
    categories: {
      LOW_CONSUMPTION: 'Laag verbruik',
      MEDIUM_CONSUMPTION: 'Gemiddeld verbruik',
      HIGH_CONSUMPTION: 'Hoog verbruik',
    },
  },
  pl: {
    title: 'Miesięczne zużycie energii (kWh)',
    actualVsPredicted: 'Rzeczywiste vs prognoza (kWh)',
    actualVsPredictedHint:
      'Mock dla Data Analysis: porównanie zużycia z prognozą modelu.',
    peakVsOffPeak: 'Szczyt vs poza szczytem (kWh)',
    peakVsOffPeakHint:
      'Mock dla Data Analysis: podział zużycia na godziny szczytu i poza szczytem.',
    seriesActual: 'Rzeczywiste',
    seriesPredicted: 'Prognoza',
    seriesPeak: 'Szczyt',
    seriesOffPeak: 'Poza szczytem',
    axisMonth: 'Miesiąc',
    axisKwh: 'kWh',
    confidence: 'Pewność modelu',
    categories: {
      LOW_CONSUMPTION: 'Niskie zużycie',
      MEDIUM_CONSUMPTION: 'Średnie zużycie',
      HIGH_CONSUMPTION: 'Wysokie zużycie',
    },
  },
  ro: {
    title: 'Consum energetic lunar (kWh)',
    actualVsPredicted: 'Real vs predicție (kWh)',
    actualVsPredictedHint:
      'Mock pentru Data Analysis: compară consumul măsurat cu predicția modelului.',
    peakVsOffPeak: 'Vârf vs în afara vârfului (kWh)',
    peakVsOffPeakHint:
      'Mock pentru Data Analysis: împarte consumul pe ore de vârf și restul.',
    seriesActual: 'Real',
    seriesPredicted: 'Predicție',
    seriesPeak: 'Vârf',
    seriesOffPeak: 'În afara vârfului',
    axisMonth: 'Lună',
    axisKwh: 'kWh',
    confidence: 'Încrederea modelului',
    categories: {
      LOW_CONSUMPTION: 'Consum scăzut',
      MEDIUM_CONSUMPTION: 'Consum mediu',
      HIGH_CONSUMPTION: 'Consum ridicat',
    },
  },
  ca: {
    title: 'Consum energètic mensual (kWh)',
    actualVsPredicted: 'Real vs predicció (kWh)',
    actualVsPredictedHint:
      'Mock per a Data Analysis: comparar el consum mesurat amb la predicció del model.',
    peakVsOffPeak: 'Punta vs vall (kWh)',
    peakVsOffPeakHint:
      'Mock per a Data Analysis: desglossar el consum en hores punta i fora de punta.',
    seriesActual: 'Real',
    seriesPredicted: 'Predit',
    seriesPeak: 'Punta',
    seriesOffPeak: 'Vall',
    axisMonth: 'Mes',
    axisKwh: 'kWh',
    confidence: 'Confiança del model',
    categories: {
      LOW_CONSUMPTION: 'Consum baix',
      MEDIUM_CONSUMPTION: 'Consum mitjà',
      HIGH_CONSUMPTION: 'Consum alt',
    },
  },
  tr: {
    title: 'Aylık enerji tüketimi (kWh)',
    actualVsPredicted: 'Gerçek vs tahmin (kWh)',
    actualVsPredictedHint:
      'Data Analysis için mock: ölçülen tüketimi model tahminiyle karşılaştır.',
    peakVsOffPeak: 'Yoğun vs sakin saat (kWh)',
    peakVsOffPeakHint:
      'Data Analysis için mock: tüketimi yoğun ve sakin saatlere ayır.',
    seriesActual: 'Gerçek',
    seriesPredicted: 'Tahmin',
    seriesPeak: 'Yoğun',
    seriesOffPeak: 'Sakin',
    axisMonth: 'Ay',
    axisKwh: 'kWh',
    confidence: 'Model güveni',
    categories: {
      LOW_CONSUMPTION: 'Düşük tüketim',
      MEDIUM_CONSUMPTION: 'Orta tüketim',
      HIGH_CONSUMPTION: 'Yüksek tüketim',
    },
  },
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

for (const [lang, chart] of Object.entries(chartByLang)) {
  const file = `./src/i18n/sections/pages-${lang}.js`
  const raw = readFileSync(file, 'utf8')
  const match = raw.match(/export const (\w+) = (\{[\s\S]*\})\s*$/)
  if (!match) throw new Error(`Cannot parse ${file}`)
  const data = JSON.parse(match[2])
  data.chart = chart
  writeFileSync(
    file,
    `export const ${exportNames[lang]} = ${JSON.stringify(data, null, 2)}\n`,
  )
  console.log('chart full ->', lang)
}
