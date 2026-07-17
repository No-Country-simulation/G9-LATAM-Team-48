# Catálogo y Evaluación de Bases de Datos
**Proyecto:** Framework de Eficiencia Energética (Hackathon ONE)  
**Equipo:** G9 - Ciencia de Datos  

## 1. Resumen Ejecutivo
Este documento consolida la investigación y evaluación técnica de las bases de datos públicas y repositorios consultados para diseñar el modelo de clasificación de eficiencia energética. El objetivo principal fue seleccionar un conjunto de datos base que caracterice el consumo local por segmento y se alinee estructuralmente con el esquema de entrada del algoritmo (`consumo_kwh`, `uso_horario_pico`, `cantidad_equipos`, `tipo_inmueble` y `horas_alto_consumo`), complementándolo con bases de sub-medición y variables climáticas para la ingeniería de características.

---

## 2. Bases de Datos Usadas (Núcleo Principal y Algorítmico)

> **Nota de Arquitectura y Datos Sintéticos:** Para el desarrollo de la solución, estas dos bases de datos funcionarán como la matriz fundamental de nuestro modelo. Con el fin de evitar sesgos por desbalance de clases, cubrir perfiles de consumo extremos y robustecer el entrenamiento del algoritmo de Machine Learning, **esta matriz será enriquecida y complementada mediante la generación controlada de datos sintéticos**, manteniendo las distribuciones estadísticas y la coherencia física de la red eléctrica local.

### 2.1 Mapeo Estructural con el Esquema de Entrada (JSON del Modelo)
Para procesar y responder directamente a la estructura JSON requerida por el MVP, nuestro núcleo algorítmico adapta las fuentes de datos de la siguiente manera:
* **`consumo_kwh` (Ej. 420):** Se obtiene integrando la suma mensual de las lecturas continuas de energía (`meter_reading`) de la base temporal, estandarizando su volumen mediante los registros de facturación real de la base nacional chilena.
* **`uso_horario_pico` (Ej. true):** Se deriva mediante una regla lógica aplicada sobre la marca de tiempo horaria (`timestamp`). El algoritmo evalúa si la demanda entre las 18:00 y las 22:00 horas supera significativamente la media operativa del inmueble.
* **`horas_alto_consumo` (Ej. 8):** Gracias a la frecuencia de muestreo horaria exacta de nuestra matriz principal, se calcula contando el número entero de horas al día en que el consumo del inmueble supera el percentil 75 ($P_{75}$) de su distribución de carga.
* **`tipo_inmueble` (Ej. "Casa"):** Se extrae del filtrado nativo por metadatos de categoría de edificación (`building_type` / categoría tarifaria CNE).
* **`cantidad_equipos` (Ej. 10):** Al ser una variable no disponible en los medidores generales de red, se imputa analíticamente utilizando la distribución de artefactos de los datasets auxiliares en combinación con algoritmos de generación de datos sintéticos.

