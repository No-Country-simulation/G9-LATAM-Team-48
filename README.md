# Datascience — EnergIA

## 1. Descripción general

# EnergIA

## 1. Descripción general

**EnergIA** es un proyecto de ciencia de datos orientado al análisis y la clasificación del perfil energético de viviendas y pequeños establecimientos comerciales. Para ello, utiliza información relacionada con las características del inmueble, la cantidad de residentes, el equipamiento disponible, los patrones de uso de los espacios, las condiciones ambientales, la generación solar, los cortes eléctricos y el consumo histórico de energía.

La variable dependiente del proyecto es `perfil_energetico`, utilizada para clasificar cada registro en una de las siguientes tres categorías:

* **Eficiente**
* **Moderado**
* **Ineficiente**

El repositorio contiene el flujo completo de preparación y análisis de los datos, incluyendo el análisis exploratorio inicial, la limpieza y corrección de inconsistencias, el análisis posterior a la limpieza, la imputación de valores faltantes, la codificación de variables categóricas, la ingeniería de características, el entrenamiento de modelos de clasificación, la evaluación de resultados y la exportación de los artefactos finales.

Los notebooks se encuentran organizados de manera secuencial para mantener la trazabilidad y reproducibilidad del proceso. Cada etapa utiliza los resultados producidos por las fases anteriores, permitiendo observar la evolución del conjunto de datos desde su versión original hasta la base final preparada para entrenar y evaluar los modelos predictivos.

Además del código, el repositorio incluye documentación técnica y metodológica sobre los datos, los análisis exploratorios, las variables creadas, el proceso de imputación, la ingeniería de características, la selección del modelo y las especificaciones necesarias para utilizar sus resultados en aplicaciones posteriores.

## 2. Objetivos

### 2.1. Objetivo general

Desarrollar un modelo de clasificación capaz de predecir el `perfil_energetico` de viviendas y pequeños establecimientos comerciales, asignando cada registro a una de las categorías **Eficiente**, **Moderado** o **Ineficiente**.

Para alcanzar este objetivo, el proyecto integra un proceso completo de análisis y preparación de datos que incluye la exploración inicial del conjunto de datos, la limpieza de inconsistencias, la imputación de valores faltantes, la codificación de variables categóricas, la creación de nuevas características, el entrenamiento de diferentes modelos de aprendizaje automático y la evaluación de su capacidad predictiva.

El resultado busca proporcionar una clasificación reproducible y sustentada en variables relacionadas con las características del inmueble, la ocupación, el equipamiento, los patrones de uso, las condiciones ambientales, el consumo histórico, la generación solar y la disponibilidad de fuentes de energía secundaria.

### 2.2. Objetivos específicos

* Analizar la estructura, calidad y distribución de los datos relacionados con el consumo energético.

* Identificar valores faltantes, inconsistencias, valores atípicos y posibles errores en las variables del conjunto de datos.

* Aplicar reglas de limpieza y correcciones determinísticas para mejorar la coherencia lógica, física y matemática de los registros.

* Imputar los valores faltantes mediante métodos multivariados que permitan conservar las relaciones existentes entre las variables.

* Transformar las variables categóricas en representaciones numéricas adecuadas para el entrenamiento de modelos de aprendizaje automático.

* Crear nuevas características a partir de las variables originales, incluyendo indicadores de ocupación, superficie, equipamiento, climatización, iluminación, consumo histórico, generación solar, cortes eléctricos y calidad de los registros.

* Preparar un conjunto de datos final sin valores inválidos, duplicados o inconsistencias que puedan afectar el proceso de modelado.

* Entrenar y comparar diferentes modelos de clasificación para predecir la variable `perfil_energetico`.

* Evaluar el rendimiento de los modelos mediante métricas apropiadas para un problema de clasificación multiclase.

* Seleccionar el modelo con mejor capacidad para diferenciar entre las categorías **Eficiente**, **Moderado** e **Ineficiente**.

* Documentar cada etapa del proyecto para garantizar la trazabilidad, comprensión y reproducibilidad del flujo de trabajo.

* Exportar el modelo seleccionado y los artefactos necesarios para facilitar su integración en aplicaciones o sistemas posteriores.

## 3. Flujo general del proyecto

El proyecto **EnergIA** sigue un flujo secuencial en el que cada etapa transforma, valida o utiliza los resultados generados por la fase anterior.

```text
Dataset original
      ↓
Análisis exploratorio inicial
      ↓
Limpieza y corrección de inconsistencias
      ↓
Análisis exploratorio posterior a la limpieza
      ↓
Imputación de valores faltantes
      ↓
Codificación de variables categóricas
      ↓
Ingeniería de características
      ↓
Entrenamiento y comparación de modelos
      ↓
Evaluación del modelo seleccionado
      ↓
Exportación del modelo y sus artefactos
```

### 3.1. Dataset original

El proceso comienza con el conjunto de datos crudo, que contiene información sobre las características de los inmuebles, los residentes, el equipamiento, los patrones de uso y el consumo energético.

### 3.2. Análisis exploratorio inicial

Se estudia la estructura del conjunto de datos para identificar:

* Tipos de variables.
* Valores faltantes.
* Distribuciones.
* Valores atípicos.
* Inconsistencias.
* Relaciones entre variables.
* Distribución de la variable objetivo `perfil_energetico`.

### 3.3. Limpieza y corrección de inconsistencias

Se corrigen errores de formato, valores inválidos y combinaciones que no cumplen relaciones lógicas, físicas o matemáticas.

También se crean banderas para conservar la trazabilidad de los registros que fueron corregidos o que presentaron alguna incidencia.

### 3.4. Análisis exploratorio posterior a la limpieza

Se realiza un nuevo análisis descriptivo para evaluar el estado de las variables después de las correcciones.

Esta etapa permite revisar nuevamente las medidas de tendencia central, dispersión, forma de las distribuciones, valores atípicos y frecuencias de las variables categóricas.

