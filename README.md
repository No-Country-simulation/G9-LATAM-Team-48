# EnergIA

## 1. Descripción

**EnergIA** es un proyecto de ciencia de datos orientado a la clasificación del perfil energético de viviendas y pequeños establecimientos comerciales.

La variable objetivo es `perfil_energetico`, con tres categorías:

- **Eficiente**
- **Moderado**
- **Ineficiente**

El proyecto cubre el ciclo completo de la solución: preparación de datos, ingeniería de características, entrenamiento y evaluación de modelos, interpretabilidad, exportación del modelo y exposición de la inferencia mediante una API REST.

La versión desplegable del modelo es **v3**, basada en **LightGBM** y construida para recibir directamente los 12 campos definidos por el contrato del formulario. El feature engineering requerido para transformar esos campos en las 55 columnas del modelo está embebido dentro del pipeline, por lo que los consumidores de la API no deben reproducir las transformaciones manualmente.

## 2. Arquitectura de la solución

La arquitectura actual separa el desarrollo y análisis de datos de la inferencia en producción:

```text
Dataset original
      ↓
EDA y limpieza
      ↓
Imputación y codificación
      ↓
Feature engineering
      ↓
Entrenamiento y selección
      ↓
Modelo LightGBM v3
      ↓
Interpretabilidad SHAP
      ↓
Pipeline v3 con FeatureEngineerV3 embebido
      ↓
FastAPI
      ↓
Predicción + logging
```

Las recomendaciones energéticas se apoyan en los resultados de interpretabilidad SHAP, pero el motor de recomendaciones Backend no forma parte del conjunto de archivos de este repositorio.

## 3. Estructura del repositorio

```text
.
├── api/
│   ├── app/
│   │   ├── logging_predicciones.py
│   │   ├── main.py
│   │   ├── model_loader.py
│   │   └── schemas.py
│   └── requirements.txt
├── datasets/
│   ├── external/
│   │   └── .gitkeep
│   ├── processed/
│   │   ├── .gitkeep
│   │   ├── 01_energia_processed.csv
│   │   ├── 02_energia_imputada_ohe.csv
│   │   └── 03_feature_engineering.csv
│   └── raw/
│       └── dataset_consumo_energetico_CRUDO.csv
├── docs/
│   ├── Documentación_del_EDA_Incidencias_y_Variables.md
│   ├── Manual_Cientifico_Datos.md
│   ├── dataset-catalog.md
│   ├── diccionario_datos_y_metodologia.md
│   ├── diccionario_nuevas_columnas.md
│   ├── documentacion_tecnica_integracion.md
│   ├── documentacion_tecnica_seleccion_modelo.md
│   ├── documentación_eda_post_limpieza.md
│   └── especificacion-formulario-modelo.md
├── models/
│   ├── columnas_requeridas_final_v3.joblib
│   ├── export_log_v3.json
│   ├── label_encoder_v3.joblib
│   ├── metadata_v3.json
│   ├── model_pipeline_v3.joblib
│   └── training_config_v3.json
├── notebooks/
│   ├── 01_EDA.ipynb
│   ├── 02_Limpieza.ipynb
│   ├── 03_EDA_post_limpieza.ipynb
│   ├── 04_Imputacion_Variables.ipynb
│   ├── 05_Feature_Engineering.ipynb
│   ├── 06_Modelos.ipynb
│   ├── 07_Evaluacion.ipynb
│   └── 08_Exportacion.ipynb
├── reports/
│   ├── model_evaluation/
│   │   └── documentacion_tecnica_seleccion_modelo.md
│   ├── model_interpretation/
│   │   ├── informe_interpretacion_modelo.md
│   │   ├── ranking_importancia_shap.csv
│   │   ├── shap_dependence_reglas_negocio.png
│   │   ├── shap_summary_global.png
│   │   ├── shap_waterfall_Eficiente.png
│   │   ├── shap_waterfall_Ineficiente.png
│   │   ├── shap_waterfall_Moderado.png
│   │   └── validacion_reglas_negocio.csv
│   └── model_selection/
│       ├── documentacion_seleccion_modelo_v1.md
│       ├── documentacion_seleccion_modelo_v3.md
│       ├── documentacion_tecnica_seleccion_modelo.md
│       └── especificacion-formulario-modelo.md
├── src/
│   ├── __init__.py
│   └── features/
│       ├── __init__.py
│       └── feature_engineer_v3.py
├── tests/
│   └── test_aceptacion_capitulo21.py
├── .gitattributes
├── .gitignore
├── .vscode/
│   └── settings.json
├── requirements.txt
├── test_environment.py
└── README.md
```

