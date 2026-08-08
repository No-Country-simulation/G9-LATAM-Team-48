# Informe de Interpretación del Modelo — EnergIA (v3, LightGBM)

## 1. Resumen ejecutivo

Este informe documenta la interpretación del modelo final de clasificación de perfil energético (v3, 55 columnas, F1 macro = 0.91 en test) mediante SHAP (SHapley Additive exPlanations), con el objetivo de: (a) explicar el comportamiento global del modelo, (b) auditar predicciones individuales representativas de cada clase, y (c) sentar la base técnica del sistema de recomendaciones energéticas que Backend entregará al usuario final.

El análisis confirma que el modelo basa sus decisiones principalmente en el consumo histórico normalizado (por persona y por m²), el consumo actual, el aislamiento térmico y la proporción de iluminación LED — variables con justificación de dominio clara. Se identificaron y documentaron 2 limitaciones relevantes: la ausencia total de la señal de generación solar, y un umbral de recomendación mal calibrado para la clase Moderado (corregido durante este análisis).

## 2. Ranking de importancia de variables (SHAP global, top 20)

Calculado sobre una muestra estratificada de 5,000 registros del test set, importancia = media de |SHAP value| agregada sobre las 3 clases.

| ranking | feature | importancia_shap |
|---|---|---|
| 1.0 | consumo_anterior_por_persona | 0.9156 |
| 2.0 | consumo_anterior_por_m2 | 0.7424 |
| 3.0 | consumo_kwh_mensual | 0.5251 |
| 4.0 | factor_aislamiento | 0.2173 |
| 5.0 | consumo_kwh_mes_anterior | 0.1385 |
| 6.0 | proporcion_iluminacion_led | 0.1323 |
| 7.0 | equipos_casa | 0.1137 |
| 8.0 | horas_aa_por_persona | 0.0752 |
| 9.0 | superficie_apartamento | 0.0592 |
| 10.0 | superficie_m2 | 0.0525 |
| 11.0 | superficie_comercial | 0.0464 |
| 12.0 | superficie_casa | 0.0353 |
| 13.0 | equipos_por_persona | 0.0341 |
| 14.0 | consumo_anterior_comercial | 0.0274 |
| 15.0 | horas_uso_aa_dia | 0.0259 |
| 16.0 | equipos_por_m2 | 0.0244 |
| 17.0 | antiguedad_aislamiento_malo | 0.0236 |
| 18.0 | superficie_por_equipo | 0.0228 |
| 19.0 | antiguedad_aislamiento_bueno | 0.0201 |
| 20.0 | ocupacion_casa | 0.0191 |

Ranking completo disponible en `ranking_importancia_shap.csv`.

## 3. Interpretación global

El gráfico de barras apiladas por clase (`shap_summary_global.png`) y los dependence plots de validación (`shap_dependence_reglas_negocio.png`) muestran:

