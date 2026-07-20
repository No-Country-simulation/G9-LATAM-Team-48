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
    "subtitle": "Evaluarea consumului după tipul de instalație",
    "installationType": "Tip de instalație",
    "types": {
      "casa": "Casă",
      "fabrica_mediana": "Fabrică medie",
      "fabrica_grande": "Fabrică mare"
    },
    "typeHints": {
      "casa": "Date despre locuință pentru consum pe persoană și climatizare.",
      "fabrica_mediana": "Date operaționale pentru mașini, schimburi și intensitate.",
      "fabrica_grande": "Date de fabrică pentru linii, capacitate și monitorizare."
    },
    "monthlyUsage": "Consum lunar (kWh)",
    "people": "Număr de persoane",
    "devices": "Număr de echipamente",
    "homeArea": "Suprafața locuinței (m²)",
    "climateHours": "Ore de climatizare pe zi",
    "peakUseHours": "Ore de utilizare intensă pe zi",
    "shifts": "Schimburi pe zi",
    "machines": "Număr de mașini",
    "area": "Suprafața fabricii (m²)",
    "hoursPerDay": "Ore de operare pe zi",
    "processIntensity": "Intensitatea procesului",
    "hasCompressedAir": "Folosește aer comprimat?",
    "lines": "Linii de producție",
    "operatingDays": "Zile de operare pe lună",
    "capacityPct": "Capacitate utilizată (%)",
    "hasMonitoring": "Are monitorizare energetică / SCADA?",
    "intensity": {
      "baja": "Scăzută",
      "media": "Medie",
      "alta": "Ridicată"
    },
    "yesNo": {
      "yes": "Da",
      "no": "Nu"
    },
    "submit": "Analizează consumul",
    "submitting": "Se analizează...",
    "panelHint": "Completează câmpurile tipului ales și rulează analiza.",
    "result": "Rezultat IA",
    "level": "Nivel",
    "estimatedSavings": "Economie estimată",
    "tips": "Sugestii pentru îmbunătățirea consumului",
    "confidence": "Încrederea modelului",
    "sourceMl": "model antrenat",
    "sourceLocal": "reguli locale",
    "failed": "Analiza nu a putut fi finalizată.",
    "loginRequired": "Autentifica-te sau inregistreaza-te pentru a analiza si a primi rezultatul pe email.",
    "loginCta": "Autentificare / Inregistrare",
    "emailHint": "Vom trimite analiza la",
    "emailPending": "Iti vom trimite si aceasta analiza pe email in curand.",
    "emailSent": "Ti-am trimis aceasta analiza pe email.",
    "chart": {
      "title": "Consumul tău vs referință",
      "hint": "Referința se ajustează după datele din formular.",
      "empty": "Introdu consumul lunar pentru a vedea graficul.",
      "seriesYours": "Consumul tău",
      "seriesBenchmark": "Referință"
    },
    "levels": {
      "efficient": "Eficient",
      "moderate": "Moderat",
      "inefficient": "Ineficient"
    },
    "tipsList": {
      "led": "Folosește iluminat LED",
      "peak": "Redu consumul în orele de vârf",
      "appliances": "Optimizează folosirea aparatelor",
      "ac": "Redu folosirea aerului condiționat",
      "replace": "Înlocuiește echipamentele vechi",
      "night": "Controlează consumul nocturn",
      "keep": "Păstrează obiceiurile actuale",
      "monitor": "Continuă monitorizarea consumului",
      "insulation": "Îmbunătățește izolarea termică a locuinței",
      "standby": "Oprește standby-ul în orele de utilizare redusă",
      "solar": "Evaluează energia solară pentru vârfuri",
      "shifts": "Mută procesele intensive în afara vârfului",
      "motors": "Verifică eficiența motoarelor și invertorilor",
      "compressedAir": "Detectează scurgeri și optimizează aerul comprimat",
      "processHeat": "Recuperează căldura de proces sau izolează cuptoarele",
      "loadBalancing": "Echilibrează sarcina între mașini și schimburi",
      "idleLines": "Oprește sau hibernază liniile nefolosite",
      "schedules": "Optimizează programul de producție",
      "predictive": "Aplică mentenanță predictivă",
      "scada": "Implementează sau extinde monitorizarea / SCADA",
      "capacity": "Ajustează producția la capacitatea real utilizată"
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
