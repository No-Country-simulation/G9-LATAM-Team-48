# Documentación Técnica — Selección de Modelo de Machine Learning

## Proyecto EnergIA — Clasificación de Perfil Energético

**Hackathon ONE G9 (Alura + Oracle Next Education)**
Documento generado: 2026-08-01

---

## 1. Resumen ejecutivo

Este documento describe el proceso completo de selección, validación y adaptación a producción del modelo de Machine Learning que clasifica el perfil energético de viviendas y pequeños establecimientos comerciales en tres categorías: **Eficiente**, **Moderado** e **Ineficiente**.

El proceso pasó por tres iteraciones de modelo:

| Iteración | Columnas | F1 macro (test) | Estado |
| --- | --- | --- | --- |
| Modelo completo | 236 | 0.92 | No deployable — requiere datos no capturables en producción |
| v2 (selección por nombre de columna) | 103 | 0.92 | **Descartado** — error metodológico detectado antes de producción |
| **v3 — Modelo final** | **55** | **0.91** | **Deployable, validado y en producción** |

El modelo final es un **LightGBM Classifier**, seleccionado entre 6 algoritmos candidatos mediante validación cruzada estratificada, con una pérdida de desempeño de solo 1 punto de F1 macro respecto al modelo teórico completo, pese a operar únicamente con datos capturables por un formulario real de usuario final.

---

## 2. Objetivo

Definir la estrategia oficial para seleccionar el modelo de clasificación multiclase del perfil energético, garantizando que la decisión estuviera sustentada en evidencia experimental, métricas objetivas, capacidad de generalización y compatibilidad real con la arquitectura del producto (Frontend + Backend).

## 3. Metodología

### 3.1 Flujo oficial de selección

Carga del dataset procesado (03_feature_engineering.csv)
-> Aplicación del Pipeline de preprocesamiento (imputación + escalamiento)
-> División Train/Test estratificada (80/20)
-> Entrenamiento de 6 modelos candidatos
-> Validación cruzada Stratified K-Fold (5 folds)
-> Comparación de métricas (Accuracy, Precision, Recall, F1, tiempos, estabilidad)
-> Análisis de sobreajuste y descarte de modelos inestables
-> Selección por criterio de desempate (F1 -> gap -> tiempo -> interpretabilidad)
-> Documentación técnica

### 3.2 Principios de selección

No se buscó únicamente la mayor precisión. Se exigió, en orden de prioridad: alto desempeño predictivo, buena capacidad de generalización, bajo riesgo de sobreajuste, tiempos de entrenamiento/inferencia razonables, facilidad de integración con Backend, compatibilidad con exportación vía Joblib, e interpretabilidad suficiente.

### 3.3 Reproducibilidad

`random_state = 42` en todos los algoritmos que lo soportan, Stratified K-Fold con 5 particiones, mismas variables y mismo Target en todas las comparaciones.

---

## 4. Modelos candidatos evaluados

| # | Modelo | Rol en la comparación |
| --- | --- | --- |
| 1 | Random Forest Classifier | Modelo base — robustez y bajo sobreajuste esperado |
| 2 | Gradient Boosting Classifier | Captura de relaciones complejas |
| 3 | XGBoost | Alternativa de alto rendimiento |
| 4 | LightGBM | Evaluado por eficiencia y rendimiento en datasets grandes |
| 5 | Decision Tree Classifier | Referencia de interpretabilidad |
| 6 | Logistic Regression | Línea base lineal |

Quedaron fuera del alcance del MVP (según especificación del proyecto): redes neuronales, deep learning, modelos de series temporales, modelos no supervisados, clustering y reinforcement learning.

---

## 5. Resultados de validación cruzada (Stratified 5-Fold)

| Modelo | Tiempo total (s) | F1 test promedio |
| --- | --- | --- |
| Logistic Regression | 38.45 | 0.9014 |
| Decision Tree | 21.13 | 0.8471 |
| Random Forest | 90.59 | 0.9010 |
| Gradient Boosting | 723.82 | 0.9024 |
| XGBoost | 43.91 | 0.9143 |
| LightGBM | 40.18 | 0.9175 |

## 6. Tabla comparativa completa de métricas