### 3.5. Imputación de valores faltantes

Los valores faltantes que no pueden completarse mediante reglas determinísticas se estiman utilizando un procedimiento de imputación multivariada.

La imputación busca aprovechar las relaciones entre las variables para generar valores compatibles con la información disponible.

### 3.6. Codificación de variables categóricas

Las variables categóricas se transforman en representaciones numéricas para que puedan utilizarse durante el entrenamiento de los modelos.

La codificación incluye una transformación temporal para la imputación y una codificación final mediante variables binarias.

### 3.7. Ingeniería de características

A partir de las variables originales se crean nuevas características relacionadas con:

* Ocupación y superficie.
* Uso de los espacios.
* Aire acondicionado y temperatura.
* Equipamiento.
* Iluminación.
* Consumo histórico.
* Generación solar.
* Cortes eléctricos y respaldo.
* Estacionalidad.
* Calidad y confiabilidad de los registros.

El objetivo de esta etapa es proporcionar a los modelos variables con mayor capacidad para representar los patrones asociados al perfil energético.

### 3.8. Entrenamiento y comparación de modelos

Se entrenan diferentes algoritmos de clasificación utilizando `perfil_energetico` como variable dependiente.

Los modelos buscan asignar cada registro a una de las categorías:

* **Eficiente**
* **Moderado**
* **Ineficiente**

### 3.9. Evaluación del modelo seleccionado

Los modelos se comparan mediante métricas de clasificación para determinar cuál presenta el mejor rendimiento.

La evaluación permite analizar tanto el desempeño general como la capacidad del modelo para reconocer correctamente cada categoría.

### 3.10. Exportación

Finalmente, se exportan el modelo seleccionado y los artefactos necesarios para reproducir las transformaciones realizadas sobre los datos y utilizar la solución en aplicaciones posteriores.

## 4. Estructura del repositorio

El repositorio de **EnergIA** está organizado por etapas del flujo de ciencia de datos. Los datasets, notebooks, documentos técnicos e informes se encuentran separados en directorios específicos para facilitar la trazabilidad, la reproducción de los análisis y el mantenimiento del proyecto.

```text
.
├── datasets/
│   ├── external/
│   ├── processed/
│   └── raw/
├── docs/
├── notebooks/
├── reports/
│   └── model_selection/
├── .gitattributes
├── .gitignore
├── requirements.txt
├── test_environment.py
└── README.md
```

### 4.1. Directorio `datasets`

Contiene los conjuntos de datos utilizados y generados durante las diferentes etapas del proyecto.

#### 4.1.1. Datos originales: `datasets/raw`

Almacena el conjunto de datos original antes de aplicar procesos de limpieza, imputación o transformación.

```text
datasets/raw/
└── dataset_consumo_energetico_CRUDO.csv
```

El archivo `dataset_consumo_energetico_CRUDO.csv` representa la fuente inicial de información utilizada por el proyecto.

#### 4.1.2. Datos procesados: `datasets/processed`

Contiene las versiones intermedias y finales del conjunto de datos producidas durante el pipeline.

```text
datasets/processed/
├── 01_energia_processed.csv
├── 02_energia_imputada_ohe.csv
└── 03_feature_engineering.csv
```

Los archivos corresponden a las siguientes etapas:

* `01_energia_processed.csv`: conjunto de datos resultante del proceso de limpieza.
* `02_energia_imputada_ohe.csv`: conjunto de datos después de la imputación y la codificación de variables categóricas.
* `03_feature_engineering.csv`: conjunto de datos enriquecido con las variables creadas durante la ingeniería de características.

#### 4.1.3. Datos externos: `datasets/external`

Directorio reservado para almacenar datos provenientes de fuentes externas que puedan complementar el análisis.

Actualmente contiene un archivo `.gitkeep`, utilizado para conservar el directorio dentro del repositorio aunque no tenga datasets disponibles.

### 4.2. Directorio `notebooks`

Contiene los notebooks que forman el flujo principal del proyecto.

```text
notebooks/
├── 01_EDA.ipynb
├── 02_Limpieza.ipynb
├── 03_EDA_post_limpieza.ipynb
├── 04_Imputacion_Variables.ipynb
├── 05_Feature_Engineering.ipynb
├── 06_Modelos.ipynb
├── 07_Evaluacion.ipynb
└── 08_Exportacion.ipynb
```

La numeración indica el orden recomendado de ejecución.

Cada notebook representa una fase específica:

* Análisis exploratorio inicial.
* Limpieza de datos.
* Análisis exploratorio posterior a la limpieza.
* Imputación y codificación.
* Ingeniería de características.
* Entrenamiento y comparación de modelos.
* Evaluación.
* Exportación de resultados y artefactos.

### 4.3. Directorio `docs`

Contiene la documentación metodológica y técnica del proyecto.

```text
docs/
├── Documentación_del_EDA_Incidencias_y_Variables.md
├── Manual_Cientifico_Datos.md
├── dataset-catalog.md
├── diccionario_datos_y_metodologia.md
├── diccionario_nuevas_columnas.md
├── documentacion_tecnica_seleccion_modelo.md
├── documentación_eda_post_limpieza.md
└── especificacion-formulario-modelo.md
```

La documentación incluye:

* Descripción y catálogo de los datasets.
* Diccionarios de variables.
* Metodología de limpieza e imputación.
* Documentación de los análisis exploratorios.
* Descripción de las variables creadas.
* Documentación técnica de la selección del modelo.
* Especificaciones para la integración del modelo.

### 4.4. Directorio `reports`

Contiene informes relacionados con los resultados del proyecto y con el proceso de selección del modelo.

```text
reports/
└── model_selection/
    ├── documentacion_seleccion_modelo_v1.md
    ├── documentacion_seleccion_modelo_v3.md
    ├── documentacion_tecnica_seleccion_modelo.md
    └── especificacion-formulario-modelo.md
```

#### 4.4.1. Informes de selección del modelo: `reports/model_selection`

