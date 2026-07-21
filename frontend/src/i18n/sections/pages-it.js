export const pagesIt = {
  "states": {
    "loading": "Caricamento...",
    "loadingConsumo": "Caricamento dati di consumo...",
    "loadingHistorial": "Caricamento cronologia...",
    "loadingRecomendaciones": "Caricamento raccomandazioni...",
    "empty": "Nessun dato da mostrare.",
    "error": "Impossibile caricare i dati.",
    "retry": "Riprova"
  },
  "dashboard": {
    "title": "EnergyAI Dashboard",
    "subtitle": "Hackathon ONE G9 - TEAM 48",
    "lastMonthUsage": "Consumo ultimo mese",
    "lastMonthCost": "Costo ultimo mese",
    "monthlyAverage": "Media mensile"
  },
  "consumos": {
    "title": "Consumi energetici",
    "subtitle": "Dettaglio mensile di kWh e costo stimato.",
    "totalUsage": "Consumo totale",
    "totalCost": "Costo totale",
    "monthlyAverage": "Media mensile",
    "history": "Cronologia mensile",
    "peak": "Consumo massimo",
    "month": "Mese",
    "usageKwh": "Consumo (kWh)",
    "estimatedCost": "Costo stimato",
    "status": "Stato",
    "aboveAverage": "Sopra la media",
    "normal": "Normale"
  },
  "chart": {
    "title": "Consumo energetico mensile (kWh)",
    "actualVsPredicted": "Reale vs previsione (kWh)",
    "actualVsPredictedHint": "Mock per Data Analysis: confrontare il consumo misurato con la previsione del modello.",
    "peakVsOffPeak": "Picco vs fuori picco (kWh)",
    "peakVsOffPeakHint": "Mock per Data Analysis: suddividere il consumo in ore di punta e fuori punta.",
    "seriesActual": "Reale",
    "seriesPredicted": "Previsto",
    "seriesPeak": "Picco",
    "seriesOffPeak": "Fuori picco",
    "axisMonth": "Mese",
    "axisKwh": "kWh",
    "confidence": "Affidabilità del modello",
    "categories": {
      "LOW_CONSUMPTION": "Consumo basso",
      "MEDIUM_CONSUMPTION": "Consumo medio",
      "HIGH_CONSUMPTION": "Consumo alto"
    }
  },
  "analysis": {
    "title": "Analisi intelligente IA",
    "subtitle": "Valutazione dei consumi in base al tipo di impianto",
    "installationType": "Tipo di impianto",
    "types": {
      "casa": "Casa",
      "fabrica_mediana": "Fabbrica media",
      "fabrica_grande": "Grande fabbrica"
    },
    "typeHints": {
      "casa": "Dati domestici per stimare consumo pro capite e climatizzazione.",
      "fabrica_mediana": "Dati operativi per confrontare macchine, turni e intensità.",
      "fabrica_grande": "Dati di impianto per valutare linee, capacità e monitoraggio."
    },
    "monthlyUsage": "Consumo mensile (kWh)",
    "people": "Numero di persone",
    "devices": "Numero di dispositivi",
    "homeArea": "Superficie abitazione (m²)",
    "climateHours": "Ore di climatizzazione al giorno",
    "peakUseHours": "Ore di uso intensivo al giorno",
    "shifts": "Turni al giorno",
    "machines": "Numero di macchine",
    "area": "Area dello stabilimento (m²)",
    "hoursPerDay": "Ore di esercizio al giorno",
    "processIntensity": "Intensità del processo",
    "hasCompressedAir": "Usa aria compressa?",
    "lines": "Linee di produzione",
    "operatingDays": "Giorni di esercizio al mese",
    "capacityPct": "Capacità utilizzata (%)",
    "hasMonitoring": "Ha monitoraggio energetico / SCADA?",
    "intensity": {
      "baja": "Bassa",
      "media": "Media",
      "alta": "Alta"
    },
    "yesNo": {
      "yes": "Sì",
      "no": "No"
    },
    "submit": "Analizza consumo",
    "submitting": "Analisi...",
    "panelHint": "Compila i campi del tipo scelto e avvia l’analisi.",
    "result": "Risultato IA",
    "level": "Livello",
    "estimatedSavings": "Risparmio stimato",
    "tips": "Suggerimenti per migliorare i consumi",
    "confidence": "Affidabilità del modello",
    "sourceMl": "modello addestrato",
    "sourceLocal": "regole locali",
    "failed": "Impossibile completare l'analisi.",
    "loginRequired": "Accedi o registrati per analizzare e ricevere il risultato via email.",
    "loginCta": "Accedi / Registrati",
    "emailHint": "Invieremo l'analisi a",
    "emailPending": "Ti invieremo anche questa analisi via email a breve.",
    "emailSent": "Ti abbiamo inviato questa analisi via email.",
    "chart": {
      "title": "Il tuo consumo vs riferimento",
      "hint": "Il riferimento si adatta ai dati del modulo.",
      "empty": "Inserisci il consumo mensile per vedere il grafico.",
      "seriesYours": "Il tuo consumo",
      "seriesBenchmark": "Riferimento"
    },
    "levels": {
      "efficient": "Efficiente",
      "moderate": "Moderato",
      "inefficient": "Inefficiente"
    },
    "tipsList": {
      "led": "Usare illuminazione LED",
      "peak": "Ridurre i consumi nelle ore di punta",
      "appliances": "Ottimizzare l'uso degli elettrodomestici",
      "ac": "Ridurre l'uso del condizionatore",
      "replace": "Sostituire attrezzature obsolete",
      "night": "Controllare i consumi notturni",
      "keep": "Mantenere le abitudini attuali",
      "monitor": "Continuare a monitorare i consumi",
      "insulation": "Migliorare l'isolamento termico dell'abitazione",
      "standby": "Tagliare lo standby nelle ore di basso uso",
      "solar": "Valutare il fotovoltaico per coprire i picchi",
      "shifts": "Spostare i processi intensivi fuori punta",
      "motors": "Verificare l'efficienza di motori e inverter",
      "compressedAir": "Rilevare perdite e ottimizzare l'aria compressa",
      "processHeat": "Recuperare calore di processo o isolare forni",
      "loadBalancing": "Bilanciare il carico tra macchine e turni",
      "idleLines": "Spegnere o mettere in idle le linee inutilizzate",
      "schedules": "Ottimizzare i piani di produzione",
      "predictive": "Applicare manutenzione predittiva",
      "scada": "Implementare o ampliare monitoraggio / SCADA",
      "capacity": "Allineare la produzione alla capacità reale"
    }
  },
  "recommendations": {
    "title": "Raccomandazioni IA",
    "subtitle": "Suggerimenti personalizzati per ottimizzare i consumi.",
    "total": "Totale raccomandazioni",
    "highPriority": "Priorità alta",
    "potentialSavings": "Risparmio potenziale accumulato",
    "estimatedSavings": "Risparmio stimato",
    "priority": {
      "high": "Alta",
      "medium": "Media",
      "low": "Bassa"
    },
    "category": {
      "lighting": "Illuminazione",
      "habits": "Abitudini",
      "climate": "Climatizzazione",
      "equipment": "Apparecchiature",
      "tech": "Tecnologia"
    },
    "items": {
      "1": {
        "title": "Sostituire l’illuminazione tradizionale con LED",
        "description": "Sostituire le lampadine a incandescenza può ridurre fino all’80 % i consumi di illuminazione."
      },
      "2": {
        "title": "Ridurre i consumi nelle ore di punta",
        "description": "Programmare gli elettrodomestici fuori dall’orario 18:00–22:00 per evitare picchi."
      },
      "3": {
        "title": "Ottimizzare l’uso del condizionatore",
        "description": "Mantenere l’apparecchio tra 24 °C e 26 °C e usare la modalità eco di notte."
      },
      "4": {
        "title": "Valutare apparecchi vecchi ad alto consumo",
        "description": "Individuare frigoriferi, microonde o lavatrici con più di 10 anni."
      },
      "5": {
        "title": "Scollegare i caricabatterie in standby",
        "description": "Evitare i consumi fantasma spegnendo adattatori e dispositivi non usati."
      },
      "6": {
        "title": "Installare un termostato intelligente",
        "description": "Automatizzare riscaldamento e raffreddamento in base agli orari di presenza."
      }
    }
  },
  "months": {
    "january": "Gennaio",
    "february": "Febbraio",
    "march": "Marzo",
    "april": "Aprile",
    "may": "Maggio",
    "june": "Giugno"
  },
  "insights": {
    "title": "Come va il tuo consumo?",
    "subtitle": "Riassunto chiaro, pensato per chiunque in casa o in azienda.",
    "trend": {
      "up": "A {month} hai usato il {pct}% di energia in più rispetto a {prevMonth} ({kwh} kWh in più).",
      "down": "A {month} hai ridotto del {pct}% rispetto a {prevMonth} (risparmiati {kwh} kWh).",
      "flat": "A {month} il consumo è quasi uguale a {prevMonth}."
    },
    "peak": "Il {pct}% dell’energia di {month} è stata usata nelle ore di punta (di solito più care).",
    "bill": {
      "up": "Bolletta stimata di {month}: ${amount} (circa ${diff} in più del mese scorso).",
      "down": "Bolletta stimata di {month}: ${amount} (circa ${diff} in meno del mese scorso).",
      "flat": "Bolletta stimata di {month}: sempre ${amount}."
    },
    "level": {
      "good": "Il tuo consumo è basso: stai andando bene.",
      "ok": "Il tuo consumo è medio: piccoli cambiamenti possono ancora aiutare.",
      "high": "Il tuo consumo è alto: conviene controllare abitudini e apparecchi."
    },
    "tip": {
      "good": "Consiglio: continua a spegnere ciò che non usi e tieni il clima a 24–26 °C.",
      "ok": "Consiglio: usa lavatrice o lavastoviglie fuori dalle 18:00–22:00 per pagare meno.",
      "high": "Consiglio: controlla clima e apparecchi vecchi; lì di solito c’è la spesa maggiore."
    }
  },
  contact: {
    title: 'Contattaci',
    subtitle: 'Inviaci la tua richiesta e ti risponderemo al più presto.',
    name: 'Nome',
    email: 'Email',
    message: 'Messaggio',
    messageHint: 'Minimo 10 caratteri.',
    submit: 'Invia messaggio',
    submitting: 'Invio...',
    success: 'Messaggio inviato. Ti risponderemo presto.',
    infoTitle: 'Dati di contatto',
    infoText: 'Puoi anche scriverci direttamente via email.',
    infoEmailLabel: 'Email',
    infoNote: 'Hackathon ONE G9 — Team 48 · EnergyAI',
    errors: {
      incomplete: 'Compila nome, email e un messaggio di almeno 10 caratteri.',
      sendFailed: 'Impossibile inviare il messaggio.',
    },
  },
  team: {
    title: 'Team 48',
    subtitle: 'Hackathon ONE G9 — LATAM. Chi costruisce EnergyAI.',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    portfolio: 'Portfolio',
    instagram: 'Instagram',
    email: 'Email',
    cv: 'CV',
    linksSoon: 'Link del profilo in arrivo.',
    roles: {
      fullstack: 'Full Stack Developer',
      dataAnalyst: 'Data Analyst',
      dataScientist: 'Data Scientist',
      backend: 'Backend Developer',
      pm: 'Project Manager',
    },
  },
}