- **`consumo_anterior_por_persona`** es la variable dominante (#1, muy por encima del resto) — relación monótona creciente con la probabilidad de Ineficiente.
- **`proporcion_iluminacion_led`** tiene relación monótona decreciente: a más LED, menor probabilidad de Ineficiente.
- **`factor_aislamiento`** muestra 3 clusters discretos (Bueno=0.7, Regular=1.0, Malo=1.3), confirmados contra las columnas one-hot originales — a mayor valor, peor aislamiento, y mayor probabilidad de Ineficiente.
- **`equipos_por_persona`** tiene un quiebre claro en 0: por debajo del promedio de equipos por persona, empuja hacia Eficiente; por encima, hacia Ineficiente.

## 4. Interpretación de casos individuales

Un caso por clase, seleccionado como el registro correctamente clasificado con mayor confianza del modelo.

### Caso: Eficiente (índice test 73863)

**Predicción:** Eficiente | **Confianza:** 0.9969

**Probabilidades:** Eficiente=0.9969 | Ineficiente=0.0002 | Moderado=0.0029

**Top 5 variables de mayor influencia (SHAP):**

| feature | valor_real | shap_value | direccion |
|---|---|---|---|
| consumo_anterior_por_persona | 67.95 | 1.6327 | empuja hacia Eficiente |
| consumo_anterior_por_m2 | 1.2665 | 1.1578 | empuja hacia Eficiente |
| proporcion_iluminacion_led | 1.0 | 0.6558 | empuja hacia Eficiente |
| consumo_kwh_mensual | 244.1913 | 0.4209 | empuja hacia Eficiente |
| superficie_apartamento | 107.3 | 0.3235 | empuja hacia Eficiente |

**Recomendaciones generadas:**

- Perfil eficiente — no se requieren recomendaciones de mejora.
### Caso: Ineficiente (índice test 45695)

**Predicción:** Ineficiente | **Confianza:** 0.9982

**Probabilidades:** Eficiente=0.0001 | Ineficiente=0.9982 | Moderado=0.0017

**Top 5 variables de mayor influencia (SHAP):**

| feature | valor_real | shap_value | direccion |
|---|---|---|---|
| consumo_anterior_por_persona | 540.1 | 2.0092 | empuja hacia Ineficiente |
| consumo_kwh_mensual | 563.2 | 0.7727 | empuja hacia Ineficiente |
| equipos_casa | 19.0 | 0.4965 | empuja hacia Ineficiente |
| factor_aislamiento | 1.3 | 0.3623 | empuja hacia Ineficiente |
| proporcion_iluminacion_led | 0.005 | 0.3108 | empuja hacia Ineficiente |

**Recomendaciones generadas:**

- **[ALERTA]** Alto consumo por ocupante: Tu consumo histórico por persona está por encima del promedio — revisar hábitos de uso de los equipos de mayor consumo puede generar un ahorro significativo.
- **[ALERTA]** Aislamiento térmico deficiente: El aislamiento térmico de tu inmueble es deficiente — mejorarlo reduce la carga de climatización necesaria.
- **[ALERTA]** Baja eficiencia de iluminación: Menos de una cuarta parte de tu iluminación es LED — migrar el resto de los focos puede reducir notablemente el consumo de iluminación.
### Caso: Moderado (índice test 90191)

**Predicción:** Moderado | **Confianza:** 0.9807

**Probabilidades:** Eficiente=0.0111 | Ineficiente=0.0081 | Moderado=0.9807

**Top 5 variables de mayor influencia (SHAP):**

| feature | valor_real | shap_value | direccion |
|---|---|---|---|
| consumo_anterior_por_persona | 170.175 | 0.6441 | empuja hacia Moderado |
| consumo_anterior_por_m2 | 7.9127 | 0.5951 | empuja hacia Moderado |
| consumo_kwh_mensual | 604.0 | 0.4546 | empuja hacia Moderado |
| consumo_kwh_mes_anterior | 680.7 | 0.0811 | empuja hacia Moderado |
| superficie_comercial | 0.0 | 0.0316 | empuja hacia Moderado |

**Recomendaciones generadas:**

- **[OPORTUNIDAD]** Alto consumo por ocupante: Tu consumo histórico por persona tiene margen de mejora — revisar hábitos de uso de los equipos de mayor consumo puede generar un ahorro significativo.


## 5. Validación con reglas de negocio

| regla | variable_clave | evidencia | validada |
|---|---|---|---|
| A mayor consumo histórico por persona, mayor probabilidad de Ineficiente | consumo_anterior_por_persona | Ranking SHAP global: #1 en importancia. Casos de estudio monotónicos: 67.95 (Eficiente) < 170.18 (Moderado) < 540.10 (Ineficiente). | Sí |
| A mayor % de iluminación LED, mayor probabilidad de Eficiente | proporcion_iluminacion_led | Caso Eficiente: 100% LED empuja hacia Eficiente (SHAP +0.656). Caso Ineficiente: 0.5% LED empuja hacia Ineficiente (SHAP +0.311). | Sí |
| Peor aislamiento térmico incrementa la probabilidad de Ineficiente | factor_aislamiento | Ranking SHAP global: #4 en importancia. Caso Ineficiente: factor=1.3 empuja hacia Ineficiente. | Parcial — dirección confirmada, falta contrastar la escala del factor con quien construyó el feature engineering |
| Mayor densidad de equipos eléctricos incrementa la probabilidad de Ineficiente | equipos_por_persona / equipos_casa | Caso Ineficiente: 19 equipos empuja hacia Ineficiente (SHAP +0.496). Presente en ranking global (#7, #13). | Sí |
| Uso intensivo de aire acondicionado incrementa la probabilidad de Ineficiente | horas_aa_por_persona / horas_uso_aa_dia | Presente en el ranking global (#8, #15) pero con importancia baja — el modelo solo ve horas de uso, no cantidad de unidades ni consumo real del equipo. | Parcial — señal débil, dominio incompleto |
| Escasa generación solar incrementa la probabilidad de Ineficiente | N/A | El dominio de generación solar fue excluido del modelo v3 por no ser capturable desde el formulario (ver notebook 06_Modelos, Paso 16). | No aplicable — el modelo no puede evaluar esta regla |

Detalle de la validación (dependence plots) en `shap_dependence_reglas_negocio.png` y `validacion_reglas_negocio.csv`.

## 6. Posibles limitaciones

1. **Generación solar no evaluable.** El modelo v3 no incluye ninguna variable de este dominio (excluido en la fase de selección de features por no ser capturable desde el formulario). La regla de negocio "escasa generación solar" no puede validarse ni usarse en recomendaciones con este modelo.
2. **Aire acondicionado con señal parcial.** Solo se dispone de horas de uso diario, no de la cantidad de unidades ni su eficiencia — la variable tiene importancia baja en el ranking (#8, #15) probablemente por esta limitación de información, no porque el fenómeno sea poco relevante.
3. **Umbrales de recomendación calibrados sobre el conjunto global de train.** Se detectó que un umbral único (percentil 75 global) deja sistemáticamente sin recomendaciones a la clase Moderado, porque los valores típicos de Ineficiente desplazan el percentil hacia arriba. Se corrigió con un mecanismo de dos niveles: mensajes tipo **ALERTA** (reglas con umbral fijo, pensadas para Ineficiente) y tipo **OPORTUNIDAD** (fallback basado en la variable SHAP-positiva más fuerte, para Moderado). Se recomienda que Backend distinga visualmente ambos tipos.
4. **Muestra de 5,000 registros para el análisis SHAP global**, no el 100% del test set (18,908), por tiempo de cómputo. Es una muestra estratificada y suficiente para conclusiones a nivel global, pero cualquier extrapolación a subgrupos muy específicos debería validarse con una muestra mayor.

## 7. Conclusiones técnicas

- El modelo v3 es interpretable y sus decisiones son consistentes con el conocimiento de dominio en 4 de las 5 reglas de negocio evaluables (la quinta, generación solar, no es evaluable por diseño).
- La variable de mayor peso en las 3 clases es siempre `consumo_anterior_por_persona`, seguida de `consumo_anterior_por_m2` y `consumo_kwh_mensual` — el consumo histórico normalizado es, con diferencia, el eje central del modelo.
- El sistema de recomendaciones derivado de SHAP es funcional para las 3 clases tras corregir la brecha de cobertura en Moderado.

## 8. Productos generados en esta etapa

- Este informe: `informe_interpretacion_modelo.md`
- Ranking de importancia: `ranking_importancia_shap.csv`
- Análisis SHAP global: `shap_summary_global.png`
- Análisis SHAP por observación: `shap_waterfall_Eficiente.png`, `shap_waterfall_Ineficiente.png`, `shap_waterfall_Moderado.png`
- Validación de reglas de negocio: `shap_dependence_reglas_negocio.png`, `validacion_reglas_negocio.csv`
- Casos de estudio documentados: sección 4 de este informe
