import { readFileSync, writeFileSync } from 'fs'

const itemsByLang = {
  de: {
    1: {
      title: 'Herkömmliche Beleuchtung durch LED ersetzen',
      description:
        'Der Austausch von Glühbirnen kann den Beleuchtungsverbrauch um bis zu 80 % senken.',
    },
    2: {
      title: 'Verbrauch in Spitzenzeiten reduzieren',
      description:
        'Geräte außerhalb von 18:00–22:00 planen, um Lastspitzen zu vermeiden.',
    },
    3: {
      title: 'Klimaanlagennutzung optimieren',
      description:
        'Gerät zwischen 24 °C und 26 °C halten und nachts den Eco-Modus nutzen.',
    },
    4: {
      title: 'Alte Geräte mit hohem Verbrauch prüfen',
      description:
        'Kühlschränke, Mikrowellen oder Waschmaschinen älter als 10 Jahre identifizieren.',
    },
    5: {
      title: 'Ladegeräte im Standby trennen',
      description:
        'Scheinverbrauch vermeiden, indem ungenutzte Adapter und Geräte ausgeschaltet werden.',
    },
    6: {
      title: 'Intelligenten Thermostat installieren',
      description:
        'Heizung und Kühlung automatisch nach Belegungszeiten steuern.',
    },
  },
  fr: {
    1: {
      title: 'Remplacer l’éclairage traditionnel par des LED',
      description:
        'Remplacer les ampoules à incandescence peut réduire jusqu’à 80 % de la consommation d’éclairage.',
    },
    2: {
      title: 'Réduire la consommation aux heures de pointe',
      description:
        'Programmer les appareils hors de la plage 18:00–22:00 pour éviter les pics de demande.',
    },
    3: {
      title: 'Optimiser l’usage de la climatisation',
      description:
        'Maintenir l’appareil entre 24 °C et 26 °C et utiliser le mode éco la nuit.',
    },
    4: {
      title: 'Évaluer les anciens appareils énergivores',
      description:
        'Identifier réfrigérateurs, micro-ondes ou lave-linge de plus de 10 ans.',
    },
    5: {
      title: 'Débrancher les chargeurs en veille',
      description:
        'Éviter la consommation fantôme en éteignant adaptateurs et appareils inutilisés.',
    },
    6: {
      title: 'Installer un thermostat intelligent',
      description:
        'Automatiser chauffage et climatisation selon les horaires d’occupation.',
    },
  },
  it: {
    1: {
      title: 'Sostituire l’illuminazione tradizionale con LED',
      description:
        'Sostituire le lampadine a incandescenza può ridurre fino all’80 % i consumi di illuminazione.',
    },
    2: {
      title: 'Ridurre i consumi nelle ore di punta',
      description:
        'Programmare gli elettrodomestici fuori dall’orario 18:00–22:00 per evitare picchi.',
    },
    3: {
      title: 'Ottimizzare l’uso del condizionatore',
      description:
        'Mantenere l’apparecchio tra 24 °C e 26 °C e usare la modalità eco di notte.',
    },
    4: {
      title: 'Valutare apparecchi vecchi ad alto consumo',
      description:
        'Individuare frigoriferi, microonde o lavatrici con più di 10 anni.',
    },
    5: {
      title: 'Scollegare i caricabatterie in standby',
      description:
        'Evitare i consumi fantasma spegnendo adattatori e dispositivi non usati.',
    },
    6: {
      title: 'Installare un termostato intelligente',
      description:
        'Automatizzare riscaldamento e raffreddamento in base agli orari di presenza.',
    },
  },
  pt: {
    1: {
      title: 'Trocar iluminação tradicional por LED',
      description:
        'Substituir lâmpadas incandescentes pode reduzir até 80% do consumo em iluminação.',
    },
    2: {
      title: 'Reduzir consumo em horários de pico',
      description:
        'Programar eletrodomésticos fora do horário 18:00–22:00 para evitar picos de demanda.',
    },
    3: {
      title: 'Otimizar uso do ar-condicionado',
      description:
        'Manter o equipamento entre 24 °C e 26 °C e usar o modo eco à noite.',
    },
    4: {
      title: 'Avaliar equipamentos antigos de alto consumo',
      description:
        'Identificar geladeiras, micro-ondas ou máquinas de lavar com mais de 10 anos.',
    },
    5: {
      title: 'Desconectar carregadores em standby',
      description:
        'Evitar consumo fantasma desligando adaptadores e equipamentos sem uso.',
    },
    6: {
      title: 'Instalar termostato inteligente',
      description:
        'Automatizar aquecimento e refrigeração conforme horários de ocupação.',
    },
  },
  nl: {
    1: {
      title: 'Traditionele verlichting vervangen door LED',
      description:
        'Gloeilampen vervangen kan het verlichtingsverbruik tot 80% verlagen.',
    },
    2: {
      title: 'Verbruik in piekuren verminderen',
      description:
        'Apparaten buiten 18:00–22:00 plannen om piekvraag te vermijden.',
    },
    3: {
      title: 'Airco-gebruik optimaliseren',
      description:
        'Apparaat tussen 24 °C en 26 °C houden en ’s nachts de eco-modus gebruiken.',
    },
    4: {
      title: 'Oude energieverslindende apparaten beoordelen',
      description:
        'Koelkasten, magnetrons of wasmachines ouder dan 10 jaar identificeren.',
    },
    5: {
      title: 'Opladers in standby loskoppelen',
      description:
        'Sluipverbruik vermijden door ongebruikte adapters en apparaten uit te schakelen.',
    },
    6: {
      title: 'Slimme thermostaat installeren',
      description:
        'Verwarming en koeling automatiseren op basis van aanwezigheidsschema’s.',
    },
  },
  pl: {
    1: {
      title: 'Zamienić tradycyjne oświetlenie na LED',
      description:
        'Wymiana żarówek żarowych może zmniejszyć zużycie oświetlenia nawet o 80%.',
    },
    2: {
      title: 'Zmniejszyć zużycie w godzinach szczytu',
      description:
        'Uruchamiać urządzenia poza godzinami 18:00–22:00, aby uniknąć szczytów.',
    },
    3: {
      title: 'Zoptymalizować użycie klimatyzacji',
      description:
        'Utrzymywać temperaturę 24–26 °C i używać trybu eco w nocy.',
    },
    4: {
      title: 'Sprawdzić stare urządzenia o wysokim zużyciu',
      description:
        'Zidentyfikować lodówki, mikrofale lub pralki starsze niż 10 lat.',
    },
    5: {
      title: 'Odłączać ładowarki w trybie czuwania',
      description:
        'Unikać poboru biernego, wyłączając nieużywane zasilacze i urządzenia.',
    },
    6: {
      title: 'Zainstalować inteligentny termostat',
      description:
        'Automatyzować ogrzewanie i chłodzenie według harmonogramu obecności.',
    },
  },
  ro: {
    1: {
      title: 'Înlocuiți iluminatul tradițional cu LED',
      description:
        'Înlocuirea becurilor cu filament poate reduce consumul de iluminat cu până la 80%.',
    },
    2: {
      title: 'Reduceți consumul în orele de vârf',
      description:
        'Programați aparatele în afara intervalului 18:00–22:00 pentru a evita vârfurile.',
    },
    3: {
      title: 'Optimizați folosirea aerului condiționat',
      description:
        'Mențineți aparatul între 24 °C și 26 °C și folosiți modul eco noaptea.',
    },
    4: {
      title: 'Evaluați echipamentele vechi cu consum mare',
      description:
        'Identificați frigidere, cuptoare cu microunde sau mașini de spălat de peste 10 ani.',
    },
    5: {
      title: 'Deconectați încărcătoarele în standby',
      description:
        'Evitați consumul fantomă oprind adaptoarele și dispozitivele nefolosite.',
    },
    6: {
      title: 'Instalați un termostat inteligent',
      description:
        'Automatizați încălzirea și răcirea după programul de ocupare.',
    },
  },
  ca: {
    1: {
      title: 'Canviar la il·luminació tradicional per LED',
      description:
        'Substituir bombetes incandescents pot reduir fins a un 80% del consum d’il·luminació.',
    },
    2: {
      title: 'Reduir el consum en hores punta',
      description:
        'Programar electrodomèstics fora de l’horari 18:00–22:00 per evitar pics de demanda.',
    },
    3: {
      title: 'Optimitzar l’ús de l’aire condicionat',
      description:
        'Mantenir l’equip entre 24 °C i 26 °C i usar el mode eco a la nit.',
    },
    4: {
      title: 'Avaluar equips antics d’alt consum',
      description:
        'Identificar neveres, microones o rentadores amb més de 10 anys d’ús.',
    },
    5: {
      title: 'Desconnectar carregadors en standby',
      description:
        'Evitar el consum fantasma apagant adaptadors i equips que no s’utilitzen.',
    },
    6: {
      title: 'Instal·lar un termòstat intel·ligent',
      description:
        'Automatitzar calefacció i refrigeració segons els horaris d’ocupació.',
    },
  },
  tr: {
    1: {
      title: 'Geleneksel aydınlatmayı LED ile değiştirin',
      description:
        'Akkor ampulleri değiştirmek aydınlatma tüketimini %80’e kadar azaltabilir.',
    },
    2: {
      title: 'Yoğun saatlerde tüketimi azaltın',
      description:
        'Talebi düşürmek için cihazları 18:00–22:00 dışında çalıştırın.',
    },
    3: {
      title: 'Klima kullanımını optimize edin',
      description:
        'Cihazı 24–26 °C arasında tutun ve geceleri eko modunu kullanın.',
    },
    4: {
      title: 'Eski yüksek tüketimli cihazları değerlendirin',
      description:
        '10 yıldan eski buzdolabı, mikrodalga veya çamaşır makinelerini belirleyin.',
    },
    5: {
      title: 'Beklemedeki şarj cihazlarını çıkarın',
      description:
        'Kullanılmayan adaptör ve cihazları kapatarak fantom tüketimi önleyin.',
    },
    6: {
      title: 'Akıllı termostat kurun',
      description:
        'Isıtma ve soğutmayı doluluk saatlerine göre otomatikleştirin.',
    },
  },
}

for (const [lang, items] of Object.entries(itemsByLang)) {
  const file = `./src/i18n/sections/pages-${lang}.js`
  const raw = readFileSync(file, 'utf8')
  const match = raw.match(/export const (\w+) = (\{[\s\S]*\})\s*$/)
  if (!match) throw new Error(`Cannot parse ${file}`)
  const name = match[1]
  const data = JSON.parse(match[2])
  data.recommendations.items = items
  if (lang === 'de') {
    data.dashboard.title = 'EnergyAI Übersicht'
  }
  writeFileSync(file, `export const ${name} = ${JSON.stringify(data, null, 2)}\n`)
  console.log('patched', lang)
}
