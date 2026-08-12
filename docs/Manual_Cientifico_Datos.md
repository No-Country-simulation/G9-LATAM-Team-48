**Capítulo 01 – Arquitectura General del Proyecto**

## **Objetivo**

Definir la arquitectura completa del MVP para establecer cómo interactúan todos los componentes del sistema, qué responsabilidad tiene Ciencia de Datos y cuáles serán las interfaces con Backend, Frontend y OCI.

Al finalizar este capítulo deberá quedar completamente definido qué construirá cada integrante del equipo y cómo se comunicará cada componente.

## **1. Arquitectura General**

La solución estará compuesta por cinco capas.

FRONTEND

Formulario de ingreso de datos

│

▼

BACKEND (Spring Boot)

Validaciones

Construcción del JSON

Consumo del modelo

Exposición de la API REST

│

▼

MOTOR DE CIENCIA DE DATOS

Modelo entrenado (.joblib)

Reglas de recomendación

Predicción

Probabilidades

Cálculo de KPIs

│

▼

OCI (Oracle Cloud)

Object Storage

API

Base de datos (opcional)

│

▼

Base de Resultados

## **2. Responsabilidad del Científico de Datos**

Este proyecto no consiste únicamente en entrenar un modelo.

La responsabilidad completa será:

* Construir el dataset.
* Validar el dataset.
* Realizar EDA.
* Limpiar datos.
* Diseñar variables.
* Crear nuevas variables.
* Definir el Target.
* Entrenar varios modelos.
* Comparar modelos.
* Seleccionar el mejor.
* Exportarlo.
* Definir el contrato JSON.
* Especificar las entradas requeridas por Backend.
* Especificar las salidas que Backend recibirá.
* Definir los KPIs.
* Crear reglas de recomendación.
* Documentar todo el proceso.

## **3. Flujo completo del sistema**

El flujo que seguirá la aplicación será el siguiente.

Usuario

↓

Completa formulario

↓

Frontend envía JSON

↓

Backend valida

↓

Backend llama al modelo

↓

Modelo procesa información

↓

Modelo genera:

• Categoría

• Probabilidad

• KPIs

• Recomendaciones

• Costo estimado

↓

Backend recibe respuesta

↓

Backend responde al Frontend

↓

Frontend muestra resultados

## **4. Arquitectura de Ciencia de Datos**

El módulo de Ciencia de Datos estará compuesto por seis fases.

Dataset

↓

EDA

↓

Limpieza

↓

Feature Engineering

↓

Entrenamiento

↓

Modelo Final

Una vez entrenado el modelo, nunca volverá a entrenarse desde la API.

La API únicamente cargará el modelo serializado.

## **5. Flujo interno del modelo**

Cuando Backend invoque el modelo, éste seguirá exactamente el siguiente proceso.

Recibir JSON

↓

Validar estructura

↓

Convertir JSON a DataFrame

↓

Aplicar mismas transformaciones del entrenamiento

↓

Realizar predicción

↓

Calcular probabilidad

↓

Generar recomendaciones

↓

Calcular indicadores

↓

Construir respuesta JSON

↓

Enviar respuesta

## **6. Responsabilidad del Backend**

Backend será responsable de:

* Validar los datos recibidos.
* Construir el JSON.
* Consumir el modelo.
* Manejar excepciones.
* Registrar logs.
* Exponer la API REST.
* Enviar la respuesta al Frontend.

Backend **no entrenará modelos**.

Backend **no realizará cálculos de Machine Learning**.

Todo el análisis será responsabilidad del módulo de Ciencia de Datos.

## **7. Responsabilidad del Frontend**

Frontend únicamente deberá:

* Mostrar formulario.
* Validar campos básicos.
* Consumir la API.
* Mostrar resultados.
* Mostrar KPIs.
* Mostrar recomendaciones.
* Mostrar gráficos.

Toda la lógica de negocio permanecerá en Backend y Ciencia de Datos.

## **8. Arquitectura del Modelo de Machine Learning**

El modelo será desarrollado en Python.

La estructura será:

Entrada JSON

↓

Preprocesamiento

↓

Pipeline

↓

Modelo

↓

Predicción

↓

Probabilidad

↓

Post-Procesamiento

↓

JSON Respuesta

Todo el preprocesamiento deberá formar parte del Pipeline.

Nunca deberá hacerse manualmente antes de llamar al modelo.

## **9. Contrato entre Ciencia de Datos y Backend**

El contrato entre ambos equipos será un archivo JSON.

Backend únicamente enviará la información.

El modelo devolverá otra estructura JSON.

Backend nunca conocerá el funcionamiento interno del modelo.

Solo conocerá:

Entrada

↓

Salida

Este desacoplamiento permitirá cambiar el modelo sin modificar la API.

## **10. Arquitectura de almacenamiento**

Durante el desarrollo se trabajará localmente.

Proyecto

│

├── datasets/

├── notebooks/

├── models/

├── src/

├── api/

├── reports/

├── exports/

└── docs/

Más adelante el modelo será almacenado en OCI Object Storage.

## **11. Arquitectura lógica del proyecto**

Usuario

↓

Frontend

↓

Spring Boot

↓

Servicio ML

↓

Pipeline

↓

Modelo

↓

Predicción

↓

Respuesta

↓

Frontend

El modelo nunca será consumido directamente por el Frontend.

Siempre existirá Backend como intermediario.

## **12. Integración con OCI**

OCI será utilizado para:

* Almacenar datasets (si aplica).
* Almacenar el modelo entrenado.
* Hospedar la API.
* Almacenar resultados futuros (opcional).

Para el MVP se utilizará, como mínimo:

* OCI Object Storage.

Los demás servicios se incorporarán en capítulos posteriores según la arquitectura definitiva.

## **13. Entregables del Científico de Datos**

Al finalizar el proyecto, el área de Ciencia de Datos deberá entregar:

* Dataset final.
* Dataset limpio.
* Notebook de EDA.
* Notebook de entrenamiento.
* Notebook de evaluación.
* Pipeline completo.
* Modelo serializado (.joblib).
* Diccionario de datos.
* Contrato JSON.
* Reglas de recomendaciones.
* Documentación técnica.

## **14. Decisiones de arquitectura adoptadas para este manual**

Estas decisiones quedan establecidas como estándar para todos los capítulos siguientes:

* Lenguaje de Ciencia de Datos: **Python**.
* Entorno de desarrollo: **Visual Studio Code** con Jupyter.
* Backend: **Java + Spring Boot**.
* Comunicación: **API REST**.
* Intercambio de información: **JSON**.
* Serialización del modelo: **Joblib**.
* Preprocesamiento: **Scikit-Learn Pipeline**.
* Servicio obligatorio de Oracle Cloud: **OCI Object Storage**.
* Todo el Machine Learning permanecerá encapsulado en un servicio independiente del Backend.
* El Frontend nunca accederá directamente al modelo.
* El proyecto se desarrollará con una arquitectura desacoplada para permitir reemplazar el modelo sin afectar la API.
* **Los datasets se seleccionarán y construirán con prioridad en fuentes públicas de Brasil**, asegurando que el modelo represente patrones de consumo energético acordes al contexto del cliente y del hackathon. Esta decisión será la base para los capítulos de selección, construcción y validación de datasets.

# **Capítulo 02 – Configuración Profesional del Entorno**

## **Objetivo**

Configurar un entorno de desarrollo profesional, reproducible y preparado para desarrollar, entrenar, evaluar y exportar el modelo de Machine Learning, asegurando compatibilidad con el resto del equipo y facilitando la integración con Backend.

Todas las configuraciones definidas en este capítulo serán utilizadas durante el resto del proyecto.

## **1. Software a instalar**

Instalar únicamente las siguientes herramientas.

| **Software** | **Versión recomendada** | **Uso** |
| --- | --- | --- |
| Python | 3.12.x | Desarrollo del modelo |
| Visual Studio Code | Última estable | IDE principal |
| Git | Última estable | Control de versiones |
| GitHub Desktop (Opcional) | Última | Gestión gráfica de Git |
| Postman | Última | Pruebas de API |
| Docker Desktop (Se utilizará posteriormente) | Última | Contenedores |
| Java JDK (Solo si colaborarás con Backend) | 21 LTS | Compatibilidad |

## **2. Instalación de Python**

Descargar Python.

Durante la instalación marcar obligatoriamente:

* Add Python to PATH

Finalizada la instalación verificar:

python --version

Debe mostrar

Python 3.12.x

Verificar pip

pip --version

## **3. Instalación de Visual Studio Code**

Instalar Visual Studio Code.

Durante la instalación activar:

* Add to PATH
* Open with Code
* Register Code as editor
* Add "Open Folder" context menu

## **4. Crear la carpeta del proyecto**

Crear la siguiente estructura desde el primer día.

energia-inteligente-ml/

│

├── api/

├── datasets/

│ ├── raw/

│ ├── processed/

│ └── external/

│

├── docs/

├── exports/

├── models/

├── notebooks/

├── reports/

├── src/

│ ├── config/

│ ├── data/

│ ├── features/

│ ├── models/

│ ├── services/

│ ├── utils/

│ └── validation/

│

├── tests/

├── .gitignore

├── requirements.txt

└── README.md

Esta estructura será utilizada durante todo el proyecto.

No deberán crearse carpetas adicionales salvo que el proyecto realmente lo requiera.

## **5. Abrir el proyecto en VSCode**

Seleccionar

File

↓

Open Folder

↓

energia-inteligente-ml

Nunca trabajar con archivos individuales.

Siempre abrir la carpeta completa.

## **6. Extensiones obligatorias de VSCode**

**Python**

Editor principal para Python.

Funciones:

* IntelliSense
* Debug
* Linting
* Formateo
* Ejecución

Debe ser la primera extensión instalada.

**Jupyter**

Permite trabajar con notebooks.

Será utilizada para:

* EDA
* Limpieza
* Visualizaciones
* Entrenamiento
* Evaluación

Toda la experimentación ocurrirá aquí.

**Pylance**

Motor de análisis de código.

Beneficios:

* Autocompletado avanzado
* Detección de errores
* Tipado
* Navegación rápida

Debe permanecer siempre habilitada.

**Ruff**

Será el estándar de calidad del proyecto.

Funciones:

* Detectar errores
* Corregir estilo
* Mejorar rendimiento
* Eliminar imports innecesarios

No utilizar múltiples linters.

Ruff será el único.

**Black Formatter**

Será el formateador oficial.

No modificar el formato manualmente.

Todo el código deberá seguir Black.

**GitLens**

Permite visualizar:

* Autor
* Historial
* Cambios
* Commits

Será útil durante el trabajo colaborativo.

**Error Lens**

Muestra errores directamente sobre el código.

Permite corregir problemas inmediatamente.

**Markdown All in One**

Será utilizada para mantener la documentación técnica.

Todo el manual del proyecto estará en Markdown.

**Material Icon Theme**

Facilita la navegación del proyecto mediante iconografía.

**Docker**

Se utilizará cuando el proyecto sea containerizado.

Instalar desde el inicio.

**REST Client**

Permitirá probar APIs desde VSCode.

Aunque también utilizaremos Postman, esta extensión facilita pruebas rápidas durante el desarrollo.

## **7. Seleccionar el intérprete de Python**

Presionar

Ctrl + Shift + P

Buscar

Python: Select Interpreter

Seleccionar

Python 3.12

Nunca utilizar un intérprete diferente durante el proyecto.

## **8. Crear el entorno virtual**

Desde la raíz del proyecto ejecutar:

python -m venv .venv

Activación en Windows

.venv\Scripts\activate

Verificación

where python

Debe apuntar al entorno virtual.

Nunca instalar dependencias fuera del entorno virtual.

## **9. Configuración inicial de VSCode**

Crear la carpeta

.vscode

Crear el archivo

settings.json

Configuración recomendada:

{

"python.defaultInterpreterPath": ".venv\\Scripts\\python.exe",

"editor.formatOnSave": true,

"editor.codeActionsOnSave": {

"source.fixAll": "explicit"

},

"python.analysis.typeCheckingMode": "basic",

"notebook.lineNumbers": "on",

"files.autoSave": "afterDelay"

}

Esta configuración será el estándar del proyecto.

## **10. Instalar dependencias**

Crear el archivo

requirements.txt

Instalar:

pandas

numpy

matplotlib

scikit-learn

jupyter

joblib

scipy

plotly

missingno

seaborn

xgboost

lightgbm

catboost

imbalanced-learn

category-encoders

openpyxl

pyarrow

fastapi

uvicorn

pydantic

Instalar:

pip install -r requirements.txt

**Decisión del proyecto:** Aunque se instalarán todas estas librerías desde el inicio para evitar interrupciones, **solo se utilizarán las que realmente aporten valor al proyecto**. La selección definitiva de algoritmos y herramientas se realizará en los capítulos de evaluación y entrenamiento.

## **11. Verificar instalación**

Crear

test\_environment.py

Contenido:

import pandas

import numpy

import sklearn

import joblib

import plotly

print("Entorno configurado correctamente")

Ejecutar.

No continuar hasta que no exista ningún error.

## **12. Configuración de Git**

Verificar instalación

git --version

Configurar usuario

git config --global user.name "Tu Nombre"

git config --global user.email "tu\_correo"

Inicializar repositorio

git init

## **13. Crear archivo .gitignore**

Incluir como mínimo:

.venv/

\_\_pycache\_\_/

.ipynb\_checkpoints/

\*.pyc

\*.pkl

\*.joblib

.env

.DS\_Store

El modelo exportado no deberá versionarse durante el desarrollo.

## **14. Configuración de Jupyter**

Crear la carpeta

notebooks

El primer notebook será

01\_EDA.ipynb

Todos los notebooks deberán seguir la nomenclatura:

01\_EDA

02\_Limpieza

03\_Feature\_Engineering

04\_Modelos

05\_Evaluacion

06\_Exportacion

No utilizar nombres libres.

## **15. Configuración de Postman**

Crear una colección llamada

Energy Intelligence API

Posteriormente se crearán las carpetas:

* Predicción
* Recomendaciones
* KPIs
* Health Check

Esta colección será utilizada durante toda la integración con Backend.

## **16. Validación final del entorno**

Antes de comenzar el siguiente capítulo verificar que:

* Python funciona correctamente.
* VSCode reconoce el entorno virtual.
* Todas las extensiones obligatorias están instaladas.
* Las dependencias del proyecto están instaladas.
* Git está configurado.
* El repositorio está inicializado.
* La estructura de carpetas coincide con la definida.
* El archivo requirements.txt está creado.
* El archivo .gitignore está configurado.
* El notebook 01\_EDA.ipynb existe.
* La colección de Postman fue creada.

## **17. Decisiones adoptadas para el resto del manual**

Las siguientes decisiones quedan establecidas como estándar para los capítulos posteriores:

* Todo el desarrollo se realizará sobre **Python 3.12**.
* El único IDE será **Visual Studio Code**.
* Todo el código Python se ejecutará desde un **entorno virtual (.venv)**.
* **Black** será el único formateador de código.
* **Ruff** será el único linter.
* Todos los notebooks seguirán una nomenclatura numérica y un propósito específico.
* Todas las dependencias se administrarán mediante requirements.txt.
* La documentación técnica del proyecto se mantendrá en formato Markdown (.md).
* Las pruebas de integración con la API se realizarán utilizando **Postman** como herramienta principal y **REST Client** como apoyo durante el desarrollo.
* La estructura de carpetas definida en este capítulo será la estructura oficial del proyecto y se mantendrá durante todo el manual.

# **Capítulo 03 – Organización del Proyecto en GitHub**

## **Objetivo**

Establecer el flujo oficial de trabajo colaborativo del Equipo de Ciencia de Datos, definiendo la organización del repositorio, la estrategia de ramas, la sincronización entre analistas, la integración con el resto de los equipos del hackathon y las normas de versionado que se utilizarán durante todo el proyecto.

Las decisiones tomadas en este capítulo serán obligatorias para todos los capítulos posteriores.

## **1. Organización general del Hackathon**

El proyecto estará compuesto por equipos independientes que desarrollarán componentes diferentes de una misma solución.

Cada equipo administrará su propio código y será responsable únicamente de su área.

La organización general será:

Hackathon Energía Inteligente

├── Backend

├── Frontend

├── Ciencia de Datos

└── Documentación

Cada equipo podrá tener su propio repositorio o trabajar dentro de un monorepositorio, según la decisión del equipo organizador.

Este manual únicamente documenta el trabajo del **Equipo de Ciencia de Datos**.

## **2. Repositorio de Ciencia de Datos**

El equipo de Ciencia de Datos trabajará sobre un único repositorio.

Dentro de este repositorio existirá una única estructura oficial.

datascience /

├── api/

├── datasets/

│ ├── raw/

│ ├── processed/

│ └── external/

├── docs/

├── exports/

├── models/

├── notebooks/

├── reports/

├── src/

├── tests/

├── .gitignore

├── README.md

└── requirements.txt

No se crearán carpetas personales para cada analista.

Toda la información deberá permanecer organizada dentro de esta estructura.

## **3. Configuración inicial del repositorio**

Antes de comenzar el desarrollo, el Analista A deberá:

* Crear la estructura definida en el Capítulo 02.
* Crear el archivo README.md.
* Crear el archivo .gitignore.
* Crear el archivo requirements.txt.
* Inicializar Git.
* Realizar el primer commit.
* Publicar la estructura en GitHub.

Una vez publicada la estructura, el Analista B será agregado como colaborador del repositorio.

## **4. Incorporación de un nuevo integrante**

Cuando un nuevo analista se incorpore al proyecto, **no deberá copiar carpetas manualmente ni recibir archivos comprimidos**.

El procedimiento oficial será:

1. Aceptar la invitación al repositorio.
2. Clonar el repositorio.
3. Abrir el proyecto en Visual Studio Code.
4. Crear el entorno virtual.
5. Instalar las dependencias mediante requirements.txt.

Con este procedimiento ambos analistas tendrán exactamente la misma estructura del proyecto.

## **5. Entorno de trabajo de cada analista**

Cada integrante trabajará sobre una copia local del proyecto.

Ejemplo:

Equipo Ciencia de Datos

GitHub

datascience

/ \

/ \

Analista A Analista B

VS Code VS Code

Proyecto Local Proyecto Local

Todo el desarrollo se realizará localmente.

GitHub únicamente se utilizará para sincronizar el trabajo entre ambos integrantes.

## **6. Flujo oficial de trabajo**

Cada tarea seguirá el siguiente flujo.

Actualizar repositorio

↓

Crear rama de trabajo

↓

Desarrollar localmente

↓

Realizar pruebas

↓

Commit

↓

Push

↓

Pull Request

↓

Revisión

↓

Merge

↓

Actualizar repositorio local

No se trabajará directamente sobre la rama principal del equipo.

## **7. Estrategia de ramas**

El proyecto utilizará una rama principal para el equipo de Ciencia de Datos.

datascience

Esta rama representará la versión estable del trabajo del equipo.

Todas las nuevas funcionalidades partirán desde esta rama.

### **Ramas de trabajo**

Las ramas de trabajo se crearán únicamente cuando exista una tarea real.

Ejemplos:

feature/dataset

feature/eda

feature/data-cleaning

feature/feature-engineering

feature/model-training

feature/model-selection

feature/model-export

feature/json-contract

feature/kpis

feature/dashboard

feature/fastapi

No deberán crearse ramas para funcionalidades que aún no hayan comenzado.

## **8. Flujo de creación de ramas**

Antes de iniciar cualquier tarea:

Actualizar la rama principal.

git checkout datascience

git pull origin datascience

Crear una nueva rama.

git checkout -b feature/nombre-funcionalidad

Trabajar únicamente sobre esa rama.

Al finalizar:

git add .

git commit -m "feat: descripción"

git push origin feature/nombre-funcionalidad

Posteriormente se creará un Pull Request hacia la rama datascience.

## **9. Distribución de responsabilidades**

### **Ricardo Chirinos – Ingeniería y Análisis de Datos**

Responsable de:

* Investigación de datasets.
* Construcción del dataset.
* Integración de múltiples fuentes.
* Validación del dataset.
* EDA.
* Limpieza de datos.
* Tratamiento de valores faltantes.
* Ingeniería de variables.
* Diccionario de datos.
* Definición de KPIs.
* Documentación técnica.

### **Jharle Compres – Machine Learning e Integración**

Responsable de:

* Desarrollo del Pipeline.
* Selección de modelos.
* Entrenamiento.
* Optimización.
* Evaluación.
* Interpretación.
* Exportación del modelo.
* FastAPI.
* Integración con Backend.
* Docker.
* OCI.

## **10. Sincronización entre analistas**

Antes de comenzar cualquier jornada de trabajo, cada analista deberá actualizar su copia local.

git checkout datascience

git pull origin datascience

Esto evitará conflictos innecesarios durante el desarrollo.

## **11. Revisión de cambios**

Todo cambio que afecte:

* Dataset.
* Pipeline.
* Variables.
* Modelo.
* Contrato JSON.
* API.

Deberá ser revisado por el otro analista antes de ser integrado.

No se realizarán integraciones directas sin revisión.

## **12. Organización de notebooks**

Cada notebook tendrá un responsable principal para minimizar conflictos de versión.

| **Notebook** | **Responsable** |
| --- | --- |
| 01\_EDA.ipynb | **Ricardo Chirinos** |
| 02\_Limpieza.ipynb | **Ricardo Chirinos** |
| 03\_Feature\_Engineering.ipynb | **Ricardo Chirinos** |
| 04\_Modelos.ipynb | **Jharle Compres** |
| 05\_Evaluacion.ipynb | **Jharle Compres** |
| 06\_Exportacion.ipynb | **Jharle Compres** |

Si un analista necesita modificar un notebook asignado al otro, deberá coordinar previamente para evitar conflictos de fusión.

## **13. Organización del código en src**

El código reutilizable se desarrollará dentro de src.

El objetivo es trasladar gradualmente la lógica validada en los notebooks hacia módulos reutilizables y preparados para producción.

La estructura será:

src/

├── config/

├── data/

├── features/

├── models/

├── services/

├── utils/

└── validation/

Los notebooks se utilizarán para experimentación y análisis.

La lógica definitiva deberá implementarse en src.

## **14. Integración con Backend**

Durante el desarrollo, el equipo de Ciencia de Datos no modificará el repositorio de Backend.

La comunicación entre ambos equipos se realizará mediante entregables definidos.

Los principales entregables serán:

