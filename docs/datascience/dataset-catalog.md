# Catálogo y Evaluación Técnico-Arquitectónica de Bases de Datos
**Proyecto:** Framework de Eficiencia Energética (Hackathon ONE)  
**Equipo:** G9 - Ciencia de Datos  

## 1. Resumen Ejecutivo
Este documento consolida la fundamentación técnica, la arquitectura de ingesta y la evaluación de los repositorios científicos oficiales consultados para diseñar el modelo de clasificación y perfilamiento de eficiencia energética. El objetivo primordial fue estructurar un ecosistema de datos híbrido que caracterice el consumo territorial por segmento y resuelva de manera nativa las 5 variables obligatorias del esquema de entrada JSON del Back-End (`consumo_kwh`, `uso_horario_pico`, `cantidad_equipos`, `tipo_inmueble` y `horas_alto_consumo`). Para garantizar el preprocesamiento, la ingeniería de características y la imputación de variables no telemétricas, la arquitectura combina telemedición horaria de alta densidad, inventarios arquitectónicos, estadísticas regulatorias chilenas y generación de datos sintéticos.

---

## 2. Bases de Datos Core (Núcleo Principal y Algorítmico)

> **Nota de Arquitectura y Datos Sintéticos:** Para el desarrollo de la solución, estas fuentes funcionan como la matriz fundamental del pipeline analítico. Al comprender que un contador telemétrico general mide corriente en el tiempo pero es ciego respecto a la densidad interna de electrodomésticos, nuestra matriz se enriquece y completa mediante la **generación controlada de datos sintéticos (Monte Carlo / CTGAN)**. Esto permite equilibrar clases, simular extremos operativos y mantener la coherencia física y estadística de la red eléctrica local.

### 2.1 Mapeo Estructural con el Esquema de Entrada (JSON del Modelo)
Para alimentar directamente el contrato de interfaz JSON del MVP, el núcleo algorítmico transforma y cruza las tablas primarias mediante las siguientes lógicas:
* **`consumo_kwh` (Ej. 420):** Se integra mediante la suma volumétrica de las lecturas continuas horarias (`meter_reading`) provenientes de las series temporales de telemedición, estandarizando el consumo resultante con la media territorial chilena.
* **`uso_horario_pico` (Ej. true):** Se calcula mediante una evaluación condicional sobre la variable cronológica (`timestamp`). El algoritmo evalúa si la demanda de la curva horaria entre las 18:00 y las 22:00 horas supera el promedio operativo de referencia del establecimiento.
* **`horas_alto_consumo` (Ej. 8):** Aprovechando el muestreo cronológico de la matriz de telemedición, se extrae el percentil 75 ($P_{75}$) de la distribución de carga de cada inmueble y se cuenta el número entero de horas al día que operan por encima de dicho umbral de estrés.
* **`tipo_inmueble` (Ej. "Casa"):** Se mapea de forma nativa desde las tablas de inventario y metadatos arquitectónicos mediante la variable categórica de uso de suelo (`primaryspaceusage` / `building_type`) y homologación con categorías tarifarias locales.
* **`cantidad_equipos` (Ej. 10):** Al ser una variable ciega para los medidores generales de red, se imputa analíticamente utilizando distribuciones tabulares auxiliares que cuentan con el inventario de artefactos (`Appliances Used`), acopladas a nuestro motor de datos sintéticos.