> El directorio `api/logs/` se crea en tiempo de ejecución para almacenar la base SQLite de predicciones; por eso no forma parte de la estructura versionada mostrada arriba.

## 4. Pipeline de datos

El flujo de preparación y modelado sigue ocho notebooks:

| Orden | Notebook | Función |
|---:|---|---|
| 1 | `01_EDA.ipynb` | Análisis exploratorio inicial |
| 2 | `02_Limpieza.ipynb` | Limpieza y corrección de inconsistencias |
| 3 | `03_EDA_post_limpieza.ipynb` | Validación exploratoria posterior a la limpieza |
| 4 | `04_Imputacion_Variables.ipynb` | Imputación y codificación |
| 5 | `05_Feature_Engineering.ipynb` | Creación de características |
| 6 | `06_Modelos.ipynb` | Entrenamiento y selección |
| 7 | `07_Evaluacion.ipynb` | Evaluación |
| 8 | `08_Exportacion.ipynb` | Exportación del modelo y artefactos |

Los datasets procesados principales son:

```text
datasets/raw/dataset_consumo_energetico_CRUDO.csv
        ↓
datasets/processed/01_energia_processed.csv
        ↓
datasets/processed/02_energia_imputada_ohe.csv
        ↓
datasets/processed/03_feature_engineering.csv
```

Las etapas de limpieza, imputación, codificación e ingeniería de características se desarrollan y documentan en los notebooks. La versión desplegable incorpora una implementación reutilizable de la ingeniería necesaria para inferencia.

## 5. Ingeniería de características v3

`src/features/feature_engineer_v3.py` contiene `FeatureEngineerV3`, el transformer oficial utilizado por el modelo v3.

Su función es transformar los **12 campos crudos del contrato de la API** en las **55 columnas requeridas por el modelo**. Las fórmulas fueron verificadas contra el notebook de ingeniería de características.

Esto evita que Backend o Frontend tengan que construir manualmente las variables derivadas.

La reducción a 55 columnas se realizó verificando las dependencias reales de las fórmulas. De las 144 características engineered del proceso original, **37 son calculables directamente con los datos disponibles en producción**. A ellas se suman **18 columnas originales o codificadas**, dando un total de 55 columnas utilizables por el modelo final.

El pipeline exportado incluye esta transformación embebida.

## 6. Modelo final

### 6.1. Selección

Se compararon seis algoritmos:

- Logistic Regression
- Decision Tree
- Random Forest
- Gradient Boosting
- XGBoost
- LightGBM

LightGBM presentó el mejor equilibrio entre rendimiento y generalización entre los candidatos considerados válidos.

Durante la validación cruzada estratificada de cinco particiones obtuvo:

| Métrica | Resultado |
|---|---:|
| Accuracy | 0.9164 |
| Precision macro | 0.9177 |
| Recall macro | 0.9173 |
| F1 macro | 0.9175 |
| Desviación estándar del F1 | 0.0026 |
| F1 de entrenamiento | 0.9413 |
| Brecha entrenamiento-validación | 0.0238 |

La evolución de las versiones fue:

| Versión | Columnas | F1 macro | Estado |
|---|---:|---:|---|
| Modelo completo | 236 | 0.92 | No desplegable |
| Modelo v2 | 103 | 0.92 | Descartado por error metodológico |
| **Modelo v3** | **55** | **0.91** | **Modelo final desplegable** |

La versión v3 prioriza la reproducibilidad de las condiciones reales de inferencia sobre el punto adicional de F1 del modelo completo.

### 6.2. Configuración y reproducibilidad

La configuración del entrenamiento está registrada en `models/training_config_v3.json`.

Los parámetros de reproducibilidad relevantes incluyen:

```python
random_state = 42
```

y validación `Stratified K-Fold` de cinco particiones.

La configuración del clasificador v3 incluye `LGBMClassifier` con `n_estimators=100`, `learning_rate=0.1`, `num_leaves=31`, `max_depth=-1` y `random_state=42`.

