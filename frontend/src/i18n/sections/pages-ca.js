import { monthsFull, monthsShort } from '../shared/monthsCalendar.js'

export const pagesCa = {
  "states": {
    "loading": "Carregant...",
    "loadingConsumo": "Carregant dades de consum...",
    "loadingHistorial": "Carregant historial...",
    "loadingRecomendaciones": "Carregant recomanacions...",
    "empty": "No hi ha dades per mostrar.",
    "error": "No s'han pogut carregar les dades.",
    "retry": "Tornar a provar"
  },
  "dashboard": {
    "title": "Dashboard",
    "subtitle": "Hackathon ONE G9 - TEAM 48",
    "lastMonthUsage": "Consum d'últim mes",
    "lastMonthCost": "Cost d'últim mes",
    "monthlyAverage": "Mitjana mensual"
  },
  "consumos": {
    "title": "Consums energètics",
    "subtitle": "Detall mensual del consum en kWh i cost estimat.",
    "totalUsage": "Consum total",
    "totalCost": "Cost total",
    "monthlyAverage": "Mitjana mensual",
    "history": "Historial mensual",
    "peak": "Major consum",
    "month": "Mes",
    "usageKwh": "Consum (kWh)",
    "estimatedCost": "Cost estimat",
    "status": "Estat",
    "aboveAverage": "Per sobre de la mitjana",
    "normal": "Normal"
  },
  "chart": {
    "title": "Consum energètic mensual (kWh)",
    "actualVsPredicted": "Real vs predicció (kWh)",
    "actualVsPredictedHint": "Mock per a Data Analysis: comparar el consum mesurat amb la predicció del model.",
    "peakVsOffPeak": "Punta vs vall (kWh)",
    "peakVsOffPeakHint": "Mock per a Data Analysis: desglossar el consum en hores punta i fora de punta.",
    "seriesActual": "Real",
    "seriesPredicted": "Predit",
    "seriesPeak": "Punta",
    "seriesOffPeak": "Vall",
    "axisMonth": "Mes",
    "axisKwh": "kWh",
    "confidence": "Confiança del model",
    "categories": {
      "LOW_CONSUMPTION": "Consum baix",
      "MEDIUM_CONSUMPTION": "Consum mitjà",
      "HIGH_CONSUMPTION": "Consum alt"
    }
  },
  "analysis": {
    "title": "Anàlisi intel·ligent IA",
    "subtitle": "Avaluació del consum segons el tipus d'instal·lació",
    "installationType": "Tipus d'instal·lació",
    "types": {
      "APARTAMENTO": "Apartament",
      "CASA_UNIFAMILIAR": "Casa unifamiliar",
      "PEQUENO_ESTABLECIMIENTO_COMERCIAL": "Petit establiment comercial"
    },
    "typeHints": {
      "APARTAMENTO": "Dades de l'apartament per estimar consum per persona i climatització.",
      "CASA_UNIFAMILIAR": "Dades de la casa per estimar consum per persona i climatització.",
      "PEQUENO_ESTABLECIMIENTO_COMERCIAL": "Dades del local per estimar consum per ocupació, equips i horaris."
    },
    "monthlyUsage": "Consum mensual (kWh)",
    "people": "Quantitat de persones",
    "peopleCommercial": "Quantitat de persones (ocupació)",
    "devices": "Quantitat d'equips",
    "homeArea": "Superfície de l’habitatge (m²)",
    "climateHours": "Hores de climatització al dia",
    "peakUseHours": "Hores d’ús intensiu al dia",
    "peakHoursUse": "Peak hours",
    "shifts": "Tornades al dia",
    "machines": "Quantitat de màquines",
    "area": "Àrea de planta (m²)",
    "hoursPerDay": "Hores d’operació al dia",
    "processIntensity": "Intensitat del procés",
    "hasCompressedAir": "Fa servir aire comprimit?",
    "lines": "Línies de producció",
    "operatingDays": "Dies d’operació al mes",
    "capacityPct": "Capacitat utilitzada (%)",
    "hasMonitoring": "Té monitoratge energètic / SCADA?",
    "intensity": {
      "baja": "Baixa",
      "media": "Mitjana",
      "alta": "Alta"
    },
    "yesNo": {
      "yes": "Sí",
      "no": "No"
    },
    "submit": "Analitzar consum",
    "submitting": "Analitzant...",
    "panelHint": "Omple els camps del tipus triat i executa l’anàlisi.",
    "result": "Resultat IA",
    "level": "Nivell",
    "estimatedSavings": "Estalvi estimat",
    "tips": "Suggeriments per millorar el consum",
    "confidence": "Confiança del model",
    "sourceMl": "model entrenat",
    "sourceLocal": "regles locals",
    "failed": "No s'ha pogut completar l'anàlisi.",
    "loginRequired": "Inicia sessió o registra't per rebre l'informe de l'anàlisi per correu.",
    "emailLoginHint": "Inicia sessió o registra't per rebre l'informe de l'anàlisi per correu.",
    "loginCta": "Iniciar sessio / Registrar-se",
    "emailHint": "T'enviarem l'analisi a",
    "emailPending": "Tambe t'enviarem aquesta analisi per correu aviat.",
    "emailSent": "T'hem enviat aquesta analisi per correu.",
    "chart": {
      "title": "El teu consum vs referència",
      "hint": "La referència s’ajusta amb les dades del formulari.",
      "empty": "Introdueix el consum mensual per veure el gràfic.",
      "seriesYours": "El teu consum",
      "seriesBenchmark": "Referència"
    },
    "levels": {
      "efficient": "Eficient",
      "moderate": "Moderat",
      "inefficient": "Ineficient"
    },
    "tipsList": {
      "led": "Utilitzar il·luminació LED",
      "peak": "Reduir el consum en hores punta",
      "appliances": "Optimitzar l'ús d'electrodomèstics",
      "ac": "Reduir l'ús de l'aire condicionat",
      "replace": "Substituir equips antics",
      "night": "Controlar el consum nocturn",
      "keep": "Mantenir els hàbits actuals",
      "monitor": "Continuar monitorant el consum",
      "insulation": "Millorar l’aïllament tèrmic de l’habitatge",
      "standby": "Tallar el standby en hores de baix ús",
      "solar": "Avaluar generació solar per cobrir pics",
      "shifts": "Moure processos intensius fora de punta",
      "commercial": "Optimitza horaris i equips del local comercial",
      "house": "Prioritza l'aïllament i la climatització eficient a casa",
      "apartment": "Aprofita zones comunes i redueix l'standby a l'apartament",
      "default": "Prioritza il·luminació LED i aparells amb bona eficiència energètica",
      "motors": "Revisar l'eficiència de motors i inversors",
      "compressedAir": "Detectar fuites i optimitzar l'aire comprimit",
      "processHeat": "Recuperar calor de procés o aïllar forns",
      "loadBalancing": "Equilibrar la càrrega entre màquines i torns",
      "idleLines": "Apagar o hibernar línies ocioses",
      "schedules": "Optimitzar horaris de producció",
      "predictive": "Aplicar manteniment predictiu",
      "scada": "Implementar o ampliar monitoratge / SCADA",
      "capacity": "Ajustar la producció a la capacitat real utilitzada"
    }
  },
  "recommendations": {
    "title": "Recomanacions IA",
    "subtitle": "Suggeriments personalitzats per optimitzar el consum.",
    "total": "Total de recomanacions",
    "highPriority": "Prioritat alta",
    "potentialSavings": "Estalvi potencial acumulat",
    "estimatedSavings": "Estalvi estimat",
    "priority": {
      "high": "Alta",
      "medium": "Mitjana",
      "low": "Baixa"
    },
    "category": {
      "lighting": "Il·luminació",
      "habits": "Hàbits",
      "climate": "Climatització",
      "equipment": "Equipament",
      "tech": "Tecnologia"
    },
    "items": {
      "1": {
        "title": "Canviar la il·luminació tradicional per LED",
        "description": "Substituir bombetes incandescents pot reduir fins a un 80% del consum d’il·luminació."
      },
      "2": {
        "title": "Reduir el consum en hores punta",
        "description": "Programar electrodomèstics fora de l’horari 18:00–22:00 per evitar pics de demanda."
      },
      "3": {
        "title": "Optimitzar l’ús de l’aire condicionat",
        "description": "Mantenir l’equip entre 24 °C i 26 °C i usar el mode eco a la nit."
      },
      "4": {
        "title": "Avaluar equips antics d’alt consum",
        "description": "Identificar neveres, microones o rentadores amb més de 10 anys d’ús."
      },
      "5": {
        "title": "Desconnectar carregadors en standby",
        "description": "Evitar el consum fantasma apagant adaptadors i equips que no s’utilitzen."
      },
      "6": {
        "title": "Instal·lar un termòstat intel·ligent",
        "description": "Automatitzar calefacció i refrigeració segons els horaris d’ocupació."
      }
    }
  },
  "months": monthsFull.ca,
  "monthsShort": monthsShort.ca,
  "insights": {
    "title": "Com va el teu consum?",
    "subtitle": "Resum clar perquè qualsevol persona a casa o a l’empresa l’entengui.",
    "trend": {
      "up": "Al {month} vas usar un {pct}% més d’energia que al {prevMonth} ({kwh} kWh de més).",
      "down": "Al {month} vas baixar un {pct}% respecte al {prevMonth} (vas estalviar {kwh} kWh).",
      "flat": "Al {month} el consum va ser gairebé igual que al {prevMonth}."
    },
    "peak": "El {pct}% de l’energia del {month} es va usar en hores punta (sol ser més cara).",
    "bill": {
      "up": "La factura estimada del {month} és ${amount} (uns ${diff} més que el mes anterior).",
      "down": "La factura estimada del {month} és ${amount} (uns ${diff} menys que el mes anterior).",
      "flat": "La factura estimada del {month} es manté en ${amount}."
    },
    "level": {
      "good": "El teu consum és baix: vas bé.",
      "ok": "El teu consum és mitjà: encara pots millorar amb canvis petits.",
      "high": "El teu consum és alt: convé revisar hàbits i equips que més gasten."
    },
    "tip": {
      "good": "Consell: continua apagant el que no facis servir i mantén l’aire a 24–26 °C.",
      "ok": "Consell: posa la rentadora fora de 18:00–22:00 per pagar menys.",
      "high": "Consell: revisa l’aire condicionat i equips vells; allà sol ser la despesa més gran."
    }
  },
  adminUsers: {
    title: 'Usuaris — administració',
    subtitle: 'Crea, edita o desactiva comptes del sistema.',
    create: 'Nou usuari',
    refresh: 'Actualitzar',
    createTitle: 'Crear usuari',
    editTitle: 'Editar usuari',
    name: 'Nom',
    email: 'Email',
    password: 'Contrasenya',
    passwordOptional: 'Contrasenya (opcional)',
    passwordOptionalCreate: 'Contrasenya (opcional)',
    passwordAutoHint: 'Si la deixes buida, generem una temporal i l\'enviem per email.',
    temporaryPassword: 'Contrasenya temporal',
    emailStatus: 'Estat de l\'email',
    createdTitle: 'Usuari creat. Desa aquestes dades (la contrasenya es mostra una sola vegada).',
    dismiss: 'Tancar avís',
    passwordMin: 'La contrasenya ha de tenir almenys 8 caràcters.',
    role: 'Rol',
    roleUser: 'Usuari',
    roleAdmin: 'Admin',
    verified: 'Verificat',
    verifiedYes: 'Sí',
    verifiedNo: 'Pendent',
    emailVerified: 'Email verificat (pot iniciar sessió sense enllaç)',
    emailVerifiedHint: 'Si està marcat, l\'usuari no cal que verifiqui el correu.',
    actions: 'Accions',
    edit: 'Editar',
    delete: 'Desactivar',
    confirmDelete: 'Desactivar aquest usuari? (esborrat lògic)',
    save: 'Desar',
    saving: 'Desant...',
    cancel: 'Cancel·lar',
    loginRequired: 'Inicia sessió com a administrador per gestionar usuaris.',
    forbidden: 'Només els administradors poden accedir a aquesta secció.',
    sessionInvalid: 'La sessió no és vàlida per al backend. Tanca sessió i torna a entrar com a admin.',
    loadFailed: 'No s\'han pogut carregar els usuaris.',
    saveFailed: 'No s\'ha pogut desar l\'usuari.',
    deleteFailed: 'No s\'ha pogut desactivar l\'usuari.',
    cannotDeactivateAdmin: 'No es pot desactivar un administrador',
  },
  adminAnalisis: {
    title: 'Anàlisi IA — historial',
    subtitle: 'Consultes desades pels usuaris autenticats.',
    refresh: 'Actualitzar',
    recalculate: 'Recalcular amb les regles actuals',
    recalculating: 'Recalculant…',
    recalculateConfirm:
      'Recalcular totes les anàlisis desades amb l’heurística actual? Sense emails ni consultes noves.',
    recalculateDone:
      'Fet: {total} consultes · {updated} actualitzades · {unchanged} sense canvis · {skipped} omeses.',
    recalculateFailed: 'No s’han pogut recalcular les anàlisis.',
    email: 'Email',
    tipo: 'Tipus',
    nivel: 'Nivell',
    ahorro: 'Estalvi',
    confidence: 'Confiança',
    emailStatus: 'Email',
    createdAt: 'Data',
    actions: 'Accions',
    detail: 'Detall',
    detailTitle: 'Consulta',
    request: 'Request',
    response: 'Response',
    loginRequired: 'Inicia sessió com a administrador per veure les anàlisis.',
    forbidden: 'Només els administradors poden accedir a aquesta secció.',
    sessionInvalid: 'La sessió no és vàlida per al backend. Tanca sessió i torna a entrar com a admin.',
    loadFailed: 'No s\'han pogut carregar les anàlisis.',
  },
  contact: {
    title: "Contacta'ns",
    subtitle: 'Escriu-nos la teva consulta i et respondrem aviat.',
    name: 'Nom',
    email: 'Email',
    message: 'Missatge',
    messageHint: 'Mínim 10 caràcters.',
    submit: 'Enviar missatge',
    submitting: 'Enviant...',
    success: 'Missatge enviat. Et respondrem aviat.',
    infoTitle: 'Dades de contacte',
    infoText: 'També ens pots escriure directament al correu de l’equip.',
    infoEmailLabel: 'Email',
    infoNote: 'Hackathon ONE G9 — Team 48 · EnergIA',
    errors: {
      incomplete: 'Omple el nom, l’email i un missatge d’almenys 10 caràcters.',
      sendFailed: 'No s’ha pogut enviar el missatge.',
    },
  },
  team: {
    title: 'Equip 48',
    subtitle: 'Hackathon ONE G9 — LATAM. Qui construeix EnergIA.',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    portfolio: 'Portfolio',
    instagram: 'Instagram',
    email: 'Email',
    cv: 'CV',
    linksSoon: 'Enllaços de perfil aviat.',
    tapHint: 'Toca per veure els enllaços',
    tapBack: 'Toca per tornar',
    flipFront: 'Veure enllaços del perfil',
    flipBack: 'Tornar a la targeta',
    roles: {
      fullstack: 'Full Stack Developer',
      dataAnalyst: 'Data Analyst',
      dataScientist: 'Data Scientist',
      backend: 'Backend Developer',
      pm: 'Project Manager',
    },
  },
}
