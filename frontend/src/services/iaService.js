export const INSTALLATION_TYPES = {
  casa: 'casa',
  fabrica_mediana: 'fabrica_mediana',
  fabrica_grande: 'fabrica_grande',
}

/** Typical monthly kWh reference by installation type */
export const BENCHMARKS_KWH = {
  casa: 300,
  fabrica_mediana: 8000,
  fabrica_grande: 45000,
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

function tipsForCasa(nivelKey, datos) {
  const tips = []
  const climateHours = Number(datos.climateHours) || 0
  const peakUseHours = Number(datos.peakUseHours) || 0
  const perPerson = Number(datos.consumo) / Math.max(Number(datos.personas) || 1, 1)

  if (nivelKey === 'efficient') {
    tips.push('keep', 'monitor')
    if (climateHours >= 4) tips.push('ac')
    return tips.slice(0, 4)
  }

  if (nivelKey === 'inefficient') {
    tips.push('ac', 'replace', 'night', 'led')
  } else {
    tips.push('led', 'peak', 'appliances')
  }

  if (climateHours >= 6) tips.push('insulation')
  if (peakUseHours >= 5) tips.push('standby')
  if (perPerson > 180) tips.push('solar')

  return [...new Set(tips)].slice(0, 5)
}

function tipsForFabricaMediana(nivelKey, datos) {
  const tips = []
  const hasAir = datos.hasCompressedAir === 'yes'
  const intensity = datos.processIntensity || 'media'
  const hours = Number(datos.hoursPerDay) || 0

  if (nivelKey === 'efficient') {
    return ['keep', 'monitor', 'shifts'].slice(0, 4)
  }

  if (nivelKey === 'inefficient') {
    tips.push('motors', 'replace', 'loadBalancing')
  } else {
    tips.push('shifts', 'motors', 'peak')
  }

  if (hasAir) tips.push('compressedAir')
  if (intensity === 'alta') tips.push('processHeat')
  if (Number(datos.turnos) >= 3 || hours >= 16) tips.push('night')

  return [...new Set(tips)].slice(0, 5)
}

function tipsForFabricaGrande(nivelKey, datos) {
  const tips = []
  const capacity = Number(datos.capacityPct) || 0
  const hasMonitoring = datos.hasMonitoring === 'yes'
  const days = Number(datos.operatingDays) || 0

  if (nivelKey === 'efficient') {
    const base = ['keep', 'monitor', 'predictive']
    if (!hasMonitoring) base.push('scada')
    return base.slice(0, 4)
  }

  if (nivelKey === 'inefficient') {
    tips.push('idleLines', 'predictive', 'schedules', 'capacity')
  } else {
    tips.push('schedules', 'idleLines', 'motors')
  }

  if (!hasMonitoring) tips.push('scada')
  if (capacity > 0 && capacity < 60) tips.push('capacity')
  if (Number(datos.lineas) >= 4 || days >= 26) tips.push('peak')
  if (datos.hasCompressedAir === 'yes') tips.push('compressedAir')

  return [...new Set(tips)].slice(0, 5)
}

export function getBenchmark(tipo, datos = {}) {
  const base = BENCHMARKS_KWH[tipo] ?? BENCHMARKS_KWH.casa

  if (tipo === INSTALLATION_TYPES.casa) {
    const personas = Number(datos.personas) || 3
    const area = Number(datos.area) || 80
    const climateHours = Number(datos.climateHours) || 2
    const adjusted =
      base * 0.45 +
      personas * 55 +
      area * 1.2 +
      climateHours * 25
    return Math.round(adjusted)
  }

  if (tipo === INSTALLATION_TYPES.fabrica_mediana) {
    const machines = Number(datos.maquinas) || 20
    const hours = Number(datos.hoursPerDay) || 8
    const intensity =
      datos.processIntensity === 'alta' ? 1.25 : datos.processIntensity === 'baja' ? 0.8 : 1
    const adjusted = machines * 280 * (hours / 8) * intensity
    return Math.round(Math.max(adjusted, base * 0.4))
  }

  const lines = Number(datos.lineas) || 4
  const area = Number(datos.area) || 5000
  const days = Number(datos.operatingDays) || 22
  const capacity = Math.min(Math.max(Number(datos.capacityPct) || 75, 20), 100) / 100
  const adjusted = lines * 6500 * (days / 22) * capacity + area * 1.5
  return Math.round(Math.max(adjusted, base * 0.35))
}

export function analizarConsumo(datos) {
  const tipo = datos.tipo || INSTALLATION_TYPES.casa
  const consumo = Number(datos.consumo) || 0
  const benchmark = getBenchmark(tipo, datos)

  let nivelKey = 'moderate'
  let ahorro = 15
  let tipKeys = ['led', 'peak', 'appliances']

  if (tipo === INSTALLATION_TYPES.casa) {
    const personas = Math.max(Number(datos.personas) || 1, 1)
    const perPerson = consumo / personas
    const level =
      perPerson > 200 || consumo > benchmark * 1.3
        ? { nivelKey: 'inefficient', ahorro: 26 }
        : perPerson < 90 && consumo < benchmark * 0.9
          ? { nivelKey: 'efficient', ahorro: 6 }
          : ratioLevel(consumo, benchmark)
    nivelKey = level.nivelKey
    ahorro = level.ahorro
    tipKeys = tipsForCasa(nivelKey, datos)
  } else if (tipo === INSTALLATION_TYPES.fabrica_mediana) {
    const machines = Math.max(Number(datos.maquinas) || 1, 1)
    const hours = Math.max(Number(datos.hoursPerDay) || 8, 1)
    const perMachineHour = consumo / (machines * hours)
    const ref = benchmark / (machines * hours)
    const level =
      perMachineHour > ref * 1.3
        ? { nivelKey: 'inefficient', ahorro: 30 }
        : perMachineHour < ref * 0.8
          ? { nivelKey: 'efficient', ahorro: 8 }
          : ratioLevel(consumo, benchmark)
    nivelKey = level.nivelKey
    ahorro = level.ahorro
    tipKeys = tipsForFabricaMediana(nivelKey, datos)
  } else {
    const area = Math.max(Number(datos.area) || 1, 1)
    const perM2 = consumo / area
    const refPerM2 = benchmark / area
    const level =
      perM2 > refPerM2 * 1.35
        ? { nivelKey: 'inefficient', ahorro: 32 }
        : perM2 < refPerM2 * 0.75
          ? { nivelKey: 'efficient', ahorro: 6 }
          : ratioLevel(consumo, benchmark)
    nivelKey = level.nivelKey
    ahorro = level.ahorro
    tipKeys = tipsForFabricaGrande(nivelKey, datos)
  }

  return {
    nivelKey,
    ahorro,
    tipKeys,
    benchmark,
  }
}
