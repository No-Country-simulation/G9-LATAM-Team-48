import { readFileSync, writeFileSync } from 'fs'

const insightsByLang = {
  pt: {
    title: 'Em palavras simples: como está o seu consumo?',
    subtitle:
      'Resumo claro, pensado para qualquer pessoa em casa ou na empresa.',
    trend: {
      up: 'Em {month} você usou {pct}% mais energia do que em {prevMonth} ({kwh} kWh a mais).',
      down: 'Em {month} você baixou {pct}% em relação a {prevMonth} (economizou {kwh} kWh).',
      flat: 'Em {month} o consumo ficou quase igual ao de {prevMonth}.',
    },
    peak: '{pct}% da sua energia em {month} foi usada no horário de pico (em geral mais caro).',
    bill: {
      up: 'A conta estimada de {month} é ${amount} (cerca de ${diff} a mais que no mês anterior).',
      down: 'A conta estimada de {month} é ${amount} (cerca de ${diff} a menos que no mês anterior).',
      flat: 'A conta estimada de {month} permanece em ${amount}.',
    },
    level: {
      good: 'Seu consumo está baixo: você está indo bem.',
      ok: 'Seu consumo está médio: ainda dá para melhorar com mudanças pequenas.',
      high: 'Seu consumo está alto: vale revisar hábitos e equipamentos que mais gastam.',
    },
    tip: {
      good: 'Dica: continue desligando o que não usa e mantenha o ar perto de 24–26 °C.',
      ok: 'Dica: use máquina de lavar fora de 18:00–22:00 para pagar menos.',
      high: 'Dica: revise ar-condicionado e aparelhos antigos; aí costuma estar o maior gasto.',
    },
  },
  fr: {
    title: 'En clair : comment va votre conso ?',
    subtitle:
      'Résumé simple, compréhensible par toute personne à la maison ou au travail.',
    trend: {
      up: 'En {month}, vous avez consommé {pct}% de plus qu’en {prevMonth} ({kwh} kWh de plus).',
      down: 'En {month}, vous avez baissé de {pct}% par rapport à {prevMonth} ({kwh} kWh économisés).',
      flat: 'En {month}, votre conso est presque la même qu’en {prevMonth}.',
    },
    peak: '{pct}% de votre énergie en {month} a été utilisée aux heures de pointe (souvent plus chères).',
    bill: {
      up: 'Facture estimée de {month} : ${amount} (environ ${diff} de plus que le mois dernier).',
      down: 'Facture estimée de {month} : ${amount} (environ ${diff} de moins que le mois dernier).',
      flat: 'Facture estimée de {month} : toujours ${amount}.',
    },
    level: {
      good: 'Votre conso est basse : c’est bien.',
      ok: 'Votre conso est moyenne : de petits gestes peuvent encore aider.',
      high: 'Votre conso est élevée : regardez les habitudes et les appareils gourmands.',
    },
    tip: {
      good: 'Conseil : continuez d’éteindre l’inutile et gardez la clim vers 24–26 °C.',
      ok: 'Conseil : lancez lave-linge ou lave-vaisselle hors 18:00–22:00 pour payer moins.',
      high: 'Conseil : vérifiez clim et vieux appareils ; c’est souvent le plus gros poste.',
    },
  },
  it: {
    title: 'In parole semplici: come va il consumo?',
    subtitle:
      'Riassunto chiaro, pensato per chiunque in casa o in azienda.',
    trend: {
      up: 'A {month} hai usato il {pct}% di energia in più rispetto a {prevMonth} ({kwh} kWh in più).',
      down: 'A {month} hai ridotto del {pct}% rispetto a {prevMonth} (risparmiati {kwh} kWh).',
      flat: 'A {month} il consumo è quasi uguale a {prevMonth}.',
    },
    peak: 'Il {pct}% dell’energia di {month} è stata usata nelle ore di punta (di solito più care).',
    bill: {
      up: 'Bolletta stimata di {month}: ${amount} (circa ${diff} in più del mese scorso).',
      down: 'Bolletta stimata di {month}: ${amount} (circa ${diff} in meno del mese scorso).',
      flat: 'Bolletta stimata di {month}: sempre ${amount}.',
    },
    level: {
      good: 'Il tuo consumo è basso: stai andando bene.',
      ok: 'Il tuo consumo è medio: piccoli cambiamenti possono ancora aiutare.',
      high: 'Il tuo consumo è alto: conviene controllare abitudini e apparecchi.',
    },
    tip: {
      good: 'Consiglio: continua a spegnere ciò che non usi e tieni il clima a 24–26 °C.',
      ok: 'Consiglio: usa lavatrice o lavastoviglie fuori dalle 18:00–22:00 per pagare meno.',
      high: 'Consiglio: controlla clima e apparecchi vecchi; lì di solito c’è la spesa maggiore.',
    },
  },
  de: {
    title: 'Einfach erklärt: Wie ist Ihr Verbrauch?',
    subtitle:
      'Klarer Überblick für alle – zu Hause oder im Betrieb.',
    trend: {
      up: 'Im {month} haben Sie {pct}% mehr Energie verbraucht als im {prevMonth} ({kwh} kWh mehr).',
      down: 'Im {month} sind Sie {pct}% unter {prevMonth} ({kwh} kWh gespart).',
      flat: 'Im {month} war der Verbrauch fast wie im {prevMonth}.',
    },
    peak: '{pct}% Ihrer Energie im {month} fiel in die Spitzenzeiten (meist teurer).',
    bill: {
      up: 'Geschätzte Rechnung für {month}: ${amount} (etwa ${diff} mehr als im Vormonat).',
      down: 'Geschätzte Rechnung für {month}: ${amount} (etwa ${diff} weniger als im Vormonat).',
      flat: 'Geschätzte Rechnung für {month} bleibt bei ${amount}.',
    },
    level: {
      good: 'Ihr Verbrauch ist niedrig: Sie liegen gut.',
      ok: 'Ihr Verbrauch ist mittel: kleine Änderungen können noch helfen.',
      high: 'Ihr Verbrauch ist hoch: prüfen Sie Gewohnheiten und starke Verbraucher.',
    },
    tip: {
      good: 'Tipp: ungenutzte Geräte aus und Klima bei 24–26 °C lassen.',
      ok: 'Tipp: Waschmaschine außerhalb von 18:00–22:00 laufen lassen – oft günstiger.',
      high: 'Tipp: Klima und alte Geräte prüfen; dort liegt meist der größte Anteil.',
    },
  },
  nl: {
    title: 'Eenvoudig gezegd: hoe staat je verbruik?',
    subtitle:
      'Duidelijke samenvatting voor iedereen thuis of op het werk.',
    trend: {
      up: 'In {month} gebruikte je {pct}% meer energie dan in {prevMonth} ({kwh} kWh meer).',
      down: 'In {month} daalde je {pct}% t.o.v. {prevMonth} ({kwh} kWh bespaard).',
      flat: 'In {month} was het verbruik bijna gelijk aan {prevMonth}.',
    },
    peak: '{pct}% van je energie in {month} viel in piekuren (vaak duurder).',
    bill: {
      up: 'Geschatte rekening voor {month}: ${amount} (ongeveer ${diff} meer dan vorige maand).',
      down: 'Geschatte rekening voor {month}: ${amount} (ongeveer ${diff} minder dan vorige maand).',
      flat: 'Geschatte rekening voor {month} blijft ${amount}.',
    },
    level: {
      good: 'Je verbruik is laag: je doet het goed.',
      ok: 'Je verbruik is gemiddeld: kleine veranderingen helpen nog.',
      high: 'Je verbruik is hoog: bekijk gewoonten en energievreters.',
    },
    tip: {
      good: 'Tip: blijf ongebruikte apparaten uit zetten en houd airco rond 24–26 °C.',
      ok: 'Tip: draai wasmachine buiten 18:00–22:00 om minder te betalen.',
      high: 'Tip: check airco en oude apparaten; daar zit vaak de grootste kostenpost.',
    },
  },
  pl: {
    title: 'Prosto mówiąc: jak wygląda zużycie?',
    subtitle:
      'Jasne podsumowanie dla każdego w domu lub firmie.',
    trend: {
      up: 'W {month} zużyłeś o {pct}% więcej energii niż w {prevMonth} (o {kwh} kWh więcej).',
      down: 'W {month} spadło o {pct}% względem {prevMonth} (zaoszczędzono {kwh} kWh).',
      flat: 'W {month} zużycie było prawie jak w {prevMonth}.',
    },
    peak: '{pct}% energii w {month} przypadło na godziny szczytu (zwykle droższe).',
    bill: {
      up: 'Szacowany rachunek za {month}: ${amount} (ok. ${diff} więcej niż poprzednio).',
      down: 'Szacowany rachunek za {month}: ${amount} (ok. ${diff} mniej niż poprzednio).',
      flat: 'Szacowany rachunek za {month} wynosi nadal ${amount}.',
    },
    level: {
      good: 'Zużycie jest niskie: idzie dobrze.',
      ok: 'Zużycie jest średnie: drobne zmiany nadal pomogą.',
      high: 'Zużycie jest wysokie: sprawdź nawyki i urządzenia.',
    },
    tip: {
      good: 'Wskazówka: wyłączaj nieużywane urządzenia i trzymaj klimatyzację na 24–26 °C.',
      ok: 'Wskazówka: piorąc poza 18:00–22:00 zwykle płacisz mniej.',
      high: 'Wskazówka: sprawdź klimatyzację i stare urządzenia — tam zwykle największy koszt.',
    },
  },
  ro: {
    title: 'Pe scurt: cum arată consumul tău?',
    subtitle:
      'Rezumat clar, ușor de înțeles acasă sau la firmă.',
    trend: {
      up: 'În {month} ai consumat cu {pct}% mai mult decât în {prevMonth} ({kwh} kWh în plus).',
      down: 'În {month} ai scăzut cu {pct}% față de {prevMonth} (ai economisit {kwh} kWh).',
      flat: 'În {month} consumul e aproape ca în {prevMonth}.',
    },
    peak: '{pct}% din energia din {month} a fost folosită în ore de vârf (de obicei mai scumpe).',
    bill: {
      up: 'Factura estimată pe {month}: ${amount} (aprox. ${diff} mai mult decât luna trecută).',
      down: 'Factura estimată pe {month}: ${amount} (aprox. ${diff} mai puțin decât luna trecută).',
      flat: 'Factura estimată pe {month} rămâne ${amount}.',
    },
    level: {
      good: 'Consumul tău e scăzut: merge bine.',
      ok: 'Consumul tău e mediu: mici schimbări mai pot ajuta.',
      high: 'Consumul tău e ridicat: verifică obiceiurile și aparatele mari consumatoare.',
    },
    tip: {
      good: 'Sfat: oprește ce nu folosești și ține aerul condiționat la 24–26 °C.',
      ok: 'Sfat: folosește mașina de spălat în afara 18:00–22:00 ca să plătești mai puțin.',
      high: 'Sfat: verifică aerul condiționat și aparatele vechi; acolo e de obicei cel mai mare cost.',
    },
  },
  ca: {
    title: 'En paraules senzilles: com va el consum?',
    subtitle:
      'Resum clar perquè qualsevol persona a casa o a l’empresa l’entengui.',
    trend: {
      up: 'Al {month} vas usar un {pct}% més d’energia que al {prevMonth} ({kwh} kWh de més).',
      down: 'Al {month} vas baixar un {pct}% respecte al {prevMonth} (vas estalviar {kwh} kWh).',
      flat: 'Al {month} el consum va ser gairebé igual que al {prevMonth}.',
    },
    peak: 'El {pct}% de l’energia del {month} es va usar en hores punta (sol ser més cara).',
    bill: {
      up: 'La factura estimada del {month} és ${amount} (uns ${diff} més que el mes anterior).',
      down: 'La factura estimada del {month} és ${amount} (uns ${diff} menys que el mes anterior).',
      flat: 'La factura estimada del {month} es manté en ${amount}.',
    },
    level: {
      good: 'El teu consum és baix: vas bé.',
      ok: 'El teu consum és mitjà: encara pots millorar amb canvis petits.',
      high: 'El teu consum és alt: convé revisar hàbits i equips que més gasten.',
    },
    tip: {
      good: 'Consell: continua apagant el que no facis servir i mantén l’aire a 24–26 °C.',
      ok: 'Consell: posa la rentadora fora de 18:00–22:00 per pagar menys.',
      high: 'Consell: revisa l’aire condicionat i equips vells; allà sol ser la despesa més gran.',
    },
  },
  tr: {
    title: 'Basitçe: tüketimin nasıl?',
    subtitle:
      'Evde veya işte herkesin anlayacağı net bir özet.',
    trend: {
      up: '{month} ayında {prevMonth} ayına göre %{pct} daha fazla enerji kullandın ({kwh} kWh fazla).',
      down: '{month} ayında {prevMonth} ayına göre %{pct} azaldı ({kwh} kWh tasarruf).',
      flat: '{month} ayında tüketim {prevMonth} ile neredeyse aynı.',
    },
    peak: '{month} ayındaki enerjinin %{pct}’i yoğun saatlerde kullanıldı (genelde daha pahalı).',
    bill: {
      up: '{month} için tahmini fatura ${amount} (önceki aya göre yaklaşık ${diff} fazla).',
      down: '{month} için tahmini fatura ${amount} (önceki aya göre yaklaşık ${diff} az).',
      flat: '{month} için tahmini fatura ${amount} olarak kaldı.',
    },
    level: {
      good: 'Tüketimin düşük: iyi gidiyorsun.',
      ok: 'Tüketimin orta: küçük değişiklikler hâlâ yardımcı olabilir.',
      high: 'Tüketimin yüksek: alışkanlıkları ve çok harcayan cihazları kontrol et.',
    },
    tip: {
      good: 'İpucu: kullanmadığın cihazları kapatmaya devam et, klimayı 24–26 °C civarında tut.',
      ok: 'İpucu: çamaşır makinesini 18:00–22:00 dışında çalıştırarak daha az öde.',
      high: 'İpucu: klima ve eski cihazları gözden geçir; en büyük maliyet genelde orada.',
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

for (const [lang, insights] of Object.entries(insightsByLang)) {
  const file = `./src/i18n/sections/pages-${lang}.js`
  const raw = readFileSync(file, 'utf8')
  const match = raw.match(/export const (\w+) = (\{[\s\S]*\})\s*$/)
  if (!match) throw new Error(`Cannot parse ${file}`)
  const data = JSON.parse(match[2])
  data.insights = insights
  writeFileSync(
    file,
    `export const ${exportNames[lang]} = ${JSON.stringify(data, null, 2)}\n`,
  )
  console.log('insights ->', lang)
}
