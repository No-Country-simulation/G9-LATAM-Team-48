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

### 5.1. Análisis exploratorio inicial

### 5.2. Limpieza de datos

### 5.3. Análisis exploratorio posterior a la limpieza

### 5.4. Imputación y codificación de variables

### 5.5. Ingeniería de características

### 5.6. Entrenamiento y selección de modelos

### 5.7. Evaluación del modelo

### 5.8. Exportación del modelo y sus artefactos

## 6. Evolución de los datasets

### 6.1. Dataset original

### 6.2. Dataset procesado después de la limpieza

### 6.3. Dataset imputado y codificado

### 6.4. Dataset con ingeniería de características

## 7. Documentación disponible

### 7.1. Documentación de los datos

### 7.2. Documentación del análisis exploratorio

### 7.3. Documentación de la imputación y la ingeniería de características

### 7.4. Documentación del modelo

### 7.5. Manuales del proyecto

## 8. Selección y evaluación del modelo

### 8.1. Informes de selección del modelo

### 8.2. Documentación técnica consolidada

### 8.3. Especificación del formulario del modelo

## 9. Instalación

### 9.1. Clonación del repositorio

### 9.2. Creación del entorno virtual

### 9.3. Activación del entorno virtual

### 9.4. Instalación de dependencias

## 10. Verificación del entorno

## 11. Ejecución del proyecto

### 11.1. Orden de ejecución de los notebooks

### 11.2. Archivos de entrada y salida

### 11.3. Dependencias entre las etapas

## 12. Resultados principales

### 12.1. Modelo seleccionado

### 12.2. Métricas de evaluación

### 12.3. Variables más relevantes

### 12.4. Principales hallazgos

### 12.5. Artefactos exportados

## 13. Reproducibilidad

### 13.1. Semillas aleatorias

### 13.2. Versiones de las dependencias

### 13.3. Orden de ejecución

### 13.4. Ubicación de los datasets

### 13.5. Archivos generados en cada etapa

## 14. Estado del proyecto

## 15. Equipo

### 15.1. Integrantes

### 15.2. Roles y contribuciones

## 16. Licencia