* Contrato JSON.
* Modelo exportado (.joblib).
* Documentación de integración.
* API de inferencia (FastAPI).
* Definición de variables de entrada y salida.

Backend será responsable de consumir estos entregables sin acceder al código interno del modelo.

## **15. Integración con Frontend**

El equipo de Frontend no tendrá acceso directo al modelo ni al repositorio de Ciencia de Datos.

Toda la comunicación se realizará a través de Backend.

Frontend únicamente consumirá la API definida por Backend.

## **16. Convención de commits**

Todos los commits seguirán el estándar **Conventional Commits**.

Formato:

tipo: descripción

Tipos permitidos:

feat:

fix:

docs:

refactor:

test:

chore:

style:

Ejemplos:

feat: agregar limpieza de datos

feat: implementar pipeline de entrenamiento

docs: actualizar diccionario de datos

fix: corregir cálculo de consumo

refactor: reorganizar módulo de features

## **17. Gestión de versiones del modelo**

Cada versión estable del modelo deberá almacenarse con un identificador de versión.

Ejemplo:

modelo\_v1.joblib

modelo\_v2.joblib

modelo\_v3.joblib

Cada versión deberá documentar:

* Fecha de generación.
* Dataset utilizado.
* Algoritmo.
* Métricas obtenidas.
* Observaciones relevantes.

## **18. Flujo de trabajo durante el proyecto**

El trabajo diario seguirá el siguiente ciclo:

Actualizar proyecto

↓

Crear rama

↓

Desarrollar localmente

↓

Ejecutar pruebas

↓

Commit

↓

Push

↓

Pull Request

↓

Revisión del compañero

↓

Merge en datascience

↓

Actualizar ambos entornos locales

Este será el flujo oficial durante todo el hackathon.

## **19. Decisiones adoptadas para el resto del manual**

Las siguientes decisiones quedan establecidas como estándar para todos los capítulos posteriores:

* El Equipo de Ciencia de Datos estará conformado por **dos analistas con responsabilidades complementarias**.
* Existirá **un único repositorio y una única estructura de proyecto** para todo el equipo.
* Cada integrante trabajará sobre una copia local sincronizada mediante GitHub.
* GitHub será utilizado exclusivamente para versionado, colaboración y sincronización del código; el desarrollo se realizará siempre desde Visual Studio Code.
* La rama datascience será la rama principal del equipo y representará la versión estable del trabajo de Ciencia de Datos.
* Las ramas feature/\* se crearán únicamente cuando exista una funcionalidad concreta por desarrollar.
* Todo cambio relevante deberá pasar por revisión antes de integrarse en la rama datascience.
* Los notebooks estarán orientados a experimentación, mientras que el código reutilizable y preparado para producción se implementará en src.
* La integración con Backend y Frontend se realizará exclusivamente mediante entregables definidos, manteniendo el desacoplamiento entre equipos.
* Todas las decisiones de organización y colaboración definidas en este capítulo serán la base operativa para el resto del manual.

# **Capítulo 04 – Definición del Problema de Ciencia de Datos**

## **Objetivo**

Definir formalmente el problema de Ciencia de Datos que resolverá el proyecto, delimitando el alcance del modelo, las variables involucradas, el tipo de aprendizaje, el resultado esperado y los criterios que determinarán el éxito del MVP.

Las decisiones establecidas en este capítulo serán utilizadas en la construcción del dataset, el entrenamiento del modelo y la integración con Backend.

## **1. Contexto del problema**

El proyecto tiene como finalidad desarrollar un sistema inteligente capaz de analizar información relacionada con el consumo energético y generar predicciones que permitan apoyar la toma de decisiones mediante recomendaciones automáticas.

El modelo será utilizado como un servicio de inferencia integrado a una aplicación desarrollada por el equipo de Backend y consumida posteriormente por Frontend.

El modelo no tomará decisiones por sí mismo; proporcionará predicciones y recomendaciones basadas en los datos recibidos.

## **2. Definición del problema**

El problema de Ciencia de Datos se define como un problema de **predicción supervisada**, donde el modelo aprenderá patrones a partir de datos históricos para estimar un resultado asociado al comportamiento energético de una entidad analizada.

La entidad podrá representar, según el dataset seleccionado en capítulos posteriores:

* Vivienda.
* Edificio.
* Industria.
* Zona geográfica.
* Instalación energética.

La decisión final dependerá del dataset oficial seleccionado.

## **3. Objetivo del modelo**

El modelo deberá ser capaz de recibir un conjunto de variables de entrada y devolver una evaluación del comportamiento energético junto con información complementaria que facilite la toma de decisiones.

La respuesta del modelo deberá incluir, como mínimo:

* Predicción principal.
* Nivel de confianza o probabilidad.
* Recomendaciones.
* Indicadores calculados.
* Información necesaria para ser presentada por Backend.

## **4. Alcance del MVP**

El MVP tendrá un alcance controlado.

El modelo deberá:

* Procesar una única solicitud por inferencia.
* Analizar un único registro por petición.
* Generar una única respuesta estructurada.
* Responder en tiempo real.
* Ser consumido mediante API.

No se desarrollarán procesos de entrenamiento en línea, aprendizaje continuo ni procesamiento por lotes durante el MVP.

## **5. Tipo de aprendizaje**

El proyecto utilizará **Machine Learning Supervisado**.

Las razones son:

* Se dispondrá de datos históricos etiquetados.
* Se requiere realizar predicciones.
* El comportamiento esperado puede aprenderse mediante ejemplos previos.

No se utilizarán técnicas de aprendizaje no supervisado como parte del modelo principal.

Estas técnicas podrán emplearse únicamente como apoyo exploratorio durante el EDA si aportan valor al análisis.

## **6. Tipo de problema**

La selección definitiva dependerá del dataset oficial.

Por tanto, el proyecto deberá admitir dos escenarios posibles.

**Escenario A – Clasificación**

El modelo asignará una categoría previamente definida.

Ejemplos:

* Consumo Bajo.
* Consumo Medio.
* Consumo Alto.

o

* Riesgo Bajo.
* Riesgo Medio.
* Riesgo Alto.

**Escenario B – Regresión**

El modelo estimará un valor numérico continuo.

Ejemplos:

* Consumo estimado.
* Demanda energética.
* Costo energético esperado.

**Decisión del proyecto**

Hasta la selección del dataset oficial, la arquitectura se diseñará para soportar ambos escenarios sin cambios estructurales.

La elección definitiva se realizará en el capítulo de construcción del dataset.

## **7. Unidad de análisis**

Cada registro del dataset representará una única observación.

El modelo nunca procesará múltiples registros simultáneamente.

Cada solicitud enviada por Backend representará exactamente una observación del dataset.

Esto garantiza consistencia entre entrenamiento e inferencia.

## **8. Variables de entrada**

Las variables de entrada serán definidas posteriormente.

Sin embargo, deberán cumplir las siguientes características:

* Disponibles al momento de realizar la predicción.
* Medibles.
* Consistentes.
* Reproducibles.
* Sin dependencia de información futura.

No se utilizarán variables que únicamente existan después del evento que se desea predecir.

## **9. Variable objetivo (Target)**

El proyecto utilizará una única variable objetivo.

Todas las demás variables serán predictoras.

La definición definitiva del Target se realizará una vez seleccionado el dataset oficial.

No se permitirá utilizar múltiples Targets dentro del MVP.

## **10. Restricciones del modelo**

El modelo deberá cumplir las siguientes restricciones:

* Tiempo de respuesta adecuado para consumo mediante API.
* Reproducibilidad de resultados.
* Interpretabilidad suficiente para justificar las predicciones.
* Capacidad de exportación mediante joblib.
* Compatibilidad con Scikit-Learn Pipeline.

No se seleccionarán algoritmos que no puedan integrarse con la arquitectura definida en capítulos anteriores.

## **11. Criterios de éxito**

El proyecto se considerará exitoso cuando el modelo cumpla simultáneamente los siguientes criterios:

* Entrenamiento reproducible.
* Predicciones consistentes.
* Integración correcta con Backend.
* Respuesta estructurada mediante JSON.
* Capacidad de ser desplegado en OCI.
* Código mantenible y documentado.
* Rendimiento suficiente para el escenario del hackathon.

Las métricas específicas se definirán en los capítulos de entrenamiento y evaluación.

## **12. Exclusiones del proyecto**

El MVP no contemplará:

* Reentrenamiento automático.
* Aprendizaje en producción.
* Autoajuste de hiperparámetros en tiempo real.
* Procesamiento masivo de registros.
* Sistemas distribuidos de entrenamiento.
* Integración con múltiples modelos simultáneamente.

El objetivo será construir una solución funcional, estable y fácilmente integrable.

## **13. Distribución del trabajo**

### **Ricardo Chirinos – Ingeniería y Análisis de Datos**

Responsable de:

* Analizar el problema de negocio.
* Identificar las variables potenciales.
* Definir los requerimientos de datos.
* Documentar las restricciones del problema.
* Validar que el dataset responda al objetivo definido.

### **Jharle Compres – Machine Learning e Integración**

Responsable de:

* Validar la viabilidad técnica del problema.
* Verificar la compatibilidad con algoritmos supervisados.
* Definir restricciones para el entrenamiento.
* Preparar la arquitectura del Pipeline.
* Validar que el modelo pueda integrarse posteriormente con Backend.

## **14. Dependencias con los siguientes capítulos**

Las decisiones tomadas en este capítulo serán la base para:

* Estrategia del modelo.
* Selección del dataset.
* Definición del Target.
* Definición de variables.
* Ingeniería de características.
* Selección de algoritmos.
* Diseño del contrato JSON.
* Integración con Backend.

Ninguno de estos capítulos deberá contradecir las decisiones establecidas aquí.

## **15. Decisiones adoptadas para el resto del manual**

Las siguientes decisiones quedan establecidas como estándar para los capítulos posteriores:

* El proyecto implementará un único modelo de Machine Learning para el MVP.
* El problema será abordado mediante **aprendizaje supervisado**.
* El modelo procesará **una única observación por solicitud**, garantizando coherencia entre entrenamiento e inferencia.
* Existirá **una única variable objetivo (Target)** y un conjunto de variables predictoras.
* La arquitectura del proyecto permanecerá preparada para soportar tanto clasificación como regresión hasta seleccionar el dataset oficial; una vez seleccionado, se adoptará un único enfoque para el resto del proyecto.
* El modelo deberá ser completamente compatible con Scikit-Learn Pipeline, exportable mediante joblib e integrable mediante una API consumida por Backend.
* El éxito del proyecto se medirá por la combinación de calidad del modelo, reproducibilidad, mantenibilidad e integración efectiva con el resto de la solución, no únicamente por una métrica de Machine Learning.

# **Capítulo 05 – Estrategia del Modelo**

## **Objetivo**

Definir la estrategia técnica que seguirá el desarrollo del modelo de Machine Learning durante todo el proyecto, estableciendo el flujo de trabajo, los criterios de selección de algoritmos, la arquitectura del pipeline, la metodología de experimentación y las reglas para evolucionar el modelo desde el análisis exploratorio hasta su integración con Backend.

Las decisiones adoptadas en este capítulo serán la base para los capítulos de construcción del dataset, entrenamiento, evaluación, exportación e integración.

## **1. Estrategia general**

El desarrollo del modelo seguirá un enfoque incremental basado en evidencia.

No se seleccionará un algoritmo antes de comprender completamente los datos.

El flujo oficial será:

Definición del problema

↓

Construcción del dataset

↓

Validación del dataset

↓

EDA

↓

Limpieza

↓

Feature Engineering

↓

Modelo Base (Baseline)

↓

Comparación de modelos

↓

Optimización

↓

Evaluación

↓

Interpretación

↓

Exportación

↓

Integración con Backend

Cada fase deberá completarse antes de avanzar a la siguiente.

## **2. Principios de desarrollo**

Durante todo el proyecto se seguirán los siguientes principios:

* Los datos determinarán el modelo, no el modelo determinará los datos.
* Cada decisión deberá estar respaldada por evidencia obtenida durante el análisis.
* Toda modificación deberá ser reproducible.
* Ningún cambio se realizará sin registrar su impacto.
* Se priorizará la simplicidad sobre la complejidad cuando ambos enfoques ofrezcan resultados similares.
* Todo experimento deberá poder repetirse bajo las mismas condiciones.

## **3. Arquitectura del modelo**

El proyecto implementará una arquitectura basada en un único Pipeline de Scikit-Learn.

El Pipeline será el único mecanismo autorizado para ejecutar el flujo completo de procesamiento y predicción.

La arquitectura lógica será:

Datos de entrada

↓

Validación

↓

Preprocesamiento

↓

Transformación de variables

↓

Feature Engineering

↓

Modelo

↓

Predicción

↓

Postprocesamiento

↓

Respuesta para Backend

No se permitirán transformaciones manuales fuera del Pipeline una vez el modelo entre en fase de producción.

## **4. Estrategia de selección de algoritmos**

El algoritmo definitivo no será elegido antes del análisis del dataset.

La selección se realizará mediante comparación objetiva.

Los algoritmos candidatos deberán cumplir los siguientes criterios:

* Compatibilidad con Scikit-Learn.
* Integración sencilla con Pipeline.
* Exportación mediante joblib.
* Tiempo de inferencia adecuado.
* Facilidad de interpretación.
* Estabilidad en producción.

### **Algoritmos candidatos**

La evaluación inicial considerará, según el tipo de problema:

**Clasificación**

* Logistic Regression
* Decision Tree
* Random Forest
* Gradient Boosting
* XGBoost (si el tiempo del hackathon lo permite)

**Regresión**

* Linear Regression
* Decision Tree Regressor
* Random Forest Regressor
* Gradient Boosting Regressor
* XGBoost Regressor (si aplica)

No se incorporarán algoritmos adicionales salvo que el análisis del dataset lo justifique.

## **5. Modelo Baseline**

Antes de optimizar cualquier algoritmo, se construirá un modelo Baseline.

El objetivo será disponer de un punto de referencia para medir las mejoras obtenidas durante el proyecto.

El Baseline deberá:

* Entrenarse con la versión inicial del dataset.
* Utilizar parámetros por defecto.
* Generar métricas reproducibles.
* Documentar el tiempo de entrenamiento.
* Documentar el tiempo de inferencia.

Ninguna optimización se realizará sin comparar previamente contra este modelo.

## **6. Estrategia de experimentación**

Cada experimento deberá responder una única pregunta.

Ejemplos:

* ¿La eliminación de outliers mejora el rendimiento?
* ¿Una nueva variable aporta información?
* ¿Otro algoritmo mejora las métricas?
* ¿Cambiar la codificación de variables mejora la precisión?

No se modificarán múltiples factores simultáneamente, ya que impediría identificar el impacto real de cada cambio.

## **7. Control de experimentos**

Cada experimento deberá registrarse.

Como mínimo se documentará:

* Identificador del experimento.
* Fecha.
* Responsable.
* Dataset utilizado.
* Variables empleadas.
* Algoritmo.
* Configuración.
* Métricas obtenidas.
* Observaciones.

Esto permitirá comparar resultados y reproducir experimentos en cualquier momento.

## **8. Estrategia de validación**

El entrenamiento y la validación deberán mantenerse completamente separados.

No se utilizarán datos de validación durante el entrenamiento.

La estrategia definitiva de partición se definirá en el capítulo de entrenamiento, pero deberá garantizar:

* Evaluación objetiva.
* Ausencia de fuga de información (Data Leakage).
* Reproducibilidad.

## **9. Gestión de versiones del modelo**

Cada cambio significativo generará una nueva versión del modelo.

Las versiones deberán mantenerse organizadas dentro de la carpeta models.

Ejemplo:

models/

├── modelo\_v1.joblib

├── modelo\_v2.joblib

├── modelo\_v3.joblib

Cada versión deberá estar asociada a:

* Dataset.
* Pipeline.
* Configuración.
* Métricas.
* Fecha de generación.

## **10. Criterios para reemplazar un modelo**

Un nuevo modelo únicamente reemplazará al anterior cuando cumpla simultáneamente los siguientes criterios:

* Mejora demostrable en las métricas definidas.
* Tiempo de inferencia aceptable.
* Compatibilidad con el Pipeline existente.
* Integración sin cambios con Backend.
* Reproducibilidad del entrenamiento.
* Estabilidad durante las pruebas.

No se reemplazará un modelo únicamente por utilizar un algoritmo más complejo.

## **11. Preparación para producción**

Desde las primeras etapas del proyecto, el modelo deberá diseñarse pensando en producción.

Esto implica:

* Evitar dependencias innecesarias.
* Mantener un Pipeline único.
* Utilizar código reutilizable en src.
* Separar experimentación y lógica de producción.
* Garantizar que el proceso de inferencia sea idéntico al utilizado durante el entrenamiento.

## **12. Integración con Backend**

El modelo deberá exponerse mediante un servicio de inferencia.

Backend nunca accederá directamente al código interno del modelo.

La comunicación se realizará mediante:

* Solicitud JSON.
* Pipeline.
* Modelo exportado.
* Respuesta JSON.

El formato del contrato se definirá en capítulos posteriores.

## **13. Estrategia de mantenimiento**

Durante el hackathon no se implementará reentrenamiento automático.

Las actualizaciones del modelo seguirán el siguiente flujo:

1. Incorporación de nuevos datos.
2. Validación del dataset.
3. Reentrenamiento completo.
4. Comparación con la versión anterior.
5. Exportación de una nueva versión.
6. Integración con Backend.

Esto garantizará que todas las versiones sean controladas y reproducibles.

## **14. Distribución del trabajo**

### **Ricardo Chirinos – Ingeniería y Análisis de Datos**

Responsable de:

* Proponer mejoras basadas en el análisis de datos.
* Evaluar el impacto de nuevas variables.
* Validar la calidad del dataset antes de cada entrenamiento.
* Documentar los experimentos realizados.
* Verificar que las transformaciones mantengan coherencia con el problema definido.

### **Jharle Compres – Machine Learning e Integración**

Responsable de:

* Diseñar el Pipeline.
* Implementar los algoritmos candidatos.
* Ejecutar los experimentos.
* Comparar modelos.
* Gestionar las versiones del modelo.
* Preparar el modelo para producción.
* Garantizar la compatibilidad con Backend.

## **15. Dependencias con los siguientes capítulos**

Las decisiones establecidas en este capítulo serán utilizadas directamente en:

* Construcción del dataset.
* Validación del dataset.
* Definición del Target.
* Definición de variables.
* EDA.
* Limpieza de datos.
* Feature Engineering.
* Selección de modelos.
* Entrenamiento.
* Evaluación de métricas.
* Interpretación del modelo.
* Exportación.
* Integración con Backend.

Todos estos capítulos deberán respetar la estrategia definida aquí.

## **16. Decisiones adoptadas para el resto del manual**

Las siguientes decisiones quedan establecidas como estándar para el resto del proyecto:

* El desarrollo del modelo seguirá un **enfoque incremental**, donde cada etapa dependerá de la validación satisfactoria de la anterior.
* Se implementará **un único Pipeline de Scikit-Learn** que integrará preprocesamiento, transformación de variables, modelo e inferencia.
* La selección del algoritmo se realizará mediante **comparación objetiva de múltiples candidatos**, utilizando un modelo Baseline como referencia inicial.
* Todo experimento deberá ser **reproducible, documentado y versionado**, evitando cambios simultáneos que impidan evaluar su impacto.
* Cada versión estable del modelo estará asociada a un Pipeline, un dataset y un conjunto de métricas, permitiendo trazabilidad completa.
* La lógica validada en los notebooks será migrada progresivamente a src, que constituirá la base del código preparado para producción.
* El modelo se diseñará desde el inicio con criterios de despliegue, manteniendo compatibilidad con joblib, FastAPI, Docker y Oracle Cloud Infrastructure (OCI).
* La integración con Backend se realizará exclusivamente mediante un servicio de inferencia y contratos JSON, preservando el desacoplamiento entre los componentes del sistema.

**Capítulo 06 – Búsqueda y Construcción del Dataset**

## **Objetivo**

Definir la metodología oficial para obtener el conjunto de datos que utilizará el proyecto, documentando el proceso de investigación, la justificación técnica para la construcción de un dataset sintético, el procedimiento de generación de datos y los estándares que garantizarán la calidad y trazabilidad del dataset durante todo el ciclo de desarrollo.

Las decisiones establecidas en este capítulo serán utilizadas en todos los procesos posteriores de validación, EDA, limpieza, ingeniería de variables, entrenamiento e integración.

## **1. Estrategia de obtención de datos**

El Equipo de Ciencia de Datos inició el proyecto realizando una investigación exhaustiva de fuentes públicas nacionales e internacionales relacionadas con consumo energético.

El objetivo era localizar un conjunto de datos que cumpliera simultáneamente con los requerimientos funcionales del hackathon.

Durante la investigación se identificó que los datasets disponibles presentan una o más de las siguientes limitaciones:

* Información agregada a nivel municipal, estatal o nacional.
* Datos provenientes exclusivamente de redes eléctricas.
* Series temporales sin características de las viviendas.
* Información estadística sin variables de comportamiento.
* Ausencia de variables relacionadas con hábitos de consumo.
* Ausencia de una clasificación energética utilizable como Target.
* Restricciones de acceso o licenciamiento.

Como resultado, se concluyó que **no existe un dataset público que represente de forma integral el problema planteado por el hackathon**.

## **2. Decisión técnica del proyecto**

Se adopta como decisión oficial la construcción de un **dataset sintético de alta fidelidad**, diseñado específicamente para representar el comportamiento energético de viviendas y pequeños establecimientos.

Esta decisión permitirá:

* Representar exactamente el problema definido por el hackathon.
* Controlar la calidad y consistencia de los datos.
* Incorporar variables relevantes para el modelo.
* Simular escenarios reales de consumo.
* Introducir problemas de calidad para validar el proceso de limpieza.
* Garantizar la reproducibilidad del proyecto.

A partir de este capítulo, el dataset sintético será considerado el **dataset oficial del proyecto**.

## **3. Objetivo del dataset**

El dataset deberá representar una observación individual por registro.

Cada registro describirá el comportamiento energético de una única vivienda o pequeño establecimiento durante un período mensual.

El conjunto de datos deberá contener información suficiente para:

* Analizar patrones de consumo.
* Identificar perfiles energéticos.
* Construir variables derivadas.
* Entrenar un modelo supervisado.
* Generar recomendaciones.
* Estimar impactos económicos asociados al consumo energético.

