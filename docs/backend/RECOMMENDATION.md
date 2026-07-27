# Motor de Recomendaciones (Strategy) — Energy Backend

> Guía del feature de recomendaciones energéticas. Explica el diseño interno, el estado actual del contrato y la evolución de la arquitectura tras la integración con el modelo de predicción. Complementa a `ARCHITECTURE.md`. 
> *Nota: La internacionalización en el backend (`I18N.md`) fue deprecada a favor de delegar la traducción al frontend.*

---

## Tabla de contenidos

1. [Qué se implementó](#1-qué-se-implementó)
2. [Justificación: por qué Strategy](#2-justificación-por-qué-strategy)
3. [Beneficios](#3-beneficios)
4. [Diseño y componentes](#4-diseño-y-componentes)
5. [Flujo de generación de recomendaciones](#5-flujo-de-generación-de-recomendaciones)
6. [Manejo de categorías desconocidas](#6-manejo-de-categorías-desconocidas)
7. [Pruebas](#7-pruebas)
8. [Evolución del Contrato](#8-evolución-del-contrato)

---

## 1. Qué se implementó

*   **Motor de reglas** (patrón Strategy) que genera recomendaciones de ahorro energético.
*   **Reglas base** evaluadas por la categoría de consumo (`HighConsumptionRule`, `MediumConsumptionRule`, `LowConsumptionRule`).
*   **Reglas granulares** basadas en hábitos específicos, como `PeakHourUsageRule`.
*   **Reglas de enrutamiento por inmueble** (`CommercialOptimizationRule`, `HouseEfficiencyRule`, `ApartmentEfficiencyRule`) que aseguran coherencia estructural.
*   **Pivote de i18n:** Las reglas devuelven claves cortas (ej. `"peak"`, `"ac"`, `"commercial"`) en lugar de oraciones traducidas. El frontend resuelve el texto final según su propio diccionario.
*   **Mensaje de contingencia** (`"default"`) cuando ninguna regla aplica.

---

## 2. Justificación: por qué Strategy

El patrón Strategy para este módulo fue definido como parte de la arquitectura base del proyecto. La idea central: cada regla de recomendación es una estrategia independiente e intercambiable, y el servicio orquestador no necesita conocer cuántas reglas existen ni su lógica interna — solo las recorre y compone el resultado.

Esto habilita el principio **Abierto/Cerrado (OCP)** de SOLID: añadir una recomendación nueva es crear una clase nueva que implemente `RecommendationRule`, sin modificar `RecommendationServiceImpl` ni las reglas existentes. Spring inyecta automáticamente todas las implementaciones anotadas `@Component` en la lista de reglas del servicio.

---

## 3. Beneficios

| Beneficio          | Detalle                                                                 |
|--------------------|---------------------------------------------------------------------------|
| Extensibilidad     | Sumar una regla nueva no requiere tocar el servicio orquestador (OCP).    |
| Desacoplamiento    | Cada regla decide por sí misma si aplica (`applies`) y qué clave devuelve (`evaluate`). |
| Mantenibilidad     | Eliminación de *magic strings* mediante el uso de enums (`TipKey`) y constantes (`CategoryConstants`, `PropertyTypeConstants`). |
| Composición        | El servicio soporta que **varias reglas apliquen a la vez** para un mismo usuario, evitando duplicados mediante operaciones de *Stream*. |

---

## 4. Diseño y componentes

| Componente | Paquete | Responsabilidad |
|------------|---------|-------------------|
| `RecommendationRule` | `recommendation.rules` | Interfaz Strategy: `applies(request)` decide si aplica, `evaluate(request)` retorna el `TipKey`. |
| `*Rule` (Implementaciones) | `recommendation.rules` | Clases concretas que evalúan categorías, variables de uso o tipos de inmuebles. |
| `TipKey` | `recommendation.dto` | Enum que cataloga los identificadores soportados (ej. `AC`, `COMMERCIAL`, `STANDBY`). |
| `ConsumptionCategory` | `common.enums` | Enum que centraliza y mapea las categorías del modelo ML (`ALTO`, `BAJO`) con las claves visuales del frontend (`inefficient`, `efficient`), eliminando condicionales en los servicios. |
| `PropertyTypeConstants`| `common.constants` | Centraliza los tipos de inmuebles válidos (`CASA_UNIFAMILIAR`, etc.). |
| `RecommendationServiceImpl` | `recommendation.service` | Filtra las reglas, extrae las claves, las convierte a minúsculas y devuelve la lista final sin duplicados. |
| `RecommendationRequest` | `recommendation.dto` | Entrada: `userId`, `category`, `tipoInmueble` + variables tipadas específicas del consumo. |
| `RecommendationResponse` | `recommendation.dto` | Salida: `userId` + lista de `tipKeys`. |
---

## 5. Flujo de generación de recomendaciones

```text
PredictionResponse                    RecommendationServiceImpl
(userId, category, confidence)                │
        │                                     │  1. Recibe RecommendationRequest
        │  (se arma el                        │     (userId, category, tipoInmueble, usoHorarioPico, etc.)
        │   RecommendationRequest              │
        │   enriquecido)                       │
        ▼                                      ▼
RecommendationRequest  ──────────────►  rules.stream()
                                            .filter(rule -> rule.applies(request))
                                            .map(rule -> rule.evaluate(request).name().toLowerCase())
                                            .distinct()
                                            .toList()
                                               │
                                               │  Si la lista queda vacía:
                                               │  Lista con ["default"]
                                               ▼
                                        RecommendationResponse
                                        (userId, [tipKeys])

```

---

## 6. Manejo de categorías desconocidas

Si la información provista no coincide con ninguna regla registrada, `RecommendationServiceImpl` devuelve una única clave de contingencia (`"default"`). El usuario nunca recibe una lista vacía de recomendaciones.

---

## 7. Pruebas

La suite de pruebas `RecommendationServiceImplTest` cubre:

* Evaluación correcta de las reglas según la constante de categoría y tipo de inmueble.
* Retorno del fallback `"default"` ante condiciones no mapeadas.
* Verificación de que el orquestador convierte correctamente los `TipKey` a cadenas en minúsculas y filtra elementos duplicados (ej. `["ac", "peak"]`).

---

## 8. Evolución del Contrato

Tras la revisión de arquitectura y los requerimientos del frontend, se resolvieron las preguntas abiertas de diseño adoptando un **Enfoque de Contrato Enriquecido**:

1. **Contrato de Entrada Extendido:** `RecommendationRequest` ya no recibe únicamente la categoría general. Fue ampliado para incluir variables específicas y estructurales (tipo de inmueble) directamente alineadas a los campos validados de `PredictionRequest`.
2. **Reglas Granulares:** Este contrato extendido permite que las implementaciones de `RecommendationRule` decidan con mayor precisión.
3. **Traducción Delegada:** El backend dejó de emitir mensajes completos traducidos. Actualmente, emite identificadores (claves cortas) para que la UI mapee la traducción correspondiente, alineando el vocabulario `tipKeys` con el resto del sistema.

