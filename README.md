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

## 3. Flujo general del proyecto

## 4. Estructura del repositorio

### 4.1. Directorio `datasets`

#### 4.1.1. Datos originales: `datasets/raw`

#### 4.1.2. Datos procesados: `datasets/processed`

#### 4.1.3. Datos externos: `datasets/external`

### 4.2. Directorio `notebooks`

### 4.3. Directorio `docs`

### 4.4. Directorio `reports`

#### 4.4.1. Informes de selección del modelo: `reports/model_selection`

### 4.5. Archivos de configuración

#### 4.5.1. `.gitignore`

#### 4.5.2. `.gitattributes`

#### 4.5.3. `.vscode/settings.json`

#### 4.5.4. `requirements.txt`

#### 4.5.5. `test_environment.py`

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