## **4. Metodología de construcción**

La construcción del dataset seguirá una estrategia de simulación basada en reglas de negocio.

El proceso oficial será:

Definición del problema

↓

Identificación de variables

↓

Diseño del esquema del dataset

↓

Definición de distribuciones estadísticas

↓

Generación de registros

↓

Validación de consistencia

↓

Introducción controlada de ruido

↓

Generación del Dataset Crudo

↓

Validación inicial

↓

Publicación en datasets/raw

El dataset no será generado mediante valores aleatorios sin restricciones.

Cada variable deberá respetar relaciones lógicas con el resto de las variables del registro.

## **5. Principios de construcción**

Durante la generación del dataset deberán cumplirse los siguientes principios:

* Cada registro deberá representar un escenario técnicamente posible.
* Las variables deberán mantener coherencia entre sí.
* Las distribuciones deberán aproximarse a comportamientos observables.
* Las relaciones entre variables deberán reflejar dependencia lógica cuando corresponda.
* No se permitirán combinaciones físicamente imposibles.

## **6. Diseño de variables**

Las variables incluidas en el dataset deberán representar factores que influyen directa o indirectamente en el consumo energético.

Las categorías de información serán:

* Identificación del registro.
* Características de la vivienda o establecimiento.
* Equipamiento eléctrico.
* Hábitos de uso.
* Variables temporales.
* Variables ambientales.
* Variables de consumo.
* Variables económicas.
* Variable objetivo.

La definición detallada de cada variable se documentará en el Diccionario de Datos.

## **7. Construcción del Target**

El dataset será generado incluyendo desde su origen la variable objetivo.

La clasificación energética será determinada mediante reglas definidas durante la construcción del dataset y no mediante asignaciones aleatorias.

La variable objetivo oficial será:

perfil\_energetico

Las categorías permitidas serán únicamente:

Eficiente

Moderado

Ineficiente

No se utilizarán categorías adicionales durante el MVP.

## **8. Generación de escenarios**

El dataset deberá contener registros representativos de diferentes patrones de consumo.

Como mínimo deberán existir escenarios asociados a:

* Bajo consumo.
* Consumo medio.
* Alto consumo.
* Uso intensivo de equipos eléctricos.
* Viviendas con pocos equipos.
* Viviendas con alta ocupación.
* Viviendas con baja ocupación.
* Diferentes perfiles de uso diario.
* Presencia o ausencia de generación fotovoltaica.
* Diferentes niveles de eficiencia energética.

La distribución de escenarios deberá evitar concentraciones excesivas en una única categoría.

## **9. Incorporación controlada de problemas de calidad**

Con el objetivo de construir un caso de estudio realista, el dataset crudo incluirá deliberadamente problemas de calidad.

Podrán incorporarse:

* Valores faltantes.
* Registros duplicados.
* Inconsistencias de formato.
* Errores tipográficos.
* Valores extremos plausibles.
* Inconsistencias categóricas.
* Variaciones en unidades cuando sea pertinente.

Estos problemas serán documentados y corregidos en los capítulos posteriores.

No se introducirán errores que impidan la utilización del dataset.

## **10. Tamaño del dataset**

El dataset deberá contener un volumen suficiente para:

* Realizar análisis exploratorio.
* Aplicar técnicas de limpieza.
* Ejecutar ingeniería de variables.
* Entrenar modelos supervisados.
* Evaluar métricas de forma confiable.

El número definitivo de registros será fijado antes de iniciar el EDA y permanecerá constante durante todo el proyecto, salvo la creación de nuevas versiones documentadas del dataset.

## **11. Versionado del dataset**

Cada modificación estructural del dataset generará una nueva versión.

La organización será:

datasets/

├── raw/

│ ├── energia\_v1\_raw.csv

│ ├── energia\_v2\_raw.csv

│

├── processed/

│ ├── energia\_v1\_processed.csv

│ ├── energia\_v2\_processed.csv

│

└── external/

Nunca se sobrescribirá una versión anterior.

Cada versión deberá estar acompañada por:

* Fecha de generación.
* Responsable.
* Descripción de cambios.
* Cantidad de registros.
* Cantidad de variables.

## **12. Organización del trabajo**

### **Ricardo Chirinos– Ingeniería y Análisis de Datos**

Responsable de:

* Diseñar la estructura del dataset.
* Definir las variables.
* Construir las reglas de generación.
* Validar la coherencia de los registros.
* Generar el dataset crudo.
* Documentar el proceso de construcción.

### **Jharle Compres– Machine Learning e Integración**

Responsable de:

* Validar que el dataset sea adecuado para entrenamiento.
* Revisar la distribución del Target.
* Verificar compatibilidad con el Pipeline.
* Detectar posibles riesgos para el modelado.
* Aprobar la versión oficial que será utilizada en los experimentos.

## **13. Almacenamiento del dataset**

La ubicación oficial será:

datasets/

├── raw/

├── processed/

└── external/

Las reglas serán:

* raw/ almacenará únicamente el dataset original generado.
* processed/ almacenará los datasets resultantes del proceso de limpieza y transformación.
* external/ almacenará archivos de referencia utilizados durante el desarrollo, sin formar parte del entrenamiento.

No se modificarán manualmente los archivos ubicados en raw/.

## **14. Dependencias con los siguientes capítulos**

Las decisiones tomadas en este capítulo servirán como base para:

* Validación del Dataset.
* Diccionario de Datos.
* Definición del Target.
* Definición de Variables.
* EDA.
* Limpieza de Datos.
* Feature Engineering.
* Entrenamiento.
* Evaluación del Modelo.

Todos estos capítulos deberán utilizar exclusivamente el dataset oficial definido aquí.

## **15. Decisiones adoptadas para el resto del manual**

Las siguientes decisiones quedan establecidas como estándar para todos los capítulos posteriores:

* El proyecto utilizará **un dataset sintético de alta fidelidad** como fuente oficial de datos, debido a la inexistencia de un conjunto de datos público que represente íntegramente el problema del hackathon.
* El dataset será construido mediante una metodología basada en reglas de negocio y relaciones lógicas entre variables, evitando la generación aleatoria sin restricciones.
* Cada registro representará **una única vivienda o pequeño establecimiento** correspondiente a un período mensual de análisis.
* La variable objetivo oficial será **perfil\_energetico**, con las categorías **Eficiente**, **Moderado** e **Ineficiente**, las cuales permanecerán invariables durante el resto del proyecto.
* El dataset incluirá de forma intencional problemas controlados de calidad para validar los procesos de limpieza y preparación de datos documentados en capítulos posteriores.
* Se mantendrá un sistema de versionado que preserve el dataset crudo y todas las versiones procesadas, garantizando trazabilidad y reproducibilidad.
* Todas las actividades de análisis, entrenamiento, evaluación e integración se realizarán exclusivamente sobre las versiones oficiales del dataset definidas en este capítulo.

**Capítulo 07 – Validación del Dataset**

## **Objetivo**

Definir el procedimiento oficial para validar el dataset sintético antes de iniciar cualquier proceso de análisis, transformación o entrenamiento, garantizando que la información utilizada por el proyecto sea consistente, íntegra, reproducible y técnicamente apta para el desarrollo del modelo de Machine Learning.

La validación constituye el punto de control obligatorio entre la construcción del dataset y el inicio del Análisis Exploratorio de Datos (EDA).

## **1. Alcance de la validación**

La validación se realizará exclusivamente sobre la versión oficial ubicada en:

datasets/raw/

Durante esta etapa no se modificarán registros ni variables.

El objetivo será identificar y documentar el estado inicial del dataset.

Cualquier corrección se realizará únicamente en el capítulo de Limpieza de Datos.

## **2. Objetivos de la validación**

La validación deberá responder las siguientes preguntas:

* ¿El archivo puede cargarse correctamente?
* ¿La estructura coincide con el diseño definido?
* ¿Las variables esperadas están presentes?
* ¿Los tipos de datos son coherentes?
* ¿Existen registros duplicados?
* ¿Existen valores faltantes?
* ¿Existen valores fuera del dominio esperado?
* ¿Las relaciones entre variables son coherentes?
* ¿La variable objetivo cumple con la definición establecida?
* ¿El dataset está listo para iniciar el EDA?

Ningún análisis posterior podrá comenzar sin completar esta validación.

## **3. Flujo oficial de validación**

El proceso seguirá el siguiente orden:

Carga del dataset

↓

Validación estructural

↓

Validación de variables

↓

Validación de tipos de datos

↓

Validación de integridad

↓

Validación de reglas de negocio

↓

Validación del Target

↓

Generación del informe

↓

Aprobación del dataset

Cada etapa deberá completarse antes de continuar con la siguiente.

## **4. Validación estructural**

Se verificará que:

* El archivo pueda abrirse sin errores.
* El delimitador sea correcto.
* La codificación de caracteres sea consistente.
* No existan columnas desplazadas.
* No existan encabezados duplicados.
* No existan columnas vacías.
* El número de columnas coincida con el diseño oficial del dataset.

La estructura validada será considerada la versión de referencia para todo el proyecto.

## **5. Validación de variables**

Se comprobará que todas las variables definidas en el diseño del dataset estén presentes.

Para cada variable se verificará:

* Nombre.
* Orden.
* Tipo esperado.
* Descripción.
* Dominio permitido.

No se permitirá incorporar nuevas variables directamente al dataset oficial sin documentar previamente el cambio.

## **6. Validación de tipos de datos**

Cada variable deberá corresponder al tipo de dato esperado.

Se verificarán, como mínimo:

* Variables numéricas.
* Variables categóricas.
* Variables booleanas.
* Variables temporales.
* Variables identificadoras.

La detección de tipos inconsistentes deberá documentarse, pero no corregirse durante esta etapa.

## **7. Validación de integridad**

Se evaluará la calidad general del dataset mediante la identificación de:

* Valores faltantes.
* Registros duplicados.
* Valores nulos.
* Registros incompletos.
* Variables completamente vacías.
* Valores imposibles.

Todos los hallazgos deberán registrarse para ser tratados posteriormente.

## **8. Validación de dominios**

Cada variable deberá respetar el dominio definido durante la construcción del dataset.

Se verificará que:

* Las variables categóricas contengan únicamente categorías válidas.
* Las variables booleanas utilicen únicamente los valores permitidos.
* Las variables numéricas permanezcan dentro de rangos técnicamente posibles.
* Las unidades de medida sean consistentes.

No se corregirán valores durante esta etapa.

Únicamente se documentarán.

## **9. Validación de reglas de negocio**

Además de validar cada variable individualmente, se comprobará la coherencia entre variables relacionadas.

Se evaluarán relaciones tales como:

* Consumo energético respecto al número de equipos.
* Consumo respecto a horas de uso.
* Consumo respecto al tipo de inmueble.
* Consumo respecto al nivel de ocupación.
* Consumo respecto a la presencia de generación fotovoltaica.
* Costo energético respecto al consumo registrado.
* Perfil energético respecto a las características generales del registro.

Las reglas de negocio deberán validar la consistencia lógica del conjunto de datos y no únicamente la validez individual de cada campo.

## **10. Validación de la variable objetivo**

La variable objetivo oficial será:

perfil\_energetico

Se verificará que:

* Todos los registros posean una categoría válida o, si existen valores faltantes introducidos intencionalmente, que estos correspondan al diseño del dataset.
* No existan categorías distintas de las definidas oficialmente.
* La distribución de clases sea conocida y documentada.
* No existan errores de escritura.
* No existan diferencias de mayúsculas y minúsculas que generen categorías duplicadas.

La distribución obtenida servirá como referencia para el entrenamiento.

## **11. Validación de identificadores**

Cada registro deberá poseer un identificador único.

Se comprobará:

* Unicidad.
* Ausencia de valores nulos.
* Formato consistente.
* Ausencia de duplicados.

El identificador será utilizado únicamente para trazabilidad y nunca como variable predictora.

## **12. Validación estadística inicial**

Antes del EDA se calcularán indicadores descriptivos básicos con el objetivo de comprender el estado general del dataset.

Como mínimo se documentarán:

* Número de registros.
* Número de variables.
* Cantidad de variables numéricas.
* Cantidad de variables categóricas.
* Cantidad de valores faltantes por variable.
* Cantidad de registros duplicados.
* Distribución preliminar de la variable objetivo.

Esta información servirá como línea base para evaluar el impacto de los procesos de limpieza.

## **13. Registro de incidencias**

Cada problema identificado deberá registrarse en un informe de validación.

El informe incluirá:

* Identificador de la incidencia.
* Variable afectada.
* Tipo de problema.
* Descripción.
* Severidad.
* Responsable de resolución.
* Estado.

No se permitirá corregir incidencias sin que hayan sido previamente documentadas.

## **14. Criterios de aprobación**

El dataset podrá avanzar al capítulo de EDA cuando:

* La estructura sea consistente.
* Todas las variables esperadas estén presentes.
* Las incidencias hayan sido documentadas.
* La variable objetivo haya sido validada.
* No existan errores que impidan la carga del dataset.
* El equipo de Ciencia de Datos apruebe formalmente la versión analizada.

La existencia de valores faltantes, duplicados o inconsistencias no impedirá continuar, siempre que formen parte del diseño controlado del dataset y hayan sido registrados.

## **15. Distribución del trabajo**

### **Ricardo Chirinos– Ingeniería y Análisis de Datos**

Responsable de:

* Ejecutar la validación estructural.
* Revisar tipos de datos.
* Validar dominios.
* Analizar reglas de negocio.
* Elaborar el informe de validación.
* Documentar todas las incidencias detectadas.

### **Jharle Compres– Machine Learning e Integración**

Responsable de:

* Validar la variable objetivo.
* Revisar la distribución de clases.
* Identificar riesgos para el entrenamiento.
* Confirmar la compatibilidad del dataset con el Pipeline.
* Aprobar técnicamente el dataset para iniciar el modelado.

## **16. Dependencias con los siguientes capítulos**

Las decisiones adoptadas durante la validación serán utilizadas directamente en:

* Diccionario de Datos.
* Definición del Target.
* Definición de Variables.
* Análisis Exploratorio (EDA).
* Limpieza de Datos.
* Feature Engineering.
* Entrenamiento del modelo.

Ningún capítulo posterior deberá modificar la estructura del dataset sin actualizar previamente el informe de validación.

## **17. Decisiones adoptadas para el resto del manual**

Las siguientes decisiones quedan establecidas como estándar para los capítulos posteriores:

* La validación del dataset será un proceso exclusivamente de inspección y documentación; no se realizarán modificaciones sobre la versión almacenada en datasets/raw.
* Toda incidencia detectada deberá registrarse antes de ser corregida, garantizando la trazabilidad entre el dataset original y las versiones procesadas.
* La variable perfil\_energetico será validada como la única variable objetivo oficial del proyecto y su distribución servirá como referencia para las etapas de entrenamiento y evaluación.
* Las reglas de negocio definidas durante la construcción del dataset serán utilizadas como criterio principal para validar la coherencia entre variables.
* El informe de validación constituirá la línea base para medir el impacto de los procesos de limpieza y transformación documentados en los capítulos siguientes.
* Únicamente los datasets aprobados mediante este procedimiento podrán avanzar al Análisis Exploratorio de Datos (EDA) y al resto del flujo de Ciencia de Datos.

**Capítulo 08 – Diccionario de Datos**

## **Objetivo**

Establecer el diccionario oficial del dataset del proyecto, definiendo de manera unificada el significado, tipo, dominio, unidad de medida y propósito de cada variable. Este documento será la referencia técnica utilizada por el Equipo de Ciencia de Datos, Backend y Frontend para garantizar una interpretación consistente de los datos durante todo el ciclo de desarrollo.

El diccionario se construirá a partir del **dataset sintético oficial del proyecto**, compuesto por 44 columnas (43 variables funcionales más una columna artefacto generada durante la exportación), y será la única referencia válida para los capítulos posteriores.

## **1. Alcance**

El diccionario documentará exclusivamente las variables presentes en la versión oficial del dataset ubicado en:

datasets/raw/

Toda incorporación, eliminación o modificación de variables deberá reflejarse primero en este documento antes de ser utilizada por cualquier componente del proyecto.

## **2. Estructura del diccionario**

Cada variable deberá documentarse utilizando la siguiente estructura:

| **Campo** | **Descripción** |
| --- | --- |
| Nombre | Nombre oficial de la variable |
| Tipo de dato | Tipo esperado durante el procesamiento |
| Unidad | Unidad de medida cuando aplique |
| Dominio | Valores permitidos |
| Obligatoria | Sí / No |
| Variable Predictora | Sí / No |
| Variable Objetivo | Sí / No |
| Descripción | Propósito de la variable |

Esta estructura será utilizada durante todo el proyecto.

## **3. Clasificación de variables**

Las variables del dataset se agrupan en las siguientes categorías funcionales:

* Identificación.
* Información temporal.
* Características del inmueble.
* Equipamiento eléctrico.
* Hábitos de consumo.
* Variables energéticas.
* Variables económicas.
* Variables ambientales.
* Variables derivadas.
* Variable objetivo.

Esta clasificación será utilizada en el EDA, Feature Engineering y documentación técnica.

## **4. Variables de identificación**

| **Variable** | **Tipo** | **Predictora** | **Objetivo** | **Descripción** |
| --- | --- | --- | --- | --- |
| id\_registro | String | No | No | Identificador único del registro. Utilizado únicamente para trazabilidad. |

El identificador nunca será utilizado durante el entrenamiento del modelo.

## **5. Variables temporales**

| **Variable** | **Tipo** | **Descripción** |
| --- | --- | --- |
| mes\_referencia | Categórica | Mes correspondiente al período de análisis. |
| dias\_facturacion | Entero | Cantidad de días considerados en la facturación del período. |

Estas variables permitirán capturar efectos estacionales y diferencias en la duración del ciclo de facturación.

## **6. Variables del inmueble**

Las variables relacionadas con las características físicas del inmueble describen el contexto donde ocurre el consumo energético.

Incluyen, entre otras:

* tipo\_inmueble
* superficie\_m2
* zona
* nivel\_socioeconomico
* antiguedad\_construccion\_anios
* aislamiento\_termico
* num\_personas

Estas variables serán consideradas predictoras durante el entrenamiento.

## **7. Variables de equipamiento eléctrico**

Este grupo representa la infraestructura instalada en la vivienda o establecimiento.

Incluye variables relacionadas con la presencia y cantidad de equipos eléctricos.

Ejemplos:

* cantidad\_equipos\_total
* tiene\_aire\_acondicionado
* tiene\_calentador\_agua\_electrico
* tiene\_lavadora

Estas variables permiten modelar el potencial de consumo energético del inmueble.

## **8. Variables de hábitos de uso**

Estas variables describen el comportamiento de los usuarios.

Incluyen información relacionada con:

* horario\_pico\_uso
* horas\_uso\_aa\_dia
* porcentaje de iluminación LED
* utilización de equipos
* patrones de ocupación

Estas variables representan uno de los principales factores explicativos del consumo energético.

## **9. Variables energéticas**

Este grupo contiene las variables directamente relacionadas con el consumo eléctrico.

Incluye:

* consumo\_kwh\_mensual
* consumo\_kwh\_mes\_anterior
* variacion\_pct\_consumo\_mensual
* consumo\_neto\_facturado\_kwh

Estas variables serán utilizadas tanto para el análisis exploratorio como para la construcción de nuevas características.

## **10. Variables ambientales**

El dataset incorpora variables exógenas que influyen en el comportamiento energético.

Incluyen:

* temperatura\_promedio\_c
* dias\_sin\_electricidad\_mes
* fuente\_energia\_secundaria
* horas\_uso\_planta\_o\_inversor\_mes
* generacion\_solar\_kwh\_mensual

Estas variables permiten representar condiciones reales del entorno que afectan el consumo energético.

## **11. Variables económicas**

El dataset incorpora variables relacionadas con el impacto financiero del consumo.

La variable principal será:

costo\_estimado\_usd

Su cálculo deberá mantenerse consistente con la tarifa de referencia establecida por el proyecto.

Durante la validación y limpieza se verificará la coherencia entre:

* consumo\_neto\_facturado\_kwh
* costo\_estimado\_usd

Esta relación constituye una regla oficial de validación del proyecto.

## **12. Variable objetivo**

La variable objetivo oficial del proyecto será:

perfil\_energetico

Las categorías permitidas serán únicamente:

Eficiente

Moderado

Ineficiente

No se admitirán categorías adicionales durante el proyecto.

Los registros sin etiqueta serán tratados como parte del proceso de limpieza definido en capítulos posteriores.

## **13. Variable artefacto**

El dataset contiene una columna adicional:

Unnamed: 0

Esta columna corresponde a un artefacto generado durante la exportación del archivo.

No representa información del negocio.

No deberá utilizarse durante:

* EDA.
* Limpieza.
* Entrenamiento.
* Evaluación.
* Exportación del modelo.

Será eliminada durante el proceso de limpieza de datos.

## **14. Variables predictoras**

Se consideran variables predictoras todas aquellas que:

* Estén disponibles antes de realizar la inferencia.
* No representen información futura.
* No generen fuga de información (Data Leakage).
* Aporten información potencialmente útil al modelo.

La selección definitiva de variables predictoras se realizará en el capítulo de Definición de Variables.

## **15. Variables excluidas del entrenamiento**

No podrán utilizarse como variables predictoras:

* id\_registro.
* Unnamed: 0.
* Variables utilizadas únicamente para auditoría.
* Variables derivadas que introduzcan fuga de información respecto al Target.

La exclusión definitiva se documentará antes del entrenamiento del modelo.

## **16. Reglas de nomenclatura**

Todas las variables deberán cumplir los siguientes estándares:

* Minúsculas.
* Snake Case.
* Sin espacios.
* Sin caracteres especiales.
* Sin acentos.
* Nombres descriptivos.
* Sin abreviaturas ambiguas.

Las transformaciones de nombres se realizarán únicamente durante la etapa de limpieza, preservando siempre una correspondencia documentada con el dataset original.

## **17. Trazabilidad**

Cada variable deberá poder rastrearse desde:

* Dataset original.
* Dataset limpio.
* Pipeline.
* Modelo entrenado.
* JSON de inferencia.
* Respuesta de Backend.

No se permitirá renombrar variables durante el proyecto sin actualizar el diccionario.

## **18. Organización del trabajo**

### **Ricardo Chirinos– Ingeniería y Análisis de Datos**

Responsable de:

