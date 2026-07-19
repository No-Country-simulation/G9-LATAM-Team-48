# Motor de Recomendaciones (Strategy) — Energy Backend

> Guia del feature de recomendaciones energeticas. Explica el diseno interno,
> el estado actual del contrato y las preguntas abiertas para el equipo.
> Complementa a [`ARCHITECTURE.md`](./ARCHITECTURE.md) y a
> [`I18N.md`](./I18N.md) (los mensajes de este modulo estan internacionalizados).

---

## Tabla de contenidos

1. [Que se implemento](#1-que-se-implemento)
2. [Justificacion: por que Strategy](#2-justificacion-por-que-strategy)
3. [Beneficios](#3-beneficios)
4. [Diseno y componentes](#4-diseno-y-componentes)
5. [Flujo de generacion de recomendaciones](#5-flujo-de-generacion-de-recomendaciones)
6. [Configuracion](#6-configuracion)
7. [Uso](#7-uso)
8. [Manejo de categorias desconocidas](#8-manejo-de-categorias-desconocidas)
9. [Pruebas](#9-pruebas)
10. [Limitaciones actuales y pregunta abierta para el equipo](#10-limitaciones-actuales-y-pregunta-abierta-para-el-equipo)

---

## 1. Que se implemento

- **Motor de reglas** (patron Strategy) que genera recomendaciones de ahorro
  energetico segun la categoria de consumo de un usuario.
- Tres reglas concretas: `HighConsumptionRule`, `MediumConsumptionRule`,
  `LowConsumptionRule`, una por cada categoria de consumo.
- **Mensaje de contingencia** cuando ninguna regla aplica (categoria
  desconocida o no mapeada).
- **Mensajes internacionalizados** (ES/EN/PT) — ver
  [`I18N.md`](./I18N.md) para el diseno de esa parte.
- **Pruebas unitarias** que verifican las 3 categorias + el fallback, en los
  tres idiomas.

---

## 2. Justificacion: por que Strategy

El patron Strategy para este modulo fue definido por el Backend Lead
(Daniel) como parte de la arquitectura base del proyecto
(`feat-backend-base-architecture`). La idea central: cada regla de
recomendacion es una estrategia independiente e intercambiable, y el
servicio orquestador no necesita conocer cuantas reglas existen ni su
logica interna — solo las recorre y compone el resultado.

Esto habilita el principio **Abierto/Cerrado (OCP)** de SOLID: anadir una
recomendacion nueva es crear una clase nueva que implemente
`RecommendationRule`, sin modificar `RecommendationServiceImpl` ni las
reglas existentes. Spring inyecta automaticamente todas las implementaciones
anotadas `@Component` en la lista de reglas del servicio.

---

## 3. Beneficios

| Beneficio          | Detalle                                                                 |
|--------------------|---------------------------------------------------------------------------|
| Extensibilidad     | Sumar una regla nueva no requiere tocar el servicio orquestador (OCP).    |
| Desacoplamiento    | Cada regla decide por si misma si aplica (`applies`) y que dice (`evaluate`). |
| Testeabilidad      | Cada regla se prueba de forma aislada; el servicio se prueba con reglas reales o dobles de prueba. |
| Composicion        | El servicio ya soporta que **varias reglas apliquen a la vez** para un mismo request (ver seccion 10). |

---

## 4. Diseno y componentes

| Componente | Paquete | Responsabilidad |
|------------|---------|-------------------|
| `RecommendationRule` | `recommendation.rules` | Interfaz Strategy: `applies(request)` decide si la regla corresponde, `evaluate(request)` genera el mensaje. |
| `HighConsumptionRule` / `MediumConsumptionRule` / `LowConsumptionRule` | `recommendation.rules` | Implementaciones concretas, una por categoria de consumo. |
| `RecommendationService` | `recommendation.service` | Contrato del orquestador: `generate(request)`. |
| `RecommendationServiceImpl` | `recommendation.service` | Filtra las reglas aplicables, compone el resultado y resuelve el fallback si ninguna aplica. |
| `RecommendationRequest` | `recommendation.dto` | Entrada: `userId` + `category`. |
| `RecommendationResponse` | `recommendation.dto` | Salida: `userId` + lista de recomendaciones. |

**Estado actual del contrato de categorias:**

Las reglas comparan contra los valores `LOW_CONSUMPTION`,
`MEDIUM_CONSUMPTION` y `HIGH_CONSUMPTION`, alineados al mock disponible en
`resources/data/sample-predictions.json`. Ese mock, segun su propio
README, **no representa datos productivos** — es una referencia de
prototipado, no un contrato cerrado. La consigna original del hackathon
define las categorias como `Eficiente` / `Moderado` / `Ineficiente`. Cual de
los dos conjuntos sera el definitivo es una decision pendiente de
confirmar con el equipo (ver seccion 10).

---

## 5. Flujo de generacion de recomendaciones

```
PredictionResponse                    RecommendationServiceImpl
(userId, category, confidence)                │
        │                                     │  1. Recibe RecommendationRequest
        │  (se arma un                        │     (hoy: solo userId + category)
        │   RecommendationRequest              │
        │   con userId + category)             │
        ▼                                      ▼
RecommendationRequest  ──────────────►  rules.stream()
                                            .filter(rule -> rule.applies(request))
                                            .map(rule -> rule.evaluate(request))
                                            .collect(...)
                                               │
                                               │  Si la lista queda vacia:
                                               │  resolveDefaultMessage()
                                               ▼
                                        RecommendationResponse
                                        (userId, [recomendaciones])
```

> Quien arma el `RecommendationRequest` a partir del `PredictionResponse` (y
> de que otros datos, si los hubiera) es parte de la pregunta abierta de la
> seccion 10 — hoy no existe un controller/orquestador que haga ese paso.

---

## 6. Configuracion

Este modulo no requiere variables de entorno propias. Los unicos artefactos
de configuracion son los archivos de mensajes (`messages_*.properties`),
documentados en [`I18N.md`](./I18N.md).

---

## 7. Uso

> El modulo aun no tiene un endpoint HTTP propio (no existe
> `RecommendationController` ni un orquestador que lo invoque desde
> `POST /analisis-energetico`). Se usa hoy de forma programatica, invocado
> directamente o desde tests.

```java
RecommendationRequest request = new RecommendationRequest("user-123", "HIGH_CONSUMPTION");
RecommendationResponse response = recommendationService.generate(request);
// response.recommendations() -> lista con 1 mensaje, en el idioma del Locale activo
```

---

## 8. Manejo de categorias desconocidas

Si `category` es `null`, o no coincide con ninguna regla registrada,
`RecommendationServiceImpl` devuelve un unico mensaje de contingencia
(`recommendation.default`, tambien traducido). El usuario nunca recibe una
lista vacia de recomendaciones.

---

## 9. Pruebas

`RecommendationServiceImplTest` cubre:

- Una regla por categoria (`HIGH_CONSUMPTION`, `MEDIUM_CONSUMPTION`,
  `LOW_CONSUMPTION`), cada una en un idioma distinto (ES/EN/PT) para
  verificar reglas + i18n en conjunto.
- El fallback por defecto ante una categoria no mapeada.
- Reset del `Locale` entre tests (`@AfterEach`) para evitar filtraciones de
  estado entre casos.

```bash
cd backend
mvn test -Dtest=RecommendationServiceImplTest
```

---

## 10. Limitaciones actuales y pregunta abierta para el equipo

**Limitaciones (estado actual):**

- No existe `RecommendationController` ni un orquestador que combine
  `prediction` + `recommendation` para atender `POST /analisis-energetico`.
- Los valores de categoria (`LOW/MEDIUM/HIGH_CONSUMPTION`) estan alineados a
  un mock de prototipado, no a un contrato confirmado por el equipo de Data
  Science.
- Cada regla evalua **solo** la categoria general. No hay reglas basadas en
  variables especificas de consumo (horario pico, cantidad de equipos,
  horas de alto consumo).

**Pregunta abierta (pendiente de definir en equipo):**

`RecommendationRequest` hoy solo trae `userId` + `category`. La consigna
original del hackathon incluye ejemplos de recomendaciones especificas por
variable (ej. *"reducir el uso de equipos durante los horarios pico"*,
*"evaluar equipos de alto consumo"*), que no son alcanzables solo con la
categoria general.

Segun lo conversado informalmente en el equipo: el modelo de Data Science
entrega unicamente `category` + `confidence` (nivel de confianza); las
variables crudas de consumo (`consumo_kwh`, `uso_horario_pico`,
`cantidad_equipos`, etc.) llegarian por otro lado — probablemente desde el
request original del usuario a `POST /analisis-energetico` — pero **aun no
esta definido quien las captura ni quien las combina** con el resultado de
`prediction` antes de llegar a este modulo.

Dos caminos posibles, a decidir en equipo:

1. **Mantener el alcance actual**: recomendaciones genericas por categoria
   (lo que hay implementado hoy), suficiente para el MVP minimo.
2. **Ampliar `RecommendationRequest`** con las variables crudas de consumo,
   y sumar reglas especificas por variable (ej. `PeakHourUsageRule`,
   `HighEquipmentCountRule`). El diseño Strategy actual ya soporta que
   **varias reglas apliquen a la vez** sin cambios en
   `RecommendationServiceImpl` — solo requeriria sumar clases nuevas y
   definir quien arma el request enriquecido.

Esta decision, y quien construye el orquestador necesario en cualquiera de
los dos casos, esta pendiente de definir con el equipo.

---

> Mantener este documento actualizado una vez se resuelva la pregunta
> abierta de esta seccion, para que siga siendo la fuente de verdad del
> feature.