| Modelo | Accuracy | Precision | Recall | F1 | F1 std (folds) | Train F1 | Gap Train-Test | Fit time (s) | Score time (s) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **LightGBM** | 0.9164 | 0.9177 | 0.9173 | **0.9175** | 0.0026 | 0.9413 | 0.0238 | 33.25 | 0.1489 |
| XGBoost | 0.9132 | 0.9145 | 0.9142 | 0.9143 | 0.0018 | 0.9691 | 0.0548 | 39.92 | 0.1966 |
| Gradient Boosting | 0.9011 | 0.9029 | 0.9020 | 0.9024 | 0.0021 | 0.9106 | 0.0082 | 713.99 | 0.5435 |
| Logistic Regression | 0.9004 | 0.9024 | 0.9007 | 0.9014 | 0.0012 | 0.9047 | 0.0032 | 25.28 | 0.0242 |
| Random Forest | 0.8997 | 0.9014 | 0.9006 | 0.9010 | 0.0029 | 1.0000 | 0.0990 | 85.60 | 0.6651 |
| Decision Tree | 0.8455 | 0.8471 | 0.8471 | 0.8471 | 0.0035 | 1.0000 | 0.1529 | 16.19 | 0.0225 |

## 7. Análisis de sobreajuste y estabilidad

Se aplicó un umbral objetivo: gap Train-Test > 0.05, o Train F1 >= 0.999 (memorización), se considera evidencia de sobreajuste.

| Modelo | Gap | Train F1 | Diagnóstico |
| --- | --- | --- | --- |
| Decision Tree | 0.1529 | 1.0000 | Sobreajuste severo -> **descartado** |
| Random Forest | 0.0990 | 1.0000 | Memoriza el train -> **descartado** |
| XGBoost | 0.0548 | 0.9691 | Supera el umbral -> **descartado** |
| LightGBM | 0.0238 | 0.9413 | Generaliza bien |
| Gradient Boosting | 0.0082 | 0.9106 | Generaliza muy bien |
| Logistic Regression | 0.0032 | 0.9047 | Gap mínimo (esperado en modelo lineal) |

La estabilidad entre folds (F1 std) fue baja en los 6 modelos (0.0012-0.0035), sin outliers — no fue un criterio de descarte por sí solo.

**Candidatos finales tras el filtro de sobreajuste:** LightGBM, Gradient Boosting, Logistic Regression.

## 8. Criterio de desempate y modelo ganador

Orden de prioridad aplicado: (1) Mayor F1-Score, (2) Menor gap Train-Test, (3) Menor tiempo de inferencia, (4) Mayor interpretabilidad, (5) Menor complejidad de mantenimiento, (6) Menor consumo de recursos.

| Modelo | F1 | Gap | Fit time (s) |
| --- | --- | --- | --- |
| **LightGBM** | **0.9175** | 0.0238 | 33.25 |
| Gradient Boosting | 0.9024 | 0.0082 | 713.99 |
| Logistic Regression | 0.9014 | 0.0032 | 25.28 |

LightGBM superó al segundo lugar por 0.0151 en F1 — diferencia superior al umbral de empate técnico (0.005) — por lo que el criterio 1 resolvió la selección sin necesidad de bajar a los criterios de desempate siguientes. Adicionalmente, LightGBM ofreció el mejor tiempo de inferencia entre los candidatos de mayor F1 y un gap de generalización considerablemente menor que XGBoost.

**Modelo seleccionado: LightGBM Classifier.**

## 9. Validación en test set — Modelo completo (236 features)

precision    recall  f1-score   support

Eficiente 0.94 0.93 0.93 6611
Ineficiente 0.95 0.94 0.94 5703
Moderado 0.88 0.89 0.89 6594
accuracy 0.92 18908
macro avg 0.92 0.92 0.92 18908
weighted avg 0.92 0.92 0.92 18908

Matriz de confusión:
[[6145 3 463]
[ 6 5379 318]
[ 391 309 5894]]

**Conclusión técnica:** el resultado de test es consistente con el F1 de validación cruzada (0.9175 vs 0.92), confirmando ausencia de fuga de datos y buena generalización. Eficiente e Ineficiente casi no se confunden entre sí (clases semánticamente opuestas); Moderado — la clase intermedia — concentra la mayor parte del error de frontera, un patrón esperado en un target de naturaleza ordinal.

---

## 10. El desafío de producción: de 236 columnas a un formulario real