* Documentar todas las variables del dataset.
* Verificar tipos de datos.
* Documentar dominios.
* Registrar unidades de medida.
* Mantener actualizado el diccionario.

### **Jharle Compres – Machine Learning e Integración**

Responsable de:

* Validar qué variables podrán utilizarse durante el entrenamiento.
* Detectar posibles riesgos de Data Leakage.
* Confirmar la compatibilidad del diccionario con el Pipeline.
* Validar que Backend utilice la nomenclatura oficial durante la integración.

## **19. Dependencias con los siguientes capítulos**

El diccionario de datos será la referencia oficial para:

* Definición del Target.
* Definición de Variables.
* EDA.
* Limpieza de Datos.
* Feature Engineering.
* Entrenamiento.
* Diseño del JSON.
* Contrato con Backend.

Ningún capítulo posterior podrá introducir variables nuevas sin actualizar previamente este documento.

## **20. Decisiones adoptadas para el resto del manual**

Las siguientes decisiones quedan establecidas como estándar para todos los capítulos posteriores:

* El diccionario de datos será la única referencia oficial para la interpretación de las variables del proyecto.
* La estructura del dataset estará compuesta por categorías funcionales que facilitarán el análisis, la ingeniería de variables y la integración con los demás componentes del sistema.
* La variable perfil\_energetico permanecerá como la única variable objetivo del proyecto.
* La columna Unnamed: 0 será considerada un artefacto técnico y será eliminada durante la etapa de limpieza, sin participar en ningún proceso analítico o de modelado.
* Toda modificación en nombres, tipos, dominios o estructura de las variables deberá reflejarse primero en este diccionario antes de ser aplicada al dataset o al código del proyecto.
* La trazabilidad entre el dataset original, el dataset procesado, el Pipeline, el modelo y los contratos de integración será obligatoria durante todo el desarrollo.

**Capítulo 09 – Definición del Target**

**Objetivo**

Definir formalmente la variable objetivo (Target) que será utilizada durante el entrenamiento del modelo de Machine Learning, estableciendo su propósito, criterios de construcción, dominio permitido, reglas de validación y restricciones de uso.

La definición realizada en este capítulo será obligatoria para todos los procesos posteriores de entrenamiento, evaluación, interpretación del modelo e integración con Backend.

**1. Definición del Target**

El proyecto utilizará una única variable objetivo.

La variable objetivo oficial será:

perfil\_energetico

Esta variable representa la clasificación energética general de una vivienda o pequeño establecimiento para el período mensual analizado.

El modelo tendrá como finalidad predecir esta variable a partir del resto de las características del registro.

**2. Tipo de problema**

Con la definición oficial del dataset, el proyecto queda clasificado definitivamente como un problema de **Clasificación Supervisada Multiclase**.

A partir de este capítulo queda descartado el escenario de regresión considerado durante el diseño inicial de la arquitectura.

Todas las decisiones posteriores deberán asumir que el modelo resolverá un problema de clasificación.

**3. Naturaleza del Target**

El Target representa una evaluación integral del comportamiento energético del inmueble.

Su clasificación considera el efecto conjunto de múltiples variables relacionadas con:

* Consumo energético.
* Características del inmueble.
* Equipamiento eléctrico.
* Hábitos de uso.
* Variables ambientales.
* Factores de eficiencia.

Por esta razón, el Target no deberá interpretarse como una función directa de una única variable, sino como el resultado de un conjunto de condiciones definidas durante la construcción del dataset.

**4. Dominio permitido**

Únicamente se admitirán las siguientes categorías:

* Eficiente
* Moderado
* Ineficiente

Estas categorías constituyen el dominio oficial del Target.

No podrán incorporarse nuevas categorías durante el desarrollo del proyecto.

**5. Significado de las categorías**

**Eficiente**

Representa inmuebles cuyo comportamiento energético refleja un uso racional de la energía y un nivel reducido de desperdicio.

Generalmente estarán asociados a patrones como:

* Consumo proporcional al tamaño del inmueble.
* Uso eficiente de equipos.
* Hábitos sostenibles.
* Aprovechamiento de tecnologías de ahorro energético.

**Moderado**

Representa inmuebles con un comportamiento energético intermedio.

Presentan oportunidades de mejora, aunque no evidencian un uso claramente ineficiente.

**Ineficiente**

Representa inmuebles con patrones de consumo que indican un uso poco eficiente de la energía.

Estas observaciones constituirán el principal objetivo de las recomendaciones generadas por la aplicación.

**6. Construcción del Target**

El Target fue incorporado durante la generación del dataset sintético.

No fue asignado de manera aleatoria.

Su construcción responde a un conjunto de reglas de negocio que consideran múltiples variables del registro.

Por esta razón, el Target será tratado como una etiqueta de referencia válida durante el entrenamiento.

No se recalculará ni se modificará durante el proyecto.

**7. Restricciones del Target**

La variable perfil\_energetico deberá cumplir las siguientes condiciones:

* Existir en todos los datasets oficiales.
* Mantener exactamente el mismo nombre.
* Conservar las tres categorías oficiales.
* No cambiar su significado entre versiones del dataset.
* No ser modificada durante los procesos de limpieza o transformación.

En caso de existir registros sin etiqueta, estos serán tratados durante la preparación de los datos siguiendo las reglas definidas en el capítulo correspondiente.

**8. Relación con las variables predictoras**

Todas las demás variables del dataset serán consideradas candidatas a variables predictoras.

Durante el proceso de selección de variables se evaluará su aporte para explicar el comportamiento del Target.

Ninguna variable que revele directa o indirectamente el valor de perfil\_energetico podrá utilizarse como predictora si genera fuga de información (Data Leakage).

**9. Balance de clases**

Antes del entrenamiento deberá analizarse la distribución de las categorías del Target.

El objetivo será identificar posibles desbalances que puedan afectar el rendimiento del modelo.

Se verificará:

* Número de registros por categoría.
* Porcentaje de representación.
* Distribución relativa.
* Existencia de clases minoritarias.

La decisión de aplicar técnicas de balanceo dependerá de los resultados obtenidos durante el EDA y el entrenamiento.

No se aplicarán técnicas de balanceo sin evidencia de que mejoren el desempeño del modelo.

**10. Codificación del Target**

Durante el entrenamiento, el Target podrá transformarse a una representación numérica cuando el algoritmo lo requiera.

La codificación deberá realizarse mediante herramientas reproducibles del Pipeline.

No se permitirá modificar manualmente los valores del Target.

La representación original deberá mantenerse para la interpretación de resultados y la integración con Backend.

**11. Uso del Target durante el Pipeline**

La variable perfil\_energetico tendrá exclusivamente las siguientes funciones:

* Entrenamiento del modelo.
* Validación del modelo.
* Evaluación de métricas.
* Interpretación de resultados.

El Target nunca formará parte del conjunto de variables de entrada durante la inferencia.

Backend no enviará esta variable al modelo.

La aplicación deberá predecirla.

**12. Uso durante la inferencia**

Una solicitud enviada por Backend contendrá únicamente las variables predictoras.

El Pipeline procesará dichas variables y devolverá:

* Categoría predicha.
* Probabilidad asociada a cada clase (cuando el algoritmo lo permita).
* Información necesaria para la generación de recomendaciones.

La variable objetivo nunca será recibida como parámetro de entrada.

**13. Validaciones obligatorias**

Antes de iniciar el entrenamiento deberán verificarse las siguientes condiciones:

* El Target existe.
* El nombre coincide exactamente con la definición oficial.
* No existen categorías distintas de las permitidas.
* No existen diferencias de escritura.
* La distribución de clases está documentada.
* Los registros sin etiqueta fueron tratados conforme a la estrategia definida para el proyecto.

**14. Relación con Backend**

Backend únicamente conocerá el resultado generado por el modelo.

El contrato entre ambos componentes utilizará el nombre oficial:

perfil\_energetico

Las respuestas enviadas por el modelo deberán utilizar exactamente las categorías oficiales definidas en este capítulo.

No se traducirán ni modificarán durante el MVP.

**15. Organización del trabajo**

**Ricardo Chirinos – Ingeniería y Análisis de Datos**

Responsable de:

* Verificar la integridad del Target.
* Analizar la distribución de clases.
* Identificar posibles problemas de calidad.
* Documentar el comportamiento del Target durante el EDA.
* Validar que las transformaciones no alteren su significado.

**Jharle Compres – Machine Learning e Integración**

Responsable de:

* Preparar el Target para el entrenamiento.
* Implementar la codificación cuando sea necesaria.
* Evaluar el impacto del balance de clases.
* Validar que el modelo prediga correctamente las categorías oficiales.
* Garantizar la compatibilidad del Target con Backend.

**16. Dependencias con los siguientes capítulos**

Las decisiones adoptadas en este capítulo serán utilizadas directamente en:

* Definición de Variables.
* Análisis Exploratorio (EDA).
* Limpieza de Datos.
* Feature Engineering.
* Selección de Modelos.
* Entrenamiento.
* Evaluación de Métricas.
* Interpretación del Modelo.
* Diseño del JSON.
* Contrato con Backend.

Todos estos capítulos deberán utilizar la definición oficial del Target establecida aquí.

**17. Decisiones adoptadas para el resto del manual**

Las siguientes decisiones quedan establecidas como estándar para los capítulos posteriores:

* El proyecto implementará un modelo de **clasificación supervisada multiclase**, descartando definitivamente el escenario de regresión considerado durante el diseño inicial.
* La variable perfil\_energetico será la única variable objetivo oficial y mantendrá exactamente tres categorías: **Eficiente**, **Moderado** e **Ineficiente**.
* El Target será considerado una etiqueta fija del dataset oficial; no será recalculado, modificado ni utilizado como variable de entrada durante la inferencia.
* Cualquier codificación necesaria para el entrenamiento se realizará exclusivamente dentro del Pipeline, preservando siempre la representación original para la interpretación de resultados y la integración con Backend.
* El análisis de la distribución de clases será obligatorio antes del entrenamiento y servirá como criterio para decidir la aplicación de técnicas de balanceo.
* Todos los componentes del proyecto (Ciencia de Datos, Backend y Frontend) utilizarán el nombre oficial perfil\_energetico y las mismas categorías definidas en este capítulo, garantizando consistencia durante todo el ciclo de desarrollo.

**Capítulo 10 – Definición de Variables**

**Objetivo**

Definir formalmente las variables que participarán en el desarrollo del modelo de Machine Learning, estableciendo los criterios para su clasificación, selección, exclusión y utilización durante el entrenamiento.

Este capítulo determina qué variables podrán utilizarse como entrada del modelo, cuáles deberán descartarse y cuáles serán creadas posteriormente mediante procesos de Feature Engineering.

Las decisiones adoptadas aquí serán obligatorias para el resto del proyecto.

**1. Principios de selección**

La selección de variables se realizará siguiendo los siguientes principios:

* Toda variable deberá aportar información útil para explicar el comportamiento del Target.
* Ninguna variable será incluida únicamente por estar disponible en el dataset.
* Se priorizarán variables con significado de negocio.
* Se evitarán variables redundantes.
* Se eliminarán variables que introduzcan fuga de información (Data Leakage).
* Toda decisión deberá estar respaldada por evidencia obtenida durante el EDA.

La selección definitiva se completará después del Análisis Exploratorio de Datos.

**2. Clasificación funcional de variables**

Para facilitar su gestión, las variables se clasificarán en las siguientes categorías:

* Variables identificadoras.
* Variables predictoras.
* Variables derivadas.
* Variables de auditoría.
* Variable objetivo.

Esta clasificación será utilizada durante todo el proyecto.

**3. Variables identificadoras**

Las variables identificadoras permiten rastrear cada registro dentro del dataset.

Variable oficial:

id\_registro

Características:

* Identificador único.
* No contiene información predictiva.
* Utilizada únicamente para trazabilidad.
* No participará en el entrenamiento.

Toda variable cuyo único propósito sea identificar un registro quedará excluida del modelo.

**4. Variable objetivo**

La única variable objetivo oficial será:

perfil\_energetico

Esta variable será utilizada exclusivamente durante:

* Entrenamiento.
* Validación.
* Evaluación.
* Interpretación del modelo.

Nunca formará parte del conjunto de variables de entrada.

**5. Variables predictoras**

Se consideran candidatas a variables predictoras todas aquellas que describen el estado del inmueble antes de realizar la predicción.

Estas variables pertenecen, entre otras, a las siguientes categorías:

* Información temporal.
* Características del inmueble.
* Equipamiento eléctrico.
* Hábitos de uso.
* Variables energéticas.
* Variables económicas.
* Variables ambientales.

La utilización definitiva de cada una dependerá del análisis realizado durante el EDA.

**6. Variables excluidas**

Quedan excluidas desde este momento las siguientes variables:

* id\_registro
* perfil\_energetico
* Unnamed: 0

Estas variables no podrán utilizarse durante el entrenamiento.

La exclusión de nuevas variables deberá justificarse técnicamente y documentarse.

**7. Variables candidatas a transformación**

Algunas variables podrán requerir transformaciones antes del entrenamiento.

Entre las transformaciones previstas se incluyen:

* Conversión de tipos de datos.
* Normalización de formatos.
* Codificación de variables categóricas.
* Escalamiento.
* Agrupación de categorías.
* Conversión de variables booleanas.

Las transformaciones se implementarán exclusivamente dentro del Pipeline oficial.

**8. Variables candidatas a ingeniería de características**

El proyecto permitirá construir nuevas variables derivadas cuando aporten información adicional.

Las nuevas variables deberán cumplir los siguientes criterios:

* Basarse únicamente en información disponible antes de la inferencia.
* Tener interpretación de negocio.
* Mejorar el desempeño del modelo.
* No generar Data Leakage.
* Ser reproducibles mediante el Pipeline.

Toda variable derivada deberá documentarse antes de incorporarse al entrenamiento.

**9. Variables con posible redundancia**

Durante el EDA se evaluará la existencia de variables que describan información similar.

Se analizarán aspectos como:

* Alta correlación entre variables numéricas.
* Variables categóricas equivalentes.
* Variables derivadas que repliquen información existente.
* Dependencias funcionales entre columnas.

Las variables redundantes podrán eliminarse si no aportan información adicional.

**10. Variables con riesgo de Data Leakage**

Antes del entrenamiento se verificará que ninguna variable revele directa o indirectamente el valor del Target.

Se considerará que existe Data Leakage cuando una variable:

* Sea consecuencia del Target.
* Contenga información disponible únicamente después de la predicción.
* Permita inferir el Target de manera trivial.
* Haya sido calculada utilizando el propio Target.

Toda variable identificada con este riesgo será eliminada del conjunto de entrenamiento.

**11. Variables obligatorias**

Se consideran obligatorias aquellas variables necesarias para que el modelo pueda realizar una predicción.

La lista definitiva se establecerá después del proceso de selección de variables y deberá mantenerse estable para:

* Entrenamiento.
* Exportación del modelo.
* Integración con Backend.
* Diseño del JSON de entrada.

Backend deberá enviar exactamente estas variables durante la inferencia.

**12. Variables opcionales**

Podrán existir variables presentes en el dataset que no formen parte del modelo.

Estas variables podrán utilizarse para:

* Auditoría.
* Análisis exploratorio.
* Visualización.
* Documentación.
* Construcción de indicadores.

Su exclusión no afectará el funcionamiento del modelo.

**13. Criterios para eliminar variables**

Una variable podrá ser descartada cuando cumpla uno o más de los siguientes criterios:

* Alta proporción de valores faltantes.
* Varianza prácticamente nula.
* Información redundante.
* Baja relevancia predictiva.
* Riesgo de Data Leakage.
* Problemas de calidad que no puedan resolverse adecuadamente.
* Ausencia de interpretación de negocio.

Toda eliminación deberá quedar registrada.

**14. Validación de las variables seleccionadas**

Antes del entrenamiento se verificará que todas las variables seleccionadas:

* Existan en el dataset procesado.
* Tengan el tipo de dato esperado.
* No presenten inconsistencias estructurales.
* Sean compatibles con el Pipeline.
* Mantengan la misma nomenclatura utilizada en el diccionario de datos.

Esta validación será obligatoria antes de entrenar cualquier modelo.

**15. Compatibilidad con Backend**

Las variables seleccionadas constituirán el contrato de entrada del modelo.

Esto implica que:

* Backend utilizará exactamente los mismos nombres definidos en el diccionario de datos.
* No se permitirán abreviaturas ni alias.
* Toda modificación deberá actualizar simultáneamente:
  * el Pipeline,
  * el JSON de entrada,
  * el contrato con Backend,
  * la documentación técnica.

**16. Organización del trabajo**

**Ricardo Chirinos – Ingeniería y Análisis de Datos**

Responsable de:

* Analizar el comportamiento de cada variable durante el EDA.
* Detectar redundancias.
* Identificar variables problemáticas.
* Proponer nuevas variables derivadas.
* Documentar todas las decisiones de selección y exclusión.

**Jharle Compres – Machine Learning e Integración**

Responsable de:

* Evaluar la importancia predictiva de las variables.
* Detectar riesgos de Data Leakage.
* Implementar las transformaciones dentro del Pipeline.
* Definir el conjunto final de variables de entrada del modelo.
* Garantizar la compatibilidad con Backend.

**17. Dependencias con los siguientes capítulos**

Las decisiones tomadas en este capítulo servirán como base para:

* Análisis Exploratorio (EDA).
* Limpieza de Datos.
* Feature Engineering.
* Selección de Modelos.
* Entrenamiento.
* Exportación del Modelo.
* Diseño del JSON.
* Contrato entre Ciencia de Datos y Backend.

Todos estos capítulos deberán utilizar exclusivamente la definición oficial de variables establecida aquí.

**18. Decisiones adoptadas para el resto del manual**

Las siguientes decisiones quedan establecidas como estándar para todos los capítulos posteriores:

* El conjunto de variables del modelo se definirá mediante evidencia obtenida durante el EDA y no por criterios arbitrarios.
* Las variables id\_registro, perfil\_energetico y Unnamed: 0 quedan excluidas permanentemente como variables de entrada del modelo.
* Todas las transformaciones de variables se implementarán exclusivamente dentro del Pipeline oficial, garantizando reproducibilidad entre entrenamiento e inferencia.
* La creación de nuevas variables mediante Feature Engineering deberá aportar valor predictivo, mantener interpretación de negocio y evitar cualquier forma de Data Leakage.
* El conjunto final de variables seleccionadas constituirá el contrato oficial de entrada para Backend, por lo que su estructura y nomenclatura deberán permanecer consistentes durante todo el proyecto.
* Cualquier incorporación, eliminación o modificación de variables deberá documentarse previamente y mantenerse alineada con el Diccionario de Datos, el Pipeline y los contratos de integración.

**Capítulo 11 – Análisis Exploratorio de Datos (EDA)**

**Objetivo**

Definir la metodología oficial para realizar el Análisis Exploratorio de Datos (EDA) sobre el dataset procesado, con el propósito de comprender el comportamiento de las variables, identificar patrones, detectar problemas de calidad, descubrir relaciones relevantes y obtener evidencia para las decisiones posteriores de limpieza, ingeniería de variables y selección de modelos.

El EDA tendrá un carácter exclusivamente analítico. Ninguna transformación permanente del dataset será realizada durante esta etapa.

**1. Objetivos específicos del EDA**

El Análisis Exploratorio deberá permitir responder las siguientes preguntas:

* ¿Cómo está distribuido el dataset?
* ¿Cuál es la calidad general de la información?
* ¿Cómo se distribuye la variable objetivo?
* ¿Qué variables presentan mayor variabilidad?
* ¿Qué relaciones existen entre las variables?
* ¿Existen valores atípicos?
* ¿Existen patrones de consumo claramente diferenciados?
* ¿Qué variables parecen aportar mayor información para explicar el Target?
* ¿Qué problemas deberán resolverse durante la limpieza de datos?

Todas las conclusiones deberán sustentarse mediante evidencia obtenida del dataset.

**2. Alcance**

El EDA se realizará utilizando exclusivamente el dataset oficial validado.

Durante esta etapa:

* No se eliminarán registros.
* No se modificarán valores.
* No se crearán variables nuevas.
* No se entrenarán modelos.

El propósito será comprender el comportamiento de los datos antes de iniciar cualquier transformación.

**3. Flujo oficial del EDA**

El proceso seguirá el siguiente orden:

Carga del dataset validado

↓

Inspección general

↓

Análisis univariado

↓

Análisis bivariado

↓

Análisis multivariado

↓

Análisis del Target

↓

Identificación de problemas

↓

Documentación de hallazgos

↓

Definición de acciones para Limpieza de Datos

No se alterará este flujo durante el proyecto.

**4. Inspección inicial**

La primera actividad consistirá en obtener una visión general del dataset.

Como mínimo se documentará:

* Número de registros.
* Número de variables.
* Tipos de datos.
* Consumo de memoria.
* Variables numéricas.
* Variables categóricas.
* Variables booleanas.
* Variables temporales.

También se verificará que la estructura coincida con la validada en el capítulo anterior.

**5. Calidad general del dataset**

Se analizará el estado inicial de la información.

Como mínimo se evaluará:

* Valores nulos.
* Valores faltantes.
* Registros duplicados.
* Valores únicos.
* Variables constantes.
* Variables con alta cardinalidad.
* Variables con formatos inconsistentes.

El objetivo será construir una línea base de calidad antes de iniciar la limpieza.

**6. Análisis univariado**

Cada variable será analizada individualmente para comprender su comportamiento.

**Variables numéricas**

Se calcularán, como mínimo:

* Media.
* Mediana.
* Moda.
* Mínimo.
* Máximo.
* Rango.
* Desviación estándar.
* Percentiles.
* Asimetría.
* Curtosis.

También se analizará la forma de la distribución.

**Variables categóricas**

Se documentará:

* Frecuencia absoluta.
* Frecuencia relativa.
* Número de categorías.
* Categorías dominantes.
* Categorías poco representadas.

Se identificarán posibles inconsistencias de escritura.

**Variables booleanas**

Se verificará:

* Distribución de valores.
* Balance entre categorías.
* Posibles errores de codificación.

**7. Análisis de la variable objetivo**

La variable:

perfil\_energetico

deberá analizarse de manera independiente.

Se documentará:

* Número de registros por categoría.
* Distribución porcentual.
* Balance de clases.
* Posibles clases minoritarias.
* Existencia de registros sin etiqueta.

Este análisis servirá como referencia para el entrenamiento del modelo.