Este directorio conserva diferentes versiones de la documentación generada durante la comparación y selección de modelos.

También incluye:

* La documentación técnica consolidada.
* Las especificaciones del formulario que utilizará el modelo.
* Versiones anteriores conservadas para mantener el historial del proceso.

### 4.5. Archivos de configuración

#### 4.5.1. `.gitignore`

Define los archivos y directorios que Git no debe incluir en el control de versiones, como archivos temporales, entornos virtuales, cachés y otros recursos locales.

#### 4.5.2. `.gitattributes`

Establece configuraciones relacionadas con el tratamiento de archivos dentro del repositorio, como normalización de saltos de línea o reglas específicas de Git.

#### 4.5.3. `.vscode/settings.json`

Contiene configuraciones del entorno de desarrollo para Visual Studio Code.

Estas configuraciones permiten mantener criterios comunes entre los integrantes que utilicen este editor.

#### 4.5.4. `requirements.txt`

Contiene la lista de librerías de Python necesarias para ejecutar los notebooks y scripts del proyecto.

Este archivo permite instalar las dependencias utilizando un único comando.

#### 4.5.5. `test_environment.py`

Script destinado a comprobar que el entorno de ejecución dispone de las dependencias y configuraciones necesarias para trabajar con el proyecto.

#### 4.5.6. `README.md`

Documento principal del repositorio.

Contiene la descripción general de **EnergIA**, sus objetivos, la estructura del proyecto, las instrucciones de instalación, el flujo de ejecución y la información necesaria para comprender y reproducir el trabajo realizado.

## 5. Pipeline de notebooks

El proyecto **EnergIA** se organiza mediante una secuencia de ocho notebooks que cubren las principales etapas del flujo de ciencia de datos. La numeración de los archivos indica el orden recomendado de ejecución.

Cada notebook utiliza como entrada los datos originales o los resultados generados por las etapas anteriores. Esta organización permite mantener la trazabilidad de las transformaciones y reproducir el proceso completo desde el análisis inicial hasta la exportación del modelo.

### 5.1. Análisis exploratorio inicial

**Notebook:** `notebooks/01_EDA.ipynb`

Esta etapa realiza la primera revisión del conjunto de datos original.

Su propósito es conocer la estructura y las características principales de la información disponible antes de aplicar modificaciones. El análisis permite identificar:

* Tipos de variables.
* Valores faltantes.
* Distribuciones numéricas y categóricas.
* Posibles valores atípicos.
* Inconsistencias entre variables.
* Relaciones relevantes para el análisis energético.
* Distribución inicial de la variable dependiente `perfil_energetico`.

Los resultados obtenidos sirven como base para definir las reglas de limpieza y preparación de los datos.

### 5.2. Limpieza de datos

**Notebook:** `notebooks/02_Limpieza.ipynb`

Esta etapa corrige problemas detectados durante el análisis exploratorio inicial.

El notebook aplica transformaciones orientadas a mejorar la calidad del conjunto de datos, incluyendo:

* Corrección de tipos de datos.
* Estandarización de valores categóricos.
* Tratamiento de formatos inconsistentes.
* Eliminación de filas completamente nulas y duplicadas.
* Preparación de la primera versión procesada del dataset.

El resultado de esta fase se almacena en:

`datasets/processed/01_energia_processed.csv`

### 5.3. Análisis exploratorio posterior a la limpieza

**Notebook:** `notebooks/03_EDA_post_limpieza.ipynb`

Esta etapa evalúa nuevamente el conjunto de datos después de aplicar la limpieza.

El notebook analiza:

* Medidas de tendencia central.
* Medidas de dispersión.
* Cuartiles y rangos.
* Asimetría y curtosis.
* Histogramas.
* Diagramas de caja.
* Valores atípicos.
* Frecuencias de variables categóricas.
* Distribución de `perfil_energetico`.

Este análisis permite comprobar los efectos de la limpieza y conocer el estado de los datos antes de la imputación.

### 5.4. Imputación y codificación de variables

**Notebook:** `notebooks/04_Imputacion_Variables.ipynb`

Esta fase completa los valores faltantes y prepara las variables categóricas para su uso en modelos de aprendizaje automático.

El proceso incluye:

* Correcciones determinísticas previas a la imputación.
* Codificación ordinal temporal de variables categóricas.
* Imputación multivariada con MICE.
* Uso de `RandomForestRegressor` como estimador interno.
* Aplicación de límites mínimos y máximos.
* Correcciones posteriores a la imputación.
* Recálculo de variables derivadas.
* Restauración de las categorías originales.
* Codificación final mediante One-Hot Encoding.
* Validación de valores nulos, infinitos y banderas.

El resultado de esta etapa se almacena en:

`datasets/processed/02_energia_imputada_ohe.csv`

### 5.5. Ingeniería de características

**Notebook:** `notebooks/05_Feature_Engineering.ipynb`

Esta etapa crea nuevas variables a partir de las características originales y procesadas.

Las variables generadas representan relaciones asociadas con:

* Ocupación y superficie.
* Uso de los espacios.
* Temperatura y aire acondicionado.
* Equipamiento tecnológico.
* Iluminación.
* Consumo energético histórico.
* Generación solar.
* Cortes eléctricos y sistemas de respaldo.
* Tipo de inmueble.
* Aislamiento y antigüedad.
* Estacionalidad.
* Horarios de mayor uso.
* Zona geográfica.
* Nivel socioeconómico.
* Certificación energética.
* Calidad y confiabilidad de los registros.

También se crean banderas para identificar divisiones no calculables y se validan los valores nulos, infinitos y constantes.

El resultado de esta etapa se almacena en:

`datasets/processed/03_feature_engineering.csv`

### 5.6. Entrenamiento y selección de modelos

**Notebook:** `notebooks/06_Modelos.ipynb`

Esta etapa utiliza el archivo `datasets/processed/03_feature_engineering.csv` para entrenar y comparar diferentes algoritmos de clasificación multiclase.

