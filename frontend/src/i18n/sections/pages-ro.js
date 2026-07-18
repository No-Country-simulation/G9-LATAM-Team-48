export const pagesRo = {
  "states": {
    "loading": "Se încarcă...",
    "loadingConsumo": "Se încarcă datele de consum...",
    "loadingHistorial": "Se încarcă istoricul...",
    "loadingRecomendaciones": "Se încarcă recomandările...",
    "empty": "Nu există date de afișat.",
    "error": "Nu s-au putut încărca datele.",
    "retry": "Reîncearcă"
  },
  "dashboard": {
    "title": "EnergyAI Dashboard",
    "subtitle": "Hackathon ONE G9 - TEAM 48",
    "lastMonthUsage": "Consum luna trecută",
    "lastMonthCost": "Cost luna trecută",
    "monthlyAverage": "Medie lunară"
  },
  "consumos": {
    "title": "Consum energetic",
    "subtitle": "Detaliu lunar al consumului în kWh și cost estimat.",
    "totalUsage": "Consum total",
    "totalCost": "Cost total",
    "monthlyAverage": "Medie lunară",
    "history": "Istoric lunar",
    "peak": "Consum maxim",
    "month": "Lună",
    "usageKwh": "Consum (kWh)",
    "estimatedCost": "Cost estimat",
    "status": "Stare",
    "aboveAverage": "Peste medie",
    "normal": "Normal"
  },
  "chart": {
    "title": "Consum energetic lunar (kWh)",
    "actualVsPredicted": "Real vs predicție (kWh)",
    "actualVsPredictedHint": "Mock pentru Data Analysis: compară consumul măsurat cu predicția modelului.",
    "peakVsOffPeak": "Vârf vs în afara vârfului (kWh)",
    "peakVsOffPeakHint": "Mock pentru Data Analysis: împarte consumul pe ore de vârf și restul.",
    "seriesActual": "Real",
    "seriesPredicted": "Predicție",
    "seriesPeak": "Vârf",
    "seriesOffPeak": "În afara vârfului",
    "axisMonth": "Lună",
    "axisKwh": "kWh",
    "confidence": "Încrederea modelului",
    "categories": {
      "LOW_CONSUMPTION": "Consum scăzut",
      "MEDIUM_CONSUMPTION": "Consum mediu",
      "HIGH_CONSUMPTION": "Consum ridicat"
    }
  },
  "analysis": {
    "title": "Analiză inteligentă IA",
    "subtitle": "Evaluarea consumului energetic",
    "monthlyUsage": "Consum lunar (kWh)",
    "people": "Număr de persoane",
    "devices": "Număr de echipamente",
    "submit": "Analizează consumul",
    "submitting": "Se analizează...",
    "result": "Rezultat IA",
    "level": "Nivel",
    "estimatedSavings": "Economie estimată",
    "tips": "Recomandări",
    "failed": "Nu s-a putut finaliza analiza.",
    "levels": {
      "efficient": "Eficient",
      "moderate": "Moderat",
      "inefficient": "Ineficient"
    },
    "tipsList": {
      "led": "Folosiți iluminat LED",
      "peak": "Reduceți consumul la ore de vârf",
      "appliances": "Optimizați electrocasnicele",
      "ac": "Reduceți aerul condiționat",
      "replace": "Înlocuiți echipamente vechi",
      "night": "Controlați consumul nocturn",
      "keep": "Păstrați obiceiurile",
      "monitor": "Continuați monitorizarea"
    }
  },
  "recommendations": {
    "title": "Recomandări IA",
    "subtitle": "Sugestii personalizate pentru optimizarea consumului.",
    "total": "Total recomandări",
    "highPriority": "Prioritate ridicată",
    "potentialSavings": "Economie potențială acumulată",
    "estimatedSavings": "Economie estimată",
    "priority": {
      "high": "Ridicată",
      "medium": "Medie",
      "low": "Scăzută"
    },
    "category": {
      "lighting": "Iluminat",
      "habits": "Obiceiuri",
      "climate": "Climatizare",
      "equipment": "Echipamente",
      "tech": "Tehnologie"
    },
    "items": {
      "1": {
        "title": "Înlocuiți iluminatul tradițional cu LED",
        "description": "Înlocuirea becurilor cu filament poate reduce consumul de iluminat cu până la 80%."
      },
      "2": {
        "title": "Reduceți consumul în orele de vârf",
        "description": "Programați aparatele în afara intervalului 18:00–22:00 pentru a evita vârfurile."
      },
      "3": {
        "title": "Optimizați folosirea aerului condiționat",
        "description": "Mențineți aparatul între 24 °C și 26 °C și folosiți modul eco noaptea."
      },
      "4": {
        "title": "Evaluați echipamentele vechi cu consum mare",
        "description": "Identificați frigidere, cuptoare cu microunde sau mașini de spălat de peste 10 ani."
      },
      "5": {
        "title": "Deconectați încărcătoarele în standby",
        "description": "Evitați consumul fantomă oprind adaptoarele și dispozitivele nefolosite."
      },
      "6": {
        "title": "Instalați un termostat inteligent",
        "description": "Automatizați încălzirea și răcirea după programul de ocupare."
      }
    }
  },
  "months": {
    "january": "Ianuarie",
    "february": "Februarie",
    "march": "Martie",
    "april": "Aprilie",
    "may": "Mai",
    "june": "Iunie"
  },
  "insights": {
    "title": "Cum arată consumul tău?",
    "subtitle": "Rezumat clar, ușor de înțeles acasă sau la firmă.",
    "trend": {
      "up": "În {month} ai consumat cu {pct}% mai mult decât în {prevMonth} ({kwh} kWh în plus).",
      "down": "În {month} ai scăzut cu {pct}% față de {prevMonth} (ai economisit {kwh} kWh).",
      "flat": "În {month} consumul e aproape ca în {prevMonth}."
    },
    "peak": "{pct}% din energia din {month} a fost folosită în ore de vârf (de obicei mai scumpe).",
    "bill": {
      "up": "Factura estimată pe {month}: ${amount} (aprox. ${diff} mai mult decât luna trecută).",
      "down": "Factura estimată pe {month}: ${amount} (aprox. ${diff} mai puțin decât luna trecută).",
      "flat": "Factura estimată pe {month} rămâne ${amount}."
    },
    "level": {
      "good": "Consumul tău e scăzut: merge bine.",
      "ok": "Consumul tău e mediu: mici schimbări mai pot ajuta.",
      "high": "Consumul tău e ridicat: verifică obiceiurile și aparatele mari consumatoare."
    },
    "tip": {
      "good": "Sfat: oprește ce nu folosești și ține aerul condiționat la 24–26 °C.",
      "ok": "Sfat: folosește mașina de spălat în afara 18:00–22:00 ca să plătești mai puțin.",
      "high": "Sfat: verifică aerul condiționat și aparatele vechi; acolo e de obicei cel mai mare cost."
    }
  }
}