**8. Análisis bivariado**

Se estudiará la relación entre cada variable predictora y el Target.

El objetivo será identificar qué variables presentan mayor capacidad explicativa.

Se analizarán relaciones entre:

* Variables numéricas vs. Target.
* Variables categóricas vs. Target.
* Variables booleanas vs. Target.

Las conclusiones obtenidas servirán como evidencia para la selección de variables.

**9. Análisis entre variables predictoras**

Además del análisis respecto al Target, se evaluarán relaciones entre las propias variables predictoras.

Se identificarán:

* Correlaciones fuertes.
* Variables redundantes.
* Dependencias funcionales.
* Posibles multicolinealidades.

Estas observaciones serán utilizadas durante Feature Engineering.

**10. Análisis multivariado**

Se analizarán combinaciones de múltiples variables para identificar patrones complejos de comportamiento energético.

Se buscará identificar:

* Agrupaciones naturales.
* Comportamientos repetitivos.
* Relaciones no evidentes en análisis individuales.
* Variables que interactúan entre sí para explicar el Target.

No se realizarán técnicas de reducción de dimensionalidad durante esta etapa.

**11. Análisis de consumo energético**

Debido a la naturaleza del proyecto, el EDA prestará especial atención a las variables relacionadas con el consumo eléctrico.

Se analizarán, entre otras:

* consumo\_kwh\_mensual
* consumo\_kwh\_mes\_anterior
* consumo\_neto\_facturado\_kwh
* variacion\_pct\_consumo\_mensual
* costo\_estimado\_usd

El objetivo será comprender los distintos perfiles de consumo representados en el dataset.

**12. Análisis de variables del inmueble**

Se estudiará el comportamiento de variables relacionadas con:

* tipo\_inmueble
* superficie\_m2
* num\_personas
* nivel\_socioeconomico
* antiguedad\_construccion\_anios
* aislamiento\_termico

Estas variables permitirán caracterizar el contexto físico del consumo energético.

**13. Análisis de hábitos de consumo**

Se evaluará el comportamiento de las variables relacionadas con el uso cotidiano de la energía.

Entre ellas:

* horario\_pico\_uso
* horas\_uso\_aa\_dia
* porcentaje\_iluminacion\_led
* frecuencia de utilización de equipos

El objetivo será identificar patrones de comportamiento asociados al Target.

**14. Análisis de variables ambientales**

Las variables ambientales serán analizadas para determinar su influencia sobre el consumo energético.

Se estudiarán relaciones con:

* temperatura\_promedio\_c
* generacion\_solar\_kwh\_mensual
* dias\_sin\_electricidad\_mes
* fuente\_energia\_secundaria

Estas variables podrán explicar diferencias entre registros con consumos similares.

**15. Identificación de Outliers**

Durante el EDA se identificarán valores atípicos.

Cada caso será clasificado como:

* Valor extremo válido.
* Error de captura.
* Error de generación.
* Escenario poco frecuente pero posible.

Los outliers no serán eliminados automáticamente.

La decisión se tomará durante la etapa de limpieza.

**16. Registro de hallazgos**

Cada observación relevante deberá documentarse.

Como mínimo se registrarán:

* Variables problemáticas.
* Variables con alta relevancia.
* Variables redundantes.
* Posibles transformaciones.
* Variables candidatas a Feature Engineering.
* Riesgos detectados para el entrenamiento.

Este documento será utilizado durante los capítulos siguientes.

**17. Productos generados por el EDA**

Al finalizar esta etapa deberán existir, como mínimo:

* Informe de análisis exploratorio.
* Resumen estadístico.
* Visualizaciones del comportamiento de las variables.
* Matriz de correlación.
* Distribución del Target.
* Inventario de problemas detectados.
* Lista preliminar de variables candidatas para ingeniería de características.

Estos productos deberán almacenarse dentro de:

reports/eda/

**18. Organización del trabajo**

**Ricardo Chirinos – Ingeniería y Análisis de Datos**

Responsable de:

* Ejecutar el análisis univariado.
* Analizar la calidad de los datos.
* Identificar valores atípicos.
* Elaborar las visualizaciones.
* Documentar todos los hallazgos.

**Jharle Compres – Machine Learning e Integración**

Responsable de:

* Analizar la relación entre las variables y el Target.
* Evaluar correlaciones y redundancias.
* Detectar posibles riesgos de Data Leakage.
* Identificar variables candidatas para el modelo.
* Preparar las conclusiones que servirán para Feature Engineering.

**19. Dependencias con los siguientes capítulos**

Las conclusiones obtenidas durante el EDA constituirán la evidencia técnica para:

* Limpieza de Datos.
* Feature Engineering.
* Selección de Variables.
* Selección de Modelos.
* Entrenamiento.
* Evaluación de Métricas.

Ninguna decisión sobre eliminación, transformación o creación de variables deberá realizarse sin estar respaldada por los resultados del EDA.

**20. Decisiones adoptadas para el resto del manual**

Las siguientes decisiones quedan establecidas como estándar para todos los capítulos posteriores:

* El EDA será la única etapa destinada a comprender el comportamiento del dataset antes de aplicar transformaciones permanentes.
* Todas las decisiones de limpieza, selección de variables e ingeniería de características deberán justificarse mediante evidencia obtenida durante el EDA.
* Los valores atípicos, correlaciones y posibles problemas de calidad únicamente serán identificados y documentados en esta etapa; cualquier modificación se realizará posteriormente en el capítulo de Limpieza de Datos.
* El análisis de la variable perfil\_energetico y de las relaciones entre las variables predictoras y el Target será obligatorio antes de entrenar cualquier modelo.
* Todos los informes, estadísticas y visualizaciones generados durante el EDA se almacenarán en reports/eda/ y constituirán la documentación técnica oficial utilizada para sustentar las decisiones del resto del proyecto.
* La selección final de variables predictoras y las transformaciones implementadas en el Pipeline deberán derivarse de los hallazgos documentados durante este análisis.

**Capítulo 12 – Limpieza de Datos**

**Objetivo**

Definir el procedimiento oficial para preparar el dataset antes del entrenamiento del modelo, eliminando o corrigiendo problemas de calidad identificados durante la validación y el EDA, garantizando que el conjunto de datos utilizado por el Pipeline sea consistente, reproducible y apto para procesos de Machine Learning.

Toda transformación realizada durante esta etapa deberá ser completamente reproducible mediante código y formar parte del Pipeline oficial del proyecto.

**1. Alcance**

La limpieza de datos se ejecutará exclusivamente sobre una copia del dataset ubicado en:

datasets/raw/

El dataset original nunca será modificado.

El resultado de esta etapa será almacenado en:

datasets/processed/

**2. Objetivos de la limpieza**

El proceso deberá garantizar que el dataset final:

* Mantenga su integridad estructural.
* Preserve el significado de las variables.
* Sea consistente para entrenamiento.
* Elimine problemas que afecten el desempeño del modelo.
* Sea completamente reproducible.
* Mantenga trazabilidad respecto al dataset original.

**3. Flujo oficial de limpieza**

El proceso seguirá estrictamente el siguiente orden:

Carga del dataset RAW

↓

Eliminación de columnas no útiles

↓

Corrección de tipos de datos

↓

Normalización de formatos

↓

Tratamiento de valores faltantes

↓

Tratamiento de duplicados

↓

Validación de dominios

↓

Tratamiento de valores atípicos

↓

Validación final

↓

Exportación del dataset procesado

Ninguna etapa podrá ejecutarse fuera de este flujo.

**4. Principios generales**

Toda transformación deberá cumplir los siguientes principios:

* Ser reproducible mediante código.
* Mantener el significado original de los datos.
* No modificar el Target.
* No introducir sesgos artificiales.
* Estar documentada.
* Poder ejecutarse nuevamente sin intervención manual.

No se permitirá modificar manualmente archivos CSV.

Toda limpieza deberá implementarse mediante scripts del proyecto.

**5. Eliminación de variables no útiles**

Antes de cualquier otra transformación se eliminarán las columnas que no aporten información al modelo.

Para este proyecto queda establecida la eliminación obligatoria de:

Unnamed: 0

Esta columna corresponde a un artefacto generado durante la exportación del dataset y no contiene información del negocio.

Su eliminación será permanente dentro del dataset procesado.

**6. Corrección de tipos de datos**

Cada variable deberá convertirse al tipo de dato definido en el Diccionario de Datos.

Se verificará:

* Variables numéricas.
* Variables categóricas.
* Variables booleanas.
* Variables temporales.
* Variables identificadoras.

No se permitirá entrenar modelos utilizando tipos inconsistentes.

**7. Normalización de formatos**

Todas las variables deberán mantener un formato uniforme.

Como mínimo se normalizarán:

* Texto.
* Espacios en blanco.
* Uso de mayúsculas y minúsculas.
* Valores booleanos.
* Formatos de fechas.
* Separadores decimales.
* Unidades de medida cuando corresponda.

Esta normalización facilitará la consistencia del Pipeline.

**8. Tratamiento de valores faltantes**

Los valores faltantes se tratarán de acuerdo con la naturaleza de cada variable.

Antes de aplicar cualquier técnica se evaluará:

* Porcentaje de valores faltantes.
* Distribución.
* Patrón de ausencia.
* Importancia de la variable.

Las estrategias permitidas incluyen:

* Eliminación de registros.
* Eliminación de variables.
* Imputación mediante medidas estadísticas.
* Imputación mediante reglas de negocio.
* Imputación mediante modelos cuando sea técnicamente justificable.

La estrategia aplicada deberá documentarse para cada variable.

**9. Tratamiento de registros duplicados**

Se identificarán dos tipos de duplicados:

**Duplicados exactos**

Registros completamente idénticos.

Podrán eliminarse si no representan eventos distintos.

**Duplicados parciales**

Registros similares con diferencias en algunas variables.

Cada caso deberá analizarse antes de decidir su tratamiento.

No se eliminarán automáticamente.

**10. Validación de dominios**

Después de la limpieza se verificará nuevamente que todas las variables respeten los dominios definidos en el Diccionario de Datos.

Se revisarán:

* Categorías permitidas.
* Rangos numéricos.
* Valores booleanos.
* Restricciones lógicas.
* Consistencia entre variables relacionadas.

**11. Tratamiento de valores atípicos**

Los valores atípicos identificados durante el EDA serán evaluados individualmente.

Cada caso podrá clasificarse como:

* Error de generación.
* Error de captura.
* Escenario válido.
* Escenario extremo pero posible.

Los valores extremos válidos permanecerán en el dataset.

Únicamente se corregirán aquellos que representen errores reales.

**12. Validación de reglas de negocio**

Después de aplicar la limpieza se verificará nuevamente la coherencia entre variables relacionadas.

Como mínimo se comprobarán relaciones entre:

* consumo\_kwh\_mensual
* consumo\_neto\_facturado\_kwh
* costo\_estimado\_usd
* generacion\_solar\_kwh\_mensual
* horas\_uso\_aa\_dia
* cantidad\_equipos\_total
* perfil\_energetico

Toda inconsistencia detectada deberá resolverse antes de exportar el dataset procesado.

**13. Restricciones durante la limpieza**

Durante esta etapa queda prohibido:

* Modificar la variable perfil\_energetico.
* Crear variables nuevas.
* Eliminar variables sin justificación técnica.
* Alterar el significado del dataset.
* Aplicar transformaciones destinadas al entrenamiento.

Las actividades de ingeniería de variables se realizarán exclusivamente en el capítulo siguiente.

**14. Validación del dataset limpio**

Antes de exportar el dataset procesado se verificará que:

* No existan errores estructurales.
* Los tipos de datos sean correctos.
* La columna Unnamed: 0 haya sido eliminada.
* Las variables mantengan la nomenclatura oficial.
* El Target permanezca sin modificaciones.
* El dataset sea compatible con el Pipeline.

Esta validación será obligatoria.

**15. Exportación del dataset procesado**

El dataset limpio será almacenado en:

datasets/processed/

Utilizando la siguiente nomenclatura:

energia\_v1\_processed.csv

El archivo exportado será la única versión autorizada para:

* Feature Engineering.
* Selección de Variables.
* Entrenamiento.
* Evaluación.
* Exportación del modelo.

**16. Organización del trabajo**

**Ricardo Chirinos – Ingeniería y Análisis de Datos**

Responsable de:

* Implementar todas las transformaciones de limpieza.
* Corregir tipos de datos.
* Tratar valores faltantes.
* Analizar registros duplicados.
* Documentar cada transformación aplicada.
* Exportar el dataset procesado.

**Jharle Compres – Machine Learning e Integración**

Responsable de:

* Validar que la limpieza no genere Data Leakage.
* Verificar la compatibilidad con el Pipeline.
* Confirmar la integridad del Target.
* Validar que el dataset esté listo para Feature Engineering.
* Aprobar técnicamente la versión procesada.

**17. Productos generados**

Al finalizar este capítulo deberán existir como mínimo:

* Dataset procesado.
* Registro de transformaciones realizadas.
* Informe de limpieza de datos.
* Comparación entre el dataset RAW y el dataset procesado.
* Validación final del dataset.

Toda la documentación deberá almacenarse en:

reports/data\_cleaning/

**18. Dependencias con los siguientes capítulos**

El dataset generado en este capítulo será utilizado directamente en:

* Feature Engineering.
* Selección de Modelos.
* Entrenamiento.
* Evaluación de Métricas.
* Interpretación del Modelo.
* Exportación del Modelo.

A partir de este punto, ninguna etapa volverá a utilizar directamente el dataset almacenado en datasets/raw/.

**19. Decisiones adoptadas para el resto del manual**

Las siguientes decisiones quedan establecidas como estándar para todos los capítulos posteriores:

* El dataset original almacenado en datasets/raw/ permanecerá inalterado durante todo el proyecto y será la referencia permanente para garantizar la trazabilidad.
* Toda limpieza será implementada mediante scripts reproducibles integrados al Pipeline oficial; no se permitirán modificaciones manuales sobre los archivos del dataset.
* La columna Unnamed: 0 será eliminada de forma permanente antes de cualquier proceso analítico o de entrenamiento.
* La variable perfil\_energetico no podrá modificarse, imputarse ni transformarse durante la limpieza de datos.
* El dataset ubicado en datasets/processed/ será la única fuente autorizada para las etapas de Feature Engineering, entrenamiento, evaluación e integración con el modelo.
* Todas las transformaciones aplicadas deberán quedar documentadas y ser completamente reproducibles para garantizar consistencia entre el entrenamiento y futuras ejecuciones del proyecto.

**Capítulo 13 – Feature Engineering**

**Objetivo**

Definir la metodología oficial para crear, transformar y seleccionar características (features) que incrementen la capacidad predictiva del modelo de Machine Learning, preservando la trazabilidad, la reproducibilidad y la interpretación de negocio.

Toda característica generada en esta etapa deberá implementarse dentro del Pipeline oficial del proyecto y podrá utilizarse tanto durante el entrenamiento como durante la inferencia.

**1. Alcance**

El proceso de Feature Engineering se ejecutará exclusivamente sobre el dataset ubicado en:

datasets/processed/

No se crearán variables directamente sobre el dataset RAW.

Toda transformación será reproducible mediante código.

**2. Objetivos del Feature Engineering**

Las nuevas variables deberán contribuir a:

* Mejorar el desempeño del modelo.
* Incrementar la capacidad explicativa del Target.
* Reducir ruido.
* Facilitar la interpretación del modelo.
* Representar mejor el comportamiento energético del inmueble.
* Mantener coherencia con las reglas de negocio definidas para el proyecto.

**3. Flujo oficial**

El proceso seguirá el siguiente orden:

Carga del dataset procesado

↓

Análisis de variables candidatas

↓

Construcción de nuevas variables

↓

Transformación de variables existentes

↓

Evaluación de relevancia

↓

Validación de Data Leakage

↓

Actualización del Pipeline

↓

Exportación del dataset enriquecido

**4. Principios generales**

Toda nueva característica deberá cumplir los siguientes criterios:

* Tener significado de negocio.
* Poder calcularse durante la inferencia.
* Ser reproducible.
* No utilizar información futura.
* No depender del Target.
* No introducir Data Leakage.
* Poder documentarse completamente.

Toda variable que no cumpla estas condiciones será descartada.

**5. Tipos de transformaciones permitidas**

Durante esta etapa podrán aplicarse las siguientes transformaciones:

* Creación de variables derivadas.
* Agrupación de categorías.
* Conversión de variables booleanas.
* Codificación de variables categóricas.
* Escalamiento.
* Transformaciones matemáticas.
* Generación de indicadores compuestos.
* Variables basadas en reglas de negocio.

No se realizarán transformaciones que alteren el significado del Target.

**6. Variables derivadas del consumo energético**

El dataset incorpora diversas variables relacionadas con el consumo eléctrico.

A partir de ellas podrán generarse indicadores derivados como:

* Consumo por metro cuadrado.
* Consumo por ocupante.
* Consumo por equipo eléctrico.
* Consumo promedio diario.
* Costo promedio diario.
* Relación entre consumo actual y consumo histórico.
* Índice de intensidad energética.

Estas variables permitirán representar de forma más precisa la eficiencia energética del inmueble.

**7. Variables derivadas de hábitos de consumo**

Las variables relacionadas con el comportamiento de los usuarios podrán combinarse para representar patrones de uso.

Ejemplos:

* Intensidad de uso del aire acondicionado.
* Índice de utilización de equipos eléctricos.
* Nivel de ocupación energética.
* Indicador de uso nocturno.
* Índice de eficiencia de iluminación.

Estas variables buscarán capturar relaciones que no son evidentes mediante las variables originales.

**8. Variables derivadas del inmueble**

Podrán construirse indicadores que relacionen las características físicas del inmueble.

Ejemplos:

* Densidad de ocupación.
* Equipos por metro cuadrado.
* Superficie por ocupante.
* Antigüedad relativa del inmueble.
* Índice estructural de eficiencia.

Estos indicadores podrán mejorar la capacidad predictiva del modelo.

**9. Variables derivadas del entorno**

Las variables ambientales podrán combinarse para representar condiciones externas relevantes.

Ejemplos:

* Dependencia de generación solar.
* Disponibilidad energética alternativa.
* Impacto climático sobre el consumo.
* Índice de resiliencia energética.

Estas características deberán construirse exclusivamente con información disponible antes de la predicción.

**10. Codificación de variables categóricas**

Las variables categóricas serán transformadas utilizando técnicas compatibles con el algoritmo seleccionado.

Las técnicas permitidas incluyen:

* One-Hot Encoding.
* Ordinal Encoding.
* Binary Encoding.

La selección dependerá del algoritmo definitivo y de los resultados obtenidos durante el entrenamiento.

Toda codificación será implementada dentro del Pipeline oficial.

**11. Escalamiento de variables**

Las variables numéricas podrán escalarse cuando el algoritmo utilizado lo requiera.

Las técnicas permitidas incluyen:

* StandardScaler.
* MinMaxScaler.
* RobustScaler.

No se realizará escalamiento si el algoritmo seleccionado no obtiene beneficios de esta transformación.

El escalador utilizado formará parte del Pipeline oficial.

**12. Validación de nuevas variables**

Cada nueva característica deberá cumplir los siguientes criterios antes de incorporarse al modelo:

* Aporta información nueva.
* Tiene interpretación de negocio.
* Puede calcularse durante la inferencia.
* No genera Data Leakage.
* Presenta calidad suficiente.
* Mejora o mantiene el desempeño del modelo.

Toda variable que no aporte valor será descartada.

**13. Evaluación de importancia**

Después de crear nuevas características se evaluará su contribución utilizando técnicas compatibles con el modelo seleccionado.

Como mínimo se analizará:

* Importancia de variables.
* Redundancia.
* Correlación.
* Contribución al desempeño del modelo.
* Complejidad añadida.

No se conservarán variables únicamente por haber sido creadas.

**14. Integración con el Pipeline**

Toda transformación desarrollada durante esta etapa deberá implementarse dentro del Pipeline oficial.

Queda prohibido:

* Crear variables manualmente antes del entrenamiento.
* Ejecutar transformaciones fuera del Pipeline.
* Aplicar procesos distintos entre entrenamiento e inferencia.

El mismo Pipeline deberá generar exactamente las mismas variables en ambos escenarios.

**15. Exportación del dataset enriquecido**

El resultado del Feature Engineering podrá almacenarse temporalmente para fines de auditoría y validación.

La versión oficial se ubicará en:

datasets/features/

Utilizando la nomenclatura:

energia\_v1\_features.csv

Este archivo será una copia técnica para análisis y verificación.

El entrenamiento oficial utilizará el Pipeline y no dependerá de este archivo.

**16. Organización del trabajo**

**Ricardo Chirinos – Ingeniería y Análisis de Datos**

Responsable de:

* Diseñar nuevas variables derivadas.
* Implementar reglas de negocio.
* Evaluar la calidad de las nuevas características.
* Documentar cada transformación realizada.
* Validar la coherencia de las variables generadas.

**Jharle Compres – Machine Learning e Integración**

Responsable de:

* Integrar las transformaciones al Pipeline.
* Evaluar el impacto de las nuevas variables en el rendimiento del modelo.
* Detectar posibles casos de Data Leakage.
* Validar la compatibilidad entre entrenamiento e inferencia.
* Aprobar el conjunto final de características utilizadas por el modelo.

**17. Productos generados**

Al finalizar esta etapa deberán existir como mínimo:

* Scripts de Feature Engineering.
* Variables derivadas documentadas.
* Pipeline actualizado.
* Informe de evaluación de características.
* Inventario de variables utilizadas y descartadas.

Toda la documentación deberá almacenarse en:

reports/feature\_engineering/

**18. Dependencias con los siguientes capítulos**

Las características generadas en este capítulo serán utilizadas directamente en:

* Selección de Modelos.
* Entrenamiento.
* Evaluación de Métricas.
* Interpretación del Modelo.
* Exportación del Modelo.
* Integración con Backend.

A partir de este punto, el modelo trabajará únicamente con las variables generadas por el Pipeline oficial.

**19. Decisiones adoptadas para el resto del manual**

Las siguientes decisiones quedan establecidas como estándar para todos los capítulos posteriores:

