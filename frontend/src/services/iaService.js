export function analizarConsumo(datos) {
  let nivelKey = 'moderate'
  let ahorro = 15
  let tipKeys = ['led', 'peak', 'appliances']

  if (datos.consumo > 500) {
    nivelKey = 'inefficient'
    ahorro = 25
    tipKeys = ['ac', 'replace', 'night']
  }

  if (datos.consumo < 250) {
    nivelKey = 'efficient'
    ahorro = 5
    tipKeys = ['keep', 'monitor']
  }

  return {
    nivelKey,
    ahorro,
    tipKeys,
  }
}
