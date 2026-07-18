# **Capítulo 01 – Arquitectura General del Proyecto**

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

### **Analista A – Ingeniería y Análisis de Datos**

Responsable de:

* Proponer mejoras basadas en el análisis de datos.
* Evaluar el impacto de nuevas variables.
* Validar la calidad del dataset antes de cada entrenamiento.
* Documentar los experimentos realizados.
* Verificar que las transformaciones mantengan coherencia con el problema definido.

### **Analista B – Machine Learning e Integración**

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

**Objetivo**

Definir la metodología oficial para obtener el conjunto de datos que utilizará el proyecto, documentando el proceso de investigación, la justificación técnica para la construcción de un dataset sintético, el procedimiento de generación de datos y los estándares que garantizarán la calidad y trazabilidad del dataset durante todo el ciclo de desarrollo.

Las decisiones establecidas en este capítulo serán utilizadas en todos los procesos posteriores de validación, EDA, limpieza, ingeniería de variables, entrenamiento e integración.

**1. Estrategia de obtención de datos**

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

**2. Decisión técnica del proyecto**

Se adopta como decisión oficial la construcción de un **dataset sintético de alta fidelidad**, diseñado específicamente para representar el comportamiento energético de viviendas y pequeños establecimientos.

Esta decisión permitirá:

* Representar exactamente el problema definido por el hackathon.
* Controlar la calidad y consistencia de los datos.
* Incorporar variables relevantes para el modelo.
* Simular escenarios reales de consumo.
* Introducir problemas de calidad para validar el proceso de limpieza.
* Garantizar la reproducibilidad del proyecto.

A partir de este capítulo, el dataset sintético será considerado el **dataset oficial del proyecto**.

**3. Objetivo del dataset**

El dataset deberá representar una observación individual por registro.

Cada registro describirá el comportamiento energético de una única vivienda o pequeño establecimiento durante un período mensual.

El conjunto de datos deberá contener información suficiente para:

* Analizar patrones de consumo.
* Identificar perfiles energéticos.
* Construir variables derivadas.
* Entrenar un modelo supervisado.
* Generar recomendaciones.
* Estimar impactos económicos asociados al consumo energético.

**4. Metodología de construcción**

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

**5. Principios de construcción**

Durante la generación del dataset deberán cumplirse los siguientes principios:

* Cada registro deberá representar un escenario técnicamente posible.
* Las variables deberán mantener coherencia entre sí.
* Las distribuciones deberán aproximarse a comportamientos observables.
* Las relaciones entre variables deberán reflejar dependencia lógica cuando corresponda.
* No se permitirán combinaciones físicamente imposibles.

**6. Diseño de variables**

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

**7. Construcción del Target**

El dataset será generado incluyendo desde su origen la variable objetivo.

La clasificación energética será determinada mediante reglas definidas durante la construcción del dataset y no mediante asignaciones aleatorias.

La variable objetivo oficial será:

perfil\_energetico

Las categorías permitidas serán únicamente:

Eficiente

Moderado

Ineficiente

No se utilizarán categorías adicionales durante el MVP.

**8. Generación de escenarios**

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

**9. Incorporación controlada de problemas de calidad**

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

**10. Tamaño del dataset**

El dataset deberá contener un volumen suficiente para:

* Realizar análisis exploratorio.
* Aplicar técnicas de limpieza.
* Ejecutar ingeniería de variables.
* Entrenar modelos supervisados.
* Evaluar métricas de forma confiable.

El número definitivo de registros será fijado antes de iniciar el EDA y permanecerá constante durante todo el proyecto, salvo la creación de nuevas versiones documentadas del dataset.

**11. Versionado del dataset**

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

**12. Organización del trabajo**

**Analista A – Ingeniería y Análisis de Datos**

Responsable de:

* Diseñar la estructura del dataset.
* Definir las variables.
* Construir las reglas de generación.
* Validar la coherencia de los registros.
* Generar el dataset crudo.
* Documentar el proceso de construcción.

**Analista B – Machine Learning e Integración**

Responsable de:

* Validar que el dataset sea adecuado para entrenamiento.
* Revisar la distribución del Target.
* Verificar compatibilidad con el Pipeline.
* Detectar posibles riesgos para el modelado.
* Aprobar la versión oficial que será utilizada en los experimentos.

**13. Almacenamiento del dataset**

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

**14. Dependencias con los siguientes capítulos**

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

**15. Decisiones adoptadas para el resto del manual**

Las siguientes decisiones quedan establecidas como estándar para todos los capítulos posteriores:

* El proyecto utilizará **un dataset sintético de alta fidelidad** como fuente oficial de datos, debido a la inexistencia de un conjunto de datos público que represente íntegramente el problema del hackathon.
* El dataset será construido mediante una metodología basada en reglas de negocio y relaciones lógicas entre variables, evitando la generación aleatoria sin restricciones.
* Cada registro representará **una única vivienda o pequeño establecimiento** correspondiente a un período mensual de análisis.
* La variable objetivo oficial será **perfil\_energetico**, con las categorías **Eficiente**, **Moderado** e **Ineficiente**, las cuales permanecerán invariables durante el resto del proyecto.
* El dataset incluirá de forma intencional problemas controlados de calidad para validar los procesos de limpieza y preparación de datos documentados en capítulos posteriores.
* Se mantendrá un sistema de versionado que preserve el dataset crudo y todas las versiones procesadas, garantizando trazabilidad y reproducibilidad.
* Todas las actividades de análisis, entrenamiento, evaluación e integración se realizarán exclusivamente sobre las versiones oficiales del dataset definidas en este capítulo.