* Todo el Feature Engineering será implementado exclusivamente dentro del Pipeline oficial, garantizando que entrenamiento e inferencia ejecuten exactamente las mismas transformaciones.
* Las nuevas variables deberán tener justificación técnica y significado de negocio; no se incorporarán características únicamente por incrementar la cantidad de variables disponibles.
* Las variables derivadas estarán basadas principalmente en relaciones entre consumo energético, características del inmueble, hábitos de uso y condiciones ambientales, alineadas con el objetivo del proyecto de clasificar perfiles energéticos.
* El archivo datasets/features/energia\_v1\_features.csv tendrá únicamente fines de auditoría y validación; el entrenamiento oficial dependerá siempre del Pipeline y no de archivos previamente transformados.
* Ninguna característica que introduzca Data Leakage o que no pueda calcularse durante la inferencia será incorporada al modelo.
* Toda variable creada deberá quedar documentada, validada y ser trazable desde su definición hasta su utilización en el modelo y en la integración con Backend.

**Capítulo 14 – Selección de Modelos**

**Objetivo**

Definir la estrategia oficial para seleccionar el modelo de Machine Learning que será utilizado para clasificar el perfil energético de viviendas y pequeños establecimientos, garantizando que la decisión esté sustentada en evidencia experimental, métricas objetivas, capacidad de generalización e integración con el resto de la arquitectura del proyecto.

La selección del modelo se realizará utilizando exclusivamente el dataset procesado y el Pipeline definido en los capítulos anteriores.

**1. Alcance**

La selección de modelos comprenderá:

* Definición de modelos candidatos.
* Entrenamiento bajo las mismas condiciones.
* Comparación utilizando las mismas métricas.
* Evaluación de estabilidad.
* Selección del modelo definitivo.
* Documentación de los resultados.

No se realizarán optimizaciones avanzadas de hiperparámetros durante esta etapa.

El objetivo será identificar la arquitectura con mejor comportamiento general.

**2. Flujo oficial**

La selección seguirá el siguiente proceso:

Carga del dataset procesado

↓

Aplicación del Pipeline oficial

↓

División Train/Test

↓

Entrenamiento de modelos candidatos

↓

Evaluación utilizando las mismas métricas

↓

Comparación de resultados

↓

Selección del mejor modelo

↓

Documentación técnica

Este flujo será obligatorio.

**3. Principios de selección**

El modelo definitivo deberá cumplir los siguientes criterios:

* Alto desempeño predictivo.
* Buena capacidad de generalización.
* Bajo riesgo de sobreajuste.
* Tiempo de entrenamiento razonable.
* Tiempo de inferencia reducido.
* Facilidad de integración con Backend.
* Compatibilidad con exportación mediante Joblib.
* Interpretabilidad suficiente para justificar las predicciones.

No se seleccionará un modelo únicamente por obtener la mayor precisión.

**4. Tipo de problema**

El proyecto resolverá un problema de:

Clasificación Supervisada Multiclase

Los modelos seleccionados deberán soportar de forma nativa este tipo de problema.

**5. Modelos candidatos**

El proyecto evaluará los siguientes algoritmos.

**Modelo 1**

Random Forest Classifier

Será considerado el modelo base debido a:

* Robustez.
* Bajo riesgo de sobreajuste.
* Buena interpretación.
* Excelente comportamiento con variables mixtas.
* Baja necesidad de escalamiento.

**Modelo 2**

Gradient Boosting Classifier

Será evaluado por su capacidad para capturar relaciones complejas entre variables.

**Modelo 3**

XGBoost

Será considerado como alternativa de alto rendimiento cuando la complejidad del dataset justifique su utilización.

Su uso dependerá de la disponibilidad del paquete correspondiente dentro del entorno del proyecto.

**Modelo 4**

LightGBM

Será evaluado únicamente si ofrece mejoras significativas respecto a los modelos anteriores.

**Modelo 5**

Decision Tree Classifier

Será utilizado como referencia para comparar modelos más complejos.

Su principal función será proporcionar interpretabilidad.

**Modelo 6**

Logistic Regression

Aunque se trata de un modelo lineal, será entrenado como línea base para medir la ganancia obtenida por modelos no lineales.

**6. Modelos descartados**

Durante esta versión del proyecto quedan descartados:

* Redes Neuronales.
* Deep Learning.
* Modelos de series temporales.
* Modelos no supervisados.
* Clustering.
* Reinforcement Learning.

Estas técnicas exceden los objetivos del MVP.

**7. Condiciones de entrenamiento**

Todos los modelos deberán entrenarse utilizando exactamente:

* El mismo dataset.
* El mismo Pipeline.
* Las mismas variables.
* La misma división Train/Test.
* El mismo Target.
* La misma estrategia de validación.

De esta manera se garantizará una comparación justa.

**8. Validación**

La evaluación de cada modelo deberá realizarse utilizando validación cruzada.

Se utilizará:

Stratified K-Fold Cross Validation

Esta estrategia permitirá conservar la distribución de clases del Target en cada partición.

El número oficial de particiones será:

5 folds

**9. Comparación de modelos**

Cada modelo será evaluado considerando:

* Accuracy.
* Precision.
* Recall.
* F1-Score.
* Matriz de Confusión.
* Tiempo de entrenamiento.
* Tiempo de inferencia.
* Estabilidad entre folds.

Ninguna métrica será evaluada de forma aislada.

**10. Criterios de desempate**

Si dos modelos presentan resultados similares, la selección seguirá el siguiente orden de prioridad:

1. Mayor F1-Score.
2. Menor diferencia entre entrenamiento y prueba.
3. Menor tiempo de inferencia.
4. Mayor interpretabilidad.
5. Menor complejidad de mantenimiento.
6. Menor consumo de recursos.

**11. Prevención del sobreajuste**

Durante la evaluación se analizará:

* Diferencia entre entrenamiento y prueba.
* Variación entre folds.
* Estabilidad de las métricas.
* Complejidad del modelo.

Los modelos con evidencia de sobreajuste serán descartados.

**12. Selección del modelo definitivo**

El modelo oficial será aquel que:

* Obtenga el mejor equilibrio entre desempeño y estabilidad.
* Generalice correctamente sobre datos no vistos.
* Sea compatible con el Pipeline.
* Permita una integración sencilla con Backend.
* Mantenga tiempos de respuesta adecuados para el MVP.

La selección deberá documentarse técnicamente.

**13. Compatibilidad con el Pipeline**

El modelo seleccionado deberá integrarse completamente dentro del Pipeline oficial.

El Pipeline incluirá:

* Transformaciones.
* Codificación.
* Escalamiento cuando corresponda.
* Modelo entrenado.

Backend nunca ejecutará transformaciones manuales.

**14. Reproducibilidad**

Todos los entrenamientos deberán ser reproducibles.

Como estándar del proyecto se utilizará:

random\_state = 42

Siempre que el algoritmo lo permita.

Esto garantizará resultados consistentes entre ejecuciones.

**15. Exportación prevista**

El modelo seleccionado deberá ser compatible con la exportación mediante:

Joblib

No se seleccionarán modelos cuya serialización complique la integración con Backend.

**16. Organización del trabajo**

**Ricardo Chirinos – Ingeniería y Análisis de Datos**

Responsable de:

* Preparar el dataset definitivo para entrenamiento.
* Ejecutar el Pipeline previo al entrenamiento.
* Documentar los resultados obtenidos por cada modelo.
* Elaborar los cuadros comparativos.
* Registrar las conclusiones técnicas.

**Jharle Compres – Machine Learning e Integración**

Responsable de:

* Implementar los modelos candidatos.
* Ejecutar la validación cruzada.
* Comparar métricas.
* Analizar sobreajuste.
* Seleccionar el modelo definitivo.
* Garantizar la compatibilidad con la exportación e integración.

**17. Productos generados**

Al finalizar este capítulo deberán existir como mínimo:

* Scripts de entrenamiento de modelos candidatos.
* Resultados de validación cruzada.
* Tabla comparativa de métricas.
* Ranking de modelos.
* Informe técnico de selección.
* Configuración del modelo elegido.

Toda la documentación deberá almacenarse en:

reports/model\_selection/

**18. Dependencias con los siguientes capítulos**

Las decisiones tomadas en este capítulo serán utilizadas directamente en:

* Entrenamiento.
* Evaluación de Métricas.
* Interpretación del Modelo.
* Exportación del Modelo.
* Integración con Backend.
* FastAPI para pruebas.

A partir de este punto no se incorporarán nuevos algoritmos sin repetir el proceso completo de selección.

**19. Decisiones adoptadas para el resto del manual**

Las siguientes decisiones quedan establecidas como estándar para todos los capítulos posteriores:

* La selección del modelo se realizará mediante una comparación objetiva entre **Random Forest**, **Gradient Boosting**, **XGBoost**, **LightGBM**, **Decision Tree** y **Logistic Regression**, utilizando exactamente el mismo Pipeline y el mismo conjunto de datos.
* La validación oficial del proyecto utilizará **Stratified K-Fold Cross Validation** con **5 folds**, preservando la distribución de las clases del Target en todas las evaluaciones.
* El criterio principal de selección será el equilibrio entre capacidad predictiva, estabilidad, interpretabilidad y facilidad de integración, evitando decisiones basadas únicamente en la métrica **Accuracy**.
* El valor **random\_state = 42** se adopta como estándar para todos los algoritmos y procesos que permitan controlar la aleatoriedad, garantizando la reproducibilidad del proyecto.
* El modelo seleccionado deberá poder integrarse completamente dentro del Pipeline oficial y ser exportado mediante **Joblib**, asegurando compatibilidad con Backend y FastAPI.
* El algoritmo elegido en este capítulo será el único utilizado durante los capítulos de Entrenamiento, Evaluación, Interpretación, Exportación e Integración, salvo que un nuevo proceso de selección documentado justifique su sustitución.

**Capítulo 15 – Entrenamiento**

**Objetivo**

Definir el procedimiento oficial para entrenar el modelo de Machine Learning utilizando el Pipeline aprobado, garantizando reproducibilidad, trazabilidad, consistencia entre entrenamiento e inferencia y compatibilidad con la arquitectura general del proyecto.

El entrenamiento se realizará únicamente después de completar las etapas de validación del dataset, limpieza de datos, Feature Engineering y selección del modelo.

**1. Alcance**

Esta etapa comprende:

* Preparación del dataset final.
* División de los datos.
* Configuración del Pipeline.
* Entrenamiento del modelo seleccionado.
* Validación durante el entrenamiento.
* Registro de resultados.
* Almacenamiento de los artefactos generados.

No se modificarán variables ni se crearán nuevas características durante esta fase.

**2. Flujo oficial del entrenamiento**

El entrenamiento seguirá estrictamente el siguiente flujo:

Carga del dataset procesado

↓

Carga del Pipeline oficial

↓

Selección de variables de entrada

↓

Separación de variables predictoras y Target

↓

División Train/Test

↓

Entrenamiento del Pipeline

↓

Predicción sobre Test

↓

Almacenamiento del modelo entrenado

↓

Registro de métricas

↓

Validación final

Este flujo será obligatorio para todas las ejecuciones.

**3. Fuente de datos**

El entrenamiento utilizará exclusivamente:

datasets/processed/

El dataset RAW y cualquier versión intermedia quedan excluidos del entrenamiento.

**4. Variables utilizadas**

El conjunto de entrada estará compuesto únicamente por las variables predictoras aprobadas durante los capítulos anteriores.

La variable:

perfil\_energetico

será utilizada exclusivamente como Target.

La variable:

id\_registro

no participará en el entrenamiento.

**5. División del dataset**

La separación entre entrenamiento y prueba se realizará una única vez antes del entrenamiento.

Se adopta como estándar del proyecto:

80 % → Entrenamiento

20 % → Prueba

La división deberá preservar la distribución de las clases mediante estratificación.

**6. Configuración del entrenamiento**

Antes de iniciar el entrenamiento se verificará que:

* El Pipeline corresponda a la versión oficial.
* Todas las transformaciones estén integradas.
* El conjunto de variables sea el aprobado.
* El Target mantenga las categorías oficiales.
* No existan registros inválidos.

No se permitirá entrenar modelos fuera del Pipeline.

**7. Entrenamiento del Pipeline**

El entrenamiento consistirá en ejecutar una única instrucción sobre el Pipeline completo.

El Pipeline deberá encargarse automáticamente de:

* Transformaciones.
* Codificación.
* Escalamiento (cuando aplique).
* Entrenamiento del modelo.

No se ejecutarán transformaciones manuales previas.

**8. Control de reproducibilidad**

Todas las ejecuciones deberán ser reproducibles.

Como estándar obligatorio del proyecto:

random\_state = 42

Además, deberán mantenerse constantes:

* Versión del dataset.
* Pipeline.
* Librerías.
* Variables seleccionadas.
* Configuración del modelo.

**9. Registro del entrenamiento**

Cada entrenamiento deberá generar un registro técnico con la siguiente información:

* Fecha y hora.
* Versión del dataset.
* Versión del Pipeline.
* Modelo utilizado.
* Parámetros del modelo.
* Número de registros.
* Número de variables.
* Tiempo de entrenamiento.
* Responsable de la ejecución.

Este registro permitirá la trazabilidad completa del proceso.

**10. Gestión de versiones**

Cada entrenamiento aprobado generará una nueva versión del modelo.

La nomenclatura oficial será:

modelo\_v1.pkl

modelo\_v2.pkl

modelo\_v3.pkl

Nunca se sobrescribirá una versión aprobada.

**11. Control de experimentos**

Todo entrenamiento deberá registrarse como un experimento independiente.

Cada experimento incluirá:

* Identificador.
* Objetivo.
* Configuración utilizada.
* Dataset empleado.
* Variables utilizadas.
* Modelo entrenado.
* Resultados obtenidos.
* Conclusión técnica.

Esto permitirá comparar distintas ejecuciones sin perder trazabilidad.

**12. Validaciones posteriores al entrenamiento**

Finalizado el entrenamiento se verificará que:

* El modelo haya convergido correctamente.
* No existan errores durante el Pipeline.
* El modelo pueda realizar predicciones.
* El Target sea correctamente reconocido.
* El número de variables coincida con la configuración oficial.

Solo después de esta validación el modelo podrá pasar a la etapa de evaluación.

**13. Restricciones durante el entrenamiento**

Durante esta etapa queda prohibido:

* Modificar el dataset.
* Cambiar el Target.
* Incorporar nuevas variables.
* Alterar el Pipeline.
* Cambiar manualmente hiperparámetros sin documentarlo.
* Reemplazar el modelo seleccionado.

Cualquier modificación requerirá repetir el proceso de selección de modelos.

**14. Almacenamiento de artefactos**

Los artefactos generados durante el entrenamiento deberán almacenarse en:

models/

Como mínimo deberán conservarse:

* Modelo entrenado.
* Configuración utilizada.
* Pipeline entrenado.
* Registro del experimento.

**15. Productos generados**

Al finalizar esta etapa deberán existir como mínimo:

* Pipeline entrenado.
* Modelo entrenado.
* Registro de entrenamiento.
* Historial de experimentos.
* Configuración utilizada.
* Dataset de entrenamiento identificado.

Toda la documentación deberá almacenarse en:

reports/training/

**16. Organización del trabajo**

**Ricardo Chirinos – Ingeniería y Análisis de Datos**

Responsable de:

* Verificar la calidad del dataset antes del entrenamiento.
* Confirmar la versión oficial del dataset.
* Validar las variables de entrada.
* Ejecutar la preparación previa al entrenamiento.
* Documentar el experimento realizado.

**Jharle Compres – Machine Learning e Integración**

Responsable de:

* Ejecutar el entrenamiento del Pipeline.
* Configurar el modelo seleccionado.
* Registrar los parámetros utilizados.
* Validar el funcionamiento del modelo entrenado.
* Exportar los artefactos generados para las siguientes etapas.

**17. Dependencias con los siguientes capítulos**

Los artefactos generados en esta etapa serán utilizados directamente en:

* Evaluación de Métricas.
* Interpretación del Modelo.
* Exportación del Modelo.
* Integración con Backend.
* FastAPI para pruebas.

A partir de este punto no se volverá a entrenar el modelo salvo que exista una modificación documentada del dataset, del Pipeline o de la estrategia de modelado.

**18. Decisiones adoptadas para el resto del manual**

Las siguientes decisiones quedan establecidas como estándar para todos los capítulos posteriores:

* El entrenamiento se realizará exclusivamente mediante el **Pipeline oficial**, evitando cualquier transformación manual antes o después del proceso.
* La división oficial del dataset será **80 % para entrenamiento** y **20 % para prueba**, utilizando estratificación para preservar la distribución de perfil\_energetico.
* Todos los entrenamientos deberán ser completamente reproducibles utilizando random\_state = 42, las mismas versiones de librerías, el mismo Pipeline y la misma versión del dataset.
* Cada ejecución generará una nueva versión del modelo y un registro completo del experimento, garantizando trazabilidad y permitiendo comparar resultados entre entrenamientos.
* Los artefactos oficiales del entrenamiento se almacenarán en models/ y constituirán la única fuente autorizada para la evaluación, exportación e integración con Backend.
* Una vez aprobado el modelo entrenado, no se permitirán modificaciones en el Pipeline, las variables o el algoritmo sin reiniciar el proceso desde la etapa correspondiente y documentar el nuevo experimento.

**Capítulo 16 – Evaluación de Métricas**

**Objetivo**

Definir la metodología oficial para evaluar el desempeño del modelo entrenado, utilizando métricas objetivas que permitan determinar su capacidad de generalización, estabilidad y utilidad para clasificar correctamente el perfil energético de viviendas y pequeños establecimientos.

La evaluación será realizada exclusivamente sobre datos no utilizados durante el entrenamiento.

**1. Alcance**

Esta etapa comprende:

* Evaluación del modelo sobre el conjunto de prueba.
* Cálculo de métricas de clasificación.
* Análisis del comportamiento por clase.
* Identificación de fortalezas y debilidades.
* Comparación entre resultados de entrenamiento y prueba.
* Aprobación o rechazo del modelo para las siguientes etapas.

No se realizarán modificaciones al modelo durante esta fase.

**2. Flujo oficial de evaluación**

La evaluación seguirá el siguiente flujo:

Carga del Pipeline entrenado

↓

Carga del conjunto de prueba

↓

Generación de predicciones

↓

Cálculo de métricas

↓

Análisis por clase

↓

Evaluación de estabilidad

↓

Conclusiones técnicas

↓

Aprobación o rechazo del modelo

Este flujo será obligatorio para todas las evaluaciones.

**3. Fuente de evaluación**

La evaluación utilizará exclusivamente:

* El conjunto **Test** generado durante el entrenamiento.
* El Pipeline oficial entrenado.
* El modelo seleccionado en el Capítulo 14.

No se utilizarán datos externos ni registros empleados para entrenar el modelo.

**4. Principios de evaluación**

Toda evaluación deberá cumplir los siguientes principios:

* Utilizar datos no vistos durante el entrenamiento.
* Aplicar exactamente el mismo Pipeline utilizado para entrenar.
* Mantener reproducibilidad.
* Basarse en múltiples métricas.
* Documentar todos los resultados obtenidos.

No se aprobará un modelo utilizando únicamente una métrica.

**5. Accuracy**

La Accuracy medirá el porcentaje total de predicciones correctas.

Su cálculo será obligatorio.

No obstante, esta métrica no será utilizada como criterio único debido al carácter multiclase del problema.

**6. Precision**

La Precision será calculada para cada clase del Target.

Permitirá medir la proporción de predicciones positivas correctas realizadas por el modelo.

Será especialmente útil para identificar clases con mayor tendencia a falsos positivos.

**7. Recall**

El Recall será calculado para cada categoría de:

perfil\_energetico

Permitirá conocer la capacidad del modelo para identificar correctamente cada perfil energético.

Será utilizado para detectar falsos negativos.

**8. F1-Score**

El F1-Score será considerado la principal métrica del proyecto.

Su utilización permitirá equilibrar Precision y Recall.

La selección definitiva del modelo deberá priorizar esta métrica sobre Accuracy cuando existan diferencias significativas entre clases.

**9. Matriz de confusión**

Se generará una matriz de confusión para analizar el comportamiento del modelo.

El análisis deberá identificar:

* Clases correctamente clasificadas.
* Clases confundidas entre sí.
* Patrones de error.
* Frecuencia de cada tipo de confusión.

Esta información servirá de base para la interpretación del modelo.

**10. Reporte de clasificación**

Se generará un reporte completo que incluya:

* Precision.
* Recall.
* F1-Score.
* Support.

El reporte deberá calcularse para cada categoría del Target.

**11. Evaluación mediante validación cruzada**

Además de la evaluación sobre Test, se analizarán los resultados obtenidos durante:

Stratified K-Fold Cross Validation

Se revisará:

* Promedio de las métricas.
* Desviación estándar.
* Estabilidad entre folds.
* Consistencia del modelo.

La validación cruzada complementará la evaluación final.

**12. Evaluación del sobreajuste**

Se compararán los resultados obtenidos sobre:

* Entrenamiento.
* Prueba.

Se analizarán diferencias en:

* Accuracy.
* Precision.
* Recall.
* F1-Score.

Diferencias significativas indicarán posible sobreajuste.

**13. Tiempo de inferencia**

El modelo deberá evaluarse considerando también su tiempo de respuesta.

Se registrará:

* Tiempo promedio por predicción.
* Tiempo para procesar múltiples registros.
* Consumo aproximado de recursos.

El modelo deberá ser apto para responder solicitudes desde Backend sin demoras perceptibles.

**14. Criterios de aceptación**

El modelo será aprobado únicamente si cumple simultáneamente los siguientes criterios:

* Presenta estabilidad entre entrenamiento y prueba.
* No evidencia sobreajuste significativo.
* Mantiene un desempeño consistente entre las distintas clases.
* Puede integrarse con el Pipeline oficial.
* Es apto para ser exportado e integrado con Backend.

En caso contrario deberá revisarse la etapa correspondiente del proyecto.

**15. Registro de resultados**

Cada evaluación deberá registrar:

* Versión del modelo.
* Versión del Pipeline.
* Métricas obtenidas.
* Tiempo de evaluación.
* Conclusión técnica.

Esto permitirá mantener trazabilidad entre diferentes versiones del modelo.

**16. Organización del trabajo**

**Ricardo Chirinos – Ingeniería y Análisis de Datos**

Responsable de:

* Ejecutar la evaluación sobre el conjunto de prueba.
* Generar la matriz de confusión.
* Elaborar el reporte de clasificación.
* Documentar los resultados obtenidos.
* Preparar el informe técnico de evaluación.

**Jharle Compres – Machine Learning e Integración**