El modelo completo requiere 236 columnas, muchas de ellas *features* de ingeniería derivadas (ratios, índices, interacciones, codificaciones one-hot) no capturables directamente por un formulario de usuario. El formulario ya construido por Frontend/Backend en ese momento tenía solo 8 campos. Enviar el resto como ceros o promedios habría generado un **fallo silencioso**: el modelo no truena, pero predice con sesgo, porque aprendió patrones que dependen de información que en producción llegaría "apagada".

### 10.1 Decisión de arquitectura

Se evaluaron 3 alternativas:

- **A.** Retrenar el modelo solo con variables obtenibles del formulario.
- **B.** Ampliar el formulario para cubrir más variables crudas.
- **C.** Combinar A + B: reducir el modelo y ampliar el formulario en los campos de mayor impacto.

**Decisión: opción C**, por ofrecer el mejor balance entre precisión del modelo y experiencia de usuario del formulario.

### 10.2 Análisis de importancia de variables

Se extrajo el ranking de importancia de LightGBM sobre las 236 columnas. Se necesitaron **78 features** para acumular el 85% de la importancia total, agrupadas en dominios de origen. Se identificaron 3 dominios de altísimo apalancamiento no capturados por el formulario original:

| Dominio crudo faltante | Importancia acumulada desbloqueada |
| --- | --- |
| Consumo del mes anterior | ~16.0% |
| Nivel de aislamiento térmico | ~7.3% |
| % de iluminación LED | ~5.5% |

Un análisis posterior por dominio (no solo por variable individual) sumó 3 dominios adicionales de alto valor: antigüedad de la construcción, zona geográfica y antigüedad de electrodomésticos.

**Campos nuevos incorporados al formulario (6):** consumo del mes anterior (kWh), nivel de aislamiento térmico, % de iluminación LED, antigüedad de la construcción, zona geográfica, antigüedad de electrodomésticos.

---

## 11. Iteración v2 — Primer intento de reducción (DESCARTADO)

Se filtraron las 236 columnas por coincidencia de palabra clave contra los dominios ahora cubiertos por el formulario (14 campos: 8 originales + 6 nuevos), obteniendo 121 columnas candidatas. Tras excluir artefactos de limpieza de datos y dominios claramente no cubiertos (certificación, generación solar, vulnerabilidad eléctrica), quedaron **103 columnas**.

### 11.1 Resultado del reentrenamiento (v2)

precision    recall  f1-score   support

Eficiente 0.94 0.93 0.93 6611
Ineficiente 0.94 0.94 0.94 5703
Moderado 0.88 0.89 0.89 6594
accuracy 0.92 18908
macro avg 0.92 0.92 0.92 18908
weighted avg 0.92 0.92 0.92 18908

A primera vista, resultado idéntico al modelo completo (F1 macro 0.92) — pero este resultado **fue inválido**, y se descubrió el error antes de pasar a producción (ver sección 12).

### 11.2 Error metodológico detectado

El filtrado por palabra clave marcaba una columna como "cubierta" si su *nombre* contenía un término del dominio disponible (ej. `"zona"`), sin verificar que **todas** las variables crudas usadas en su fórmula real estuvieran disponibles. Al revisar el notebook original de feature engineering se confirmó que numerosas columnas son **interacciones multiplicativas** entre un dominio cubierto y otro no cubierto:

```python
# Ejemplo real encontrado en el notebook:
temperatura_zona_costera = temperatura_promedio_c * zona_costera
```

El término `"zona"` coincidía con la búsqueda por palabra clave, pero la fórmula también depende de `temperatura_promedio_c`, dato que el formulario nunca captura. El mismo patrón se repitió en aire acondicionado (requiere `cantidad_unidades_aa`, no solo horas de uso), iluminación (requiere `cantidad_focos` y `horas_uso_iluminacion_dia`, no solo el % LED), uso por espacio (requiere el desglose por habitación, no el campo agregado del formulario), energía solar, cortes eléctricos, nivel socioeconómico y certificación previa.

**Riesgo que se evitó:** entregar a producción un modelo con *train/serve skew* — el peor tipo de bug en Machine Learning, porque no genera errores visibles, solo degrada la calidad real de las predicciones de forma silenciosa.

---

## 12. Corrección — Verificación de dependencias reales

Se construyó un diccionario de dependencias línea por línea, extraído directamente de las fórmulas del notebook `05_Feature_Engineering.ipynb` (144 features engineered en total), y se cruzó contra el conjunto real de 14 campos disponibles en el formulario.

