# Documentación del Análisis Exploratorio Posterior a la Limpieza

## Índice

1. [Descripción general del notebook](#1-descripción-general-del-notebook)
2. [Preparación del entorno y carga de datos](#2-preparación-del-entorno-y-carga-de-datos)
3. [Medidas de tendencia central y posición](#3-medidas-de-tendencia-central-y-posición)
4. [Medidas de dispersión y posición](#4-medidas-de-dispersión-y-posición)
5. [Análisis de la forma de las distribuciones](#5-análisis-de-la-forma-de-las-distribuciones)
6. [Diagramas de caja e identificación de valores atípicos](#6-diagramas-de-caja-e-identificación-de-valores-atípicos)
7. [Análisis de frecuencias de las variables categóricas](#7-análisis-de-frecuencias-de-las-variables-categóricas)
8. [Resultados y objetos generados](#8-resultados-y-objetos-generados)
9. [Hallazgos principales del análisis exploratorio](#9-hallazgos-principales-del-análisis-exploratorio)
10. [Implicaciones para las etapas posteriores](#10-implicaciones-para-las-etapas-posteriores)
11. [Conclusión](#11-conclusión)

---

## 1. Descripción general del notebook

El notebook `03_EDA_post_limpieza(1).ipynb` desarrolla una segunda etapa del Análisis Exploratorio de Datos aplicada al conjunto de datos de consumo energético después de su proceso de limpieza.

Su propósito es caracterizar el comportamiento de las variables mediante el estudio de:

- La tendencia central y la posición de las variables numéricas.
- La dispersión y heterogeneidad de los datos.
- La asimetría y el exceso de curtosis de las distribuciones.
- La presencia visual de valores atípicos.
- La frecuencia absoluta y relativa de las variables categóricas.
- La distribución de la variable objetivo `perfil_energetico`.

El análisis se utiliza para conocer la estructura estadística del conjunto de datos y aportar información que pueda considerarse durante la imputación de valores faltantes, el preprocesamiento, la selección de variables y el entrenamiento posterior de modelos.

El notebook es principalmente descriptivo. No transforma ni reemplaza los valores del DataFrame; calcula estadísticas, genera tablas y produce visualizaciones para examinar la información disponible.

---

## 2. Preparación del entorno y carga de datos

### 2.1. Librerías utilizadas

El notebook utiliza las siguientes librerías:

- `pandas`, para cargar el conjunto de datos, seleccionar columnas y construir las tablas estadísticas.
- `numpy`, para operaciones numéricas y manejo de valores especiales.
- `matplotlib.pyplot`, para generar histogramas y diagramas de caja.

### 2.2. Carga del conjunto de datos

El archivo limpio se carga en el DataFrame `bd` desde la ruta:

```text
/content/dataset_consumo_energetico_LIMPIO.csv
```

Todas las operaciones posteriores se realizan sobre este DataFrame.

### 2.3. Comprobación inicial de valores faltantes

Después de cargar la base, el notebook calcula la cantidad total de valores nulos mediante la suma de los valores faltantes de todas las columnas.

La salida registrada es:

```text
186939 valores nulos
```

Esta comprobación confirma que, aunque la base corresponde a una versión posterior a la limpieza, todavía contiene información faltante que debe considerarse en las etapas posteriores.

---

## 3. Medidas de tendencia central y posición

### 3.1. Propósito del análisis

Este bloque proporciona una descripción general de todas las variables numéricas y permite observar el centro, los extremos y la cantidad de valores faltantes de cada distribución.

La información generada también sirve como apoyo para definir estrategias posteriores de imputación.

### 3.2. Selección automática de variables

El procedimiento selecciona automáticamente las columnas con tipos numéricos enteros o decimales. Se consideran tanto los tipos estándar de NumPy como los tipos anulables de pandas.

Como resultado, el análisis se adapta a las columnas numéricas presentes en `bd` sin requerir una lista escrita manualmente.

La ejecución analiza un total de:

```text
34 variables numéricas
```

### 3.3. Estadísticas calculadas

Para cada variable numérica se obtienen las siguientes medidas:

| Medida | Función dentro del análisis |
|---|---|
| Nulos | Cuenta los valores faltantes de la variable. |
| Mínimo | Identifica el menor valor observado. |
| Media | Calcula el promedio aritmético de los valores disponibles. |
| Mediana | Identifica el valor central de la distribución ordenada. |
| Moda | Obtiene el valor válido que aparece con mayor frecuencia. |
| Máximo | Identifica el mayor valor observado. |

Los cálculos ignoran automáticamente los valores `NaN`. La moda se asigna como nula únicamente cuando la variable no contiene ningún valor válido del cual pueda obtenerse un resultado.

### 3.4. Presentación de resultados

Las estadísticas se reúnen en el DataFrame `reporte`. Cada fila representa una variable y las columnas contienen sus medidas descriptivas.

Los cálculos se realizan con la precisión disponible. El redondeo a dos decimales se aplica únicamente al momento de presentar:

- Mínimo.
- Media.
- Mediana.
- Moda.
- Máximo.

### 3.5. Resultados destacados por el notebook

La interpretación incluida en el notebook señala que no se observan valores fuera de rangos lógicos después de la limpieza. Como ejemplo, `costo_estimado_usd` presenta un valor mínimo igual a `0`, por lo que no se identifican costos negativos en la tabla.

También se confirma una presencia elevada de valores faltantes en variables como:

- `certificacion_energetica_previa`: 14 695 valores nulos.
- `temperatura_promedio_c`: 10 675 valores nulos.

Estos resultados son coherentes con el análisis previo de ausencia de datos mencionado en el notebook.

---

## 4. Medidas de dispersión y posición

### 4.1. Propósito del análisis

Este bloque estudia la amplitud y la variabilidad de las variables numéricas. Su objetivo principal es determinar qué tan concentrados o dispersos se encuentran sus valores.

El notebook destaca especialmente el coeficiente de variación, porque permite comparar la variabilidad relativa de variables que tienen unidades y escalas diferentes.

### 4.2. Selección y exclusión de variables

El procedimiento parte de todas las variables numéricas y excluye:

- Variables identificadoras, cuando estén presentes entre las columnas numéricas.
- Variables cuyos valores sean únicamente un subconjunto de `0` y `1`.
- Variables con cardinalidad menor o igual que dos.

La ejecución produce el siguiente resumen:

```text
Variables continuas o discretas analizadas: 30
Variables binarias o booleanas excluidas: 4
```

Las cuatro variables excluidas son:

- `tiene_aire_acondicionado`
- `tiene_calentador_agua_electrico`
- `tiene_lavadora`
- `certificacion_energetica_previa`

### 4.3. Estadísticas calculadas

Para cada variable seleccionada se obtienen:

| Medida | Descripción operativa |
|---|---|
| Nulos | Cantidad de valores faltantes. |
| Rango | Diferencia entre el máximo y el mínimo. |
| Q1 | Percentil 25. |
| Q2 | Mediana o percentil 50. |
| Q3 | Percentil 75. |
| Varianza | Varianza muestral, calculada con un grado de libertad. |
| Desviación estándar | Dispersión de los valores respecto de la media. |
| Coeficiente de variación | Relación porcentual entre la desviación estándar y la media. |

El coeficiente de variación se calcula de la siguiente manera:

```text
Coeficiente de variación = (desviación estándar / media) × 100
```

Cuando la media es igual a cero, el coeficiente se conserva como un valor nulo para evitar una división no calculable.

### 4.4. Tabla producida

Los resultados se almacenan en `df_estadisticas`. Las medidas numéricas se redondean a dos decimales únicamente para su presentación.

### 4.5. Resultados destacados por el notebook

La tabla evidencia coeficientes de variación elevados en diferentes variables. Entre los resultados registrados se encuentran:

| Variable | Coeficiente de variación |
|---|---:|
| `variacion_pct_consumo_mensual` | 1136.40 % |
| `generacion_solar_kwh_mensual` | 330.36 % |
| `consumo_kwh_mensual` | 259.23 % |
| `horas_uso_planta_o_inversor_mes` | 149.15 % |
| `superficie_m2` | 122.45 % |
| `consumo_kwh_por_persona` | 113.32 % |
| `cantidad_unidades_aa` | 105.30 % |
| `consumo_kwh_por_m2` | 104.42 % |
| `horas_dia_lavanderia` | 103.99 % |

La interpretación del notebook indica que los coeficientes superiores al 100 %, y especialmente el valor superior al 1000 % de `variacion_pct_consumo_mensual`, reflejan una alta heterogeneidad. Bajo estas condiciones, la media pierde representatividad como medida del centro de la distribución.

---

## 5. Análisis de la forma de las distribuciones

### 5.1. Propósito del análisis

Este bloque estudia la forma de las distribuciones numéricas mediante:

- El coeficiente de asimetría o *skewness*.
- El exceso de curtosis.
- Histogramas con 30 intervalos.

La combinación de estadísticas y gráficos permite observar sesgos, concentración de los valores y posibles extremos.

### 5.2. Selección de variables

Se seleccionan las variables numéricas y se excluyen:

- Variables identificadoras.
- Variables con cardinalidad menor o igual que tres.

La ejecución analiza 30 variables y excluye cuatro:

- `tiene_aire_acondicionado`
- `tiene_calentador_agua_electrico`
- `tiene_lavadora`
- `certificacion_energetica_previa`

### 5.3. Coeficiente de asimetría

Para cada variable se calcula el coeficiente de asimetría. La tabla utiliza un formato visual para distinguir el signo de los resultados:

- Valores positivos: fondo verde.
- Valores negativos: fondo azul.
- Valores iguales a cero: fondo blanco.

Entre los coeficientes positivos más elevados registrados aparecen:

| Variable | Asimetría |
|---|---:|
| `superficie_m2` | 31.70 |
| `consumo_kwh_mensual` | 13.99 |
| `num_personas` | 13.94 |
| `generacion_solar_kwh_mensual` | 3.84 |
| `consumo_kwh_por_m2` | 3.60 |
| `consumo_kwh_por_persona` | 3.56 |

También se observan coeficientes negativos en variables como:

- `dias_facturacion`: -1.19.
- `horas_dia_dormitorios`: -1.17.
- `temperatura_promedio_c`: -0.07.

### 5.4. Exceso de curtosis

El bloque calcula el exceso de curtosis para las mismas variables. Algunos de los valores positivos más elevados son:

| Variable | Exceso de curtosis |
|---|---:|
| `superficie_m2` | 1608.52 |
| `num_personas` | 312.98 |
| `consumo_kwh_mensual` | 239.26 |
| `consumo_kwh_por_m2` | 24.19 |
| `consumo_kwh_por_persona` | 20.84 |
| `generacion_solar_kwh_mensual` | 16.19 |

### 5.5. Histogramas

Las 30 variables seleccionadas se representan mediante histogramas con las siguientes características:

- 30 intervalos por variable.
- Tres gráficos por fila.
- Tamaño de la figura ajustado automáticamente según el número de variables.
- Ausencia de cuadrícula.

### 5.6. Interpretación registrada en el notebook

El notebook señala un predominio de distribuciones con asimetría positiva. Esto implica una mayor extensión de la cola hacia los valores altos en una parte importante de las variables evaluadas.

También indica que la mayoría de los resultados de exceso de curtosis reflejan formas leptocúrticas, asociadas en la interpretación del notebook con una mayor probabilidad de encontrar valores extremos.

---

## 6. Diagramas de caja e identificación de valores atípicos

### 6.1. Propósito del análisis

Este bloque genera diagramas de caja para examinar visualmente:

- La posición central de las variables.
- La amplitud intercuartílica.
- La extensión de los valores.
- La presencia de observaciones atípicas.

### 6.2. Selección de variables

Se utilizan los mismos criterios generales del análisis de la forma de las distribuciones:

- Selección de columnas numéricas.
- Exclusión de identificadores.
- Exclusión de variables con cardinalidad menor o igual que tres.

La ejecución presenta el siguiente resultado:

```text
Variables analizadas: 30
Variables excluidas: 4
```

Las variables excluidas son las mismas cuatro variables binarias identificadas en los análisis anteriores.

### 6.3. Generación de los gráficos

Los diagramas se distribuyen automáticamente en una cuadrícula de tres columnas. Cada gráfico:

- Utiliza los valores no nulos de la variable.
- Presenta el nombre de la variable como título.
- Muestra los valores en el eje vertical.
- Elimina los ejes vacíos que pudieran quedar en la última fila.

### 6.4. Interpretación registrada en el notebook

El texto del notebook indica la existencia de múltiples valores atípicos, principalmente por encima del límite superior definido mediante:

```text
Q3 + 1.5 × RIC
```

La presencia dominante de observaciones por encima de este límite es coherente con la asimetría positiva descrita en la sección anterior.

---

## 7. Análisis de frecuencias de las variables categóricas

### 7.1. Propósito del análisis

Este bloque examina la distribución de todas las variables categóricas disponibles en `bd`.

Para cada categoría se calculan:

- Frecuencia absoluta.
- Frecuencia relativa porcentual.

Los valores nulos también se incluyen como una categoría dentro de las tablas.

### 7.2. Selección automática

Se seleccionan las columnas con tipos:

- `object`
- `string`
- `category`

La ejecución identifica y analiza:

```text
9 variables categóricas
```

Estas variables son:

- `id_registro`
- `tipo_inmueble`
- `zona`
- `nivel_socioeconomico`
- `mes_referencia`
- `horario_pico_uso`
- `aislamiento_termico`
- `fuente_energia_secundaria`
- `perfil_energetico`

### 7.3. Tablas generadas

Para cada variable se construye una tabla con la siguiente estructura:

| Columna | Contenido |
|---|---|
| Categoría | Valor o categoría observada. |
| Frecuencia absoluta | Número de registros de la categoría. |
| Frecuencia relativa (%) | Proporción porcentual de la categoría. |

La frecuencia relativa se redondea a dos decimales.

### 7.4. Distribución de la fuente de energía secundaria

La salida registrada para `fuente_energia_secundaria` es:

| Categoría | Frecuencia absoluta | Frecuencia relativa |
|---|---:|---:|
| Ninguna | 52 997 | 53.52 % |
| Planta Eléctrica | 19 094 | 19.28 % |
| Inversor con baterías | 14 160 | 14.30 % |
| Panel Solar | 9 669 | 9.76 % |
| Valor nulo | 3 104 | 3.13 % |

El notebook destaca que `Panel Solar` tiene una representación considerablemente menor que las categorías restantes.

### 7.5. Distribución de la variable objetivo

La salida registrada para `perfil_energetico` es:

| Categoría | Frecuencia absoluta | Frecuencia relativa |
|---|---:|---:|
| Eficiente | 33 739 | 34.07 % |
| Moderado | 33 620 | 33.95 % |
| Ineficiente | 29 062 | 29.35 % |
| Valor nulo | 2 603 | 2.63 % |

El notebook interpreta que las tres clases observadas presentan una distribución relativamente equilibrada, con diferencias inferiores a cinco puntos porcentuales entre ellas.

---

## 8. Resultados y objetos generados

El notebook produce los siguientes objetos y salidas principales:

| Objeto o salida | Contenido |
|---|---|
| `variables_numericas` | Columnas numéricas seleccionadas para el análisis descriptivo. |
| `reporte` | Tabla de nulos, mínimo, media, mediana, moda y máximo. |
| `df_estadisticas` | Tabla de rango, cuartiles, varianza, desviación estándar y coeficiente de variación. |
| `df` | Tabla de asimetría y exceso de curtosis. |
| `styled` | Versión formateada visualmente de la tabla de asimetría y curtosis. |
| `variables_excluidas` | Registro de variables omitidas y motivo de exclusión. |
| Histogramas | Distribuciones de las 30 variables numéricas seleccionadas. |
| Diagramas de caja | Representación de la dispersión y los valores atípicos de 30 variables. |
| Tablas de frecuencia | Frecuencias absolutas y relativas de nueve variables categóricas. |

Las tablas y visualizaciones se muestran dentro del notebook, pero no se exportan a archivos externos en los bloques analizados.

---

## 9. Hallazgos principales del análisis exploratorio

El notebook registra un total de 186 939 valores faltantes y confirma que la ausencia de datos continúa siendo un elemento relevante después de la limpieza. Dentro de las estadísticas descriptivas se destacan `certificacion_energetica_previa` y `temperatura_promedio_c` por su cantidad elevada de valores nulos. Al mismo tiempo, el análisis señala que los valores observados se mantienen dentro de rangos considerados lógicos; en particular, `costo_estimado_usd` no presenta costos negativos.

Las medidas de dispersión muestran una alta heterogeneidad en varias variables. El caso más destacado es `variacion_pct_consumo_mensual`, cuyo coeficiente de variación alcanza 1136.40 %. También se registran coeficientes superiores al 100 % en la generación solar, el consumo mensual, las horas de uso del respaldo, la superficie y diferentes medidas relativas de consumo. El notebook interpreta que esta variabilidad elevada reduce la representatividad de la media como medida de tendencia central.

El análisis de la forma de las distribuciones muestra un predominio de asimetría positiva. Los valores más altos de asimetría corresponden a `superficie_m2`, `consumo_kwh_mensual` y `num_personas`. El notebook relaciona este patrón con la existencia de colas más extensas hacia los valores altos. Asimismo, varias variables presentan exceso de curtosis positivo y valores especialmente altos en la superficie, el número de personas y el consumo mensual. La interpretación incluida caracteriza una parte importante de estas distribuciones como leptocúrticas y señala una mayor presencia de valores extremos.

Los diagramas de caja confirman visualmente la existencia de múltiples valores atípicos, principalmente por encima del límite superior basado en Q3 más 1.5 veces el rango intercuartílico. Este resultado coincide con la asimetría positiva identificada mediante los coeficientes y los histogramas.

En las variables categóricas se observa cierto desbalance en categorías específicas. El ejemplo destacado en el notebook es `Panel Solar`, que representa aproximadamente el 9.76 % de `fuente_energia_secundaria`, frente a porcentajes mayores para las demás fuentes. Por otra parte, la variable objetivo `perfil_energetico` presenta proporciones de 34.07 % para `Eficiente`, 33.95 % para `Moderado` y 29.35 % para `Ineficiente`. El notebook considera esta distribución relativamente equilibrada porque las diferencias entre las clases son inferiores a cinco puntos porcentuales.

---

## 10. Implicaciones para las etapas posteriores

De acuerdo con la interpretación incluida en el notebook, la imputación mediante la media podría ser poco adecuada para variables con coeficientes de variación muy elevados, debido a que la media pierde representatividad ante distribuciones altamente heterogéneas. El mismo texto aclara que la elección de un método de imputación no debe depender únicamente del coeficiente de variación, sino también del mecanismo de ausencia y de la forma de la distribución.

El predominio de asimetría positiva podría requerir transformaciones que reduzcan el sesgo, como la transformación logarítmica, dependiendo del modelo de aprendizaje automático que se seleccione. Esta consideración se plantea especialmente para técnicas que asumen distribuciones más simétricas o que son sensibles a valores extremos.

La presencia de múltiples valores atípicos también debe considerarse durante la selección del modelo. El notebook señala que estos valores pueden afectar especialmente a métodos basados en distancias, como K-Nearest Neighbors, mientras que modelos basados en árboles de decisión, como Random Forest, suelen ser más robustos frente a este tipo de observaciones.

Respecto de la variable objetivo, la distribución relativamente equilibrada podría indicar que no es necesario aplicar técnicas adicionales de balanceo de clases. Sin embargo, el propio notebook establece que esta decisión no debe tomarse de forma definitiva sin analizar previamente la relación de `perfil_energetico` con las demás características del conjunto de datos.

---

## 11. Conclusión

El notebook proporciona una caracterización estadística y visual del conjunto de datos posterior a la limpieza. Sus resultados muestran una presencia importante de valores faltantes, una heterogeneidad elevada en varias variables, un predominio de distribuciones con asimetría positiva y múltiples valores atípicos situados principalmente en los extremos superiores.

También se identifican distribuciones con exceso de curtosis positivo, interpretadas en el notebook como leptocúrticas y asociadas con una mayor presencia de valores extremos. Estos resultados son consistentes con la variabilidad observada mediante el coeficiente de variación y con los patrones mostrados en los diagramas de caja.

Finalmente, el análisis de frecuencias indica diferencias de representación en algunas categorías, especialmente en la fuente de energía secundaria, mientras que la variable objetivo presenta una distribución relativamente equilibrada. En conjunto, los resultados aportan información que el notebook considera relevante para definir la imputación de valores faltantes, evaluar posibles transformaciones, seleccionar variables y elegir modelos para las etapas posteriores del proyecto.