La metadata de `models/metadata_v3.json` identifica la versión v3, las tres clases, las 55 características requeridas, las 12 características crudas y las métricas de test.

## 7. Evaluación final

El modelo v3 se evaluó sobre un conjunto de prueba de **18 908 registros**.

| Clase | Precision | Recall | F1-score |
|---|---:|---:|---:|
| Eficiente | 0.93 | 0.93 | 0.93 |
| Ineficiente | 0.94 | 0.93 | 0.94 |
| Moderado | 0.87 | 0.88 | 0.88 |
| **Global** | **0.91** | **0.91** | **0.91** |

Matriz de confusión:

```text
[[6128,    7,  476],
 [   8, 5331,  364],
 [ 449,  348, 5797]]
```

La reducción de 236 a 55 columnas implicó una disminución aproximada de un punto porcentual en F1 macro, de 0.92 a 0.91, pero permitió utilizar únicamente variables reproducibles en producción.

## 8. Interpretabilidad y reglas de negocio

El informe `reports/model_interpretation/informe_interpretacion_modelo.md` documenta la interpretación global y local del modelo v3 mediante **SHAP**.

El análisis global se calculó sobre una muestra estratificada de 5 000 registros del conjunto de prueba. Las variables con mayor importancia SHAP fueron:

| Ranking | Variable | Importancia SHAP |
|---:|---|---:|
| 1 | `consumo_anterior_por_persona` | 0.9156 |
| 2 | `consumo_anterior_por_m2` | 0.7424 |
| 3 | `consumo_kwh_mensual` | 0.5251 |
| 4 | `factor_aislamiento` | 0.2173 |
| 5 | `consumo_kwh_mes_anterior` | 0.1385 |
| 6 | `proporcion_iluminacion_led` | 0.1323 |
| 7 | `equipos_casa` | 0.1137 |
| 8 | `horas_aa_por_persona` | 0.0752 |

El ranking completo se encuentra en `reports/model_interpretation/ranking_importancia_shap.csv`.

La interpretación también incluye:

- Resumen global de importancia.
- Dependencias de variables principales.
- Casos individuales de alta confianza para las tres clases.
- Gráficos waterfall para **Eficiente**, **Ineficiente** y **Moderado**.
- Validación de hipótesis de negocio.

Los artefactos visuales correspondientes están en `reports/model_interpretation/`.

### Reglas de negocio auditadas

La validación confirma, entre otras, las siguientes señales:

- Mayor consumo histórico por persona → mayor probabilidad de **Ineficiente**.
- Mayor proporción de iluminación LED → mayor probabilidad de **Eficiente**.
- Mayor densidad de equipos → mayor probabilidad de **Ineficiente**.

La regla relacionada con `factor_aislamiento` quedó documentada como **parcialmente validada** debido a que debe contrastarse la escala del factor con la definición original del feature.

El análisis también identifica una señal débil para el uso de aire acondicionado porque el modelo dispone de horas de uso, pero no del dominio completo de unidades y consumo del equipo.

La generación solar no forma parte del modelo v3, ya que no puede capturarse con el formulario actual.

## 9. Artefactos del modelo

Los principales artefactos exportados son:

```text
models/
├── model_pipeline_v3.joblib
├── label_encoder_v3.joblib
├── columnas_requeridas_final_v3.joblib
├── metadata_v3.json
├── training_config_v3.json
└── export_log_v3.json
```

- `model_pipeline_v3.joblib`: pipeline completo de inferencia, incluyendo el feature engineering v3 y el clasificador.
- `label_encoder_v3.joblib`: correspondencia entre clases y etiquetas.
- `columnas_requeridas_final_v3.joblib`: orden y lista de las 55 columnas del modelo.
- `metadata_v3.json`: versión, clases, features y métricas.
- `training_config_v3.json`: configuración del entrenamiento.
- `export_log_v3.json`: información de exportación y validación de fidelidad.

La validación de fidelidad registrada en `export_log_v3.json` compara 18 908 filas del conjunto de prueba. La mediana de diferencia es 0 y se documenta una única fila con una diferencia superior a 0.001, atribuida a ruido de punto flotante amplificado por un umbral de decisión del árbol, sin sesgo sistemático.

## 10. API de predicción

