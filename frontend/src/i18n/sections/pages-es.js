/** UI strings shared across pages — Spanish */
export const pagesEs = {
  states: {
    loading: 'Cargando...',
    loadingConsumo: 'Cargando datos de consumo...',
    loadingHistorial: 'Cargando historial de consumo...',
    loadingRecomendaciones: 'Cargando recomendaciones...',
    empty: 'No hay datos para mostrar.',
    error: 'No se pudieron cargar los datos.',
    retry: 'Reintentar',
  },
  dashboard: {
    title: 'EnergyAI Dashboard',
    subtitle: 'Hackathon ONE G9 - TEAM 48',
    lastMonthUsage: 'Consumo último mes',
    lastMonthCost: 'Costo último mes',
    monthlyAverage: 'Promedio mensual',
  },
  consumos: {
    title: 'Consumos energéticos',
    subtitle: 'Detalle mensual del consumo en kWh y costo estimado.',
    totalUsage: 'Consumo total',
    totalCost: 'Costo total',
    monthlyAverage: 'Promedio mensual',
    history: 'Historial mensual',
    peak: 'Mayor consumo',
    month: 'Mes',
    usageKwh: 'Consumo (kWh)',
    estimatedCost: 'Costo estimado',
    status: 'Estado',
    aboveAverage: 'Sobre promedio',
    normal: 'Normal',
  },
  chart: {
    title: 'Consumo energético mensual (kWh)',
    actualVsPredicted: 'Real vs predicción (kWh)',
    actualVsPredictedHint:
      'Mock para Data Analysis: comparar consumo medido con el forecast del modelo.',
    peakVsOffPeak: 'Pico vs valle (kWh)',
    peakVsOffPeakHint:
      'Mock para Data Analysis: desglose de consumo en horario pico y fuera de pico.',
    seriesActual: 'Real',
    seriesPredicted: 'Predicho',
    seriesPeak: 'Pico',
    seriesOffPeak: 'Valle',
    axisMonth: 'Mes',
    axisKwh: 'kWh',
    confidence: 'Confianza del modelo',
    categories: {
      LOW_CONSUMPTION: 'Consumo bajo',
      MEDIUM_CONSUMPTION: 'Consumo medio',
      HIGH_CONSUMPTION: 'Consumo alto',
    },
  },
  insights: {
    title: '¿Cómo viene tu consumo?',
    subtitle: 'Resumen en lenguaje claro, pensado para cualquier persona del hogar o la empresa.',
    trend: {
      up: 'En {month} usaste un {pct}% más de energía que en {prevMonth} ({kwh} kWh de más).',
      down: 'En {month} bajaste un {pct}% respecto de {prevMonth} (ahorraste {kwh} kWh).',
      flat: 'En {month} consumiste casi lo mismo que en {prevMonth}.',
    },
    peak:
      'El {pct}% de tu energía en {month} se usó en horario pico (suele ser más caro).',
    bill: {
      up: 'La factura estimada de {month} es ${amount} (unos ${diff} más que el mes anterior).',
      down: 'La factura estimada de {month} es ${amount} (unos ${diff} menos que el mes anterior).',
      flat: 'La factura estimada de {month} se mantiene en ${amount}.',
    },
    level: {
      good: 'Tu consumo está en un nivel bajo: vas bien.',
      ok: 'Tu consumo está en un nivel medio: hay margen para mejorar sin grandes cambios.',
      high: 'Tu consumo está alto: conviene revisar hábitos y equipos que más gastan.',
    },
    tip: {
      good: 'Consejo: seguí apagando lo que no uses y mantené el aire cerca de 24–26 °C.',
      ok: 'Consejo: mové lavarropas o lavavajillas fuera de 18:00–22:00 para pagar menos.',
      high: 'Consejo: revisá aire acondicionado y equipos viejos; ahí suele estar el mayor gasto.',
    },
  },
  analysis: {
    title: 'Análisis Inteligente IA',
    subtitle: 'Evaluación del consumo energético',
    monthlyUsage: 'Consumo mensual (kWh)',
    people: 'Cantidad de personas',
    devices: 'Cantidad de equipos',
    submit: 'Analizar consumo',
    submitting: 'Analizando...',
    result: 'Resultado IA',
    level: 'Nivel',
    estimatedSavings: 'Ahorro estimado',
    tips: 'Recomendaciones',
    failed: 'No se pudo completar el análisis.',
    levels: {
      efficient: 'Eficiente',
      moderate: 'Moderado',
      inefficient: 'Ineficiente',
    },
    tipsList: {
      led: 'Utilizar iluminación LED',
      peak: 'Reducir consumo en horarios pico',
      appliances: 'Optimizar uso de electrodomésticos',
      ac: 'Reducir uso del aire acondicionado',
      replace: 'Reemplazar equipos antiguos',
      night: 'Controlar consumo nocturno',
      keep: 'Mantener hábitos actuales',
      monitor: 'Continuar monitoreando consumo',
    },
  },
  recommendations: {
    title: 'Recomendaciones IA',
    subtitle: 'Sugerencias personalizadas para optimizar el consumo energético.',
    total: 'Total de recomendaciones',
    highPriority: 'Prioridad alta',
    potentialSavings: 'Ahorro potencial acumulado',
    estimatedSavings: 'Ahorro estimado',
    priority: {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
    },
    category: {
      lighting: 'Iluminación',
      habits: 'Hábitos',
      climate: 'Climatización',
      equipment: 'Equipamiento',
      tech: 'Tecnología',
    },
    items: {
      1: {
        title: 'Cambiar iluminación tradicional por LED',
        description:
          'Reemplazar bombillas incandescentes reduce hasta un 80% del consumo en iluminación.',
      },
      2: {
        title: 'Reducir consumo en horarios pico',
        description:
          'Programar electrodomésticos fuera del horario 18:00-22:00 para evitar picos de demanda.',
      },
      3: {
        title: 'Optimizar uso del aire acondicionado',
        description:
          'Mantener el equipo entre 24°C y 26°C y usar modo eco durante la noche.',
      },
      4: {
        title: 'Evaluar equipos antiguos de alto consumo',
        description:
          'Identificar refrigeradores, microondas o lavarropas con más de 10 años de uso.',
      },
      5: {
        title: 'Desconectar cargadores en standby',
        description:
          'Evitar el consumo fantasma apagando adaptadores y equipos que no se usan.',
      },
      6: {
        title: 'Instalar termostato inteligente',
        description:
          'Automatizar calefacción y refrigeración según horarios de ocupación del hogar.',
      },
    },
  },
  months: {
    january: 'Enero',
    february: 'Febrero',
    march: 'Marzo',
    april: 'Abril',
    may: 'Mayo',
    june: 'Junio',
  },
}