### 2.2 Building Energy Dataset - Series 2020 (Kaggle - Waqas K)
* **Descripción:** Conjunto de datos que registra series temporales con resolución horaria del consumo eléctrico en instalaciones físicas para el año 2020 (`4.data_2020.csv`), acoplando las lecturas del medidor (`meter_reading`) con variables meteorológicas locales exógenas como temperatura ambiental y humedad relativa.
* **Justificación de Uso:** Constituye la fuente algorítmica primordial para modelar el comportamiento energético intra-diario. Su granularidad horaria es la única que permite calcular de forma nativa la variable de `horas_alto_consumo` y el booleano de `uso_horario_pico`, permitiendo además aislar el estrés de carga asociado a la climatización térmica.
* **Uso en el Proyecto:** **Ingesta Primaria y Extracción de Características (Feature Engineering).** Se utiliza en el *Jupyter Notebook* principal para estructurar la matriz temporal de entrenamiento del algoritmo clasificador (XGBoost/LightGBM), derivando el cálculo de las horas críticas diarias (`horas_alto_consumo`) y activando condicionalmente el booleano `uso_horario_pico`.
* **Fuente:** [Kaggle - Building Energy Dataset (Waqas K)](https://www.kaggle.com/datasets/waqask/building-energy-dataset?select=4.data_2020.csv)

### 2.3 Consumo Eléctrico Anual por Comuna y Tipo de Cliente (CNE - Chile)
* **Descripción:** Base de datos oficial que resume el consumo eléctrico anual desagregado por comuna y tipo de cliente, construida a partir de la información procesada por la Comisión Nacional de Energía (CNE) mediante entregas de antecedentes de las empresas distribuidoras.
* **Justificación de Uso:** Se utiliza en tándem con el dataset anterior para anclar la variable de `tipo_inmueble` a la realidad comercial chilena ("Casa", comercio, industria) y calibrar la línea base del volumen en `consumo_kwh` sobre el perfil socioeconómico y territorial de los usuarios locales.
* **Uso en el Proyecto:** **Segmentación del Target y Calibración Basal.** Se utiliza durante el Análisis Exploratorio de Datos (EDA) para definir la ponderación y distribución mensual de la variable `consumo_kwh` según el sector territorial, sirviendo como parámetro de anclaje para la posterior inyección de datos sintéticos representativos del mercado nacional.
* **Fuente:** [Comisión Nacional de Energía - Consumo Eléctrico por Comuna](https://comisionenergia-my.sharepoint.com/:x:/g/personal/infoestadistica_cne_cl/IQBOjT6d9F4pT5YI5gfu99tIAS8eAt-ZaoDaOgDnEA9lMyI?rtime=15_ZE3Lj3kg)

---

## 3. Datasets Auxiliares (Modelamiento y Contexto Analítico)

> **Nota de Gestión de Riesgos y Contingencia:** Las bases de datos presentadas en esta sección cumplen un rol analítico, conceptual y de apoyo para la ingeniería de características durante las fases iniciales. Sin embargo, **estos datasets están catalogados como plan de contingencia técnico y podrían ser implementados como fuentes directas en fases posteriores del proyecto** en caso de presentarse complicaciones estructurales, falta de granularidad o limitaciones de convergencia algorítmica durante el desarrollo con las bases de datos principales.

### 3.1 AMPds - The Almanac of Minutely Power Dataset (Kaggle)
* **Descripción:** Base de datos empírica que registra mediciones simultáneas de electricidad, agua y gas natural en una vivienda residencial con intervalos de un minuto, complementada con variables meteorológicas temporales.
* **Justificación de Uso:** La desagregación exhaustiva del consumo eléctrico por 19 sub-circuitos independientes permite auditar matemáticamente el perfil de uso de los ambientes (cocina, lavandería, climatización) y modelar el consumo basal nocturno ($R_{basal}$) del inmueble.
* **Uso en el Proyecto:** **Auditoría Zonal y Transfer Learning.** Se usa para modelar empíricamente la distribución porcentual del gasto por habitación y electrodoméstico. Su estructura permite entrenar la lógica de detección de consumo en *standby* y caracterizar la huella eléctrica de los ambientes domésticos en nuestras simulaciones sintéticas.
* **Fuente:** [Kaggle - AMPds: The Almanac of Minutely Power Dataset](https://www.kaggle.com/datasets/programmerrdai/ampds-the-almanac-of-minutely-power-dataset?select=Electricity_HPE.csv)

### 3.2 Individual Household Electric Power Consumption (UCI)
* **Descripción:** Mediciones del consumo de energía eléctrica residencial con una tasa de muestreo de un minuto durante un período de casi 4 años. Contiene el registro de magnitudes eléctricas globales junto con valores de sub-medición física por circuitos independientes (Hébrail & Bérard, 2012).
* **Justificación de Uso:** Aporta el patrón empírico de división por zonas funcionales, sirviendo de validación para los perfiles conductuales. Su porcentaje de valores nulos (1.25%) se utiliza como estándar de referencia para justificar las técnicas de imputación y limpieza durante el Análisis Exploratorio de Datos (EDA).
* **Uso en el Proyecto:** **Demostración Práctica de Preprocesamiento (EDA).** Se emplea en la documentación del pipeline de limpieza para ejemplificar y justificar técnicamente los métodos de imputación de valores faltantes (mediante medias móviles y KNN) y la normalización de series de tiempo de consumo doméstico.
* **Fuente:** [UCI Machine Learning Repository - Individual Household Electric Power Consumption](https://archive.ics.uci.edu/dataset/235/individual+household+electric+power+consumption)

### 3.3 Energy Consumption Dataset (Kaggle - Govindaramsriram)
* **Descripción:** Conjunto de datos tabular que correlaciona el consumo de energía en edificaciones con variables socioeconómicas y estructurales, incluyendo el conteo numérico explícito de artefactos eléctricos operativos (`Appliances Used`).
* **Justificación de Uso:** Es la base de referencia estadística utilizada para entrenar la imputación y generar datos sintéticos de la variable `cantidad_equipos`, permitiendo al modelo normalizar el gasto eléctrico según el tamaño del parque tecnológico del inmueble.
* **Uso en el Proyecto:** **Calibración de Intensidad por Dispositivo.** Sus distribuciones alimentan el generador de datos sintéticos (Monte Carlo / CTGAN) para simular de manera realista la variable de entrada `cantidad_equipos` (Ej. 10 equipos), evitando que el clasificador penalize por volumen a inmuebles altamente tecnificados pero eficientes.
* **Fuente:** [Kaggle - Energy Consumption Dataset (Linear Regression)](https://www.kaggle.com/datasets/govindaramsriram/energy-consumption-dataset-linear-regression/data)

### 3.4 Smart Meter Electricity Consumption Dataset (Kaggle)
* **Descripción:** Conjunto de datos de contadores inteligentes que acopla mediciones del consumo eléctrico de usuarios finales con variables climáticas locales.
* **Justificación de Uso:** Se utiliza en la etapa de preprocesamiento para cuantificar y fundamentar estadísticamente la influencia de factores exógenos (como la temperatura y humedad ambiental) sobre la varianza de la demanda eléctrica.
* **Uso en el Proyecto:** **Análisis de Correlación Climática (EDA).** Se utiliza para graficar matrices de correlación y demostrar ante el jurado el impacto trigonométrico y estacional que tiene el clima local en las curvas de sobreconsumo en sistemas de climatización.
* **Fuente:** [Kaggle - Smart Meter Electricity Consumption Dataset](https://www.kaggle.com/datasets/ziya07/smart-meter-electricity-consumption-dataset)

### 3.5 Curva de Carga Horaria (ONS - Brasil)
* **Descripción:** Base de datos del Operador Nacional del Sistema Eléctrico de Brasil (nombre original en el repositorio: *Curva de Carga Horária*) que registra la evolución sub-diaria de la demanda en el sistema interconectado, expresada en Megavatios medios (MWmed).
* **Justificación de Uso:** Proporciona el respaldo empírico a escala macro para mapear el perfil diurno y nocturno del consumo en Sudamérica, aportando el fundamento analítico para sincronizar los horarios de mayor estrés del sistema.
* **Uso en el Proyecto:** **Fundamentación del Horario Pico Regional.** Se utiliza para argumentar teóricamente en el informe por qué el booleano `uso_horario_pico` se configura y evalúa en las franjas de tarde/noche en la región sudamericana, basándose en el comportamiento real de estrés de la red interconectada.
* **Fuente:** [Dados Abertos ONS - Curva de Carga Horária](https://dados.ons.org.br/dataset/curva-carga)

### 3.6 Carga de Energía Mensual (ONS - Brasil)
* **Descripción:** Series temporales históricas con el volumen de demanda mensual administrado por el ONS (nombre original en el repositorio: *Carga de Energia Mensal*). Refleja su evolución metodológica: mediciones telemétricas de grandes plantas hasta 2014, incorporación de facturación comercial de pequeñas centrales desde 2015, e integraciones de modelado meteorológico para la generación solar distribuida (MMGD) desde 2023.
* **Justificación de Uso:** Funciona como indicador macro-analítico para observar la estacionalidad regional del consumo a lo largo del año y argumentar las técnicas de estandarización por volumen.
* **Uso en el Proyecto:** **Marco Teórico de Estacionalidad y No-Estacionariedad.** Se utiliza en la argumentación académica para explicar la varianza estacional del consumo eléctrico regional y justificar la necesidad de normalizar matemáticamente las series de tiempo mes a mes en modelos de predicción energética.
* **Fuente:** [Dados Abertos ONS - Carga de Energia Mensal](https://dados.ons.org.br/dataset/carga-energia-mensual)