El repositorio incluye un microservicio **FastAPI v3** para servir el modelo.

### Endpoints

| Método | Endpoint | Función |
|---|---|---|
| `GET` | `/api/v3/health` | Comprueba que el servicio y la versión estén activos |
| `GET` | `/api/v3/info` | Devuelve metadata del modelo activo |
| `POST` | `/api/v3/predict` | Ejecuta una predicción |

FastAPI también expone documentación interactiva en:

```text
/docs
/redoc
```

### Ejecución

La documentación técnica de integración establece Python 3.12 y el siguiente arranque:

```bash
cd api
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

El servicio carga el pipeline desde `models/model_pipeline_v3.joblib` y su metadata desde `models/metadata_v3.json`.

El código del servicio se encuentra en:

```text
api/app/
├── main.py
├── model_loader.py
├── schemas.py
└── logging_predicciones.py
```

## 11. Contrato de predicción

`POST /api/v3/predict` recibe exactamente 12 campos:

| Campo | Tipo | Restricción |
|---|---|---|
| `tipo_inmueble` | string | `Apartamento`, `Casa Unifamiliar`, `Pequeño Establecimiento Comercial` |
| `superficie_m2` | float | ≥ 0 |
| `num_personas` | integer | ≥ 1 |
| `cantidad_equipos_total` | integer | ≥ 0 |
| `horas_uso_aa_dia` | float | 0–24 |
| `consumo_kwh_mensual` | float | ≥ 0 |
| `consumo_kwh_mes_anterior` | float | ≥ 0 |
| `aislamiento_termico` | string | `Bueno`, `Malo`, `Regular` |
| `pct_iluminacion_led` | float | 0–100 |
| `antiguedad_construccion_anios` | float | ≥ 0 |
| `zona` | string | `Suburbana`, `Urbana Costera`, `Urbana Interior` |
| `antiguedad_electrodomesticos_anios` | float | ≥ 0 |

Ejemplo:

```json
{
  "tipo_inmueble": "Casa Unifamiliar",
  "superficie_m2": 120.5,
  "num_personas": 4,
  "cantidad_equipos_total": 12,
  "horas_uso_aa_dia": 6.5,
  "consumo_kwh_mensual": 450.0,
  "consumo_kwh_mes_anterior": 430.0,
  "aislamiento_termico": "Regular",
  "pct_iluminacion_led": 65.0,
  "antiguedad_construccion_anios": 15,
  "zona": "Urbana Interior",
  "antiguedad_electrodomesticos_anios": 8
}
```

La API devuelve el nivel predicho, su confianza y las probabilidades de las tres clases:

```json
{
  "nivel": "Eficiente",
  "confianza_pct": 65.0,
  "probabilidades": {
    "Eficiente": 65.0,
    "Ineficiente": 10.0,
    "Moderado": 25.0
  }
}
```

El contrato completo está documentado en `docs/especificacion-formulario-modelo.md`.

Los campos deben enviarse con los valores exactos definidos por el contrato. `pct_iluminacion_led` utiliza escala **0–100**, no 0–1.

Los campos históricos del formulario `"Horas de alto consumo por día"` y `"¿Hay consumo en horario pico?"` no son utilizados por la versión v3 y no forman parte del contrato de los 12 campos.

## 12. Manejo de errores y logging

La API valida el contrato mediante Pydantic y utiliza los siguientes códigos:

| Código | HTTP | Descripción |
|---|---:|---|
| `CAMPO_FALTANTE` | 400 | Falta un campo obligatorio |
| `CAMPO_INVALIDO` | 400 | Tipo o enum inválido |
| `VALOR_FUERA_DE_RANGO` | 400 | Valor numérico fuera del rango |
| `ERROR_INTERNO_MODELO` | 500 | Error inesperado durante la inferencia |

Las predicciones y errores se registran en SQLite mediante `logging_predicciones.py`. La base se crea automáticamente en `api/logs/predicciones.db`.

El registro incluye, entre otros datos:

- timestamp;
- código HTTP;
- código de error;
- nivel predicho;
- confianza;
- probabilidades;
- entrada recibida;
- latencia de la operación.

## 13. Pruebas y validación

El repositorio incluye:

```text
tests/test_aceptacion_capitulo21.py
```

La suite comprueba:

- No regresión de un caso documentado por cada clase.
- Concordancia entre predicción y confianza esperadas.
- Suma de probabilidades cercana al 100 %.
- Manejo del error interno del modelo.

Ejecución:

```bash
pytest tests/test_aceptacion_capitulo21.py -v
```

El proyecto también conserva `test_environment.py` para verificar la preparación del entorno.

## 14. Instalación del proyecto

### Dependencias de ciencia de datos

Desde la raíz:

```bash
python -m venv .venv
```

**Windows — PowerShell**

```powershell
.venv\Scripts\Activate.ps1
```

**Git Bash**

```bash
source .venv/Scripts/activate
```

**Linux / macOS**

```bash
source .venv/bin/activate
```

Instalar dependencias:

```bash
pip install -r requirements.txt
```

Verificar el entorno:

```bash
python test_environment.py
```

Para ejecutar la API, utilizar las dependencias definidas para el servicio y seguir `docs/documentacion_tecnica_integracion.md`.

## 15. Documentación

La documentación se distribuye según su propósito:

### Datos y preparación

- `docs/dataset-catalog.md`
- `docs/diccionario_datos_y_metodologia.md`
- `docs/diccionario_nuevas_columnas.md`
- `docs/Documentación_del_EDA_Incidencias_y_Variables.md`
- `docs/documentación_eda_post_limpieza.md`

### Modelo y selección

- `docs/documentacion_tecnica_seleccion_modelo.md`
- `reports/model_selection/documentacion_seleccion_modelo_v1.md`
- `reports/model_selection/documentacion_seleccion_modelo_v3.md`
- `reports/model_selection/documentacion_tecnica_seleccion_modelo.md`
- `reports/model_evaluation/documentacion_tecnica_seleccion_modelo.md`

### Integración

- `docs/documentacion_tecnica_integracion.md`
- `docs/especificacion-formulario-modelo.md`

### Interpretabilidad

- `reports/model_interpretation/informe_interpretacion_modelo.md`
- `reports/model_interpretation/ranking_importancia_shap.csv`
- `reports/model_interpretation/validacion_reglas_negocio.csv`
- `reports/model_interpretation/shap_summary_global.png`
- `reports/model_interpretation/shap_dependence_reglas_negocio.png`
- `reports/model_interpretation/shap_waterfall_Eficiente.png`
- `reports/model_interpretation/shap_waterfall_Ineficiente.png`
- `reports/model_interpretation/shap_waterfall_Moderado.png`

### Manual general

- `docs/Manual_Cientifico_Datos.md`

## 16. Limitaciones y trabajo futuro

Las principales limitaciones documentadas para la versión v3 son:

- La generación solar fue excluida del modelo porque no es capturable mediante el formulario actual.
- `mes_numero` se deriva de la fecha del servidor durante la inferencia.
- El dominio de aire acondicionado está incompleto: el modelo dispone de horas de uso, pero no de cantidad de unidades ni consumo específico.
- La regla de aislamiento requiere una validación adicional sobre la escala del feature `factor_aislamiento`.
- El tuning avanzado de hiperparámetros de LightGBM quedó fuera del alcance de esta etapa.

El informe de interpretación propone como oportunidades futuras incorporar temperatura mediante una fuente meteorológica externa, ampliar los datos del aire acondicionado y evaluar tuning del modelo.

## 17. Estado del proyecto

La versión v3 completa el flujo de ciencia de datos hasta una implementación servible mediante API REST, con:

- pipeline de inferencia reproducible;
- feature engineering embebido;
- modelo LightGBM v3;
- contrato de datos definido;
- endpoints de salud, información y predicción;
- logging de predicciones;
- pruebas de aceptación;
- interpretación SHAP;
- validación de reglas de negocio.

El empaquetado Docker/OCI y su despliegue en infraestructura externa no forman parte de los archivos analizados en este repositorio.

## 18. Equipo

| Integrante | Rol |
|---|---|
| Ricardo Chirinos | Ingeniería y Análisis de Datos |
| Jharle Compres | Ciencia de Datos / ML |
| Elizabeth Díaz Familia | Data Scientist |

## 19. Licencia

Este proyecto se distribuye bajo la **Apache License, Version 2.0 (January 2004)**.

La licencia completa está disponible en el archivo:

```text
LICENSE
```