**Resultado de la verificación:** de 144 features engineered, solo **37** son genuinamente calculables desde los datos del formulario. Sumando las 18 columnas crudas que entran directo al modelo (9 numéricas + 9 dummies de variables categóricas), el conjunto real deployable es de **55 columnas**, no 103.

---

## 13. Iteración v3 — Modelo final (deployable, verificado)

### 13.1 Resultado del reentrenamiento (v3, 55 columnas)

precision    recall  f1-score   support

Eficiente 0.93 0.93 0.93 6611
Ineficiente 0.94 0.93 0.94 5703
Moderado 0.87 0.88 0.88 6594
accuracy 0.91 18908
macro avg 0.91 0.91 0.91 18908
weighted avg 0.91 0.91 0.91 18908

Matriz de confusión:
[[6128 7 476]
[ 8 5331 364]
[ 449 348 5797]]

### 13.2 Conclusión técnica

La caída real de desempeño frente al modelo completo fue de solo **1 punto de F1 macro** (0.92 -> 0.91), pese a haber descartado dominios enteros (temperatura, aire acondicionado detallado, iluminación detallada, energía solar, cortes eléctricos, nivel socioeconómico, certificación previa). Esto confirma que la señal predictiva real estaba concentrada en variables que sí resultaron capturables: superficie, personas, equipos, consumo histórico, aislamiento y antigüedad. El patrón de confusión se mantuvo idéntico en las 3 iteraciones: casi cero confusión entre clases extremas, error concentrado en la clase intermedia (Moderado).

**Decisión final:** se aceptó este resultado (F1 macro = 0.91) como versión definitiva, en lugar de perseguir el punto de diferencia restante agregando `cantidad_unidades_aa` al formulario y `temperatura_promedio_c` vía una API de clima externa — evaluado como una mejora de costo/beneficio desfavorable para el alcance del MVP, y documentado como oportunidad de mejora futura (sección 15).

---

## 14. Configuración final del modelo

```python
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from lightgbm import LGBMClassifier

RANDOM_STATE = 42

preprocessor_final = ColumnTransformer(transformers=[
    ("num", Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ]), columnas_finales_v3)  # 55 columnas verificadas
], remainder="drop")

pipeline_final = Pipeline([
    ("preprocessor", preprocessor_final),
    ("classifier", LGBMClassifier(random_state=RANDOM_STATE, n_jobs=-1, verbose=-1))
])
```

- **Algoritmo:** LightGBM Classifier (hiperparámetros por defecto — no se realizó tuning avanzado, fuera del alcance de esta etapa del MVP).
- **Validación:** Stratified K-Fold, 5 particiones.
- **Reproducibilidad:** `random_state = 42` en todos los pasos aplicables.
- **Serialización:** Joblib (`modelo_perfil_energetico_final.joblib`, `label_encoder.joblib`, `columnas_requeridas_final.joblib`).
- **Contrato de integración:** ver `docs/especificacion-formulario-modelo.md` — 12 campos JSON que alimentan el pipeline.

---

## 15. Lecciones aprendidas y trabajo futuro

1. **La selección de features por coincidencia de nombre no es segura en pipelines de feature engineering con interacciones.** Cualquier reducción de columnas orientada a producción debe verificarse contra las fórmulas reales, no contra los nombres.
2. **Medir el "F1 deployable" requiere simular las condiciones reales de inferencia**, no solo eliminar columnas de un dataset ya calculado con el conjunto de datos crudo completo.
3. **Oportunidades de mejora identificadas para una futura iteración:**
   - Incorporar `temperatura_promedio_c` vía una API de clima externa (usando zona + fecha), sin necesidad de un campo adicional en el formulario.
   - Agregar `cantidad_unidades_aa` como campo del formulario para desbloquear el dominio completo de aire acondicionado.
   - Evaluar tuning de hiperparámetros sobre LightGBM (fuera del alcance de esta fase, según el documento de instrucciones del MVP).

---

## 16. Productos generados en esta etapa

- Scripts de entrenamiento de los 6 modelos candidatos (validación cruzada Stratified 5-Fold).
- Resultados completos de validación cruzada por modelo.
- Tabla comparativa de métricas (Accuracy, Precision, Recall, F1, tiempos, estabilidad).
- Ranking de modelos y análisis de sobreajuste.
- Informe técnico de selección (este documento).
- Configuración final del modelo elegido, exportada vía Joblib.
- Especificación de contrato de datos (JSON) para integración con Backend/Frontend.