El conjunto de datos utilizado contiene **94 537 registros y 238 columnas**. Antes del entrenamiento se excluyen `id_registro` y la variable dependiente `perfil_energetico`, por lo que el modelo completo parte de **236 características predictoras**.

La variable dependiente se codifica numéricamente de la siguiente manera:

* **Eficiente:** 0.
* **Ineficiente:** 1.
* **Moderado:** 2.

El preprocesamiento se implementa mediante un pipeline que aplica:

* Imputación de posibles valores faltantes mediante la mediana.
* Estandarización de las variables con `StandardScaler`.
* Eliminación de columnas no incluidas explícitamente en el transformador.

Posteriormente, los datos se dividen de forma estratificada en:

* **80 % para entrenamiento:** 75 629 registros.
* **20 % para prueba:** 18 908 registros.

La estratificación conserva la proporción original de las tres clases y se utiliza `random_state = 42` para garantizar la reproducibilidad. El preprocesador se ajusta exclusivamente con los datos de entrenamiento para evitar fugas de información hacia el conjunto de prueba.

Los seis modelos candidatos evaluados son:

* Logistic Regression.
* Decision Tree.
* Random Forest.
* Gradient Boosting.
* XGBoost.
* LightGBM.

La comparación se realiza mediante validación cruzada estratificada de cinco particiones. Para cada modelo se calculan:

* Accuracy.
* Precision macro.
* Recall macro.
* F1-score macro.
* Desviación estándar del F1 entre particiones.
* F1 obtenido sobre entrenamiento.
* Brecha entre el F1 de entrenamiento y validación.
* Tiempo promedio de entrenamiento.
* Tiempo promedio de evaluación.

Para identificar posibles problemas de sobreajuste, se considera riesgoso un modelo cuando la brecha entre entrenamiento y validación supera `0.05` o cuando el F1 de entrenamiento es igual o superior a `0.999`.

Bajo este criterio se descartan:

* **XGBoost:** brecha de 0.0548.
* **Random Forest:** brecha de 0.0990 y F1 de entrenamiento igual a 1.
* **Decision Tree:** brecha de 0.1529 y F1 de entrenamiento igual a 1.

Los candidatos que no presentan evidencia de sobreajuste son:

* LightGBM.
* Gradient Boosting.
* Logistic Regression.

El modelo con mejor desempeño es **LightGBM**, con los siguientes resultados promedio durante la validación cruzada:

| Métrica                         | Resultado |
| ------------------------------- | --------: |
| Accuracy                        |    0.9164 |
| Precision macro                 |    0.9177 |
| Recall macro                    |    0.9173 |
| F1 macro                        |    0.9175 |
| Desviación estándar del F1      |    0.0026 |
| F1 de entrenamiento             |    0.9413 |
| Brecha entrenamiento-validación |    0.0238 |

LightGBM supera al segundo candidato válido, Gradient Boosting, por una diferencia de `0.0151` en F1 macro, por lo que no se considera un empate técnico.

Después de seleccionar el algoritmo, se evalúan tres versiones del modelo:

| Versión         | Columnas | F1 macro | Estado                            |
| --------------- | -------: | -------: | --------------------------------- |
| Modelo completo |      236 |     0.92 | No desplegable                    |
| Modelo v2       |      103 |     0.92 | Descartado por error metodológico |
| Modelo v3       |       55 |     0.91 | Modelo final desplegable          |

El modelo completo alcanza un F1 macro de 0.92, pero depende de variables que no pueden capturarse directamente mediante el formulario de la aplicación.

La versión v2 conserva 103 columnas seleccionadas mediante coincidencias en los nombres de las variables. Esta versión se descarta porque algunas características derivadas utilizan en sus fórmulas variables que no están disponibles en producción, aunque sus nombres coincidan con dominios capturados por el formulario.

Para corregir este problema, las dependencias de las variables creadas durante la ingeniería de características se verifican directamente contra sus fórmulas. Como resultado, se identifican:

* **37 variables derivadas** que pueden calcularse realmente con los datos disponibles.
* **18 variables originales o codificadas** que entran directamente al modelo.
* **55 columnas verificadas** en total.

La versión final utiliza **LightGBM sobre 55 columnas**, debido a que ofrece el mejor equilibrio entre rendimiento predictivo, capacidad de generalización y viabilidad de integración en producción.

### 5.7. Evaluación del modelo

La evaluación final se realiza sobre el conjunto de prueba estratificado, compuesto por **18 908 registros** que no fueron utilizados durante el entrenamiento.

El modelo completo de 236 características alcanza un F1 macro aproximado de 0.92. Sin embargo, debido a que no puede reproducirse completamente con los datos disponibles en producción, la evaluación definitiva se concentra en el modelo v3 de 55 columnas verificadas.

Los resultados del modelo final son:

| Clase                | Precision |   Recall | F1-score |  Registros |
| -------------------- | --------: | -------: | -------: | ---------: |
| Eficiente            |      0.93 |     0.93 |     0.93 |      6 611 |
| Ineficiente          |      0.94 |     0.93 |     0.94 |      5 703 |
| Moderado             |      0.87 |     0.88 |     0.88 |      6 594 |
| **Resultado global** |  **0.91** | **0.91** | **0.91** | **18 908** |

La matriz de confusión obtenida es:

```text
[[6128,    7,  476],
 [   8, 5331,  364],
 [ 449,  348, 5797]]
```

Los resultados muestran que las categorías extremas, **Eficiente** e **Ineficiente**, presentan muy poca confusión directa entre sí. La mayor parte de los errores se concentra en la categoría **Moderado**, debido a su posición intermedia entre los otros dos perfiles energéticos.

La reducción desde 236 hasta 55 columnas genera una disminución aproximada de un punto en el F1 macro, pasando de 0.92 a 0.91. Esta pérdida se considera aceptable porque permite utilizar únicamente variables que pueden obtenerse o calcularse en el entorno real de producción.

