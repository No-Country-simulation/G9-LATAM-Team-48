export const pagesPt = {
  "states": {
    "loading": "Carregando...",
    "loadingConsumo": "Carregando dados de consumo...",
    "loadingHistorial": "Carregando histórico de consumo...",
    "loadingRecomendaciones": "Carregando recomendações...",
    "empty": "Não há dados para mostrar.",
    "error": "Não foi possível carregar os dados.",
    "retry": "Tentar novamente"
  },
  "dashboard": {
    "title": "EnergyAI Dashboard",
    "subtitle": "Hackathon ONE G9 - TEAM 48",
    "lastMonthUsage": "Consumo do último mês",
    "lastMonthCost": "Custo do último mês",
    "monthlyAverage": "Média mensal"
  },
  "consumos": {
    "title": "Consumos energéticos",
    "subtitle": "Detalhe mensal do consumo em kWh e custo estimado.",
    "totalUsage": "Consumo total",
    "totalCost": "Custo total",
    "monthlyAverage": "Média mensal",
    "history": "Histórico mensal",
    "peak": "Maior consumo",
    "month": "Mês",
    "usageKwh": "Consumo (kWh)",
    "estimatedCost": "Custo estimado",
    "status": "Estado",
    "aboveAverage": "Acima da média",
    "normal": "Normal"
  },
  "chart": {
    "title": "Consumo energético mensal (kWh)",
    "actualVsPredicted": "Real vs previsão (kWh)",
    "actualVsPredictedHint": "Mock para Data Analysis: comparar consumo medido com a previsão do modelo.",
    "peakVsOffPeak": "Pico vs fora de pico (kWh)",
    "peakVsOffPeakHint": "Mock para Data Analysis: separar consumo em horário de pico e fora de pico.",
    "seriesActual": "Real",
    "seriesPredicted": "Previsto",
    "seriesPeak": "Pico",
    "seriesOffPeak": "Fora de pico",
    "axisMonth": "Mês",
    "axisKwh": "kWh",
    "confidence": "Confiança do modelo",
    "categories": {
      "LOW_CONSUMPTION": "Consumo baixo",
      "MEDIUM_CONSUMPTION": "Consumo médio",
      "HIGH_CONSUMPTION": "Consumo alto"
    }
  },
  "analysis": {
    "title": "Análise inteligente IA",
    "subtitle": "Avaliação do consumo energético",
    "monthlyUsage": "Consumo mensal (kWh)",
    "people": "Quantidade de pessoas",
    "devices": "Quantidade de equipamentos",
    "submit": "Analisar consumo",
    "submitting": "Analisando...",
    "result": "Resultado IA",
    "level": "Nível",
    "estimatedSavings": "Economia estimada",
    "tips": "Recomendações",
    "failed": "Não foi possível concluir a análise.",
    "levels": {
      "efficient": "Eficiente",
      "moderate": "Moderado",
      "inefficient": "Ineficiente"
    },
    "tipsList": {
      "led": "Usar iluminação LED",
      "peak": "Reduzir consumo em horários de pico",
      "appliances": "Otimizar uso de eletrodomésticos",
      "ac": "Reduzir uso do ar-condicionado",
      "replace": "Substituir equipamentos antigos",
      "night": "Controlar consumo noturno",
      "keep": "Manter hábitos atuais",
      "monitor": "Continuar monitorando o consumo"
    }
  },
  "recommendations": {
    "title": "Recomendações IA",
    "subtitle": "Sugestões personalizadas para otimizar o consumo energético.",
    "total": "Total de recomendações",
    "highPriority": "Prioridade alta",
    "potentialSavings": "Economia potencial acumulada",
    "estimatedSavings": "Economia estimada",
    "priority": {
      "high": "Alta",
      "medium": "Média",
      "low": "Baixa"
    },
    "category": {
      "lighting": "Iluminação",
      "habits": "Hábitos",
      "climate": "Climatização",
      "equipment": "Equipamentos",
      "tech": "Tecnologia"
    },
    "items": {
      "1": {
        "title": "Trocar iluminação tradicional por LED",
        "description": "Substituir lâmpadas incandescentes pode reduzir até 80% do consumo em iluminação."
      },
      "2": {
        "title": "Reduzir consumo em horários de pico",
        "description": "Programar eletrodomésticos fora do horário 18:00–22:00 para evitar picos de demanda."
      },
      "3": {
        "title": "Otimizar uso do ar-condicionado",
        "description": "Manter o equipamento entre 24 °C e 26 °C e usar o modo eco à noite."
      },
      "4": {
        "title": "Avaliar equipamentos antigos de alto consumo",
        "description": "Identificar geladeiras, micro-ondas ou máquinas de lavar com mais de 10 anos."
      },
      "5": {
        "title": "Desconectar carregadores em standby",
        "description": "Evitar consumo fantasma desligando adaptadores e equipamentos sem uso."
      },
      "6": {
        "title": "Instalar termostato inteligente",
        "description": "Automatizar aquecimento e refrigeração conforme horários de ocupação."
      }
    }
  },
  "months": {
    "january": "Janeiro",
    "february": "Fevereiro",
    "march": "Março",
    "april": "Abril",
    "may": "Maio",
    "june": "Junho"
  },
  "insights": {
    "title": "Em palavras simples: como está o seu consumo?",
    "subtitle": "Resumo claro, pensado para qualquer pessoa em casa ou na empresa.",
    "trend": {
      "up": "Em {month} você usou {pct}% mais energia do que em {prevMonth} ({kwh} kWh a mais).",
      "down": "Em {month} você baixou {pct}% em relação a {prevMonth} (economizou {kwh} kWh).",
      "flat": "Em {month} o consumo ficou quase igual ao de {prevMonth}."
    },
    "peak": "{pct}% da sua energia em {month} foi usada no horário de pico (em geral mais caro).",
    "bill": {
      "up": "A conta estimada de {month} é ${amount} (cerca de ${diff} a mais que no mês anterior).",
      "down": "A conta estimada de {month} é ${amount} (cerca de ${diff} a menos que no mês anterior).",
      "flat": "A conta estimada de {month} permanece em ${amount}."
    },
    "level": {
      "good": "Seu consumo está baixo: você está indo bem.",
      "ok": "Seu consumo está médio: ainda dá para melhorar com mudanças pequenas.",
      "high": "Seu consumo está alto: vale revisar hábitos e equipamentos que mais gastam."
    },
    "tip": {
      "good": "Dica: continue desligando o que não usa e mantenha o ar perto de 24–26 °C.",
      "ok": "Dica: use máquina de lavar fora de 18:00–22:00 para pagar menos.",
      "high": "Dica: revise ar-condicionado e aparelhos antigos; aí costuma estar o maior gasto."
    }
  }
}