Responsable de:

* Analizar la estabilidad del modelo.
* Comparar resultados de entrenamiento y prueba.
* Detectar posibles casos de sobreajuste.
* Validar el tiempo de inferencia.
* Aprobar técnicamente el modelo para las siguientes etapas.

**17. Productos generados**

Al finalizar esta etapa deberán existir como mínimo:

* Reporte de métricas.
* Matriz de confusión.
* Reporte de clasificación.
* Resultados de validación cruzada.
* Informe de evaluación técnica.

Toda la documentación deberá almacenarse en:

reports/model\_evaluation/

**18. Dependencias con los siguientes capítulos**

Las conclusiones obtenidas en esta etapa serán utilizadas directamente en:

* Interpretación del Modelo.
* Exportación del Modelo.
* Integración con Backend.
* Diseño del JSON.
* FastAPI para pruebas.
* Dashboard de métricas.

Solo un modelo aprobado podrá avanzar hacia la etapa de interpretación y despliegue.

**19. Decisiones adoptadas para el resto del manual**

Las siguientes decisiones quedan establecidas como estándar para todos los capítulos posteriores:

* La evaluación oficial del modelo combinará **Accuracy**, **Precision**, **Recall**, **F1-Score**, matriz de confusión y reporte de clasificación; ninguna métrica será utilizada de forma aislada.
* El **F1-Score** será la métrica principal para comparar el desempeño del modelo, al ofrecer el mejor equilibrio entre Precision y Recall en un problema de clasificación multiclase.
* La validación del modelo incluirá obligatoriamente el análisis de los resultados obtenidos en **Stratified K-Fold Cross Validation** y la comparación entre entrenamiento y prueba para detectar sobreajuste.
* El modelo solo será aprobado si demuestra estabilidad, capacidad de generalización, tiempos de inferencia compatibles con el MVP y plena compatibilidad con el Pipeline oficial.
* Todos los resultados de evaluación deberán documentarse y almacenarse en reports/model\_evaluation/, formando parte del historial técnico del proyecto.
* Únicamente los modelos aprobados en esta etapa podrán continuar hacia los capítulos de Interpretación del Modelo, Exportación, Integración con Backend y despliegue del sistema.

**Capítulo 17 – Interpretación del Modelo**

**Objetivo**

Definir la metodología oficial para interpretar el comportamiento del modelo de Machine Learning, explicando cómo las variables de entrada influyen en la clasificación del perfil energético y garantizando que las predicciones sean comprensibles, auditables y justificables desde el punto de vista técnico y del negocio.

La interpretación será realizada sobre el modelo oficialmente aprobado en el capítulo anterior.

**1. Alcance**

Esta etapa comprende:

* Interpretación global del modelo.
* Interpretación de predicciones individuales.
* Análisis de importancia de variables.
* Validación de coherencia con las reglas de negocio.
* Identificación de posibles sesgos.
* Documentación de los resultados.

Esta etapa no modifica el modelo entrenado.

**2. Flujo oficial de interpretación**

La interpretación seguirá el siguiente flujo:

Carga del Pipeline entrenado

↓

Carga del modelo aprobado

↓

Análisis de importancia de variables

↓

Interpretación global

↓

Interpretación local

↓

Validación con reglas de negocio

↓

Análisis de consistencia

↓

Documentación técnica

**3. Principios generales**

Toda interpretación deberá cumplir los siguientes principios:

* Ser reproducible.
* Basarse en evidencia obtenida del modelo.
* Mantener consistencia con el comportamiento observado durante el EDA.
* Poder ser comprendida por el equipo de Backend y Frontend.
* Servir como base para las recomendaciones energéticas entregadas al usuario.

No se aceptarán conclusiones basadas únicamente en percepción o criterio personal.

**4. Interpretación global**

La interpretación global permitirá comprender cómo el modelo toma decisiones de forma general sobre todo el dataset.

Se analizarán:

* Variables más influyentes.
* Variables con menor aporte.
* Relaciones predominantes.
* Comportamientos generales del modelo.
* Coherencia con el conocimiento del dominio.

Este análisis servirá como referencia para todo el proyecto.

**5. Importancia de variables**

Se calculará la importancia de todas las variables predictoras.

Como mínimo se generará un ranking ordenado desde la variable con mayor contribución hasta la de menor impacto.

El análisis permitirá identificar:

* Variables críticas.
* Variables secundarias.
* Variables con aporte mínimo.
* Variables candidatas a ser eliminadas en futuras versiones.

La importancia deberá documentarse utilizando la técnica compatible con el algoritmo seleccionado.

**6. Interpretación de predicciones individuales**

Además del comportamiento global, se analizarán predicciones específicas.

Para cada registro evaluado se documentará:

* Variables que más influyeron en la clasificación.
* Sentido de la influencia.
* Intensidad de la contribución.
* Coherencia con los datos de entrada.

Este análisis facilitará la explicación de resultados al usuario final.

**7. Técnica oficial de interpretabilidad**

Como estándar del proyecto se utilizará:

SHAP (SHapley Additive exPlanations)

SHAP será la herramienta principal para:

* Explicar predicciones individuales.
* Explicar el comportamiento global.
* Analizar la contribución de cada variable.
* Facilitar la auditoría del modelo.

Si el algoritmo seleccionado presenta limitaciones técnicas con SHAP, se utilizará la técnica de importancia de variables nativa del modelo como mecanismo complementario.

**8. Validación con reglas de negocio**

Las conclusiones del modelo deberán ser coherentes con las reglas definidas para el proyecto.

Se verificará que:

* Mayores consumos energéticos no favorezcan clasificaciones eficientes sin justificación.
* Variables relacionadas con generación solar reflejen una influencia coherente.
* Hábitos de consumo intensivo incrementen la probabilidad de perfiles menos eficientes cuando corresponda.
* Las relaciones observadas sean consistentes con el objetivo del sistema.

Toda discrepancia deberá investigarse antes del despliegue.

**9. Detección de sesgos**

Se analizará la existencia de posibles sesgos derivados de:

* Distribución del dataset.
* Variables altamente dominantes.
* Desbalance entre clases.
* Correlaciones espurias.
* Características sintéticas del conjunto de datos.

Si se detectan sesgos relevantes, deberán documentarse junto con su posible impacto.

**10. Consistencia entre entrenamiento e inferencia**

Se verificará que las variables interpretadas durante el entrenamiento sean exactamente las mismas utilizadas durante la inferencia.

Se comprobará:

* Orden de variables.
* Transformaciones del Pipeline.
* Codificaciones.
* Escalamiento.
* Compatibilidad del modelo exportado.

No se permitirá interpretar variables que no formen parte del Pipeline oficial.

**11. Casos de estudio**

Se seleccionarán registros representativos de cada categoría de:

perfil\_energetico

Para cada uno se documentará:

* Valores de entrada.
* Predicción obtenida.
* Probabilidad asociada a cada clase.
* Variables con mayor influencia.
* Justificación técnica de la clasificación.

Estos casos servirán como referencia para las pruebas funcionales del sistema.

**12. Relación con el sistema de recomendaciones**

La interpretación del modelo será la base para construir las recomendaciones energéticas entregadas al usuario.

Las recomendaciones deberán derivarse de las variables con mayor influencia detectadas durante la interpretación.

Ejemplos:

* Alto consumo por ocupante.
* Uso intensivo de aire acondicionado.
* Baja eficiencia de iluminación.
* Escasa generación solar.
* Alta densidad de equipos eléctricos.

Backend utilizará esta información para generar mensajes personalizados.

**13. Restricciones**

Durante esta etapa queda prohibido:

* Modificar el modelo entrenado.
* Alterar el Pipeline.
* Cambiar variables de entrada.
* Reentrenar el modelo.
* Ajustar hiperparámetros.

La interpretación será exclusivamente analítica.

**14. Documentación técnica**

El informe de interpretación deberá incluir como mínimo:

* Resumen ejecutivo.
* Ranking de importancia de variables.
* Interpretación global.
* Interpretación de casos individuales.
* Validación con reglas de negocio.
* Posibles limitaciones.
* Conclusiones técnicas.

Este documento será utilizado por Backend y Frontend para comprender el funcionamiento del modelo.

**15. Organización del trabajo**

**Ricardo Chirinos– Ingeniería y Análisis de Datos**

Responsable de:

* Generar los análisis de importancia de variables.
* Elaborar los casos de estudio.
* Validar la coherencia con el conocimiento del dominio.
* Documentar los resultados obtenidos.
* Preparar el informe técnico de interpretación.

**Jharle Compres – Machine Learning e Integración**

Responsable de:

* Implementar SHAP o la técnica de interpretación correspondiente.
* Validar la consistencia entre Pipeline y modelo.
* Analizar posibles sesgos.
* Preparar la información necesaria para Backend.
* Aprobar técnicamente la interpretación del modelo.

**16. Productos generados**

Al finalizar esta etapa deberán existir como mínimo:

* Informe de interpretación del modelo.
* Ranking de importancia de variables.
* Análisis SHAP global.
* Análisis SHAP por observación.
* Casos de estudio documentados.
* Informe de validación de consistencia.

Toda la documentación deberá almacenarse en:

reports/model\_interpretation/

**17. Dependencias con los siguientes capítulos**

Los resultados obtenidos en esta etapa serán utilizados directamente en:

* Exportación del Modelo.
* Integración con Backend.
* Diseño del JSON.
* Contrato entre Ciencia de Datos y Backend.
* Dashboard.
* FastAPI para pruebas.

Backend utilizará esta información para construir respuestas interpretables y recomendaciones energéticas basadas en la predicción del modelo.

**18. Decisiones adoptadas para el resto del manual**

Las siguientes decisiones quedan establecidas como estándar para todos los capítulos posteriores:

* La interpretación oficial del modelo se realizará utilizando **SHAP** como técnica principal y la importancia nativa del algoritmo como mecanismo complementario cuando sea necesario.
* Toda recomendación energética mostrada al usuario deberá estar respaldada por las variables con mayor influencia identificadas durante la interpretación del modelo.
* Backend no generará recomendaciones mediante reglas independientes; utilizará la información derivada de la interpretación del modelo para mantener coherencia entre la predicción y las acciones sugeridas.
* Los casos de estudio elaborados en este capítulo serán la referencia oficial para validar el comportamiento del sistema durante las pruebas funcionales y de integración.
* Toda la documentación generada se almacenará en reports/model\_interpretation/ y constituirá la base técnica para explicar, auditar y mantener el modelo en futuras versiones del proyecto.
* A partir de este capítulo, cualquier modificación del modelo que altere significativamente la importancia de las variables requerirá repetir el proceso de interpretación antes de proceder con la exportación e integración.

**Capítulo 18 – Exportación del Modelo**

**Objetivo**

Definir el procedimiento oficial para exportar el modelo de Machine Learning aprobado junto con su Pipeline completo, garantizando que pueda ser utilizado por Backend exactamente bajo las mismas condiciones en las que fue entrenado, sin requerir transformaciones adicionales.

La exportación constituye el punto de transición entre el equipo de Ciencia de Datos y el equipo Backend.

**1. Alcance**

Esta etapa comprende:

* Exportación del Pipeline completo.
* Versionado del modelo.
* Organización de artefactos.
* Validación de integridad.
* Pruebas de carga del modelo.
* Documentación técnica para Backend.

No se exportarán componentes parciales del Pipeline.

**2. Flujo oficial de exportación**

El proceso seguirá el siguiente flujo:

Modelo aprobado

↓

Validación final

↓

Serialización del Pipeline

↓

Generación de metadatos

↓

Prueba de carga

↓

Prueba de inferencia

↓

Versionado

↓

Entrega al Backend

**3. Principios generales**

La exportación deberá cumplir los siguientes principios:

* Reproducibilidad.
* Compatibilidad entre entrenamiento e inferencia.
* Versionado.
* Integridad del Pipeline.
* Facilidad de integración.
* Trazabilidad.

Backend nunca reconstruirá el Pipeline.

**4. Elemento oficial a exportar**

El artefacto oficial del proyecto será:

Pipeline completo

El Pipeline incluirá:

* Preprocesamiento.
* Codificación.
* Escalamiento (cuando aplique).
* Feature Engineering.
* Modelo entrenado.

Queda prohibido exportar únicamente el algoritmo entrenado.

**5. Herramienta oficial de serialización**

Como estándar del proyecto se utilizará:

Joblib

No se utilizarán otros mecanismos de serialización salvo que exista una justificación técnica documentada.

**6. Estructura de almacenamiento**

Todos los artefactos exportados se almacenarán en:

models/

Con la siguiente estructura:

models/

├── model\_pipeline\_v1.joblib

├── metadata\_v1.json

├── training\_config\_v1.json

└── export\_log\_v1.json

**7. Versionado**

Cada exportación aprobada generará una nueva versión.

La nomenclatura oficial será:

model\_pipeline\_v1.joblib

model\_pipeline\_v2.joblib

model\_pipeline\_v3.joblib

Nunca se sobrescribirá una versión previamente aprobada.

**8. Metadatos obligatorios**

Cada versión exportada deberá incluir un archivo de metadatos con información como:

* Versión del modelo.
* Algoritmo utilizado.
* Versión del Pipeline.
* Versión del dataset.
* Número de variables.
* Variable Target.

Estos metadatos permitirán reproducir el modelo en el futuro.

**9. Configuración de entrenamiento**

Se exportará un archivo independiente con la configuración utilizada durante el entrenamiento.

Como mínimo contendrá:

* random\_state.
* División Train/Test.
* Estrategia de validación.
* Parámetros del algoritmo.
* Variables utilizadas.
* Variables descartadas.

Este archivo servirá para auditoría técnica.

**10. Validación de integridad**

Antes de aprobar una exportación se verificará que:

* El archivo pueda cargarse correctamente.
* El Pipeline esté completo.
* El modelo responda a nuevas predicciones.
* No existan errores de serialización.
* La salida sea consistente con la obtenida durante el entrenamiento.

Solo después de esta validación el modelo podrá entregarse al equipo Backend.

**11. Prueba de carga**

Cada artefacto exportado deberá superar una prueba de carga.

Se verificará:

* Tiempo de carga.
* Consumo de memoria.
* Compatibilidad con el entorno del proyecto.
* Integridad del Pipeline.

**12. Prueba de inferencia**

Una vez cargado el modelo se ejecutarán predicciones utilizando registros de prueba.

Se comprobará que:

* Las predicciones sean exitosas.
* Las probabilidades puedan calcularse cuando el algoritmo lo permita.
* Las clases devueltas pertenezcan al dominio oficial de perfil\_energetico.
* No existan diferencias respecto al modelo utilizado durante la evaluación.

**13. Compatibilidad con Backend**

El modelo exportado deberá permitir que Backend únicamente realice las siguientes acciones:

* Cargar el Pipeline.
* Recibir datos de entrada.
* Ejecutar predict().
* Ejecutar predict\_proba() cuando esté disponible.
* Construir la respuesta JSON.

Backend no aplicará transformaciones manuales sobre los datos recibidos.

**14. Restricciones**

Durante la exportación queda prohibido:

* Modificar el modelo entrenado.
* Reentrenar el algoritmo.
* Cambiar variables.
* Alterar el Pipeline.
* Editar manualmente los archivos exportados.

Toda modificación requerirá una nueva exportación oficial.

**15. Registro de exportación**

Cada exportación deberá generar un registro técnico con:

* Versión del modelo.

Este registro garantizará la trazabilidad de cada versión.

**16. Organización del trabajo**

**Ricardo Chirinos – Ingeniería y Análisis de Datos**

Responsable de:

* Validar la versión definitiva del modelo.
* Verificar la consistencia de los metadatos.
* Generar la documentación técnica.
* Registrar la versión aprobada.
* Preparar la entrega al equipo Backend.

**Jharle Compres – Machine Learning e Integración**

Responsable de:

* Exportar el Pipeline mediante Joblib.
* Ejecutar las pruebas de carga e inferencia.
* Validar la integridad del artefacto.
* Generar los archivos de configuración.
* Aprobar técnicamente la versión exportada.

**17. Productos generados**

Al finalizar esta etapa deberán existir como mínimo:

* Pipeline exportado (.joblib).
* Historial de versiones del modelo.

Toda la documentación deberá almacenarse en:

reports/model\_export/

**18. Dependencias con los siguientes capítulos**

Los artefactos generados en esta etapa serán utilizados directamente en:

* Integración con Backend.
* Diseño del JSON.
* Contrato entre Ciencia de Datos y Backend.
* Endpoints.
* FastAPI para pruebas.
* Docker.
* OCI.

A partir de este punto, Backend trabajará exclusivamente con el Pipeline exportado.

**19. Decisiones adoptadas para el resto del manual**

Las siguientes decisiones quedan establecidas como estándar para todos los capítulos posteriores:

* El único artefacto oficial entregado a Backend será el **Pipeline completo exportado mediante Joblib**, incluyendo todas las transformaciones y el modelo entrenado.
* Toda exportación deberá generar una nueva versión identificable, sin sobrescribir versiones anteriores, garantizando trazabilidad y posibilidad de reversión.
* Cada versión incluirá obligatoriamente un archivo de metadatos, un archivo con la configuración del entrenamiento y un registro de exportación para facilitar auditorías y mantenimiento.
* Ningún componente externo (Backend, FastAPI o Frontend) implementará transformaciones de datos; toda la lógica de preprocesamiento permanecerá encapsulada dentro del Pipeline exportado.
* Antes de ser entregado al equipo Backend, el Pipeline deberá superar satisfactoriamente las pruebas de carga, integridad e inferencia, demostrando que reproduce exactamente el comportamiento validado durante la etapa de evaluación.
* El Pipeline exportado se convierte en la única fuente autorizada para la integración, el despliegue y las futuras versiones del sistema, salvo que una nueva iteración del proyecto genere una versión superior siguiendo el mismo procedimiento.

## Capítulo 19 – Integración con Backend

### Objetivo

Definir la arquitectura oficial mediante la cual el modelo de Machine Learning se pone a disposición de Backend, garantizando que ningún componente externo reimplemente lógica que pertenece al Pipeline de Ciencia de Datos.

### 1. Alcance

Este capítulo define:

* La arquitectura de integración entre Ciencia de Datos y Backend.
* Las responsabilidades de cada equipo.
* La topología de despliegue.

No define (se desarrollan en capítulos posteriores):

* El esquema exacto del JSON de entrada/salida (Capítulo 20).
* El contrato formal Ciencia de Datos–Backend (Capítulo 21).
* Los endpoints específicos (Capítulo 22).
* La implementación del servicio FastAPI (Capítulo 25).

### 2. Principio arquitectónico oficial

El modelo entrenado (`model_pipeline_v3.joblib`) es un artefacto de Python y solo puede ejecutarse dentro de un proceso Python. Backend, desarrollado en Java Spring Boot, no puede cargar ni ejecutar este artefacto de forma nativa.

Se establece como arquitectura oficial:

> El modelo se expone como un **microservicio Python independiente**, accesible por Backend exclusivamente a través de una API REST (HTTP + JSON).

Se descarta, para esta etapa del proyecto, la exportación a formatos de ejecución nativa en Java (ONNX, PMML). Motivo: introducen una capa adicional de conversión numérica que representa una fuente de riesgo de inconsistencia entre el modelo entrenado y el modelo ejecutado — el mismo tipo de riesgo ya identificado y corregido en el Capítulo 18. Esta decisión puede revisarse en una fase posterior si el rendimiento de red del microservicio resulta insuficiente.

### 3. Extensión del principio del Pipeline auto-contenido

El Capítulo 18 estableció que ningún componente externo implementará transformaciones de datos. Este principio se extiende explícitamente a la integración con Backend:

* Backend nunca ejecutará feature engineering, codificación ni escalamiento.
* Backend nunca reconstruirá el Pipeline ni sus columnas.
* Backend entrega únicamente los datos crudos capturados por el formulario; toda transformación ocurre dentro de `model_pipeline_v3.joblib`.

### 4. Responsabilidades por equipo

| Equipo | Responsabilidad |
| --- | --- |
| Ciencia de Datos | Entrenar, validar, exportar y servir el modelo (microservicio Python). Documentar el contrato de datos. |
| Backend (Java Spring Boot) | Recibir el formulario, invocar el microservicio vía HTTP, persistir resultados, aplicar lógica de negocio. |
| Frontend | Capturar los datos del formulario y mostrar el resultado (nivel, confianza, recomendaciones). |

### 5. Topología de integración

Ver diagrama. Frontend envía el formulario a Backend; Backend reenvía el JSON de 12 campos crudos al microservicio ML; el microservicio ejecuta `predict_proba()` sobre el Pipeline completo y responde con nivel, confianza y probabilidades por clase (contrato definido en la sesión de trabajo previa a este capítulo). La respuesta recorre el mismo camino en sentido inverso hasta llegar a Frontend.

### 6. Dependencias

Este capítulo es prerrequisito de: Diseño del JSON (Cap. 20), Contrato Ciencia de Datos–Backend (Cap. 21), Endpoints necesarios (Cap. 22), FastAPI para pruebas (Cap. 25).

### 7. Producto generado

* Definición formal de la arquitectura de integración (este capítulo).

* Diagrama de topología del sistema.

## Capítulo 20 – Diseño del JSON

### Objetivo

Formalizar la estructura, tipos de datos y reglas de validación de los mensajes JSON que circulan entre Frontend, Backend y el microservicio ML, estableciendo un estándar único que evite ambigüedad de interpretación entre equipos.

### 1. Alcance

* Esquema del JSON de entrada (solicitud de predicción).

* Esquema del JSON de salida (respuesta exitosa).
* Esquema del JSON de error.
* Reglas de validación y manejo de valores inválidos.
* Convenciones de nomenclatura.

No define (se desarrolla en capítulos posteriores):

* Las rutas y métodos HTTP exactos (Capítulo 22 — Endpoints).
* Las obligaciones formales y responsabilidades entre equipos (Capítulo 21 — Contrato).

### 2. Convenciones de nomenclatura

* `snake_case` en todas las claves, sin excepción.

* Los nombres de campo del JSON de entrada son idénticos a los nombres de columna del dataset crudo de origen — trazabilidad directa entre lo que Frontend captura y lo que Ciencia de Datos entrenó.
* Sin abreviaturas no evidentes (`antiguedad_construccion_anios`, no `ant_constr_anios`).
* Los valores de tipo enum (dropdowns) se transmiten como texto plano, nunca como códigos numéricos ni como nombres de columna codificada (ver Capítulo 19, principio del Pipeline auto-contenido).