La versión final excluye deliberadamente dominios que no pueden capturarse sin ampliar considerablemente el formulario, entre ellos:

* Temperatura promedio.
* Cantidad de unidades de aire acondicionado.
* Información detallada de focos y horas de iluminación.
* Generación solar.
* Cortes eléctricos y sistemas de respaldo.
* Nivel socioeconómico.
* Certificación energética previa.

El modelo final mantiene un rendimiento equilibrado entre las tres clases y conserva la mayor parte de la capacidad predictiva del modelo completo, utilizando una cantidad considerablemente menor de variables.

### 5.8. Exportación del modelo y sus artefactos

La versión final se construye como un pipeline que integra el preprocesamiento y el clasificador LightGBM.

El pipeline incluye:

* Imputación por mediana.
* Estandarización con `StandardScaler`.
* Selección de las 55 columnas verificadas.
* Clasificador `LGBMClassifier`.
* Configuración reproducible mediante `random_state = 42`.

Los artefactos finales se serializan mediante Joblib:

```text
models/
├── modelo_perfil_energetico_final_v3.joblib
├── label_encoder_v3.joblib
└── columnas_requeridas_final_v3.joblib
```

Cada archivo tiene la siguiente función:

* `modelo_perfil_energetico_final_v3.joblib`: contiene el pipeline completo de preprocesamiento y clasificación.
* `label_encoder_v3.joblib`: conserva la correspondencia entre las clases numéricas y las categorías Eficiente, Ineficiente y Moderado.
* `columnas_requeridas_final_v3.joblib`: contiene la lista y el orden exacto de las 55 columnas que espera el modelo.

El servicio de predicción no necesita recibir directamente las 55 columnas. El contrato de integración consume **12 campos proporcionados por el formulario**, a partir de los cuales deben construirse las variables originales, derivadas y codificadas requeridas por el pipeline:

* Tipo de inmueble.
* Superficie en metros cuadrados.
* Número de personas.
* Cantidad total de equipos.
* Horas diarias de uso del aire acondicionado.
* Consumo energético mensual.
* Consumo energético del mes anterior.
* Nivel de aislamiento térmico.
* Porcentaje de iluminación LED.
* Antigüedad de la construcción.
* Zona geográfica.
* Antigüedad de los electrodomésticos.

El formulario puede conservar otros campos existentes, pero aquellos que no formen parte de este contrato no afectan las predicciones de la versión final.

También se generan documentos técnicos relacionados con la selección y la integración del modelo:

```text
reports/model_selection/
├── documentacion_seleccion_modelo_v1.md
├── documentacion_seleccion_modelo_v3.md
└── documentacion_tecnica_seleccion_modelo.md
```

La documentación técnica consolidada también se almacena en:

```text
docs/documentacion_tecnica_seleccion_modelo.md
```

Estos documentos registran:

* Modelos candidatos evaluados.
* Resultados de validación cruzada.
* Análisis de sobreajuste.
* Justificación de la selección de LightGBM.
* Evolución de las versiones del modelo.
* Métricas finales.
* Variables requeridas.
* Limitaciones conocidas.
* Contrato de integración con Backend y Frontend.

La exportación del pipeline, el codificador de clases, la lista de columnas y la documentación técnica permite reproducir el proceso de inferencia y utilizar el modelo fuera del entorno donde fue entrenado.

## 6. Evolución de los datasets

El conjunto de datos utilizado por **EnergIA** atraviesa diferentes etapas de procesamiento antes de ser utilizado para entrenar los modelos de clasificación.

Cada archivo almacenado en `datasets/processed/` representa el resultado de una fase específica del pipeline. Esta organización permite conservar la trazabilidad de las transformaciones y evita modificar directamente el dataset original.

```text
dataset_consumo_energetico_CRUDO.csv
                ↓
01_energia_processed.csv
                ↓
02_energia_imputada_ohe.csv
                ↓
03_feature_engineering.csv
```

### 6.1. Dataset original

**Archivo:** `datasets/raw/dataset_consumo_energetico_CRUDO.csv`

Corresponde al conjunto de datos inicial del proyecto, antes de aplicar procesos de limpieza, imputación o transformación.

Este archivo contiene las variables originales relacionadas con:

* Características de los inmuebles.
* Número de personas.
* Superficie.
* Equipamiento disponible.
* Uso de iluminación y aire acondicionado.
* Consumo energético.
* Generación solar.
* Cortes eléctricos.
* Sistemas de respaldo.
* Condiciones ambientales.
* Variable dependiente `perfil_energetico`.

El dataset original se conserva sin modificaciones dentro del directorio `datasets/raw/`, de manera que siempre sea posible reproducir el procesamiento desde su punto de partida.

### 6.2. Dataset procesado después de la limpieza

**Archivo:** `datasets/processed/01_energia_processed.csv`

Este archivo es generado por el notebook:

`notebooks/02_Limpieza.ipynb`

Contiene el conjunto de datos después de aplicar las operaciones iniciales de limpieza, entre ellas:

* Corrección de tipos de datos.
* Estandarización de valores categóricos.
* Tratamiento de formatos inconsistentes.
* Eliminación de filas completamente nulas.
* Eliminación de registros duplicados.

En esta etapa todavía pueden permanecer valores faltantes que no pueden resolverse mediante operaciones directas de limpieza.

El archivo resultante sirve como entrada para el análisis exploratorio posterior a la limpieza y para el proceso de imputación.

### 6.3. Dataset imputado y codificado

**Archivo:** `datasets/processed/02_energia_imputada_ohe.csv`

Este archivo es generado por el notebook:

`notebooks/04_Imputacion_Variables.ipynb`

Contiene el conjunto de datos después de completar los valores faltantes y preparar las variables categóricas para su utilización en modelos de aprendizaje automático.

Las principales transformaciones aplicadas en esta etapa son:

