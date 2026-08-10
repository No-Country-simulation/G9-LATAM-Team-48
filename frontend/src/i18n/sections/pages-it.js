import { monthsFull, monthsShort } from '../shared/monthsCalendar.js'

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
    "title": "Dashboard",
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
    "actualVsPredictedHint": "Medie dataset: consumo mensile vs mese precedente (trend).",
    "peakVsOffPeak": "Picco vs fuori picco (kWh)",
    "peakVsOffPeakHint": "Medie dataset: ripartizione tra ore di punta e fuori punta.",
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
      "APARTAMENTO": "Appartamento",
      "CASA_UNIFAMILIAR": "Casa unifamiliare",
      "PEQUENO_ESTABLECIMIENTO_COMERCIAL": "Piccolo esercizio commerciale"
    },
    "typeHints": {
      "APARTAMENTO": "Dati dell'appartamento per stimare consumo pro capite e climatizzazione.",
      "CASA_UNIFAMILIAR": "Dati della casa per stimare consumo pro capite e climatizzazione.",
      "PEQUENO_ESTABLECIMIENTO_COMERCIAL": "Dati del locale per stimare consumo per occupazione, apparecchi e orari."
    },
    "monthlyUsage": "Consumo mensile (kWh)",
    "people": "Numero di persone",
    "peopleCommercial": "Numero di persone (occupazione)",
    "devices": "Numero di dispositivi",
    "homeArea": "Superficie abitazione (m²)",
    "climateHours": "Ore di climatizzazione al giorno",
    "peakUseHours": "Ore di uso intensivo al giorno",
    "peakHoursUse": "Peak hours",
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
    "loginRequired": "Accedi o registrati per ricevere il report dell'analisi via email.",
    "emailLoginHint": "Accedi o registrati per ricevere il report dell'analisi via email.",
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
      "commercial": "Ottimizzare orari e attrezzature del locale commerciale",
      "house": "Dare priorità a isolamento e climatizzazione efficiente in casa",
      "apartment": "Sfruttare le aree comuni e ridurre lo standby in appartamento",
      "default": "Priorizzare illuminazione LED e elettrodomestici ad alta efficienza",
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
  "months": monthsFull.it,
  "monthsShort": monthsShort.it,
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
  adminUsers: {
    title: 'Utenti — amministrazione',
    subtitle: 'Crea, modifica o disattiva gli account di sistema.',
    create: 'Nuovo utente',
    refresh: 'Aggiorna',
    createTitle: 'Crea utente',
    editTitle: 'Modifica utente',
    name: 'Nome',
    email: 'Email',
    password: 'Password',
    passwordOptional: 'Password (opzionale)',
    passwordOptionalCreate: 'Password (opzionale)',
    passwordAutoHint: 'Se vuota, generiamo una password temporanea e la inviamo via email.',
    temporaryPassword: 'Password temporanea',
    emailStatus: 'Stato email',
    createdTitle: 'Utente creato. Salva questi dati (la password appare una sola volta).',
    dismiss: 'Chiudi',
    passwordMin: 'La password deve avere almeno 8 caratteri.',
    role: 'Ruolo',
    roleUser: 'Utente',
    roleAdmin: 'Admin',
    verified: 'Verificato',
    verifiedYes: 'Sì',
    verifiedNo: 'In attesa',
    emailVerified: 'Email verificata (accesso senza link)',
    emailVerifiedHint: 'Se selezionato, l\'utente non deve verificare l\'email per accedere.',
    actions: 'Azioni',
    edit: 'Modifica',
    delete: 'Disattiva',
    confirmDelete: 'Disattivare questo utente? (eliminazione logica)',
    save: 'Salva',
    saving: 'Salvataggio...',
    cancel: 'Annulla',
    loginRequired: 'Accedi come amministratore per gestire gli utenti.',
    forbidden: 'Solo gli amministratori possono accedere a questa sezione.',
    sessionInvalid: 'Sessione non valida per il backend. Esci e accedi di nuovo come admin.',
    loadFailed: 'Impossibile caricare gli utenti.',
    saveFailed: 'Impossibile salvare l\'utente.',
    deleteFailed: 'Impossibile disattivare l\'utente.',
    cannotDeactivateAdmin: 'Non è possibile disattivare un amministratore',
  },
  adminAnalisis: {
    title: 'Analisi IA — cronologia',
    subtitle: 'Query salvate dagli utenti autenticati.',
    refresh: 'Aggiorna',
    recalculate: 'Ricalcola con le regole attuali',
    recalculating: 'Ricalcolo…',
    recalculateConfirm:
      'Ricalcolare tutte le analisi salvate con l’euristica attuale? Nessuna email né nuove query.',
    recalculateDone:
      'Fatto: {total} query · {updated} aggiornate · {unchanged} invariate · {skipped} saltate.',
    recalculateFailed: 'Impossibile ricalcolare le analisi.',
    email: 'Email',
    tipo: 'Tipo',
    nivel: 'Livello',
    ahorro: 'Risparmio',
    confidence: 'Affidabilità',
    emailStatus: 'Email',
    createdAt: 'Data',
    actions: 'Azioni',
    detail: 'Dettaglio',
    detailTitle: 'Query',
    request: 'Request',
    response: 'Response',
    loginRequired: 'Accedi come amministratore per vedere le analisi.',
    forbidden: 'Solo gli amministratori possono accedere a questa sezione.',
    sessionInvalid: 'Sessione non valida per il backend. Esci e accedi di nuovo come admin.',
    loadFailed: 'Impossibile caricare le analisi.',
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
    infoNote: 'Hackathon ONE G9 — Team 48 · EnergIA',
    errors: {
      incomplete: 'Compila nome, email e un messaggio di almeno 10 caratteri.',
      sendFailed: 'Impossibile inviare il messaggio.',
    },
  },
  team: {
    title: 'Team 48',
    subtitle: 'Hackathon ONE G9 — LATAM. Chi costruisce EnergIA.',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    portfolio: 'Portfolio',
    instagram: 'Instagram',
    email: 'Email',
    cv: 'CV',
    linksSoon: 'Link del profilo in arrivo.',
    tapHint: 'Tocca per vedere i link',
    tapBack: 'Tocca per tornare',
    flipFront: 'Mostra link del profilo',
    flipBack: 'Torna alla card',
    roles: {
      fullstack: 'Full Stack Developer',
      dataAnalyst: 'Data Analyst',
      dataScientist: 'Data Scientist',
      backend: 'Backend Developer',
      pm: 'Project Manager',
    },
  },
}
