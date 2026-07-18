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
    "title": "EnergyAI Dashboard",
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
    "subtitle": "Avaluació del consum energètic",
    "monthlyUsage": "Consum mensual (kWh)",
    "people": "Quantitat de persones",
    "devices": "Quantitat d'equips",
    "submit": "Analitzar consum",
    "submitting": "Analitzant...",
    "result": "Resultat IA",
    "level": "Nivell",
    "estimatedSavings": "Estalvi estimat",
    "tips": "Recomanacions",
    "failed": "No s'ha pogut completar l'anàlisi.",
    "levels": {
      "efficient": "Eficient",
      "moderate": "Moderat",
      "inefficient": "Ineficient"
    },
    "tipsList": {
      "led": "Utilitzar il·luminació LED",
      "peak": "Reduir consum en hores punta",
      "appliances": "Optimitzar electrodomèstics",
      "ac": "Reduir aire condicionat",
      "replace": "Substituir equips antics",
      "night": "Controlar consum nocturn",
      "keep": "Mantenir hàbits",
      "monitor": "Continuar monitorant"
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
  "months": {
    "january": "Gener",
    "february": "Febrer",
    "march": "Març",
    "april": "Abril",
    "may": "Maig",
    "june": "Juny"
  },
  "insights": {
    "title": "En paraules senzilles: com va el consum?",
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
  }
}