* Correcciones determinísticas previas a la imputación.
* Codificación ordinal temporal de variables categóricas.
* Imputación multivariada mediante MICE.
* Uso de `RandomForestRegressor` como estimador interno.
* Redondeo y corrección de variables imputadas.
* Recálculo de variables dependientes.
* Recuperación de las categorías originales.
* Codificación final mediante One-Hot Encoding.
* Validación de valores nulos y banderas de calidad.

Como resultado, las categorías se representan mediante columnas binarias y el dataset queda preparado para la creación de nuevas características.

### 6.4. Dataset con ingeniería de características

**Archivo:** `datasets/processed/03_feature_engineering.csv`

Este archivo es generado por el notebook:

`notebooks/05_Feature_Engineering.ipynb`

Representa la versión del dataset enriquecida con nuevas variables construidas a partir de la información original y procesada.

Las características creadas incluyen indicadores asociados con:

* Consumo por persona.
* Consumo por superficie.
* Densidad de ocupación.
* Intensidad de uso de espacios.
* Uso de aire acondicionado.
* Cantidad y antigüedad del equipamiento.
* Eficiencia de la iluminación.
* Variación del consumo histórico.
* Generación solar.
* Cortes eléctricos.
* Sistemas de respaldo.
* Antigüedad y aislamiento del inmueble.
* Estacionalidad.
* Horarios de mayor consumo.
* Calidad y consistencia de los registros.

También se incorporan banderas que permiten identificar operaciones no calculables, como divisiones con denominadores iguales a cero.

Este archivo constituye la fuente principal utilizada durante el entrenamiento, comparación y selección de los modelos de clasificación.

| Etapa                            | Archivo                                | Notebook que lo genera          |
| -------------------------------- | -------------------------------------- | ------------------------------- |
| Datos originales                 | `dataset_consumo_energetico_CRUDO.csv` | Fuente inicial                  |
| Datos limpios                    | `01_energia_processed.csv`             | `02_Limpieza.ipynb`             |
| Datos imputados y codificados    | `02_energia_imputada_ohe.csv`          | `04_Imputacion_Variables.ipynb` |
| Datos con nuevas características | `03_feature_engineering.csv`           | `05_Feature_Engineering.ipynb`  |

## 7. Documentación disponible

La documentación complementaria del proyecto **EnergIA** se encuentra principalmente en los directorios `docs/` y `reports/model_selection/`.

### 7.1. Documentación general

- [`dataset-catalog.md`](docs/dataset-catalog.md)
- [`diccionario_datos_y_metodologia.md`](docs/diccionario_datos_y_metodologia.md)
- [`diccionario_nuevas_columnas.md`](docs/diccionario_nuevas_columnas.md)
- [`Documentación_del_EDA_Incidencias_y_Variables.md`](docs/Documentación_del_EDA_Incidencias_y_Variables.md)
- [`documentación_eda_post_limpieza.md`](docs/documentación_eda_post_limpieza.md)
- [`documentacion_tecnica_seleccion_modelo.md`](docs/documentacion_tecnica_seleccion_modelo.md)
- [`especificacion-formulario-modelo.md`](docs/especificacion-formulario-modelo.md)
- [`Manual_Cientifico_Datos.md`](docs/Manual_Cientifico_Datos.md)

### 7.2. Informes de selección del modelo

- [`documentacion_seleccion_modelo_v1.md`](reports/model_selection/documentacion_seleccion_modelo_v1.md)
- [`documentacion_seleccion_modelo_v3.md`](reports/model_selection/documentacion_seleccion_modelo_v3.md)
- [`documentacion_tecnica_seleccion_modelo.md`](reports/model_selection/documentacion_tecnica_seleccion_modelo.md)
- [`especificacion-formulario-modelo.md`](reports/model_selection/especificacion-formulario-modelo.md)

## 8. Instalación

Para ejecutar el proyecto **EnergIA** en un entorno local, se recomienda clonar el repositorio, crear un entorno virtual e instalar las dependencias definidas en `requirements.txt`.

### 8.1. Clonación del repositorio

Clonar el repositorio desde GitHub:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Acceder al directorio del proyecto:

```bash
cd G9-LATAM-Team-48
```

> Sustituir `<URL_DEL_REPOSITORIO>` por la URL correspondiente al repositorio de **EnergIA**.

### 8.2. Creación del entorno virtual

Desde la raíz del proyecto, crear un entorno virtual de Python:

```bash
python -m venv .venv
```

El entorno virtual permite mantener las dependencias del proyecto aisladas de las instalaciones globales de Python.

### 8.3. Activación del entorno virtual

#### Windows

En PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

En Git Bash:

```bash
source .venv/Scripts/activate
```

#### Linux / macOS

```bash
source .venv/bin/activate
```

Una vez activado correctamente, el nombre del entorno debería aparecer al inicio de la terminal.

### 8.4. Instalación de dependencias

Con el entorno virtual activo, instalar las librerías requeridas por el proyecto:

```bash
pip install -r requirements.txt
```

El archivo [`requirements.txt`](requirements.txt) contiene las dependencias necesarias para ejecutar los notebooks, scripts y procesos de ciencia de datos utilizados en **EnergIA**.

Una vez completada la instalación, el entorno puede verificarse mediante el script `test_environment.py`, cuyo uso se describe en la siguiente sección.

## 9. Verificación del entorno

Una vez instaladas las dependencias del proyecto, se recomienda verificar que el entorno de Python esté correctamente preparado antes de ejecutar los notebooks de **EnergIA**.

El repositorio incluye el script:

```text
test_environment.py
```

Este archivo está destinado a comprobar que el entorno de ejecución dispone de las dependencias y configuraciones necesarias para trabajar con el proyecto.

### 9.1. Ejecución de la verificación

Con el entorno virtual activado y desde la raíz del repositorio, ejecutar:

```bash
python test_environment.py
```

La verificación debe realizarse después de instalar las dependencias mediante:

```bash
pip install -r requirements.txt
```

y antes de comenzar la ejecución del pipeline de notebooks.

### 9.2. Resolución de problemas

