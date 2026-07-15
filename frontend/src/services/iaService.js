export function analizarConsumo(datos) {

    let nivel = "Moderado"
    let ahorro = 15
  
    let recomendaciones = [
      "Utilizar iluminación LED",
      "Reducir consumo en horarios pico",
      "Optimizar uso de electrodomésticos"
    ]
  
  
    if (datos.consumo > 500) {
  
      nivel = "Ineficiente"
      ahorro = 25
  
      recomendaciones = [
        "Reducir uso del aire acondicionado",
        "Reemplazar equipos antiguos",
        "Controlar consumo nocturno"
      ]
  
    }
  
  
    if (datos.consumo < 250) {
  
      nivel = "Eficiente"
      ahorro = 5
  
      recomendaciones = [
        "Mantener hábitos actuales",
        "Continuar monitoreando consumo"
      ]
  
    }
  
  
    return {
  
      nivel,
      ahorro,
      recomendaciones
  
    }
  
  }