### 3. Esquema del JSON de entrada

| Campo | Tipo | Formato / Valores permitidos | Obligatorio |
| --- | --- | --- | --- |
| `tipo_inmueble` | string (enum) | `Apartamento` / `Casa Unifamiliar` / `Pequeño Establecimiento Comercial` | Sí |
| `superficie_m2` | number (float) | ≥ 0 | Sí |
| `num_personas` | integer | ≥ 1 | Sí |
| `cantidad_equipos_total` | integer | ≥ 0 | Sí |
| `horas_uso_aa_dia` | number (float) | 0 a 24 | Sí |
| `consumo_kwh_mensual` | number (float) | ≥ 0 | Sí |
| `consumo_kwh_mes_anterior` | number (float) | ≥ 0 | Sí |
| `aislamiento_termico` | string (enum) | `Bueno` / `Malo` / `Regular` | Sí |
| `pct_iluminacion_led` | number (float) | 0 a 100 | Sí |
| `antiguedad_construccion_anios` | number (float) | ≥ 0 | Sí |
| `zona` | string (enum) | `Suburbana` / `Urbana Costera` / `Urbana Interior` | Sí |
| `antiguedad_electrodomesticos_anios` | number (float) | ≥ 0 | Sí |

No hay campos opcionales en esta versión: los 12 son obligatorios porque los 55 features del modelo dependen de todos ellos (Capítulo 19, sección 3).

### 4. Esquema del JSON de salida (respuesta exitosa)

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

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `nivel` | string (enum) | Clase predicha: `Eficiente` / `Ineficiente` / `Moderado` |
| `confianza_pct` | number (float) | Probabilidad de la clase predicha, en escala 0-100, redondeada a 1 decimal |
| `probabilidades` | object | Probabilidad de cada una de las 3 clases, mismo formato que `confianza_pct` |

### 5. Esquema del JSON de error

```json
{
  "error": {
    "codigo": "CAMPO_INVALIDO",
    "mensaje": "El campo 'zona' debe ser uno de: Suburbana, Urbana Costera, Urbana Interior",
    "campo": "zona"
  }
}
```

| Código | HTTP status | Cuándo ocurre |
| --- | --- | --- |
| `CAMPO_FALTANTE` | 400 | Falta uno de los 12 campos obligatorios |
| `CAMPO_INVALIDO` | 400 | Un enum no coincide con ninguno de los valores permitidos, o un tipo de dato no corresponde |
| `VALOR_FUERA_DE_RANGO` | 400 | Un campo numérico está fuera del rango definido en la sección 3 (ej. `pct_iluminacion_led` > 100) |
| `ERROR_INTERNO_MODELO` | 500 | Falla inesperada al ejecutar el Pipeline (no debería ocurrir si la validación previa pasó) |

El campo `campo` en el error solo aparece cuando el error es atribuible a un campo específico (`CAMPO_FALTANTE`, `CAMPO_INVALIDO`, `VALOR_FUERA_DE_RANGO`); se omite en `ERROR_INTERNO_MODELO`.

### 6. Reglas de validación

* La validación de tipos, enums y rangos ocurre en el microservicio ML (vía Pydantic, Capítulo 25), no en Backend — consistente con el principio de que toda lógica relacionada con el modelo vive en un único lugar.

* Los valores de enum son sensibles a mayúsculas/minúsculas y tildes; no se aplica normalización automática (ver advertencia del Capítulo 19 sobre categorías desconocidas degradando la predicción).
* Backend puede aplicar validaciones adicionales de negocio (ej. límites de superficie razonables) antes de reenviar, pero nunca sustituye la validación del microservicio.

### 7. Versionado

El esquema de entrada está atado a la versión del modelo (`v3`). Si una futura versión del modelo requiere campos adicionales o distintos, se define un nuevo esquema versionado y ambas versiones coexisten temporalmente a través del versionado de endpoint (Capítulo 22) — nunca se modifica el esquema `v3` de forma retroactiva.

### 8. Producto generado

* Esquema JSON de entrada (formal, sección 3).

* Esquema JSON de salida (formal, sección 4).
* Esquema JSON de error (formal, sección 5) — producto nuevo, no existía antes de este capítulo.
* Tabla de códigos de error.

## Capítulo 21 – Contrato entre Ciencia de Datos y Backend

### Objetivo

Formalizar los compromisos, garantías y procedimientos de cambio entre el equipo de Ciencia de Datos y el equipo de Backend, de modo que ambos puedan desarrollar de forma independiente sin bloquearse mutuamente, y que cualquier incumplimiento sea detectable y atribuible.

### 1. Alcance

Este capítulo define:

* Qué garantiza Ciencia de Datos.
* Qué garantiza Backend.
* El procedimiento de cambio de versión del modelo.
* Las pruebas de aceptación previas a la integración.
* El manejo de incidentes y fallos del microservicio.

No define (se desarrolla en capítulos posteriores):

* Las rutas HTTP exactas (Capítulo 22 — Endpoints).
* La implementación técnica del servicio (Capítulo 25 — FastAPI).
* El monitoreo en producción (Capítulo 26 — OCI).

### 2. Partes del contrato

| Parte | Responsable |
| --- | --- |
| Ciencia de Datos / ML | Jharle Compres |
| Ingeniería y Análisis de Datos | Ricardo Chirinos |
| Backend | Equipo de Backend (Java Spring Boot) |

### 3. Garantías de Ciencia de Datos

Ciencia de Datos se compromete a:

1. Mantener `model_pipeline_v3.joblib` como artefacto **auto-contenido** (Capítulo 18/19) — Backend nunca necesita implementar transformaciones.
2. No modificar el esquema JSON de una versión ya publicada (Capítulo 20) sin pasar por el procedimiento de cambio de versión (sección 6).
3. Documentar toda nueva versión del modelo con `metadata_vN.json`, `training_config_vN.json` y `export_log_vN.json` (Capítulo 18).
4. Notificar a Backend con antelación razonable ante cualquier cambio de contrato (campos nuevos, cambio de rango, cambio de enum).
5. Proveer un entorno de pruebas (Capítulo 25 — FastAPI local) antes de solicitar integración en Backend.

### 4. Garantías de Backend

Backend se compromete a:

1. Enviar exclusivamente los 12 campos definidos en el Capítulo 20, con los tipos y formatos exactos — sin transformar, redondear, ni recodificar valores antes de enviarlos.
2. Enviar los valores de enum como texto plano idéntico al especificado (mayúsculas, espacios, sin normalización propia).
3. Interpretar y manejar los 4 códigos de error del Capítulo 20 de forma explícita (no tratarlos como un error genérico).
4. Implementar timeout y reintento ante fallos de red hacia el microservicio (política de reintento a definir en el Capítulo 22).
5. No persistir ni exponer `probabilidades` o `confianza_pct` de forma que sugiera precisión estadística no garantizada (evitar decimales artificiales en la UI, por ejemplo).

### 5. Pruebas de aceptación

Antes de que Backend integre una versión del modelo en un ambiente distinto al local, deben pasar:

* [ ] El microservicio responde `200 OK` con el esquema exacto del Capítulo 20 ante un payload válido.
* [ ] El microservicio responde con el código de error correcto ante cada uno de los 4 escenarios de error (Capítulo 20, sección 5).
* [ ] Las probabilidades devueltas suman 100% (± tolerancia de redondeo).
* [ ] Los resultados de un lote de prueba conocido coinciden con las predicciones documentadas en `reports/model_interpretation/` (validación de no-regresión).

### 6. Procedimiento de cambio de versión

1. Ciencia de Datos publica la nueva versión (`vN`) junto con sus 4 artefactos de metadatos.
2. Ciencia de Datos documenta explícitamente las diferencias respecto a la versión anterior (campos agregados/eliminados, cambios de rango).
3. Ambas versiones (`vN-1` y `vN`) coexisten en el microservicio durante un período de transición (mecanismo exacto: Capítulo 22).
4. Backend migra y confirma las pruebas de aceptación (sección 5) sobre `vN` antes de que Ciencia de Datos retire `vN-1`.
5. Ninguna versión se retira sin confirmación explícita de Backend.

### 7. Manejo de incidentes

* Si el microservicio no responde o responde `ERROR_INTERNO_MODELO`, Backend no debe bloquear el flujo del usuario — debe aplicar una respuesta de contingencia definida por Backend (ej. "resultado no disponible temporalmente"), nunca inventar un nivel o confianza.

* Ciencia de Datos es responsable de investigar y resolver la causa raíz cuando el error se origina en el modelo.

### 8. Pendiente de definición

* SLA de tiempo de respuesta: aún no se ha medido el rendimiento del microservicio bajo carga — se definirá con evidencia una vez completado el Capítulo 25 (pruebas locales) y el Capítulo 26 (despliegue en OCI). No se establece un número aquí para evitar comprometer una cifra sin datos.

### 9. Producto generado

* Este documento de contrato.

* Checklist de pruebas de aceptación (sección 5), reutilizable en cada nueva versión del modelo.

## Capítulo 22 – Endpoints necesarios

### Objetivo

Especificar las rutas HTTP concretas del microservicio ML: método, formato de entrada/salida, códigos de estado, y el mecanismo de versionado que permite la coexistencia de versiones del modelo acordada en el Capítulo 21.

### 1. Alcance

* Listado completo de endpoints del microservicio.

* Mecanismo de versionado de la API.
* Códigos de estado HTTP por escenario.
* Alcance explícito de lo que NO se expone en esta etapa.

No define (se desarrolla en capítulos posteriores):

* La implementación del código (Capítulo 25 — FastAPI).
* El empaquetado y despliegue (Capítulos 26-27 — OCI y Docker).

### 2. Mecanismo de versionado

Versionado por **ruta**, no por header ni por parámetro de query — es explícito, cacheable, y visible en cualquier log sin inspeccionar headers:

/api/{version}/{recurso}

Ejemplo: `/api/v3/predict`. Cuando exista una versión `v4` del modelo, coexiste en `/api/v4/predict` durante el período de transición del Capítulo 21, sección 6 — nunca se reemplaza `v3` en el mismo path.

### 3. Endpoints

| Método | Ruta | Propósito | Request | Response exitosa |
| --- | --- | --- | --- | --- |
| `GET` | `/api/v3/health` | Verifica que el servicio está vivo y el Pipeline cargado en memoria | — | `{"status": "ok", "version": "v3"}` |
| `GET` | `/api/v3/info` | Expone metadata del modelo activo, para que Backend confirme qué versión está corriendo | — | Contenido de `metadata_v3.json` (Capítulo 18) |
| `POST` | `/api/v3/predict` | Ejecuta la predicción sobre un registro | Esquema de entrada (Capítulo 20, sección 3) | Esquema de salida (Capítulo 20, sección 4) |

Explícitamente **fuera de alcance** en esta versión (no se construyen ahora, para no sobredimensionar el MVP):

* Endpoint de predicción por lotes (`/predict/batch`) — el formulario es de un registro a la vez; se evalúa solo si surge una necesidad real.
* Endpoint de reentrenamiento o actualización de modelo vía API — el reentrenamiento ocurre en los notebooks (Capítulos 1-18), nunca en producción.

### 4. `GET /api/v3/health`

Uso previsto: *liveness probe* de Docker/OCI (Capítulos 26-27) y verificación manual de Backend antes de enviar tráfico real.

Respuesta:

```json
{"status": "ok", "version": "v3"}
```

No requiere autenticación. Responde en menos de lo que tarda cargar el proceso — no ejecuta el Pipeline, solo confirma que está en memoria.

### 5. `GET /api/v3/info`

Uso previsto: que Backend pueda loggear o mostrar en un panel interno qué versión del modelo está sirviendo en un momento dado, sin tener que coordinarlo manualmente con Ciencia de Datos.

Respuesta: el contenido de `metadata_v3.json` tal cual (clases, cantidad de features, métricas de test, librerías) — un solo lugar de verdad, sin duplicar esa información a mano en el código del endpoint.

### 6. `POST /api/v3/predict`

El endpoint principal. Recibe el JSON de 12 campos (Capítulo 20, sección 3) y devuelve el JSON de salida (Capítulo 20, sección 4) o de error (Capítulo 20, sección 5).

**Códigos de estado HTTP:**

| Código HTTP | Cuándo | Cuerpo de la respuesta |
| --- | --- | --- |
| `200 OK` | Predicción exitosa | Esquema de salida (Cap. 20, sec. 4) |
| `400 Bad Request` | `CAMPO_FALTANTE`, `CAMPO_INVALIDO` o `VALOR_FUERA_DE_RANGO` | Esquema de error (Cap. 20, sec. 5) |
| `500 Internal Server Error` | `ERROR_INTERNO_MODELO` | Esquema de error (Cap. 20, sec. 5) |

No hay código `404` aplicable a este endpoint (la ruta es fija); un `404` real solo ocurriría si Backend llama a una versión de API que no existe (ej. `/api/v9/predict`), lo cual es un error de configuración de Backend, no un caso de negocio a documentar aquí.

### 7. Documentación interactiva

FastAPI genera automáticamente documentación interactiva de estos 3 endpoints (`/docs` y `/redoc`) a partir del esquema Pydantic — se aprovechará en el Capítulo 25 en vez de mantener una documentación manual duplicada que pueda desincronizarse del código real.

### 8. Producto generado

* Tabla de endpoints (sección 3), lista para implementar en el Capítulo 25.

* Mecanismo de versionado formalizado — cierra el pendiente del Capítulo 21, sección 6.

## Capítulo 23 – KPIs

### Objetivo

Definir los indicadores que permiten monitorear la salud del modelo y del sistema en producción, distinguiendo entre lo que se puede medir directamente (uso, latencia, errores) y lo que solo se puede aproximar por ausencia de retroalimentación con la realidad (calidad predictiva).

### 1. Alcance

* KPIs de calidad del modelo (proxy, sin ground truth).

* KPIs de uso y producto.
* KPIs de sistema y disponibilidad.
* Frecuencia de medición y umbrales de alerta.
* Limitación estructural: ausencia de feedback loop.

No define (se desarrolla en capítulos posteriores):

* La visualización de estos indicadores (Capítulo 24 — Dashboard).
* La infraestructura de métricas/logging en OCI (Capítulo 26).

### 2. KPIs de calidad del modelo (proxy)

Como no hay etiqueta real disponible en producción, estos KPIs no miden "aciertos" — miden **desviación respecto al comportamiento observado durante el entrenamiento**. Una desviación grande es una alerta de posible *data drift*, no una medición directa de error.

| KPI | Línea base (de entrenamiento) | Qué señala una desviación |
| --- | --- | --- |
| Distribución de clases predichas | Eficiente 34.97% / Ineficiente 30.16% / Moderado 34.87% (Capítulo 6) | Si la proporción de una clase se dispara o desaparece, el perfil de usuarios reales difiere del dataset de entrenamiento |
| Confianza promedio de predicción (`confianza_pct`) | A establecer con el primer lote real de producción — no se fija un número sin datos | Una caída sostenida sugiere que el modelo enfrenta casos cada vez más ambiguos o fuera de su distribución de entrenamiento |
| % de predicciones con confianza < 50% | A establecer con el primer lote real | Volumen alto sugiere revisar si el formulario captura bien la realidad del usuario, o si el modelo necesita reentrenamiento |
| Rango de valores de entrada por campo | Rango observado en `03_feature_engineering.csv` por campo (Capítulo 6) | Valores sistemáticamente fuera de rango (ej. `superficie_m2` muy por encima del máximo visto en entrenamiento) indican una población de usuarios distinta a la entrenada |

### 3. KPIs de uso y producto

| KPI | Descripción |
| --- | --- |
| Cantidad de predicciones por día/semana | Adopción del sistema |
| Tasa de finalización del formulario | Usuarios que completan los 12 campos vs. los que abandonan — mide fricción del formulario, no del modelo |
| Distribución de recomendaciones generadas | Qué categorías (Capítulo 17 — Alto consumo por ocupante, Aislamiento deficiente, etc.) se disparan con más frecuencia — insumo útil para priorizar mejoras del producto |
| % de predicciones tipo ALERTA vs. OPORTUNIDAD | Del sistema de recomendaciones de dos niveles (Capítulo 17) — una proporción muy desbalanceada hacia ALERTA podría indicar que el umbral necesita recalibrarse con datos reales, igual que se recalibró para la clase Moderado durante el desarrollo |

### 4. KPIs de sistema y disponibilidad

| KPI | Descripción |
| --- | --- |
| Disponibilidad del endpoint `/api/v3/health` | Uptime del microservicio (Capítulo 22) |
| Latencia de `/api/v3/predict` (p50 / p95 / p99) | Tiempo de respuesta real — pendiente de primera medición (Capítulo 21, sección 8) |
| Tasa de errores por código | Proporción de `200` vs `400` vs `500` — un aumento sostenido de `400` sugiere un problema de validación en Frontend/Backend, no del modelo; un aumento de `500` sí es responsabilidad de Ciencia de Datos |

### 5. Frecuencia de medición

| KPI | Frecuencia sugerida |
| --- | --- |
| Distribución de clases predichas, confianza promedio | Semanal (volumen bajo esperado en un MVP recién lanzado; diario sería ruido, no señal) |
| Uso y producto | Diario |
| Sistema y disponibilidad | Tiempo real / continuo (vía health checks) |

### 6. Limitación estructural: sin feedback loop

Ninguno de los KPIs de la sección 2 mide error real, porque el sistema **no tiene un mecanismo para capturar la clase verdadera** después de la predicción (ej. una factura real posterior, o una confirmación del usuario). Esto es una limitación de producto, no del modelo:

* Sin este mecanismo, no es posible calcular un F1 o accuracy "en producción" — solo proxies de drift.
* Se recomienda evaluar, como trabajo futuro, capturar una señal de retroalimentación mínima (ej. "¿esta clasificación te parece correcta? Sí/No" en el Frontend) para habilitar monitoreo de calidad real. No se implementa en esta etapa por estar fuera del alcance del MVP.

### 7. Producto generado

* Catálogo de KPIs por categoría (secciones 2-4).

* Líneas base cuantitativas donde existen (distribución de clases); marcadas explícitamente como pendientes donde no hay datos de producción todavía.
* Documentación de la limitación de feedback loop, como insumo para decisiones de producto futuras.

## Capítulo 24 – Dashboard

### Objetivo

Definir la herramienta, estructura y fuente de datos del dashboard de monitoreo interno, que visualiza los KPIs definidos en el Capítulo 23 para Ciencia de Datos y Producto.

### 1. Alcance

* Selección de herramienta y justificación.

* Audiencia y propósito.
* Estructura de secciones, alineada 1 a 1 con las categorías de KPIs del Capítulo 23.
* Fuente de datos requerida y su estado actual (pendiente vs. disponible).

No define (fuera de alcance de este capítulo):

* La UI de resultado que ve el usuario final del formulario (eso es Frontend, Capítulo 19) — este dashboard es una herramienta interna, no un producto para el cliente.
* La infraestructura de despliegue del dashboard (Capítulo 26 — OCI).

### 2. Audiencia y propósito

Herramienta interna para Ciencia de Datos y Producto. No es un dashboard de cliente final ni reemplaza al Frontend del formulario (Capítulo 19). Propósito: detectar *drift*, problemas de disponibilidad y patrones de uso antes de que se conviertan en incidentes reportados por Backend o por usuarios.

### 3. Herramienta seleccionada: Streamlit

Se elige **Streamlit** sobre alternativas (Power BI, Grafana, Metabase) por consistencia con el resto del stack de Ciencia de Datos:

* Mismo lenguaje (Python) que el resto del proyecto — sin curva de aprendizaje adicional para el equipo.
* Puede leer directamente los artefactos ya generados (`reports/`, `models/metadata_v3.json`) sin una capa de integración extra.
* Suficiente para el volumen de un MVP recién lanzado (Capítulo 23, sección 5 — frecuencias semanal/diaria, no tiempo real de alto volumen).
* Se descarta Grafana/Power BI en esta etapa por requerir infraestructura de métricas (Prometheus, conectores) que no existe todavía — se reevalúa si el proyecto escala más allá del MVP.

### 4. Estructura del dashboard

**Sección A — Calidad del modelo (proxy)**

* Gráfico de distribución de clases predichas (período actual) vs. línea base de entrenamiento (Capítulo 23, sección 2).
* Serie de tiempo: confianza promedio de predicción por semana.
* Serie de tiempo: % de predicciones con confianza < 50%.
* Indicador visual de alerta cuando cualquiera de los dos anteriores se desvía más de 2 desviaciones estándar de su propio histórico (umbral a calibrar con los primeros datos reales, no con un número inventado ahora).

**Sección B — Uso y producto**

* Predicciones por día/semana (conteo).
* Distribución de categorías de recomendación disparadas (Capítulo 17).
* Proporción de mensajes tipo ALERTA vs. OPORTUNIDAD (Capítulo 17, sección de corrección de Moderado).

**Sección C — Sistema y disponibilidad**

* Estado actual de `/api/v3/health` (Capítulo 22).
* Latencia p50/p95/p99 de `/api/v3/predict`.
* Tasa de errores por código (`400` vs `500`), diferenciando origen (validación vs. modelo) según el Capítulo 20, sección 5.

**Sección D — Referencia del modelo (estática)**

* Ranking global de importancia SHAP (Capítulo 17) y métricas de test del modelo activo, leídas directamente de `reports/model_interpretation/` y `models/metadata_v3.json` — contexto de referencia, no recalculado en cada carga del dashboard (SHAP es costoso computacionalmente, Capítulo 17).

### 5. Fuente de datos — dependencia pendiente

Las secciones A, B y C requieren un **registro histórico de predicciones** (input, output, timestamp, código de respuesta, latencia) que **todavía no existe** en ningún capítulo anterior. Sin esto, el dashboard no tiene datos que mostrar más allá de la Sección D.

Se deja como requisito explícito para el Capítulo 25: el microservicio FastAPI debe registrar cada predicción (éxito o error) en un almacenamiento consultable — la decisión de mecanismo concreto (archivo estructurado, SQLite, base de datos) se toma en ese capítulo, no aquí, porque depende de decisiones de implementación que todavía no se han tomado.

### 6. Producto generado

* Especificación de estructura del dashboard (secciones A-D).

* Justificación de herramienta (Streamlit).
* Requisito de logging de predicciones, formalizado como dependencia del Capítulo 25.