Si la verificación del entorno indica que falta alguna dependencia, se recomienda comprobar que el entorno virtual esté activo y volver a instalar los paquetes definidos en `requirements.txt`:

```bash
pip install -r requirements.txt
```

También puede comprobarse qué intérprete de Python está siendo utilizado:

#### Windows

```bash
where python
```

#### Linux / macOS

```bash
which python
```

El intérprete mostrado debería corresponder al entorno virtual creado para el proyecto.

Una vez completada correctamente la preparación del entorno, puede continuarse con la ejecución secuencial de los notebooks descrita en la siguiente sección.

## 10. Ejecución del proyecto

El flujo de **EnergIA** está organizado mediante notebooks numerados de forma secuencial. Para reproducir completamente el proceso de ciencia de datos, se recomienda ejecutarlos respetando este orden, ya que varias etapas utilizan como entrada los resultados generados por notebooks anteriores.

### 10.1. Orden de ejecución de los notebooks

Los notebooks deben ejecutarse en el siguiente orden:

```text
01_EDA.ipynb
      ↓
02_Limpieza.ipynb
      ↓
03_EDA_post_limpieza.ipynb
      ↓
04_Imputacion_Variables.ipynb
      ↓
05_Feature_Engineering.ipynb
      ↓
06_Modelos.ipynb
      ↓
07_Evaluacion.ipynb
      ↓
08_Exportacion.ipynb
```

| Orden | Notebook | Etapa |
|---:|---|---|
| 1 | `notebooks/01_EDA.ipynb` | Análisis exploratorio inicial |
| 2 | `notebooks/02_Limpieza.ipynb` | Limpieza de datos |
| 3 | `notebooks/03_EDA_post_limpieza.ipynb` | Análisis exploratorio posterior a la limpieza |
| 4 | `notebooks/04_Imputacion_Variables.ipynb` | Imputación y codificación de variables |
| 5 | `notebooks/05_Feature_Engineering.ipynb` | Ingeniería de características |
| 6 | `notebooks/06_Modelos.ipynb` | Entrenamiento y selección de modelos |
| 7 | `notebooks/07_Evaluacion.ipynb` | Evaluación del modelo |
| 8 | `notebooks/08_Exportacion.ipynb` | Exportación del modelo y sus artefactos |

### 10.2. Archivos de entrada y salida

El pipeline comienza utilizando el dataset original almacenado en:

```text
datasets/raw/dataset_consumo_energetico_CRUDO.csv
```

A medida que avanza el procesamiento se generan diferentes versiones del conjunto de datos:

| Etapa | Entrada principal | Salida principal |
|---|---|---|
| EDA inicial | `dataset_consumo_energetico_CRUDO.csv` | Resultados exploratorios |
| Limpieza | `dataset_consumo_energetico_CRUDO.csv` | `01_energia_processed.csv` |
| EDA post-limpieza | `01_energia_processed.csv` | Resultados exploratorios posteriores a la limpieza |
| Imputación y codificación | `01_energia_processed.csv` | `02_energia_imputada_ohe.csv` |
| Ingeniería de características | `02_energia_imputada_ohe.csv` | `03_feature_engineering.csv` |
| Modelado | `03_feature_engineering.csv` | Modelo seleccionado y resultados de comparación |
| Evaluación | Modelo seleccionado y conjunto de prueba | Métricas y resultados de evaluación |
| Exportación | Modelo final y configuración requerida | Artefactos necesarios para la integración |

Los datasets generados y versionados en el repositorio se encuentran en:

```text
datasets/processed/
├── 01_energia_processed.csv
├── 02_energia_imputada_ohe.csv
└── 03_feature_engineering.csv
```

### 10.3. Dependencias entre las etapas

Las principales dependencias del pipeline son:

- `01_EDA.ipynb` analiza directamente el dataset original.
- `02_Limpieza.ipynb` transforma el dataset original y genera `01_energia_processed.csv`.
- `03_EDA_post_limpieza.ipynb` analiza el dataset después de la limpieza.
- `04_Imputacion_Variables.ipynb` utiliza los datos limpios y genera `02_energia_imputada_ohe.csv`.
- `05_Feature_Engineering.ipynb` utiliza los datos imputados y codificados para generar `03_feature_engineering.csv`.
- `06_Modelos.ipynb` utiliza `03_feature_engineering.csv` para entrenar, comparar y seleccionar los modelos de clasificación.
- `07_Evaluacion.ipynb` utiliza el modelo seleccionado para analizar su rendimiento predictivo.
- `08_Exportacion.ipynb` utiliza la versión final del modelo y prepara los elementos necesarios para su integración en la aplicación.

Debido a estas dependencias, modificar una etapa intermedia puede afectar los resultados de todas las fases posteriores. Por este motivo, cuando se realizan cambios en la limpieza, imputación o ingeniería de características, se recomienda volver a ejecutar las etapas dependientes para mantener la consistencia del pipeline.

```python
random_state = 42
```

Esta configuración permite mantener resultados consistentes en operaciones que incorporan aleatoriedad, como:

- División del conjunto de datos en entrenamiento y prueba.
- Entrenamiento de algoritmos que utilizan procesos aleatorios.
- Comparación reproducible entre diferentes modelos.
- Construcción de la versión final de LightGBM.

El uso de una semilla fija reduce las variaciones entre ejecuciones realizadas bajo las mismas condiciones.

> La reproducibilidad exacta también depende de utilizar las mismas versiones de Python, librerías, datos y parámetros de entrenamiento.

## 11. Resultados principales

El desarrollo de **EnergIA** permitió construir y validar un modelo de clasificación multiclase capaz de predecir el `perfil_energetico` en las categorías **Eficiente**, **Moderado** e **Ineficiente**.

El proceso de modelado comenzó con 236 características predictoras y finalizó con una versión desplegable de 55 columnas verificadas, manteniendo la mayor parte del rendimiento obtenido por el modelo completo.

### 11.1. Modelo seleccionado