### 2.2 Building Data Genome Project 2 / ASHRAE (BUDS Lab - NUS)
* **Descripción:** Macro-repositorio científico oficial publicado en *Nature Scientific Data* por el *Building and Urban Data Science Lab* de la Universidad Nacional de Singapur. El modelo ingiere dos estructuras del estudio: la matriz de inventario (`metadata.csv`), que cataloga los atributos y metadatos del inmueble, y la matriz de telemedición horaria limpia (`data/meters/cleaned/electricity_cleaned.csv`), que registra el consumo eléctrico en kilovatios-hora ($kWh$) estructurado en un formato anclado a la marca temporal (`timestamp`) para cada edificio del estudio.
* **Justificación de Uso:** Es el motor analítico primario que cubre **4 de las 5 variables del JSON**. El cruce relacional entre el código único (`building_id`) de la tabla de metadatos y el historial cronológico de la tabla eléctrica permite mapear de forma directa `consumo_kwh` (sumando las lecturas eléctricas horarias), `tipo_inmueble` (filtrando `primaryspaceusage`), `uso_horario_pico` (filtrando las franjas horarias del `timestamp`) y `horas_alto_consumo` (calculando el $P_{75}$ de la carga eléctrica).
* **Uso en el Proyecto:** **Ingesta Primaria, Cruce Relacional y Feature Engineering.** Se procesa en el *Jupyter Notebook* principal mediante Pandas para transformar la matriz ancha a formato vertical (`pd.melt`), extraer el comportamiento operativo de la demanda y construir los vectores de entrenamiento para el clasificador (XGBoost/LightGBM).
* **Fuente Oficial:** [BUDS Lab - Building Data Genome Project 2 Repository](https://github.com/buds-lab/building-data-genome-project-2)

### 2.3 Consumo Eléctrico Anual por Comuna y Tipo de Cliente (CNE - Chile)
* **Descripción:** Base de datos regulatoria oficial administrada por la Comisión Nacional de Energía (CNE), elaborada a partir de la facturación y telemedición reportada por las empresas distribuidoras en el Sistema Eléctrico Nacional.
* **Justificación de Uso:** Actúa como el ancla de realidad territorial del proyecto. Se utiliza en tándem con el dataset de telemedición para calibrar el volumen base de la variable `consumo_kwh` según la comuna y estrato socioeconómico, y homologar la categorización de `tipo_inmueble` al mercado residencial, comercial e industrial chileno.
* **Uso en el Proyecto:** **Segmentación Territorial y Estandarización Basal.** Durante el Análisis Exploratorio de Datos (EDA), establece la media ($\mu$) y desviación estándar ($\sigma$) para aplicar normalización Z-Score, garantizando que las simulaciones sintéticas inyectadas al modelo mantengan los márgenes tarifarios y volúmenes reales de distribución en Chile.
* **Fuente Oficial:** [Comisión Nacional de Energía - Consumo Eléctrico por Comuna](https://comisionenergia-my.sharepoint.com/:x:/g/personal/infoestadistica_cne_cl/IQBOjT6d9F4pT5YI5gfu99tIAS8eAt-ZaoDaOgDnEA9lMyI?rtime=15_ZE3Lj3kg)

### 2.4 Energy Consumption Dataset - Linear Regression (Govindaramsriram)
* **Descripción:** Conjunto de datos tabular enfocado en regresión multivariable que correlaciona atributos físicos del inmueble (superficie en $m^2$, número de ocupantes, temperatura) con el consumo eléctrico global.
* **Justificación de Uso:** Es la base estadística única seleccionada por el equipo para **resguardar y calcular la variable faltante del núcleo: `cantidad_equipos`**. Al ser el único repositorio que incluye la columna explícita de conteo de artefactos operativos (`Appliances Used`), permite correlacionar la densidad tecnológica con la superficie construida y el número de habitantes.
* **Uso en el Proyecto:** **Entrenamiento del Generador Sintético de Equipos.** Sus distribuciones paramétricas alimentan los algoritmos para imputar de manera realista la variable `cantidad_equipos` (Ej. 10 equipos) en el JSON, evitando que el clasificador penalice como "ineficientes" a establecimientos altamente tecnificados que operan con altos estándares de aprovechamiento.
* **Fuente Original:** [Kaggle - Energy Consumption Dataset (Linear Regression)](https://www.kaggle.com/datasets/govindaramsriram/energy-consumption-dataset-linear-regression/data)

---

## 3. Datasets Auxiliares (Modelamiento, Imputación y Preprocesamiento)

> **Nota de Gestión de Riesgos y Contingencia:** Las fuentes secundarias de este catálogo cumplen un rol técnico especializado en la demostración de preprocesamiento (EDA), justificación física de sub-circuitos e imputación de variables ciegas. Constituyen el respaldo analítico para defender la rigurosidad matemática del algoritmo ante el jurado, y actúan como plan de contingencia estructural ante eventuales anomalías en el núcleo primario.

### 3.1 Individual Household Electric Power Consumption (UCI Machine Learning)
* **Descripción:** Estudio longitudinal clásico de alta resolución que registra mediciones minuto a minuto durante 47 meses en una residencia en Sceaux, Francia. Monitorea magnitudes eléctricas generales y sub-medición por circuitos físicos independientes (Hébrail & Bérard, 2012).
* **Justificación de Uso:** Aporta el patrón empírico conductual del consumo en hogares. Desde la perspectiva de ingeniería de datos, destaca por presentar exactamente un **1,25% de valores nulos reales**, convirtiéndose en el activo de prueba perfecto para validar el pipeline de limpieza sin manipular datos artificialmente.
* **Uso en el Proyecto:** **Demostración Práctica de Preprocesamiento (EDA).** Se utiliza en la documentación técnico-académica del repositorio para justificar y ejemplificar ante los evaluadores las técnicas de imputación de valores faltantes (mediante medias móviles e interpolación KNN) y la desagregación matemática del consumo en zonas funcionales.
* **Fuente Oficial:** [UCI Machine Learning Repository - Individual Household Electric Power Consumption](https://archive.ics.uci.edu/dataset/235/individual+household+electric+power+consumption)

### 3.2 AMPds / AMPds2 - The Almanac of Minutely Power Dataset (Simon Fraser University)
* **Descripción:** Estudio canónico canadiense (Dr. Stephen Makonin) capturado con telemedición intra-minutal. Registra electricidad, agua y gas, destacando por auditar 19 sub-circuitos eléctricos independientes y desglosar magnitudes de corriente alterna avanzadas: Potencia Activa ($P$), Reactiva ($Q$), Aparente ($S$), Factor de Potencia ($APF$) y Frecuencia ($f$).
* **Justificación de Uso:** Proporciona el soporte teórico y matemático para auditar el consumo basal nocturno ($R_{basal}$) y justificar la carga de los dispositivos. Al analizar el desfase entre potencia activa ($P$) y reactiva ($Q$), permite demostrar algebraicamente cómo un algoritmo puede distinguir cargas resistivas (calefacción) de cargas inductivas (motores de climatización o lavadoras).
* **Uso en el Proyecto:** **Transfer Learning y Auditoría de Eficiencia.** Se emplea para fundamentar el modelo de perfilamiento de artefactos y validar teóricamente que las simulaciones de la variable `cantidad_equipos` mantengan proporciones físicas coherentes con el consumo eléctrico total que reporta el medidor.
* **Fuente Oficial:** [Harvard Dataverse - AMPds Institutional Repository](https://dataverse.harvard.edu/dataverse/ampds)

### 3.3 Smart Meter Electricity Consumption Dataset (Kaggle)
* **Descripción:** Repositorio de lecturas de contadores inteligentes residenciales con muestreo a 30 minutos, acoplado a series cronológicas de parámetros climáticos locales (temperatura del aire, nubosidad, viento).
* **Justificación de Uso:** Permite auditar el comportamiento de perfiles generalizados ante variaciones atmosféricas rápidas, sirviendo para aislar la carga térmica en análisis comparativos.
* **Uso en el Proyecto:** **Análisis de Correlación Climática (EDA).** Se utiliza en la etapa de exploración visual para construir matrices de correlación de Pearson y fundamentar ante el jurado el impacto estacional que tiene la climatología sobre la saturación de los circuitos eléctricos.
* **Fuente:** [Kaggle - Smart Meter Electricity Consumption Dataset](https://www.kaggle.com/datasets/ziya07/smart-meter-electricity-consumption-dataset)

### 3.4 Curva de Carga Horária (ONS - Brasil)
* **Descripción:** Base de datos telemétrica oficial del Operador Nacional do Sistema Elétrico (ONS) de Brasil que registra la evolución horaria y sub-horaria de la demanda global en el sistema interconectado, expresada en Megavatios medios ($MWmed$).
* **Justificación de Uso:** Aporta la validación empírica macro-analítica para caracterizar el comportamiento de la red eléctrica en el cono sur, demostrando cómo se estructuran las curvas de estrés en nuestra zona horaria regional.
* **Uso en el Proyecto:** **Fundamentación Científica del Horario Pico Regional.** Se utiliza para argumentar y justificar teóricamente en el informe por qué la regla lógica de la variable `uso_horario_pico` se evalúa en la franja crítica de tarde/noche (18:00 a 22:00 horas), respaldándose en el estrés real del sistema interconectado sudamericano.
* **Fuente Oficial:** [Dados Abertos ONS - Curva de Carga Horária](https://dados.ons.org.br/dataset/curva-carga)

### 3.5 Carga de Energia Mensal (ONS - Brasil)
* **Descripción:** Series temporales históricas con el volumen de demanda eléctrica mensual del interconectado regional administrado por el ONS, integrando mediciones telemétricas de grandes generadoras, facturación de distribuidoras e impacto de generación solar distribuida (MMGD).
* **Justificación de Uso:** Funciona como indicador de referencia macro-estadística para evaluar la varianza estacional de la carga eléctrica a lo largo del año calendario en Latinoamérica.
* **Uso en el Proyecto:** **Marco Teórico de Estacionalidad y No-Estacionariedad.** Respalda la argumentación matemática para justificar la necesidad de normalizar las series temporales mes a mes antes de procesar las métricas en los clasificadores de Machine Learning.
* **Fuente Oficial:** [Dados Abertos ONS - Carga de Energia Mensal](https://dados.ons.org.br/dataset/carga-energia-mensual)
