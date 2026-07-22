export const INSTALLATION_TYPES = {
  APARTAMENTO: 'APARTAMENTO',
  CASA_UNIFAMILIAR: 'CASA_UNIFAMILIAR',
  PEQUENO_ESTABLECIMIENTO_COMERCIAL: 'PEQUENO_ESTABLECIMIENTO_COMERCIAL',
}

/** Typical monthly kWh reference by property type */
export const BENCHMARKS_KWH = {
  APARTAMENTO: 220,
  CASA_UNIFAMILIAR: 300,
  PEQUENO_ESTABLECIMIENTO_COMERCIAL: 650,
}

function num(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function ratioLevel(consumo, benchmark) {
  const ratio = consumo / Math.max(benchmark, 1)

  if (ratio < 0.85) {
    return { nivelKey: 'efficient', ahorro: 5 }
  }
  if (ratio > 1.25) {
    return { nivelKey: 'inefficient', ahorro: 28 }
  }
  return { nivelKey: 'moderate', ahorro: 15 }
}

function tipsForInmueble(nivelKey, datos, tipo) {
  const tips = []
  const climateHours = num(datos.horasClimatizacion)
  const peakUseHours = num(datos.horasAltoConsumo)
  const perPerson =
    num(datos.consumoKwh) / Math.max(num(datos.cantidadPersonas) || 1, 1)
  const isComercial = tipo === INSTALLATION_TYPES.PEQUENO_ESTABLECIMIENTO_COMERCIAL

  if (nivelKey === 'efficient') {
    tips.push('keep', 'monitor')
    if (climateHours >= 4) tips.push('ac')
    return tips.slice(0, 4)
  }

  if (nivelKey === 'inefficient') {
    tips.push(isComercial ? 'schedules' : 'ac', 'replace', 'night', 'led')
  } else {
    tips.push('led', 'peak', 'appliances')
  }

  if (climateHours >= 6) tips.push('insulation')
  if (peakUseHours >= 5 || datos.usoHorarioPico === true) tips.push('standby')
  if (perPerson > (isComercial ? 220 : 180)) tips.push('solar')

  return [...new Set(tips)].slice(0, 5)
}

export function getBenchmark(tipoInmueble, datos = {}) {
  const tipo = tipoInmueble || INSTALLATION_TYPES.CASA_UNIFAMILIAR
  const base = BENCHMARKS_KWH[tipo] ?? BENCHMARKS_KWH.CASA_UNIFAMILIAR
  const personas = num(datos.cantidadPersonas, tipo === INSTALLATION_TYPES.APARTAMENTO ? 2 : 3)
  const area = num(
    datos.areaM2,
    tipo === INSTALLATION_TYPES.APARTAMENTO
      ? 55
      : tipo === INSTALLATION_TYPES.PEQUENO_ESTABLECIMIENTO_COMERCIAL
        ? 80
        : 80,
  )
  const climateHours = num(datos.horasClimatizacion, 2)
  const personFactor =
    tipo === INSTALLATION_TYPES.PEQUENO_ESTABLECIMIENTO_COMERCIAL ? 70 : 55
  const areaFactor =
    tipo === INSTALLATION_TYPES.PEQUENO_ESTABLECIMIENTO_COMERCIAL ? 2.2 : 1.2

  return Math.round(
    base * 0.45 + personas * personFactor + area * areaFactor + climateHours * 25,
  )
}

export function analizarConsumo(datos) {
  const tipo = datos.tipoInmueble || INSTALLATION_TYPES.CASA_UNIFAMILIAR
  const consumo = num(datos.consumoKwh)
  const benchmark = getBenchmark(tipo, datos)
  const personas = Math.max(num(datos.cantidadPersonas) || 1, 1)
  const perPerson = consumo / personas

  const inefficientThreshold =
    tipo === INSTALLATION_TYPES.PEQUENO_ESTABLECIMIENTO_COMERCIAL ? 260 : 200
  const efficientThreshold =
    tipo === INSTALLATION_TYPES.APARTAMENTO ? 75 : 90

  const level =
    perPerson > inefficientThreshold || consumo > benchmark * 1.3
      ? { nivelKey: 'inefficient', ahorro: 26 }
      : perPerson < efficientThreshold && consumo < benchmark * 0.9
        ? { nivelKey: 'efficient', ahorro: 6 }
        : ratioLevel(consumo, benchmark)

  return {
    nivelKey: level.nivelKey,
    ahorro: level.ahorro,
    tipKeys: tipsForInmueble(level.nivelKey, datos, tipo),
    benchmark,
  }
}
