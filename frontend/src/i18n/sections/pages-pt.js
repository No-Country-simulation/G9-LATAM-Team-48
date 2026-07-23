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
    "title": "Dashboard",
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
    "subtitle": "Avaliação do consumo conforme o tipo de instalação",
    "installationType": "Tipo de instalação",
    "types": {
      "APARTAMENTO": "Apartamento",
      "CASA_UNIFAMILIAR": "Casa unifamiliar",
      "PEQUENO_ESTABLECIMIENTO_COMERCIAL": "Pequeno estabelecimento comercial"
    },
    "typeHints": {
      "APARTAMENTO": "Dados do apartamento para estimar consumo por pessoa e climatização.",
      "CASA_UNIFAMILIAR": "Dados da casa para estimar consumo por pessoa e climatização.",
      "PEQUENO_ESTABLECIMIENTO_COMERCIAL": "Dados do local para estimar consumo por ocupação, equipamentos e horários."
    },
    "monthlyUsage": "Consumo mensal (kWh)",
    "people": "Quantidade de pessoas",
    "peopleCommercial": "Quantidade de pessoas (ocupação)",
    "devices": "Quantidade de equipamentos",
    "homeArea": "Área da residência (m²)",
    "climateHours": "Horas de climatização por dia",
    "peakUseHours": "Horas de uso intensivo por dia",
    "peakHoursUse": "Peak hours",
    "shifts": "Turnos por dia",
    "machines": "Quantidade de máquinas",
    "area": "Área da planta (m²)",
    "hoursPerDay": "Horas de operação por dia",
    "processIntensity": "Intensidade do processo",
    "hasCompressedAir": "Usa ar comprimido?",
    "lines": "Linhas de produção",
    "operatingDays": "Dias de operação por mês",
    "capacityPct": "Capacidade utilizada (%)",
    "hasMonitoring": "Tem monitoramento energético / SCADA?",
    "intensity": {
      "baja": "Baixa",
      "media": "Média",
      "alta": "Alta"
    },
    "yesNo": {
      "yes": "Sim",
      "no": "Não"
    },
    "submit": "Analisar consumo",
    "submitting": "Analisando...",
    "panelHint": "Preencha os dados do tipo escolhido e analise para ver sugestões.",
    "result": "Resultado IA",
    "level": "Nível",
    "estimatedSavings": "Economia estimada",
    "tips": "Sugestões para melhorar o consumo",
    "confidence": "Confiança do modelo",
    "sourceMl": "modelo treinado",
    "sourceLocal": "regras locais",
    "failed": "Não foi possível concluir a análise.",
    "loginRequired": "Para analisar e receber o resultado por e-mail, inicie sessao ou registre-se.",
    "loginCta": "Entrar / Registrar",
    "emailHint": "Enviaremos a analise para",
    "emailPending": "Tambem enviaremos esta analise por e-mail em breve.",
    "emailSent": "Enviamos esta analise por e-mail.",
    "chart": {
      "title": "Seu consumo vs referência",
      "hint": "A referência se ajusta aos dados do formulário.",
      "empty": "Informe o consumo mensal para ver o gráfico.",
      "seriesYours": "Seu consumo",
      "seriesBenchmark": "Referência"
    },
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
      "monitor": "Continuar monitorando o consumo",
      "insulation": "Melhorar o isolamento térmico da residência",
      "standby": "Cortar standby em horários de baixo uso",
      "solar": "Avaliar geração solar para cobrir picos",
      "shifts": "Mover processos intensivos para fora do horário de pico",
      "motors": "Revisar eficiência de motores e inversores",
      "compressedAir": "Detectar vazamentos e otimizar ar comprimido",
      "processHeat": "Recuperar calor de processo ou isolar fornos",
      "loadBalancing": "Balancear carga entre máquinas e turnos",
      "idleLines": "Desligar ou hibernar linhas ociosas",
      "schedules": "Otimizar horários de produção conforme a demanda",
      "predictive": "Aplicar manutenção preditiva em equipamentos críticos",
      "scada": "Implementar ou ampliar monitoramento energético / SCADA",
      "capacity": "Ajustar a produção à capacidade realmente utilizada"
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
    "title": "Como está o seu consumo?",
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
  },
  adminUsers: {
    title: 'Administração de usuários',
    subtitle: 'Crie, edite ou exclua contas do sistema.',
    create: 'Novo usuário',
    createTitle: 'Criar usuário',
    editTitle: 'Editar usuário',
    name: 'Nome',
    email: 'Email',
    password: 'Senha',
    passwordOptional: 'Senha (opcional)',
    passwordOptionalCreate: 'Senha (opcional)',
    passwordAutoHint: 'Se ficar vazia, geramos uma senha temporária e enviamos por email.',
    temporaryPassword: 'Senha temporária',
    emailStatus: 'Status do email',
    createdTitle: 'Usuário criado. Guarde estes dados (a senha aparece só uma vez).',
    dismiss: 'Fechar aviso',
    passwordMin: 'A senha deve ter pelo menos 8 caracteres.',
    role: 'Função',
    roleUser: 'Usuário',
    roleAdmin: 'Admin',
    verified: 'Verificado',
    verifiedYes: 'Sim',
    verifiedNo: 'Pendente',
    emailVerified: 'Email verificado (pode entrar sem link)',
    emailVerifiedHint: 'Se marcado, o usuário não precisa verificar o email para entrar.',
    actions: 'Ações',
    edit: 'Editar',
    delete: 'Desativar',
    confirmDelete: 'Desativar este usuário? (exclusão lógica — permanece no banco)',
    save: 'Salvar',
    saving: 'Salvando...',
    cancel: 'Cancelar',
    loginRequired: 'Entre como administrador para gerenciar usuários.',
    forbidden: 'Apenas administradores podem acessar esta seção.',
    sessionInvalid: 'Sua sessão não é válida para o backend. Saia e entre de novo como admin.',
    loadFailed: 'Não foi possível carregar os usuários.',
    saveFailed: 'Não foi possível salvar o usuário.',
    deleteFailed: 'Não foi possível desativar o usuário.',
    cannotDeactivateAdmin: 'Não é possível desativar um administrador',
  },
  adminAnalisis: {
    title: 'Análise IA — histórico',
    subtitle: 'Consultas salvas por usuários autenticados.',
    refresh: 'Atualizar',
    email: 'Email',
    tipo: 'Tipo',
    nivel: 'Nível',
    ahorro: 'Economia',
    confidence: 'Confiança',
    emailStatus: 'Email',
    createdAt: 'Data',
    actions: 'Ações',
    detail: 'Detalhe',
    detailTitle: 'Consulta',
    request: 'Request',
    response: 'Response',
    loginRequired: 'Entre como administrador para ver as análises.',
    forbidden: 'Apenas administradores podem acessar esta seção.',
    sessionInvalid: 'Sua sessão não é válida para o backend. Saia e entre de novo como admin.',
    loadFailed: 'Não foi possível carregar as análises.',
  },
  contact: {
    title: 'Fale conosco',
    subtitle: 'Envie sua dúvida e responderemos em breve.',
    name: 'Nome',
    email: 'Email',
    message: 'Mensagem',
    messageHint: 'Mínimo de 10 caracteres.',
    submit: 'Enviar mensagem',
    submitting: 'Enviando...',
    success: 'Mensagem enviada. Responderemos em breve.',
    infoTitle: 'Dados de contato',
    infoText: 'Você também pode escrever diretamente para o email da equipe.',
    infoEmailLabel: 'Email',
    infoNote: 'Hackathon ONE G9 — Team 48 · EnergIA',
    errors: {
      incomplete: 'Preencha nome, email e uma mensagem com pelo menos 10 caracteres.',
      sendFailed: 'Não foi possível enviar a mensagem.',
    },
  },
  team: {
    title: 'Equipe 48',
    subtitle: 'Hackathon ONE G9 — LATAM. Quem constrói a EnergIA.',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    portfolio: 'Portfolio',
    instagram: 'Instagram',
    email: 'Email',
    cv: 'Currículo',
    linksSoon: 'Links de perfil em breve.',
    tapHint: 'Toque para ver links',
    tapBack: 'Toque para voltar',
    flipFront: 'Ver links do perfil',
    flipBack: 'Voltar ao cartão',
    roles: {
      fullstack: 'Full Stack Developer',
      dataAnalyst: 'Data Analyst',
      dataScientist: 'Data Scientist',
      backend: 'Backend Developer',
      pm: 'Project Manager',
    },
  },
}