Después de comparar seis algoritmos de clasificación:

- Logistic Regression.
- Decision Tree.
- Random Forest.
- Gradient Boosting.
- XGBoost.
- LightGBM.

se seleccionó **LightGBM Classifier** como algoritmo principal.

Durante la validación cruzada estratificada de 5 particiones, LightGBM obtuvo un **F1 macro promedio de 0.9175**, superior al resto de los candidatos que no presentaron evidencia significativa de sobreajuste.

Posteriormente se desarrollaron tres versiones:

| Versión | Columnas | F1 macro | Estado |
|---|---:|---:|---|
| Modelo completo | 236 | 0.92 | No desplegable |
| Modelo v2 | 103 | 0.92 | Descartado por error metodológico |
| **Modelo v3** | **55** | **0.91** | **Modelo final desplegable** |

La versión v3 fue seleccionada como modelo definitivo debido a que utiliza únicamente variables que pueden obtenerse o calcularse con la información disponible en producción.

### 11.2. Métricas de evaluación

El modelo final fue evaluado sobre un conjunto de prueba independiente de **18 908 registros**.

| Clase | Precision | Recall | F1-score |
|---|---:|---:|---:|
| Eficiente | 0.93 | 0.93 | 0.93 |
| Ineficiente | 0.94 | 0.93 | 0.94 |
| Moderado | 0.87 | 0.88 | 0.88 |
| **Resultado global** | **0.91** | **0.91** | **0.91** |

El modelo final alcanza:

- **Accuracy:** 0.91.
- **F1 macro:** 0.91.
- **F1 Eficiente:** 0.93.
- **F1 Ineficiente:** 0.94.
- **F1 Moderado:** 0.88.

La reducción de 236 a 55 características produjo una disminución aproximada de **1 punto porcentual en F1 macro**, pasando de 0.92 a 0.91, a cambio de disponer de un modelo compatible con las condiciones reales de inferencia.

### 11.3. Variables más relevantes

El análisis de importancia realizado sobre el modelo LightGBM completo mostró que la capacidad predictiva se distribuye entre múltiples características: fueron necesarias aproximadamente **78 variables para acumular el 85 % de la importancia total**.

Entre los dominios con mayor aporte identificados durante el análisis se encuentran:

| Dominio | Importancia aproximada identificada |
|---|---:|
| Consumo energético del mes anterior | ~16.0 % |
| Nivel de aislamiento térmico | ~7.3 % |
| Porcentaje de iluminación LED | ~5.5 % |

También se identificaron como dominios relevantes:

- Antigüedad de la construcción.
- Zona geográfica.
- Antigüedad de los electrodomésticos.
- Superficie del inmueble.
- Número de personas.
- Cantidad de equipos.
- Consumo energético histórico.

Este análisis también fue utilizado para determinar qué información adicional resultaba conveniente incorporar al formulario de la aplicación.

### 11.4. Principales hallazgos

Los principales resultados obtenidos durante el desarrollo del modelo son:

- **LightGBM presentó el mejor equilibrio entre rendimiento y capacidad de generalización** entre los algoritmos evaluados.
- El modelo completo alcanzó un **F1 macro de 0.92**, mientras que la versión final desplegable obtuvo **0.91**.
- Fue posible reducir el modelo de **236 a 55 columnas** manteniendo prácticamente todo su rendimiento predictivo.
- De las características creadas durante la ingeniería de variables, **37 pueden calcularse utilizando únicamente los datos disponibles para producción**.
- Las clases **Eficiente** e **Ineficiente** presentan muy poca confusión directa entre ellas.
- La mayor parte de los errores de clasificación se concentra en la categoría **Moderado**, que representa el perfil intermedio.
- La selección de características únicamente mediante coincidencias en los nombres de las columnas resultó insuficiente. Para construir la versión final fue necesario verificar las dependencias reales de cada característica contra las fórmulas utilizadas durante la ingeniería de variables.
- La reducción del modelo permite evitar diferencias entre las variables disponibles durante el entrenamiento y aquellas que realmente pueden generarse durante la inferencia.
- La versión final ofrece un equilibrio entre **rendimiento predictivo, reproducibilidad y viabilidad de integración** con la aplicación.

### 11.5. Artefactos exportados

El proceso de modelado contempla la serialización mediante Joblib de los siguientes artefactos:

```text
models/
├── modelo_perfil_energetico_final_v3.joblib
├── label_encoder_v3.joblib
└── columnas_requeridas_final_v3.joblib
```

Estos archivos cumplen las siguientes funciones:

- `modelo_perfil_energetico_final_v3.joblib`: contiene el pipeline de preprocesamiento y el clasificador LightGBM.
- `label_encoder_v3.joblib`: conserva la correspondencia entre las clases numéricas y las categorías de `perfil_energetico`.
- `columnas_requeridas_final_v3.joblib`: almacena las 55 columnas y el orden esperado por el modelo.

> **Nota:** el directorio `models/` y estos archivos son generados por el proceso de modelado, pero actualmente no aparecen entre los archivos versionados mostrados por `git ls-files`.

## 12. Reproducibilidad


El proyecto **EnergIA** está organizado para que el flujo de ciencia de datos pueda reproducirse desde el dataset original hasta la obtención del modelo final.


La reproducibilidad se apoya en la conservación de los datos originales, el versionado de los datasets intermedios, la ejecución secuencial de los notebooks, el uso de semillas aleatorias en las etapas de modelado y la definición de las dependencias del entorno mediante `requirements.txt`.

### 12.1. Semillas aleatorias

En las etapas de entrenamiento y evaluación se utiliza:

```python
random_state = 42
```

Esta configuración permite mantener resultados consistentes en operaciones que incorporan aleatoriedad, como:

- División del conjunto de datos en entrenamiento y prueba.
- Entrenamiento de algoritmos que utilizan procesos aleatorios.
- Comparación reproducible entre diferentes modelos.
- Construcción de la versión final de LightGBM.




