# Diccionario de nuevas columnas

Este documento describe las columnas creadas o recalculadas por los notebooks `04_Imputacion_Variables(13)(1).ipynb` y `05_Feature_Engineering(7)(1).ipynb`. El objetivo es documentar su origen, su construcción y su utilidad potencial como variables de entrada para modelos predictivos de consumo o perfil energético.

> **Nota:** la documentación se basa en la lógica implementada en los notebooks. Las columnas One-Hot Encoding solo se generan cuando la categoría correspondiente está presente, y las banderas de división solo se agregan cuando existe al menos un denominador igual a cero.

## Índice

- [1. Descripción general](#1-descripción-general)
- [2. Resumen de columnas por notebook](#2-resumen-de-columnas-por-notebook)
- [3. Columnas creadas durante la imputación y preparación](#3-columnas-creadas-durante-la-imputación-y-preparación)
- [4. Columnas creadas mediante Feature Engineering](#4-columnas-creadas-mediante-feature-engineering)
- [5. Tabla consolidada de nuevas columnas](#5-tabla-consolidada-de-nuevas-columnas)
- [6. Relación entre los dos notebooks](#6-relación-entre-los-dos-notebooks)
- [7. Índice alfabético de columnas](#7-índice-alfabético-de-columnas)
- [8. Conclusión](#8-conclusión)

## 1. Descripción general

### 1.1. Objetivo del documento

Proporcionar una referencia técnica de las variables que se incorporan al conjunto de datos durante la imputación, la codificación categórica y la ingeniería de características. Cada entrada indica el notebook donde se produce, su cálculo o condición, su propósito y el tipo de dato esperado.

### 1.2. Alcance de los notebooks analizados

- `04_Imputacion_Variables(13)(1).ipynb`: corrige inconsistencias, crea banderas de trazabilidad, recalcula variables energéticas y transforma variables categóricas mediante One-Hot Encoding.
- `05_Feature_Engineering(7)(1).ipynb`: construye ratios, cargas, interacciones, indicadores estacionales y variables de calidad para enriquecer la información utilizada durante el entrenamiento.

### 1.3. Documentos de origen

1. `04_Imputacion_Variables(13)(1).ipynb`
2. `05_Feature_Engineering(7)(1).ipynb`

### 1.4. Criterios de clasificación

- **Nueva:** se incorpora como una columna adicional.
- **Nueva condicional:** solo se incorpora cuando se cumple una condición del código.
- **Recalculada o reemplazada:** ya forma parte del conjunto de datos, pero su contenido se vuelve a calcular.
- **Binaria:** contiene valores 0 y 1.
- **Discreta:** representa conteos o categorías numéricas enteras.
- **Continua:** representa ratios, cargas, interacciones o magnitudes numéricas.

### 1.5. Estructura utilizada para describir cada variable

Las tablas incluyen el nombre exacto de la columna, el cálculo o condición que la origina, su propósito dentro del modelado, el tipo esperado y el estado de creación.

## 2. Resumen de columnas por notebook

| Notebook | Grupos principales | Columnas nuevas permanentes o esperadas | Columnas adicionales |
| --- | --- | --- | --- |
| 04_Imputacion_Variables(13)(1).ipynb | 9 banderas + 32 columnas One-Hot Encoding | 41 | 5 |
| 05_Feature_Engineering(7)(1).ipynb | 144 características base + 15 variables de calidad | 159 | Hasta 8 banderas de división |

En conjunto se documentan **200 columnas nuevas permanentes o esperadas** y **hasta 8 columnas condicionales**, además de **5 variables existentes que se recalculan**.

### 2.1. Columnas creadas en el notebook de imputación

El notebook crea banderas de corrección e inconsistencia y reemplaza las siete variables categóricas originales por columnas binarias. Las categorías concretas documentadas son las que aparecen como entradas esperadas en el notebook de Feature Engineering.

### 2.2. Columnas creadas en el notebook de Feature Engineering

El notebook crea variables de intensidad, densidad, interacción, tendencia, estacionalidad y calidad. Las 159 características principales se agregan siempre que las columnas base requeridas estén disponibles. Las ocho banderas de división se crean únicamente cuando se detecta al menos un denominador igual a cero.

### 2.3. Columnas recalculadas o reemplazadas

El notebook de imputación recalcula cinco variables energéticas ya existentes. El notebook de Feature Engineering elimina antes de la concatenación cualquier columna que tenga el mismo nombre que una característica nueva, por lo que una segunda ejecución reemplaza esas columnas en lugar de duplicarlas.

### 2.4. Columnas de creación condicional

Las columnas One-Hot Encoding dependen de las categorías observadas. Las banderas de división no calculable solo se agregan cuando existe al menos un caso problemático en el denominador correspondiente.

## 3. Columnas creadas durante la imputación y preparación

Todas las columnas de esta sección pertenecen a `04_Imputacion_Variables(13)(1).ipynb`.

### 3.1. Banderas de correcciones determinísticas e inconsistencias

| Columna | Condición o construcción | Propósito | Tipo | Estado |
| --- | --- | --- | --- | --- |
| `personas_corregidas` | `num_personas <= 0` | Identificar registros cuyo número de personas se corrige a 1. | Binaria | Nueva o reemplazada |
| `superficie_corregida` | `superficie_m2 <= 0` | Identificar registros cuya superficie se corrige a 15 m². | Binaria | Nueva o reemplazada |
| `aa_inconsistente` | Contradicción entre `tiene_aire_acondicionado`, `cantidad_unidades_aa` y `horas_uso_aa_dia`. | Conservar trazabilidad de inconsistencias del sistema de aire acondicionado. | Binaria | Nueva o reemplazada |
| `iluminacion_inconsistente` | `cantidad_focos == 0` con porcentaje LED u horas de iluminación diferentes de cero. | Identificar y auditar contradicciones en las variables de iluminación. | Binaria | Nueva o reemplazada |
| `cantidad_equipos_reconstruida` | `cantidad_equipos_total` es nulo o menor que la suma de televisores, computadoras y otros equipos. | Indicar que el total de equipos fue reconstruido a partir de sus componentes. | Binaria | Nueva o reemplazada |
| `inicio_consumo_desde_cero` | `consumo_kwh_mes_anterior == 0` y `consumo_kwh_mensual > 0`. | Distinguir el inicio de consumo cuando la variación porcentual convencional no es calculable. | Binaria | Nueva o reemplazada |
| `sin_consumo_dos_meses` | Consumo anterior y consumo actual iguales a cero. | Identificar registros sin consumo en los dos meses analizados. | Binaria | Nueva o reemplazada |
| `caida_consumo_a_cero` | Consumo anterior mayor que cero y consumo actual igual a cero. | Identificar una caída completa del consumo y asignar una variación de −100 %. | Binaria | Nueva o reemplazada |
| `respaldo_inconsistente` | La fuente secundaria indica ausencia de respaldo, pero existen horas de respaldo o generación solar positivas. | Auditar contradicciones entre la fuente secundaria y sus variables operativas. | Binaria | Nueva o reemplazada |

### 3.2. Variables energéticas recalculadas

Estas columnas **no son nuevas** en el esquema original, pero se regeneran después de la imputación para mantener coherencia con las variables base corregidas.

| Columna | Cálculo | Propósito | Tipo | Estado |
| --- | --- | --- | --- | --- |
| `consumo_neto_facturado_kwh` | `max(0, consumo_kwh_mensual - generacion_solar_kwh_mensual)` | Representar la energía realmente facturable después de descontar la generación solar. | Continua | Recalculada o reemplazada |
| `costo_estimado_usd` | `consumo_neto_facturado_kwh × 0.75` | Actualizar el costo estimado utilizando el consumo neto facturado. | Continua | Recalculada o reemplazada |
| `consumo_kwh_por_m2` | `consumo_kwh_mensual / superficie_m2` | Normalizar el consumo actual por el tamaño del inmueble. | Continua | Recalculada o reemplazada |
| `consumo_kwh_por_persona` | `consumo_kwh_mensual / num_personas` | Normalizar el consumo actual por el número de residentes. | Continua | Recalculada o reemplazada |
| `variacion_pct_consumo_mensual` | Variación porcentual entre el consumo actual y el anterior, con reglas especiales cuando el consumo anterior es cero. | Representar el cambio mensual del consumo sin generar divisiones entre cero. | Continua | Recalculada o reemplazada |

### 3.3. Variables binarias creadas mediante One-Hot Encoding


#### 3.3.1. Tipo de inmueble

| Columna | Construcción | Propósito | Tipo | Estado |
| --- | --- | --- | --- | --- |
| `tipo_inmueble_Apartamento` | Indicador igual a 1 cuando `tipo_inmueble` corresponde a **Apartamento**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Apartamento** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `tipo_inmueble_Casa Unifamiliar` | Indicador igual a 1 cuando `tipo_inmueble` corresponde a **Casa Unifamiliar**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Casa Unifamiliar** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `tipo_inmueble_Pequeño Establecimiento Comercial` | Indicador igual a 1 cuando `tipo_inmueble` corresponde a **Pequeño Establecimiento Comercial**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Pequeño Establecimiento Comercial** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |

#### 3.3.2. Zona geográfica

| Columna | Construcción | Propósito | Tipo | Estado |
| --- | --- | --- | --- | --- |
| `zona_Suburbana` | Indicador igual a 1 cuando `zona` corresponde a **Suburbana**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Suburbana** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `zona_Urbana Costera` | Indicador igual a 1 cuando `zona` corresponde a **Urbana Costera**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Urbana Costera** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `zona_Urbana Interior` | Indicador igual a 1 cuando `zona` corresponde a **Urbana Interior**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Urbana Interior** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |

#### 3.3.3. Nivel socioeconómico

| Columna | Construcción | Propósito | Tipo | Estado |
| --- | --- | --- | --- | --- |
| `nivel_socioeconomico_Alto` | Indicador igual a 1 cuando `nivel_socioeconomico` corresponde a **Alto**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Alto** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `nivel_socioeconomico_Bajo` | Indicador igual a 1 cuando `nivel_socioeconomico` corresponde a **Bajo**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Bajo** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `nivel_socioeconomico_Medio` | Indicador igual a 1 cuando `nivel_socioeconomico` corresponde a **Medio**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Medio** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |

#### 3.3.4. Mes de referencia

| Columna | Construcción | Propósito | Tipo | Estado |
| --- | --- | --- | --- | --- |
| `mes_referencia_Abril` | Indicador igual a 1 cuando `mes_referencia` corresponde a **Abril**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Abril** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `mes_referencia_Agosto` | Indicador igual a 1 cuando `mes_referencia` corresponde a **Agosto**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Agosto** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `mes_referencia_Diciembre` | Indicador igual a 1 cuando `mes_referencia` corresponde a **Diciembre**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Diciembre** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `mes_referencia_Enero` | Indicador igual a 1 cuando `mes_referencia` corresponde a **Enero**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Enero** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `mes_referencia_Febrero` | Indicador igual a 1 cuando `mes_referencia` corresponde a **Febrero**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Febrero** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `mes_referencia_Julio` | Indicador igual a 1 cuando `mes_referencia` corresponde a **Julio**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Julio** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `mes_referencia_Junio` | Indicador igual a 1 cuando `mes_referencia` corresponde a **Junio**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Junio** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `mes_referencia_Marzo` | Indicador igual a 1 cuando `mes_referencia` corresponde a **Marzo**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Marzo** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `mes_referencia_Mayo` | Indicador igual a 1 cuando `mes_referencia` corresponde a **Mayo**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Mayo** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `mes_referencia_Noviembre` | Indicador igual a 1 cuando `mes_referencia` corresponde a **Noviembre**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Noviembre** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `mes_referencia_Octubre` | Indicador igual a 1 cuando `mes_referencia` corresponde a **Octubre**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Octubre** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `mes_referencia_Septiembre` | Indicador igual a 1 cuando `mes_referencia` corresponde a **Septiembre**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Septiembre** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |

#### 3.3.5. Horario pico de uso

| Columna | Construcción | Propósito | Tipo | Estado |
| --- | --- | --- | --- | --- |
| `horario_pico_uso_Madrugada` | Indicador igual a 1 cuando `horario_pico_uso` corresponde a **Madrugada**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Madrugada** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `horario_pico_uso_Mañana` | Indicador igual a 1 cuando `horario_pico_uso` corresponde a **Mañana**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Mañana** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `horario_pico_uso_Noche` | Indicador igual a 1 cuando `horario_pico_uso` corresponde a **Noche**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Noche** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `horario_pico_uso_Tarde` | Indicador igual a 1 cuando `horario_pico_uso` corresponde a **Tarde**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Tarde** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |

#### 3.3.6. Aislamiento térmico

| Columna | Construcción | Propósito | Tipo | Estado |
| --- | --- | --- | --- | --- |
| `aislamiento_termico_Bueno` | Indicador igual a 1 cuando `aislamiento_termico` corresponde a **Bueno**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Bueno** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `aislamiento_termico_Malo` | Indicador igual a 1 cuando `aislamiento_termico` corresponde a **Malo**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Malo** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `aislamiento_termico_Regular` | Indicador igual a 1 cuando `aislamiento_termico` corresponde a **Regular**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Regular** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |

#### 3.3.7. Fuente de energía secundaria

| Columna | Construcción | Propósito | Tipo | Estado |
| --- | --- | --- | --- | --- |
| `fuente_energia_secundaria_Inversor con baterías` | Indicador igual a 1 cuando `fuente_energia_secundaria` corresponde a **Inversor con baterías**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Inversor con baterías** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `fuente_energia_secundaria_Ninguna` | Indicador igual a 1 cuando `fuente_energia_secundaria` corresponde a **Ninguna**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Ninguna** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `fuente_energia_secundaria_Panel Solar` | Indicador igual a 1 cuando `fuente_energia_secundaria` corresponde a **Panel Solar**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Panel Solar** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |
| `fuente_energia_secundaria_Planta Eléctrica` | Indicador igual a 1 cuando `fuente_energia_secundaria` corresponde a **Planta Eléctrica**; 0 en caso contrario. | Permitir que el modelo utilice la categoría **Planta Eléctrica** sin tratar el texto como una magnitud ordinal. | Binaria | Nueva si la categoría está presente |

### 3.4. Transformaciones que no crean columnas nuevas

- La codificación ordinal temporal sustituye texto por códigos numéricos en las mismas columnas.
- MICE completa valores faltantes sin agregar nuevas columnas.
- La transformación inversa restaura las categorías originales antes del One-Hot Encoding.
- El redondeo y las correcciones determinísticas modifican columnas existentes.
- La reconstrucción de `cantidad_equipos_total` modifica el total existente y queda registrada por `cantidad_equipos_reconstruida`.

## 4. Columnas creadas mediante Feature Engineering

Todas las columnas de esta sección pertenecen a `05_Feature_Engineering(7)(1).ipynb`.

### 4.1. Banderas de divisiones no calculables

Cada bandera se crea únicamente cuando la condición se cumple en al menos una fila. Su valor es 1 en los registros cuyo denominador es cero y 0 en los demás.

| Columna | Condición | Propósito | Tipo | Estado |
| --- | --- | --- | --- | --- |
| `division_por_personas_no_calculable` | `num_personas == 0` | Identificar ratios por persona que se sustituyen por el valor predeterminado. | Binaria | Nueva condicional |
| `division_por_superficie_no_calculable` | `superficie_m2 == 0` | Identificar ratios por superficie que no pueden calcularse. | Binaria | Nueva condicional |
| `division_por_equipos_no_calculable` | `cantidad_equipos_total == 0` | Identificar ratios por equipo que no pueden calcularse. | Binaria | Nueva condicional |
| `division_por_horas_actividad_no_calculable` | `horas_uso_espacios_total == 0` | Identificar ratios por hora de actividad que no pueden calcularse. | Binaria | Nueva condicional |
| `division_por_antiguedad_inmueble_no_calculable` | `antiguedad_construccion_anios == 0` | Identificar el índice de obsolescencia que no puede calcularse. | Binaria | Nueva condicional |
| `division_por_dias_facturacion_no_calculable` | `dias_facturacion == 0` | Identificar medidas diarias o ajustadas por facturación que no pueden calcularse. | Binaria | Nueva condicional |
| `division_por_consumo_anterior_no_calculable` | `consumo_kwh_mes_anterior == 0` | Identificar la tasa de autogeneración que no puede calcularse con el consumo anterior. | Binaria | Nueva condicional |
| `division_por_dias_sin_electricidad_no_calculable` | `dias_sin_electricidad_mes == 0` | Identificar el uso de respaldo por día de corte que no puede calcularse. | Binaria | Nueva condicional |

### 4.2. Ocupación y superficie

| Columna | Cálculo o construcción | Propósito | Tipo |
| --- | --- | --- | --- |
| `superficie_por_persona` | `superficie_m2 / num_personas (usa 0 si no es calculable)`. | Medir el espacio disponible por residente y facilitar comparaciones entre hogares de distinto tamaño. | Continua |
| `densidad_habitacional` | `num_personas / superficie_m2 (usa 0 si no es calculable)`. | Medir la concentración de residentes por metro cuadrado. | Continua |
| `superficie_por_equipo` | `superficie_m2 / cantidad_equipos_total (usa 0 si no es calculable)`. | Medir el espacio disponible por equipo registrado. | Continua |
| `personas_por_equipo` | `num_personas / cantidad_equipos_total (usa 0 si no es calculable)`. | Relacionar el número de residentes con la disponibilidad de equipos. | Continua |

### 4.3. Uso de espacios

| Columna | Cálculo o construcción | Propósito | Tipo |
| --- | --- | --- | --- |
| `horas_uso_espacios_total` | Suma de las horas de cocina, sala, dormitorios, oficina/estudio y lavandería. | Resumir la actividad diaria acumulada en los principales espacios del inmueble. | Continua |
| `horas_uso_espacios_promedio` | Promedio de las horas de uso de cocina, sala, dormitorios, oficina/estudio y lavandería. | Representar el nivel medio de uso de los espacios. | Continua |
| `uso_espacios_por_persona` | `horas_uso_espacios_total / num_personas (usa 0 si no es calculable)`. | Normalizar el uso total de espacios por persona. | Continua |
| `uso_espacios_por_m2` | `horas_uso_espacios_total / superficie_m2 (usa 0 si no es calculable)`. | Normalizar el uso total de espacios por metro cuadrado. | Continua |
| `cantidad_espacios_activos` | Cantidad de espacios con horas de uso mayores que cero. | Contabilizar cuántos espacios presentan actividad. | Discreta |
| `indice_permanencia_hogar` | Horas totales de uso de espacios divididas entre 120 horas (`24 × 5`), restringidas al intervalo [0, 1]. | Aproximar el grado de permanencia y ocupación cotidiana del hogar. | Continua |
| `proporcion_uso_cocina` | `horas_dia_cocina / horas_uso_espacios_total (usa 0 si no es calculable)`. | Medir qué proporción de la actividad total se concentra en cocina. | Continua |
| `proporcion_uso_sala` | `horas_dia_sala_estar / horas_uso_espacios_total (usa 0 si no es calculable)`. | Medir qué proporción de la actividad total se concentra en sala. | Continua |
| `proporcion_uso_dormitorios` | `horas_dia_dormitorios / horas_uso_espacios_total (usa 0 si no es calculable)`. | Medir qué proporción de la actividad total se concentra en dormitorios. | Continua |
| `proporcion_uso_oficina` | `horas_dia_oficina_estudio / horas_uso_espacios_total (usa 0 si no es calculable)`. | Medir qué proporción de la actividad total se concentra en oficina. | Continua |
| `proporcion_uso_lavanderia` | `horas_dia_lavanderia / horas_uso_espacios_total (usa 0 si no es calculable)`. | Medir qué proporción de la actividad total se concentra en lavanderia. | Continua |
| `indice_teletrabajo` | `horas_dia_oficina_estudio / 24 (usa 0 si no es calculable)`. | Aproximar la intensidad de trabajo o estudio desde el hogar. | Continua |
| `indice_actividad_domestica` | Suma de las horas de cocina y lavandería. | Resumir la actividad asociada a cocina y lavandería. | Continua |

### 4.4. Aire acondicionado y demanda térmica

| Columna | Cálculo o construcción | Propósito | Tipo |
| --- | --- | --- | --- |
| `grados_calor` | `max(temperatura_promedio_c - 24, 0)`. | Medir el exceso de temperatura por encima del umbral de 24 °C. | Continua |
| `carga_operativa_aa` | `cantidad_unidades_aa × horas_uso_aa_dia`. | Representar la intensidad básica de operación del aire acondicionado. | Continua |
| `carga_climatica_aa` | `carga_operativa_aa * grados_calor`. | Combinar el uso del aire acondicionado con la presión térmica. | Continua |
| `unidades_aa_por_persona` | `cantidad_unidades_aa / num_personas (usa 0 si no es calculable)`. | Normalizar unidades aire acondicionado por el número de residentes. | Continua |
| `unidades_aa_por_m2` | `cantidad_unidades_aa / superficie_m2 (usa 0 si no es calculable)`. | Normalizar unidades aire acondicionado por la superficie del inmueble. | Continua |
| `horas_aa_por_persona` | `horas_uso_aa_dia / num_personas (usa 0 si no es calculable)`. | Normalizar horas aire acondicionado por el número de residentes. | Continua |
| `intensidad_aa_por_persona` | `carga_operativa_aa / num_personas (usa 0 si no es calculable)`. | Normalizar intensidad aire acondicionado por el número de residentes. | Continua |
| `intensidad_aa_por_m2` | `carga_operativa_aa / superficie_m2 (usa 0 si no es calculable)`. | Normalizar intensidad aire acondicionado por la superficie del inmueble. | Continua |
| `aa_ajustado_por_aislamiento` | `carga_operativa_aa * factor_aislamiento`. | Ajustar la operación del aire acondicionado según la calidad del aislamiento. | Continua |
| `demanda_termica_estimada` | `grados_calor × superficie_m2 × factor_aislamiento`. | Aproximar la demanda térmica del inmueble. | Continua |
| `exposicion_termica` | `grados_calor * superficie_m2`. | Combinar el exceso de temperatura con la superficie expuesta. | Continua |
| `temperatura_aislamiento_malo` | `temperatura_promedio_c * aislamiento_termico_Malo`. | Aislar el efecto de la temperatura en inmuebles con aislamiento malo. | Continua |
| `temperatura_aislamiento_regular` | `temperatura_promedio_c * aislamiento_termico_Regular`. | Aislar el efecto de la temperatura en inmuebles con aislamiento regular. | Continua |
| `temperatura_aislamiento_bueno` | `temperatura_promedio_c * aislamiento_termico_Bueno`. | Aislar el efecto de la temperatura en inmuebles con aislamiento bueno. | Continua |

### 4.5. Equipamiento y tecnología

| Columna | Cálculo o construcción | Propósito | Tipo |
| --- | --- | --- | --- |
| `equipos_por_persona` | `cantidad_equipos_total / num_personas (usa 0 si no es calculable)`. | Normalizar equipos por el número de residentes. | Continua |
| `equipos_por_m2` | `cantidad_equipos_total / superficie_m2 (usa 0 si no es calculable)`. | Normalizar equipos por la superficie del inmueble. | Continua |
| `carga_tecnologica` | `cantidad_tv_o_pantallas + 1.5 × cantidad_computadoras + 0.5 × otros_equipos_pequenos`. | Aproximar la carga relativa del conjunto de equipos tecnológicos. | Continua |
| `carga_tecnologica_por_persona` | `carga_tecnologica / num_personas (usa 0 si no es calculable)`. | Normalizar carga tecnologica por el número de residentes. | Continua |
| `carga_tecnologica_por_m2` | `carga_tecnologica / superficie_m2 (usa 0 si no es calculable)`. | Normalizar carga tecnologica por la superficie del inmueble. | Continua |
| `cantidad_equipos_alto_consumo` | `cantidad_unidades_aa + tiene_lavadora + tiene_calentador_agua_electrico`. | Contabilizar equipos asociados a un consumo elevado. | Discreta |
| `equipos_alto_consumo_por_persona` | `cantidad_equipos_alto_consumo / num_personas (usa 0 si no es calculable)`. | Normalizar equipos alto consumo por el número de residentes. | Continua |
| `equipos_alto_consumo_por_m2` | `cantidad_equipos_alto_consumo / superficie_m2 (usa 0 si no es calculable)`. | Normalizar equipos alto consumo por la superficie del inmueble. | Continua |
| `carga_equipos_antiguos` | `cantidad_equipos_total * antiguedad_electrodomesticos_anios`. | Combinar cantidad y antigüedad de los equipos para representar obsolescencia potencial. | Continua |
| `carga_equipos_antiguos_por_persona` | `cantidad_equipos_total * antiguedad_electrodomesticos_anios / num_personas (usa 0 si no es calculable)`. | Normalizar carga equipos antiguos por el número de residentes. | Continua |
| `indice_obsolescencia_equipos` | `antiguedad_electrodomesticos_anios / antiguedad_construccion_anios (usa 0 si no es calculable)`. | Comparar la antigüedad de los equipos con la del inmueble. | Continua |
| `brecha_antiguedad_inmueble_equipos` | `antiguedad_construccion_anios - antiguedad_electrodomesticos_anios`. | Medir la diferencia de antigüedad entre el inmueble y sus electrodomésticos. | Continua |

### 4.6. Iluminación

| Columna | Cálculo o construcción | Propósito | Tipo |
| --- | --- | --- | --- |
| `proporcion_iluminacion_led` | `pct_iluminacion_led / 100`, restringido previamente al intervalo [0, 1]. | Representar la fracción de iluminación eficiente. | Continua |
| `cantidad_focos_led` | `cantidad_focos × proporcion_iluminacion_led`. | Estimar la cantidad de focos LED. | Continua |
| `cantidad_focos_no_led` | `cantidad_focos - cantidad_focos_led`. | Estimar la cantidad de focos no LED. | Continua |
| `focos_por_persona` | `cantidad_focos / num_personas (usa 0 si no es calculable)`. | Normalizar focos por el número de residentes. | Continua |
| `focos_por_m2` | `cantidad_focos / superficie_m2 (usa 0 si no es calculable)`. | Normalizar focos por la superficie del inmueble. | Continua |
| `carga_iluminacion_total` | `carga_iluminacion_led + carga_iluminacion_no_led`. | Representar la intensidad total de uso de iluminación. | Continua |
| `carga_iluminacion_led` | `cantidad_focos_led × horas_uso_iluminacion_dia`. | Representar la carga asociada a focos LED. | Continua |
| `carga_iluminacion_no_led` | `cantidad_focos_no_led × horas_uso_iluminacion_dia`. | Representar la carga asociada a focos no LED. | Continua |
| `carga_iluminacion_por_persona` | `carga_iluminacion_total / num_personas (usa 0 si no es calculable)`. | Normalizar carga iluminacion por el número de residentes. | Continua |
| `carga_iluminacion_por_m2` | `carga_iluminacion_total / superficie_m2 (usa 0 si no es calculable)`. | Normalizar carga iluminacion por la superficie del inmueble. | Continua |
| `indice_ineficiencia_iluminacion` | `(1 - pct_iluminacion_led / 100) * horas_iluminacion`. | Aproximar el uso de iluminación no eficiente. | Continua |

### 4.7. Consumo histórico

| Columna | Cálculo o construcción | Propósito | Tipo |
| --- | --- | --- | --- |
| `consumo_anterior_diario` | `consumo_kwh_mes_anterior / dias_facturacion (usa 0 si no es calculable)`. | Expresar consumo anterior como una medida diaria. | Continua |
| `consumo_anterior_por_persona` | `consumo_kwh_mes_anterior / num_personas (usa 0 si no es calculable)`. | Normalizar consumo anterior por el número de residentes. | Continua |
| `consumo_anterior_por_m2` | `consumo_kwh_mes_anterior / superficie_m2 (usa 0 si no es calculable)`. | Normalizar consumo anterior por la superficie del inmueble. | Continua |
| `consumo_anterior_por_equipo` | `consumo_kwh_mes_anterior / cantidad_equipos_total (usa 0 si no es calculable)`. | Normalizar consumo anterior por la cantidad total de equipos. | Continua |
| `consumo_anterior_por_hora_actividad` | `consumo_kwh_mes_anterior / horas_uso_espacios_total (usa 0 si no es calculable)`. | Normalizar consumo anterior por las horas totales de actividad. | Continua |
| `consumo_anterior_ajustado_facturacion` | `consumo_kwh_mes_anterior / dias_facturacion (usa 0 si no es calculable) * 30`. | Estandarizar el consumo anterior a un periodo de 30 días. | Continua |
| `cambio_consumo_estimado` | `consumo_kwh_mes_anterior * variacion_pct_consumo_mensual / 100`. | Estimar el cambio absoluto esperado a partir de la variación observada. | Continua |
| `consumo_estimado_tendencia` | `consumo_kwh_mes_anterior * (1 + variacion_pct_consumo_mensual / 100)`. | Estimar el consumo siguiendo la tendencia mensual registrada. | Continua |
| `variacion_consumo_absoluta_estimada` | `consumo_kwh_mes_anterior * variacion_pct_consumo_mensual / 100`. | Cuantificar el cambio estimado del consumo en unidades de energía. | Continua |
| `variacion_consumo_magnitud` | `variacion_pct_consumo_mensual / 100 en valor absoluto`. | Representar la magnitud del cambio sin considerar su dirección. | Continua |

### 4.8. Generación solar

| Columna | Cálculo o construcción | Propósito | Tipo |
| --- | --- | --- | --- |
| `generacion_solar_diaria` | `generacion_solar_kwh_mensual / dias_facturacion (usa 0 si no es calculable)`. | Expresar generacion solar como una medida diaria. | Continua |
| `generacion_solar_por_persona` | `generacion_solar_kwh_mensual / num_personas (usa 0 si no es calculable)`. | Normalizar generacion solar por el número de residentes. | Continua |
| `generacion_solar_por_m2` | `generacion_solar_kwh_mensual / superficie_m2 (usa 0 si no es calculable)`. | Normalizar generacion solar por la superficie del inmueble. | Continua |
| `tasa_autogeneracion_solar_previa` | `generacion_solar_kwh_mensual / consumo_kwh_mes_anterior`; usa 0 si no es calculable y restringe valores negativos. | Medir qué proporción del consumo anterior podría cubrir la generación solar. | Continua |
| `brecha_energetica_previa` | `generacion_solar_kwh_mensual - consumo_kwh_mes_anterior`. | Medir el saldo entre generación solar y consumo anterior. | Continua |
| `saldo_solar_por_persona` | `brecha_energetica_previa / num_personas (usa 0 si no es calculable)`. | Normalizar saldo solar por el número de residentes. | Continua |
| `saldo_solar_por_m2` | `brecha_energetica_previa / superficie_m2 (usa 0 si no es calculable)`. | Normalizar saldo solar por la superficie del inmueble. | Continua |
| `dependencia_red_estimada` | `(1 - tasa_autogeneracion_previa), restringido a [0, 1]`. | Aproximar la proporción de energía que todavía depende de la red. | Continua |
| `tiene_generacion_solar` | `generacion_solar_kwh_mensual > 0`. | Identificar registros con generación solar positiva. | Binaria |
| `intensidad_generacion_solar` | `generacion_solar_kwh_mensual / superficie_m2 (usa 0 si no es calculable)`. | Medir intensidad generacion solar. | Continua |

### 4.9. Cortes eléctricos y respaldo

| Columna | Cálculo o construcción | Propósito | Tipo |
| --- | --- | --- | --- |
| `intensidad_cortes` | `dias_sin_electricidad_mes * horas_uso_planta_o_inversor_mes`. | Combinar frecuencia de cortes y horas de respaldo utilizadas. | Continua |
| `frecuencia_cortes_relativa` | `dias_sin_electricidad_mes / dias_facturacion`, restringido al intervalo [0, 1]. | Normalizar los días sin electricidad por la duración de la facturación. | Continua |
| `uso_respaldo_por_dia_corte` | `horas_uso_planta_o_inversor_mes / dias_sin_electricidad_mes (usa 0 si no es calculable)`. | Representar uso respaldo por dia corte como una característica adicional para el modelo. | Continua |
| `uso_respaldo_diario` | `horas_uso_planta_o_inversor_mes / dias_facturacion (usa 0 si no es calculable)`. | Expresar uso respaldo como una medida diaria. | Continua |
| `dependencia_respaldo` | `horas_uso_planta_o_inversor_mes > 0`. | Identificar registros que utilizan alguna fuente de respaldo. | Binaria |
| `cobertura_respaldo_estimada` | `horas_uso_planta_o_inversor_mes / (dias_sin_electricidad_mes × 24)`, restringido al intervalo [0, 1]. | Estimar qué proporción del tiempo sin electricidad está cubierta por el respaldo. | Continua |
| `cortes_con_planta` | `dias_sin_electricidad_mes * fuente_energia_secundaria_Planta Eléctrica`. | Representar los días de corte asociados al uso de planta. | Continua |
| `cortes_con_inversor` | `dias_sin_electricidad_mes * fuente_energia_secundaria_Inversor con baterías`. | Representar los días de corte asociados al uso de inversor. | Continua |
| `cortes_con_panel_solar` | `dias_sin_electricidad_mes * fuente_energia_secundaria_Panel Solar`. | Representar los días de corte asociados al uso de panel solar. | Continua |
| `cortes_sin_respaldo` | `dias_sin_electricidad_mes * fuente_energia_secundaria_Ninguna`. | Representar los días sin electricidad en registros que no disponen de respaldo. | Continua |
| `indice_vulnerabilidad_electrica` | `frecuencia_cortes_relativa × (1 - cobertura_respaldo_estimada) × (fuente_energia_secundaria_Ninguna + 1)`. | Resumir la exposición a cortes y la falta de cobertura de respaldo. | Continua |

### 4.10. Interacciones con el tipo de inmueble

| Columna | Cálculo o construcción | Propósito | Tipo |
| --- | --- | --- | --- |
| `superficie_apartamento` | `superficie_m2 * tipo_inmueble_Apartamento`. | Aislar superficie para la categoría de inmueble apartamento. | Continua |
| `superficie_casa` | `superficie_m2 * tipo_inmueble_Casa Unifamiliar`. | Aislar superficie para la categoría de inmueble casa. | Continua |
| `superficie_comercial` | `superficie_m2 * tipo_inmueble_Pequeño Establecimiento Comercial`. | Aislar superficie para la categoría de inmueble comercial. | Continua |
| `ocupacion_apartamento` | `num_personas * tipo_inmueble_Apartamento`. | Aislar ocupacion para la categoría de inmueble apartamento. | Continua |
| `ocupacion_casa` | `num_personas * tipo_inmueble_Casa Unifamiliar`. | Aislar ocupacion para la categoría de inmueble casa. | Continua |
| `ocupacion_comercial` | `num_personas * tipo_inmueble_Pequeño Establecimiento Comercial`. | Aislar ocupacion para la categoría de inmueble comercial. | Continua |
| `equipos_apartamento` | `cantidad_equipos_total * tipo_inmueble_Apartamento`. | Aislar equipos para la categoría de inmueble apartamento. | Continua |
| `equipos_casa` | `cantidad_equipos_total * tipo_inmueble_Casa Unifamiliar`. | Aislar equipos para la categoría de inmueble casa. | Continua |
| `equipos_comercial` | `cantidad_equipos_total * tipo_inmueble_Pequeño Establecimiento Comercial`. | Aislar equipos para la categoría de inmueble comercial. | Continua |
| `actividad_comercial_estimada` | `horas_uso_espacios_total * tipo_inmueble_Pequeño Establecimiento Comercial`. | Representar actividad comercial estimada como una característica adicional para el modelo. | Continua |
| `consumo_anterior_comercial` | `consumo_kwh_mes_anterior * tipo_inmueble_Pequeño Establecimiento Comercial`. | Aislar consumo anterior para la categoría de inmueble comercial. | Continua |

### 4.11. Aislamiento y antigüedad

| Columna | Cálculo o construcción | Propósito | Tipo |
| --- | --- | --- | --- |
| `factor_aislamiento` | `1.30` para aislamiento malo, `1.00` para regular y `0.70` para bueno; usa `1` si ninguna categoría queda activa. | Representar numéricamente la eficiencia térmica relativa del aislamiento. | Continua |
| `antiguedad_aislamiento_malo` | `antiguedad_construccion_anios * aislamiento_termico_Malo`. | Aislar la antigüedad de los inmuebles con aislamiento malo. | Continua |
| `antiguedad_aislamiento_regular` | `antiguedad_construccion_anios * aislamiento_termico_Regular`. | Aislar la antigüedad de los inmuebles con aislamiento regular. | Continua |
| `antiguedad_aislamiento_bueno` | `antiguedad_construccion_anios * aislamiento_termico_Bueno`. | Aislar la antigüedad de los inmuebles con aislamiento bueno. | Continua |
| `demanda_termica_por_antiguedad` | `demanda_termica_estimada * antiguedad_construccion_anios`. | Combinar demanda térmica y antigüedad para capturar deterioro estructural potencial. | Continua |
| `indice_ineficiencia_constructiva` | `factor_aislamiento * antiguedad_construccion_anios`. | Combinar antigüedad y factor de aislamiento en una medida de ineficiencia. | Continua |
| `inmueble_antiguo` | `antiguedad_construccion_anios >= 30`. | Identificar inmuebles con al menos 30 años. | Binaria |
| `electrodomesticos_antiguos` | `antiguedad_electrodomesticos_anios >= 10`. | Identificar electrodomésticos con al menos 10 años. | Binaria |
| `inmueble_y_equipos_antiguos` | `(antiguedad_construccion_anios >= 30 AND antiguedad_electrodomesticos_anios >= 10)`. | Identificar registros donde el inmueble y los equipos superan ambos umbrales de antigüedad. | Binaria |

### 4.12. Estacionalidad

| Columna | Cálculo o construcción | Propósito | Tipo |
| --- | --- | --- | --- |
| `mes_numero` | Reconstrucción de un número entre 1 y 12 a partir de las doce columnas binarias del mes. | Recuperar una representación numérica del mes para crear variables estacionales. | Discreta |
| `mes_sin` | `sin(2π × mes_numero / 12)`. | Representar la posición cíclica del mes mediante el componente seno. | Continua |
| `mes_cos` | `cos(2π × mes_numero / 12)`. | Representar la posición cíclica del mes mediante el componente coseno. | Continua |
| `temperatura_estacional` | `temperatura_promedio_c * mes_sin`. | Capturar la interacción entre temperatura y estacionalidad. | Continua |
| `aa_temporada_calida` | `carga_operativa_aa * grados_calor`. | Capturar el uso del aire acondicionado bajo presión térmica. | Continua |
| `generacion_solar_estacional` | `generacion_solar_kwh_mensual * mes_sin`. | Capturar variaciones estacionales de la generación solar. | Continua |
| `consumo_anterior_estacional` | `consumo_kwh_mes_anterior * mes_sin`. | Capturar variaciones estacionales del consumo histórico. | Continua |

### 4.13. Horario pico

| Columna | Cálculo o construcción | Propósito | Tipo |
| --- | --- | --- | --- |
| `pico_uso_diurno` | `(horario_pico_uso_Mañana + horario_pico_uso_Tarde), con máximo 1`. | Identificar horarios pico de mañana o tarde. | Binaria |
| `pico_uso_nocturno` | `(horario_pico_uso_Noche + horario_pico_uso_Madrugada), con máximo 1`. | Identificar horarios pico de noche o madrugada. | Binaria |
| `aa_en_horario_calido` | `carga_operativa_aa * horario_pico_uso_Tarde`. | Capturar el uso del aire acondicionado cuando el pico ocurre en la tarde. | Continua |
| `iluminacion_en_horario_nocturno` | `carga_iluminacion_total * (horario_pico_uso_Noche + horario_pico_uso_Madrugada), con máximo 1`. | Capturar la carga de iluminación cuando el pico ocurre de noche o madrugada. | Continua |
| `actividad_en_horario_pico` | `horas_uso_espacios_total`. | Aportar el nivel total de actividad doméstica como señal del horario pico. | Continua |

### 4.14. Interacciones con la zona geográfica

| Columna | Cálculo o construcción | Propósito | Tipo |
| --- | --- | --- | --- |
| `temperatura_zona_costera` | `temperatura_promedio_c * zona_Urbana Costera`. | Aislar temperatura para la zona costera. | Continua |
| `temperatura_zona_interior` | `temperatura_promedio_c * zona_Urbana Interior`. | Aislar temperatura para la zona interior. | Continua |
| `temperatura_zona_suburbana` | `temperatura_promedio_c * zona_Suburbana`. | Aislar temperatura para la zona suburbana. | Continua |
| `aa_zona_costera` | `carga_operativa_aa * zona_Urbana Costera`. | Aislar aire acondicionado para la zona costera. | Continua |
| `aa_zona_interior` | `carga_operativa_aa * zona_Urbana Interior`. | Aislar aire acondicionado para la zona interior. | Continua |
| `generacion_solar_zona_costera` | `generacion_solar_kwh_mensual * zona_Urbana Costera`. | Aislar generacion solar para la zona costera. | Continua |
| `generacion_solar_zona_interior` | `generacion_solar_kwh_mensual * zona_Urbana Interior`. | Aislar generacion solar para la zona interior. | Continua |
| `generacion_solar_zona_suburbana` | `generacion_solar_kwh_mensual * zona_Suburbana`. | Aislar generacion solar para la zona suburbana. | Continua |
| `vulnerabilidad_zona_costera` | `indice_vulnerabilidad_electrica * zona_Urbana Costera`. | Aislar vulnerabilidad para la zona costera. | Continua |
| `vulnerabilidad_zona_interior` | `indice_vulnerabilidad_electrica * zona_Urbana Interior`. | Aislar vulnerabilidad para la zona interior. | Continua |
| `vulnerabilidad_zona_suburbana` | `indice_vulnerabilidad_electrica * zona_Suburbana`. | Aislar vulnerabilidad para la zona suburbana. | Continua |

### 4.15. Interacciones con el nivel socioeconómico

| Columna | Cálculo o construcción | Propósito | Tipo |
| --- | --- | --- | --- |
| `equipos_nivel_alto` | `cantidad_equipos_total * nivel_socioeconomico_Alto`. | Aislar equipos para el nivel socioeconómico alto. | Continua |
| `equipos_nivel_medio` | `cantidad_equipos_total * nivel_socioeconomico_Medio`. | Aislar equipos para el nivel socioeconómico medio. | Continua |
| `equipos_nivel_bajo` | `cantidad_equipos_total * nivel_socioeconomico_Bajo`. | Aislar equipos para el nivel socioeconómico bajo. | Continua |
| `aa_nivel_alto` | `carga_operativa_aa * nivel_socioeconomico_Alto`. | Aislar aire acondicionado para el nivel socioeconómico alto. | Continua |
| `aa_nivel_medio` | `carga_operativa_aa * nivel_socioeconomico_Medio`. | Aislar aire acondicionado para el nivel socioeconómico medio. | Continua |
| `aa_nivel_bajo` | `carga_operativa_aa * nivel_socioeconomico_Bajo`. | Aislar aire acondicionado para el nivel socioeconómico bajo. | Continua |
| `superficie_nivel_alto` | `superficie_m2 * nivel_socioeconomico_Alto`. | Aislar superficie para el nivel socioeconómico alto. | Continua |
| `superficie_nivel_medio` | `superficie_m2 * nivel_socioeconomico_Medio`. | Aislar superficie para el nivel socioeconómico medio. | Continua |
| `superficie_nivel_bajo` | `superficie_m2 * nivel_socioeconomico_Bajo`. | Aislar superficie para el nivel socioeconómico bajo. | Continua |
| `consumo_anterior_nivel_alto` | `consumo_kwh_mes_anterior * nivel_socioeconomico_Alto`. | Aislar consumo anterior para el nivel socioeconómico alto. | Continua |
| `consumo_anterior_nivel_medio` | `consumo_kwh_mes_anterior * nivel_socioeconomico_Medio`. | Aislar consumo anterior para el nivel socioeconómico medio. | Continua |
| `consumo_anterior_nivel_bajo` | `consumo_kwh_mes_anterior * nivel_socioeconomico_Bajo`. | Aislar consumo anterior para el nivel socioeconómico bajo. | Continua |

### 4.16. Interacciones con la certificación energética

| Columna | Cálculo o construcción | Propósito | Tipo |
| --- | --- | --- | --- |
| `certificacion_por_antiguedad` | `certificacion_energetica_previa * antiguedad_construccion_anios`. | Crear una interacción entre la certificación energética y otra característica relevante. | Continua |
| `certificacion_por_aislamiento` | `certificacion_energetica_previa * factor_aislamiento`. | Crear una interacción entre la certificación energética y otra característica relevante. | Continua |
| `certificacion_y_led` | `certificacion_energetica_previa * pct_iluminacion_led / 100`. | Crear una interacción entre la certificación energética y otra característica relevante. | Continua |
| `certificacion_y_consumo_anterior` | `certificacion_energetica_previa * consumo_kwh_mes_anterior`. | Crear una interacción entre la certificación energética y otra característica relevante. | Continua |

### 4.17. Variables derivadas de las banderas de calidad

| Columna | Cálculo o construcción | Propósito | Tipo |
| --- | --- | --- | --- |
| `cantidad_banderas_activas` | Suma por fila de todas las banderas de calidad disponibles y de las banderas de división creadas. | Resumir la cantidad total de incidencias de calidad detectadas en cada registro. | Discreta |
| `cantidad_variables_imputadas` | Suma de las banderas terminadas en `_era_nulo` seleccionadas por el notebook. | Contabilizar cuántas variables del registro fueron imputadas. | Discreta |
| `cantidad_correcciones_deterministicas` | Suma de las banderas de corrección determinística seleccionadas. | Contabilizar cuántas correcciones determinísticas recibió el registro. | Discreta |
| `cantidad_inconsistencias` | Suma de las banderas de inconsistencias de equipos, aire acondicionado, iluminación y respaldo. | Contabilizar las inconsistencias operativas detectadas. | Discreta |
| `cantidad_anomalias_consumo` | Suma de las banderas `inicio_consumo_desde_cero`, `sin_consumo_dos_meses` y `caida_consumo_a_cero`. | Contabilizar patrones especiales o anómalos del consumo. | Discreta |

### 4.18. Indicadores generales de calidad y confiabilidad

| Columna | Cálculo o condición | Propósito | Tipo |
| --- | --- | --- | --- |
| `tiene_alguna_inconsistencia` | Indicador igual a 1 cuando `cantidad_inconsistencias > 0`. | Identificar registros con al menos una inconsistencia. | Binaria |
| `tiene_alguna_variable_imputada` | Indicador igual a 1 cuando `cantidad_variables_imputadas > 0`. | Identificar registros que contienen al menos una variable imputada. | Binaria |
| `tiene_alguna_correccion` | Indicador igual a 1 cuando `cantidad_correcciones_deterministicas > 0`. | Identificar registros que recibieron al menos una corrección. | Binaria |
| `inconsistencia_operativa` | OR lógico entre `aa_inconsistente`, `iluminacion_inconsistente` y `respaldo_inconsistente`. | Resumir inconsistencias de aire acondicionado, iluminación o respaldo. | Binaria |
| `inconsistencia_consumo` | Indicador igual a 1 cuando existe al menos una anomalía de consumo. | Identificar registros con alguna anomalía de consumo. | Binaria |
| `patron_consumo_cero` | OR lógico entre las tres banderas de casos especiales de consumo cero. | Identificar patrones relacionados con consumos iguales a cero. | Binaria |
| `patron_cambio_extremo_consumo` | Indicador igual a 1 cuando la magnitud de la variación decimal del consumo es al menos 1. | Identificar variaciones mensuales de magnitud igual o superior al 100 %. | Binaria |
| `consumo_historico_anomalo` | Indicador igual a 1 cuando existe una anomalía de consumo o una variación absoluta de al menos 100 %. | Identificar consumo histórico con condiciones especiales o cambios extremos. | Binaria |
| `registro_consumo_no_confiable` | Indicador igual a 1 por anomalía de consumo, consumo anterior imputado o variación absoluta de al menos 100 %. | Marcar registros cuyo historial de consumo puede ser menos confiable. | Binaria |

### 4.19. Índice de calidad del registro

| Columna | Cálculo | Propósito | Tipo |
| --- | --- | --- | --- |
| `indice_calidad_registro` | `1 - (cantidad_banderas_activas / total_banderas)`, restringido al intervalo [0, 1]. | Resumir la calidad del registro en una escala de 0 a 1; valores mayores indican menos banderas activas. | Continua |

## 5. Tabla consolidada de nuevas columnas

| Columna | Documento | Categoría | Estado |
| --- | --- | --- | --- |
| `aa_ajustado_por_aislamiento` | 05_Feature_Engineering(7)(1).ipynb | Aire Acondicionado | Nueva |
| `aa_en_horario_calido` | 05_Feature_Engineering(7)(1).ipynb | Horario Pico | Nueva |
| `aa_inconsistente` | 04_Imputacion_Variables(13)(1).ipynb | Banderas de imputación | Nueva o reemplazada |
| `aa_nivel_alto` | 05_Feature_Engineering(7)(1).ipynb | Nivel Socioeconómico | Nueva |
| `aa_nivel_bajo` | 05_Feature_Engineering(7)(1).ipynb | Nivel Socioeconómico | Nueva |
| `aa_nivel_medio` | 05_Feature_Engineering(7)(1).ipynb | Nivel Socioeconómico | Nueva |
| `aa_temporada_calida` | 05_Feature_Engineering(7)(1).ipynb | Estacionalidad | Nueva |
| `aa_zona_costera` | 05_Feature_Engineering(7)(1).ipynb | Zona | Nueva |
| `aa_zona_interior` | 05_Feature_Engineering(7)(1).ipynb | Zona | Nueva |
| `actividad_comercial_estimada` | 05_Feature_Engineering(7)(1).ipynb | Tipo De Inmueble | Nueva |
| `actividad_en_horario_pico` | 05_Feature_Engineering(7)(1).ipynb | Horario Pico | Nueva |
| `aislamiento_termico_Bueno` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Aislamiento térmico | Nueva si la categoría está presente |
| `aislamiento_termico_Malo` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Aislamiento térmico | Nueva si la categoría está presente |
| `aislamiento_termico_Regular` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Aislamiento térmico | Nueva si la categoría está presente |
| `antiguedad_aislamiento_bueno` | 05_Feature_Engineering(7)(1).ipynb | Aislamiento Y Antigüedad | Nueva |
| `antiguedad_aislamiento_malo` | 05_Feature_Engineering(7)(1).ipynb | Aislamiento Y Antigüedad | Nueva |
| `antiguedad_aislamiento_regular` | 05_Feature_Engineering(7)(1).ipynb | Aislamiento Y Antigüedad | Nueva |
| `brecha_antiguedad_inmueble_equipos` | 05_Feature_Engineering(7)(1).ipynb | Equipamiento | Nueva |
| `brecha_energetica_previa` | 05_Feature_Engineering(7)(1).ipynb | Energía Solar | Nueva |
| `caida_consumo_a_cero` | 04_Imputacion_Variables(13)(1).ipynb | Banderas de imputación | Nueva o reemplazada |
| `cambio_consumo_estimado` | 05_Feature_Engineering(7)(1).ipynb | Consumo Histórico | Nueva |
| `cantidad_anomalias_consumo` | 05_Feature_Engineering(7)(1).ipynb | Calidad y confiabilidad del registro | Nueva |
| `cantidad_banderas_activas` | 05_Feature_Engineering(7)(1).ipynb | Calidad y confiabilidad del registro | Nueva |
| `cantidad_correcciones_deterministicas` | 05_Feature_Engineering(7)(1).ipynb | Calidad y confiabilidad del registro | Nueva |
| `cantidad_equipos_alto_consumo` | 05_Feature_Engineering(7)(1).ipynb | Equipamiento | Nueva |
| `cantidad_equipos_reconstruida` | 04_Imputacion_Variables(13)(1).ipynb | Banderas de imputación | Nueva o reemplazada |
| `cantidad_espacios_activos` | 05_Feature_Engineering(7)(1).ipynb | Uso De Espacios | Nueva |
| `cantidad_focos_led` | 05_Feature_Engineering(7)(1).ipynb | Iluminación | Nueva |
| `cantidad_focos_no_led` | 05_Feature_Engineering(7)(1).ipynb | Iluminación | Nueva |
| `cantidad_inconsistencias` | 05_Feature_Engineering(7)(1).ipynb | Calidad y confiabilidad del registro | Nueva |
| `cantidad_variables_imputadas` | 05_Feature_Engineering(7)(1).ipynb | Calidad y confiabilidad del registro | Nueva |
| `carga_climatica_aa` | 05_Feature_Engineering(7)(1).ipynb | Aire Acondicionado | Nueva |
| `carga_equipos_antiguos` | 05_Feature_Engineering(7)(1).ipynb | Equipamiento | Nueva |
| `carga_equipos_antiguos_por_persona` | 05_Feature_Engineering(7)(1).ipynb | Equipamiento | Nueva |
| `carga_iluminacion_led` | 05_Feature_Engineering(7)(1).ipynb | Iluminación | Nueva |
| `carga_iluminacion_no_led` | 05_Feature_Engineering(7)(1).ipynb | Iluminación | Nueva |
| `carga_iluminacion_por_m2` | 05_Feature_Engineering(7)(1).ipynb | Iluminación | Nueva |
| `carga_iluminacion_por_persona` | 05_Feature_Engineering(7)(1).ipynb | Iluminación | Nueva |
| `carga_iluminacion_total` | 05_Feature_Engineering(7)(1).ipynb | Iluminación | Nueva |
| `carga_operativa_aa` | 05_Feature_Engineering(7)(1).ipynb | Aire Acondicionado | Nueva |
| `carga_tecnologica` | 05_Feature_Engineering(7)(1).ipynb | Equipamiento | Nueva |
| `carga_tecnologica_por_m2` | 05_Feature_Engineering(7)(1).ipynb | Equipamiento | Nueva |
| `carga_tecnologica_por_persona` | 05_Feature_Engineering(7)(1).ipynb | Equipamiento | Nueva |
| `certificacion_por_aislamiento` | 05_Feature_Engineering(7)(1).ipynb | Certificación | Nueva |
| `certificacion_por_antiguedad` | 05_Feature_Engineering(7)(1).ipynb | Certificación | Nueva |
| `certificacion_y_consumo_anterior` | 05_Feature_Engineering(7)(1).ipynb | Certificación | Nueva |
| `certificacion_y_led` | 05_Feature_Engineering(7)(1).ipynb | Certificación | Nueva |
| `cobertura_respaldo_estimada` | 05_Feature_Engineering(7)(1).ipynb | Cortes Y Respaldo | Nueva |
| `consumo_anterior_ajustado_facturacion` | 05_Feature_Engineering(7)(1).ipynb | Consumo Histórico | Nueva |
| `consumo_anterior_comercial` | 05_Feature_Engineering(7)(1).ipynb | Tipo De Inmueble | Nueva |
| `consumo_anterior_diario` | 05_Feature_Engineering(7)(1).ipynb | Consumo Histórico | Nueva |
| `consumo_anterior_estacional` | 05_Feature_Engineering(7)(1).ipynb | Estacionalidad | Nueva |
| `consumo_anterior_nivel_alto` | 05_Feature_Engineering(7)(1).ipynb | Nivel Socioeconómico | Nueva |
| `consumo_anterior_nivel_bajo` | 05_Feature_Engineering(7)(1).ipynb | Nivel Socioeconómico | Nueva |
| `consumo_anterior_nivel_medio` | 05_Feature_Engineering(7)(1).ipynb | Nivel Socioeconómico | Nueva |
| `consumo_anterior_por_equipo` | 05_Feature_Engineering(7)(1).ipynb | Consumo Histórico | Nueva |
| `consumo_anterior_por_hora_actividad` | 05_Feature_Engineering(7)(1).ipynb | Consumo Histórico | Nueva |
| `consumo_anterior_por_m2` | 05_Feature_Engineering(7)(1).ipynb | Consumo Histórico | Nueva |
| `consumo_anterior_por_persona` | 05_Feature_Engineering(7)(1).ipynb | Consumo Histórico | Nueva |
| `consumo_estimado_tendencia` | 05_Feature_Engineering(7)(1).ipynb | Consumo Histórico | Nueva |
| `consumo_historico_anomalo` | 05_Feature_Engineering(7)(1).ipynb | Calidad y confiabilidad del registro | Nueva |
| `cortes_con_inversor` | 05_Feature_Engineering(7)(1).ipynb | Cortes Y Respaldo | Nueva |
| `cortes_con_panel_solar` | 05_Feature_Engineering(7)(1).ipynb | Cortes Y Respaldo | Nueva |
| `cortes_con_planta` | 05_Feature_Engineering(7)(1).ipynb | Cortes Y Respaldo | Nueva |
| `cortes_sin_respaldo` | 05_Feature_Engineering(7)(1).ipynb | Cortes Y Respaldo | Nueva |
| `demanda_termica_estimada` | 05_Feature_Engineering(7)(1).ipynb | Aire Acondicionado | Nueva |
| `demanda_termica_por_antiguedad` | 05_Feature_Engineering(7)(1).ipynb | Aislamiento Y Antigüedad | Nueva |
| `densidad_habitacional` | 05_Feature_Engineering(7)(1).ipynb | Ocupación Y Superficie | Nueva |
| `dependencia_red_estimada` | 05_Feature_Engineering(7)(1).ipynb | Energía Solar | Nueva |
| `dependencia_respaldo` | 05_Feature_Engineering(7)(1).ipynb | Cortes Y Respaldo | Nueva |
| `division_por_antiguedad_inmueble_no_calculable` | 05_Feature_Engineering(7)(1).ipynb | Divisiones no calculables | Nueva condicional |
| `division_por_consumo_anterior_no_calculable` | 05_Feature_Engineering(7)(1).ipynb | Divisiones no calculables | Nueva condicional |
| `division_por_dias_facturacion_no_calculable` | 05_Feature_Engineering(7)(1).ipynb | Divisiones no calculables | Nueva condicional |
| `division_por_dias_sin_electricidad_no_calculable` | 05_Feature_Engineering(7)(1).ipynb | Divisiones no calculables | Nueva condicional |
| `division_por_equipos_no_calculable` | 05_Feature_Engineering(7)(1).ipynb | Divisiones no calculables | Nueva condicional |
| `division_por_horas_actividad_no_calculable` | 05_Feature_Engineering(7)(1).ipynb | Divisiones no calculables | Nueva condicional |
| `division_por_personas_no_calculable` | 05_Feature_Engineering(7)(1).ipynb | Divisiones no calculables | Nueva condicional |
| `division_por_superficie_no_calculable` | 05_Feature_Engineering(7)(1).ipynb | Divisiones no calculables | Nueva condicional |
| `electrodomesticos_antiguos` | 05_Feature_Engineering(7)(1).ipynb | Aislamiento Y Antigüedad | Nueva |
| `equipos_alto_consumo_por_m2` | 05_Feature_Engineering(7)(1).ipynb | Equipamiento | Nueva |
| `equipos_alto_consumo_por_persona` | 05_Feature_Engineering(7)(1).ipynb | Equipamiento | Nueva |
| `equipos_apartamento` | 05_Feature_Engineering(7)(1).ipynb | Tipo De Inmueble | Nueva |
| `equipos_casa` | 05_Feature_Engineering(7)(1).ipynb | Tipo De Inmueble | Nueva |
| `equipos_comercial` | 05_Feature_Engineering(7)(1).ipynb | Tipo De Inmueble | Nueva |
| `equipos_nivel_alto` | 05_Feature_Engineering(7)(1).ipynb | Nivel Socioeconómico | Nueva |
| `equipos_nivel_bajo` | 05_Feature_Engineering(7)(1).ipynb | Nivel Socioeconómico | Nueva |
| `equipos_nivel_medio` | 05_Feature_Engineering(7)(1).ipynb | Nivel Socioeconómico | Nueva |
| `equipos_por_m2` | 05_Feature_Engineering(7)(1).ipynb | Equipamiento | Nueva |
| `equipos_por_persona` | 05_Feature_Engineering(7)(1).ipynb | Equipamiento | Nueva |
| `exposicion_termica` | 05_Feature_Engineering(7)(1).ipynb | Aire Acondicionado | Nueva |
| `factor_aislamiento` | 05_Feature_Engineering(7)(1).ipynb | Aislamiento Y Antigüedad | Nueva |
| `focos_por_m2` | 05_Feature_Engineering(7)(1).ipynb | Iluminación | Nueva |
| `focos_por_persona` | 05_Feature_Engineering(7)(1).ipynb | Iluminación | Nueva |
| `frecuencia_cortes_relativa` | 05_Feature_Engineering(7)(1).ipynb | Cortes Y Respaldo | Nueva |
| `fuente_energia_secundaria_Inversor con baterías` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Fuente de energía secundaria | Nueva si la categoría está presente |
| `fuente_energia_secundaria_Ninguna` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Fuente de energía secundaria | Nueva si la categoría está presente |
| `fuente_energia_secundaria_Panel Solar` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Fuente de energía secundaria | Nueva si la categoría está presente |
| `fuente_energia_secundaria_Planta Eléctrica` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Fuente de energía secundaria | Nueva si la categoría está presente |
| `generacion_solar_diaria` | 05_Feature_Engineering(7)(1).ipynb | Energía Solar | Nueva |
| `generacion_solar_estacional` | 05_Feature_Engineering(7)(1).ipynb | Estacionalidad | Nueva |
| `generacion_solar_por_m2` | 05_Feature_Engineering(7)(1).ipynb | Energía Solar | Nueva |
| `generacion_solar_por_persona` | 05_Feature_Engineering(7)(1).ipynb | Energía Solar | Nueva |
| `generacion_solar_zona_costera` | 05_Feature_Engineering(7)(1).ipynb | Zona | Nueva |
| `generacion_solar_zona_interior` | 05_Feature_Engineering(7)(1).ipynb | Zona | Nueva |
| `generacion_solar_zona_suburbana` | 05_Feature_Engineering(7)(1).ipynb | Zona | Nueva |
| `grados_calor` | 05_Feature_Engineering(7)(1).ipynb | Aire Acondicionado | Nueva |
| `horario_pico_uso_Madrugada` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Horario pico de uso | Nueva si la categoría está presente |
| `horario_pico_uso_Mañana` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Horario pico de uso | Nueva si la categoría está presente |
| `horario_pico_uso_Noche` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Horario pico de uso | Nueva si la categoría está presente |
| `horario_pico_uso_Tarde` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Horario pico de uso | Nueva si la categoría está presente |
| `horas_aa_por_persona` | 05_Feature_Engineering(7)(1).ipynb | Aire Acondicionado | Nueva |
| `horas_uso_espacios_promedio` | 05_Feature_Engineering(7)(1).ipynb | Uso De Espacios | Nueva |
| `horas_uso_espacios_total` | 05_Feature_Engineering(7)(1).ipynb | Uso De Espacios | Nueva |
| `iluminacion_en_horario_nocturno` | 05_Feature_Engineering(7)(1).ipynb | Horario Pico | Nueva |
| `iluminacion_inconsistente` | 04_Imputacion_Variables(13)(1).ipynb | Banderas de imputación | Nueva o reemplazada |
| `inconsistencia_consumo` | 05_Feature_Engineering(7)(1).ipynb | Calidad y confiabilidad del registro | Nueva |
| `inconsistencia_operativa` | 05_Feature_Engineering(7)(1).ipynb | Calidad y confiabilidad del registro | Nueva |
| `indice_actividad_domestica` | 05_Feature_Engineering(7)(1).ipynb | Uso De Espacios | Nueva |
| `indice_calidad_registro` | 05_Feature_Engineering(7)(1).ipynb | Calidad y confiabilidad del registro | Nueva |
| `indice_ineficiencia_constructiva` | 05_Feature_Engineering(7)(1).ipynb | Aislamiento Y Antigüedad | Nueva |
| `indice_ineficiencia_iluminacion` | 05_Feature_Engineering(7)(1).ipynb | Iluminación | Nueva |
| `indice_obsolescencia_equipos` | 05_Feature_Engineering(7)(1).ipynb | Equipamiento | Nueva |
| `indice_permanencia_hogar` | 05_Feature_Engineering(7)(1).ipynb | Uso De Espacios | Nueva |
| `indice_teletrabajo` | 05_Feature_Engineering(7)(1).ipynb | Uso De Espacios | Nueva |
| `indice_vulnerabilidad_electrica` | 05_Feature_Engineering(7)(1).ipynb | Cortes Y Respaldo | Nueva |
| `inicio_consumo_desde_cero` | 04_Imputacion_Variables(13)(1).ipynb | Banderas de imputación | Nueva o reemplazada |
| `inmueble_antiguo` | 05_Feature_Engineering(7)(1).ipynb | Aislamiento Y Antigüedad | Nueva |
| `inmueble_y_equipos_antiguos` | 05_Feature_Engineering(7)(1).ipynb | Aislamiento Y Antigüedad | Nueva |
| `intensidad_aa_por_m2` | 05_Feature_Engineering(7)(1).ipynb | Aire Acondicionado | Nueva |
| `intensidad_aa_por_persona` | 05_Feature_Engineering(7)(1).ipynb | Aire Acondicionado | Nueva |
| `intensidad_cortes` | 05_Feature_Engineering(7)(1).ipynb | Cortes Y Respaldo | Nueva |
| `intensidad_generacion_solar` | 05_Feature_Engineering(7)(1).ipynb | Energía Solar | Nueva |
| `mes_cos` | 05_Feature_Engineering(7)(1).ipynb | Estacionalidad | Nueva |
| `mes_numero` | 05_Feature_Engineering(7)(1).ipynb | Estacionalidad | Nueva |
| `mes_referencia_Abril` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Mes de referencia | Nueva si la categoría está presente |
| `mes_referencia_Agosto` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Mes de referencia | Nueva si la categoría está presente |
| `mes_referencia_Diciembre` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Mes de referencia | Nueva si la categoría está presente |
| `mes_referencia_Enero` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Mes de referencia | Nueva si la categoría está presente |
| `mes_referencia_Febrero` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Mes de referencia | Nueva si la categoría está presente |
| `mes_referencia_Julio` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Mes de referencia | Nueva si la categoría está presente |
| `mes_referencia_Junio` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Mes de referencia | Nueva si la categoría está presente |
| `mes_referencia_Marzo` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Mes de referencia | Nueva si la categoría está presente |
| `mes_referencia_Mayo` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Mes de referencia | Nueva si la categoría está presente |
| `mes_referencia_Noviembre` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Mes de referencia | Nueva si la categoría está presente |
| `mes_referencia_Octubre` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Mes de referencia | Nueva si la categoría está presente |
| `mes_referencia_Septiembre` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Mes de referencia | Nueva si la categoría está presente |
| `mes_sin` | 05_Feature_Engineering(7)(1).ipynb | Estacionalidad | Nueva |
| `nivel_socioeconomico_Alto` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Nivel socioeconómico | Nueva si la categoría está presente |
| `nivel_socioeconomico_Bajo` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Nivel socioeconómico | Nueva si la categoría está presente |
| `nivel_socioeconomico_Medio` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Nivel socioeconómico | Nueva si la categoría está presente |
| `ocupacion_apartamento` | 05_Feature_Engineering(7)(1).ipynb | Tipo De Inmueble | Nueva |
| `ocupacion_casa` | 05_Feature_Engineering(7)(1).ipynb | Tipo De Inmueble | Nueva |
| `ocupacion_comercial` | 05_Feature_Engineering(7)(1).ipynb | Tipo De Inmueble | Nueva |
| `patron_cambio_extremo_consumo` | 05_Feature_Engineering(7)(1).ipynb | Calidad y confiabilidad del registro | Nueva |
| `patron_consumo_cero` | 05_Feature_Engineering(7)(1).ipynb | Calidad y confiabilidad del registro | Nueva |
| `personas_corregidas` | 04_Imputacion_Variables(13)(1).ipynb | Banderas de imputación | Nueva o reemplazada |
| `personas_por_equipo` | 05_Feature_Engineering(7)(1).ipynb | Ocupación Y Superficie | Nueva |
| `pico_uso_diurno` | 05_Feature_Engineering(7)(1).ipynb | Horario Pico | Nueva |
| `pico_uso_nocturno` | 05_Feature_Engineering(7)(1).ipynb | Horario Pico | Nueva |
| `proporcion_iluminacion_led` | 05_Feature_Engineering(7)(1).ipynb | Iluminación | Nueva |
| `proporcion_uso_cocina` | 05_Feature_Engineering(7)(1).ipynb | Uso De Espacios | Nueva |
| `proporcion_uso_dormitorios` | 05_Feature_Engineering(7)(1).ipynb | Uso De Espacios | Nueva |
| `proporcion_uso_lavanderia` | 05_Feature_Engineering(7)(1).ipynb | Uso De Espacios | Nueva |
| `proporcion_uso_oficina` | 05_Feature_Engineering(7)(1).ipynb | Uso De Espacios | Nueva |
| `proporcion_uso_sala` | 05_Feature_Engineering(7)(1).ipynb | Uso De Espacios | Nueva |
| `registro_consumo_no_confiable` | 05_Feature_Engineering(7)(1).ipynb | Calidad y confiabilidad del registro | Nueva |
| `respaldo_inconsistente` | 04_Imputacion_Variables(13)(1).ipynb | Banderas de imputación | Nueva o reemplazada |
| `saldo_solar_por_m2` | 05_Feature_Engineering(7)(1).ipynb | Energía Solar | Nueva |
| `saldo_solar_por_persona` | 05_Feature_Engineering(7)(1).ipynb | Energía Solar | Nueva |
| `sin_consumo_dos_meses` | 04_Imputacion_Variables(13)(1).ipynb | Banderas de imputación | Nueva o reemplazada |
| `superficie_apartamento` | 05_Feature_Engineering(7)(1).ipynb | Tipo De Inmueble | Nueva |
| `superficie_casa` | 05_Feature_Engineering(7)(1).ipynb | Tipo De Inmueble | Nueva |
| `superficie_comercial` | 05_Feature_Engineering(7)(1).ipynb | Tipo De Inmueble | Nueva |
| `superficie_corregida` | 04_Imputacion_Variables(13)(1).ipynb | Banderas de imputación | Nueva o reemplazada |
| `superficie_nivel_alto` | 05_Feature_Engineering(7)(1).ipynb | Nivel Socioeconómico | Nueva |
| `superficie_nivel_bajo` | 05_Feature_Engineering(7)(1).ipynb | Nivel Socioeconómico | Nueva |
| `superficie_nivel_medio` | 05_Feature_Engineering(7)(1).ipynb | Nivel Socioeconómico | Nueva |
| `superficie_por_equipo` | 05_Feature_Engineering(7)(1).ipynb | Ocupación Y Superficie | Nueva |
| `superficie_por_persona` | 05_Feature_Engineering(7)(1).ipynb | Ocupación Y Superficie | Nueva |
| `tasa_autogeneracion_solar_previa` | 05_Feature_Engineering(7)(1).ipynb | Energía Solar | Nueva |
| `temperatura_aislamiento_bueno` | 05_Feature_Engineering(7)(1).ipynb | Aire Acondicionado | Nueva |
| `temperatura_aislamiento_malo` | 05_Feature_Engineering(7)(1).ipynb | Aire Acondicionado | Nueva |
| `temperatura_aislamiento_regular` | 05_Feature_Engineering(7)(1).ipynb | Aire Acondicionado | Nueva |
| `temperatura_estacional` | 05_Feature_Engineering(7)(1).ipynb | Estacionalidad | Nueva |
| `temperatura_zona_costera` | 05_Feature_Engineering(7)(1).ipynb | Zona | Nueva |
| `temperatura_zona_interior` | 05_Feature_Engineering(7)(1).ipynb | Zona | Nueva |
| `temperatura_zona_suburbana` | 05_Feature_Engineering(7)(1).ipynb | Zona | Nueva |
| `tiene_alguna_correccion` | 05_Feature_Engineering(7)(1).ipynb | Calidad y confiabilidad del registro | Nueva |
| `tiene_alguna_inconsistencia` | 05_Feature_Engineering(7)(1).ipynb | Calidad y confiabilidad del registro | Nueva |
| `tiene_alguna_variable_imputada` | 05_Feature_Engineering(7)(1).ipynb | Calidad y confiabilidad del registro | Nueva |
| `tiene_generacion_solar` | 05_Feature_Engineering(7)(1).ipynb | Energía Solar | Nueva |
| `tipo_inmueble_Apartamento` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Tipo de inmueble | Nueva si la categoría está presente |
| `tipo_inmueble_Casa Unifamiliar` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Tipo de inmueble | Nueva si la categoría está presente |
| `tipo_inmueble_Pequeño Establecimiento Comercial` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Tipo de inmueble | Nueva si la categoría está presente |
| `unidades_aa_por_m2` | 05_Feature_Engineering(7)(1).ipynb | Aire Acondicionado | Nueva |
| `unidades_aa_por_persona` | 05_Feature_Engineering(7)(1).ipynb | Aire Acondicionado | Nueva |
| `uso_espacios_por_m2` | 05_Feature_Engineering(7)(1).ipynb | Uso De Espacios | Nueva |
| `uso_espacios_por_persona` | 05_Feature_Engineering(7)(1).ipynb | Uso De Espacios | Nueva |
| `uso_respaldo_diario` | 05_Feature_Engineering(7)(1).ipynb | Cortes Y Respaldo | Nueva |
| `uso_respaldo_por_dia_corte` | 05_Feature_Engineering(7)(1).ipynb | Cortes Y Respaldo | Nueva |
| `variacion_consumo_absoluta_estimada` | 05_Feature_Engineering(7)(1).ipynb | Consumo Histórico | Nueva |
| `variacion_consumo_magnitud` | 05_Feature_Engineering(7)(1).ipynb | Consumo Histórico | Nueva |
| `vulnerabilidad_zona_costera` | 05_Feature_Engineering(7)(1).ipynb | Zona | Nueva |
| `vulnerabilidad_zona_interior` | 05_Feature_Engineering(7)(1).ipynb | Zona | Nueva |
| `vulnerabilidad_zona_suburbana` | 05_Feature_Engineering(7)(1).ipynb | Zona | Nueva |
| `zona_Suburbana` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Zona geográfica | Nueva si la categoría está presente |
| `zona_Urbana Costera` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Zona geográfica | Nueva si la categoría está presente |
| `zona_Urbana Interior` | 04_Imputacion_Variables(13)(1).ipynb | One-Hot Encoding: Zona geográfica | Nueva si la categoría está presente |

### 5.1. Variables recalculadas que no se contabilizan como nuevas

| Columna | Documento | Estado |
| --- | --- | --- |
| `consumo_neto_facturado_kwh` | 04_Imputacion_Variables(13)(1).ipynb | Recalculada o reemplazada |
| `costo_estimado_usd` | 04_Imputacion_Variables(13)(1).ipynb | Recalculada o reemplazada |
| `consumo_kwh_por_m2` | 04_Imputacion_Variables(13)(1).ipynb | Recalculada o reemplazada |
| `consumo_kwh_por_persona` | 04_Imputacion_Variables(13)(1).ipynb | Recalculada o reemplazada |
| `variacion_pct_consumo_mensual` | 04_Imputacion_Variables(13)(1).ipynb | Recalculada o reemplazada |

## 6. Relación entre los dos notebooks

### 6.1. Variables reemplazadas frente a variables completamente nuevas

`04_Imputacion_Variables(13)(1).ipynb` crea las columnas binarias que representan tipo de inmueble, zona, nivel socioeconómico, mes, horario pico, aislamiento y fuente secundaria. Estas columnas son utilizadas directamente por `05_Feature_Engineering(7)(1).ipynb` para crear interacciones específicas por categoría.

Las banderas de calidad creadas o conservadas durante la imputación también se utilizan para construir conteos, indicadores de confiabilidad y el índice de calidad del registro.

En la primera ejecución de Feature Engineering, las 159 características principales son columnas completamente nuevas. Antes de agregarlas, el código busca nombres coincidentes y elimina las versiones anteriores. Por esta razón, si el bloque se ejecuta nuevamente o recibe un DataFrame que ya contiene alguna de esas características, la columna se considera **reemplazada** y no duplicada.

Las cinco variables energéticas de la sección 3.2 son recalculadas en el notebook de imputación, pero no deben contabilizarse como nuevas columnas.

## 7. Índice alfabético de columnas

### 7.1. Columnas creadas en el notebook de imputación

- `aa_inconsistente`
- `aislamiento_termico_Bueno`
- `aislamiento_termico_Malo`
- `aislamiento_termico_Regular`
- `caida_consumo_a_cero`
- `cantidad_equipos_reconstruida`
- `fuente_energia_secundaria_Inversor con baterías`
- `fuente_energia_secundaria_Ninguna`
- `fuente_energia_secundaria_Panel Solar`
- `fuente_energia_secundaria_Planta Eléctrica`
- `horario_pico_uso_Madrugada`
- `horario_pico_uso_Mañana`
- `horario_pico_uso_Noche`
- `horario_pico_uso_Tarde`
- `iluminacion_inconsistente`
- `inicio_consumo_desde_cero`
- `mes_referencia_Abril`
- `mes_referencia_Agosto`
- `mes_referencia_Diciembre`
- `mes_referencia_Enero`
- `mes_referencia_Febrero`
- `mes_referencia_Julio`
- `mes_referencia_Junio`
- `mes_referencia_Marzo`
- `mes_referencia_Mayo`
- `mes_referencia_Noviembre`
- `mes_referencia_Octubre`
- `mes_referencia_Septiembre`
- `nivel_socioeconomico_Alto`
- `nivel_socioeconomico_Bajo`
- `nivel_socioeconomico_Medio`
- `personas_corregidas`
- `respaldo_inconsistente`
- `sin_consumo_dos_meses`
- `superficie_corregida`
- `tipo_inmueble_Apartamento`
- `tipo_inmueble_Casa Unifamiliar`
- `tipo_inmueble_Pequeño Establecimiento Comercial`
- `zona_Suburbana`
- `zona_Urbana Costera`
- `zona_Urbana Interior`

### 7.2. Columnas creadas en el notebook de Feature Engineering

- `aa_ajustado_por_aislamiento`
- `aa_en_horario_calido`
- `aa_nivel_alto`
- `aa_nivel_bajo`
- `aa_nivel_medio`
- `aa_temporada_calida`
- `aa_zona_costera`
- `aa_zona_interior`
- `actividad_comercial_estimada`
- `actividad_en_horario_pico`
- `antiguedad_aislamiento_bueno`
- `antiguedad_aislamiento_malo`
- `antiguedad_aislamiento_regular`
- `brecha_antiguedad_inmueble_equipos`
- `brecha_energetica_previa`
- `cambio_consumo_estimado`
- `cantidad_anomalias_consumo`
- `cantidad_banderas_activas`
- `cantidad_correcciones_deterministicas`
- `cantidad_equipos_alto_consumo`
- `cantidad_espacios_activos`
- `cantidad_focos_led`
- `cantidad_focos_no_led`
- `cantidad_inconsistencias`
- `cantidad_variables_imputadas`
- `carga_climatica_aa`
- `carga_equipos_antiguos`
- `carga_equipos_antiguos_por_persona`
- `carga_iluminacion_led`
- `carga_iluminacion_no_led`
- `carga_iluminacion_por_m2`
- `carga_iluminacion_por_persona`
- `carga_iluminacion_total`
- `carga_operativa_aa`
- `carga_tecnologica`
- `carga_tecnologica_por_m2`
- `carga_tecnologica_por_persona`
- `certificacion_por_aislamiento`
- `certificacion_por_antiguedad`
- `certificacion_y_consumo_anterior`
- `certificacion_y_led`
- `cobertura_respaldo_estimada`
- `consumo_anterior_ajustado_facturacion`
- `consumo_anterior_comercial`
- `consumo_anterior_diario`
- `consumo_anterior_estacional`
- `consumo_anterior_nivel_alto`
- `consumo_anterior_nivel_bajo`
- `consumo_anterior_nivel_medio`
- `consumo_anterior_por_equipo`
- `consumo_anterior_por_hora_actividad`
- `consumo_anterior_por_m2`
- `consumo_anterior_por_persona`
- `consumo_estimado_tendencia`
- `consumo_historico_anomalo`
- `cortes_con_inversor`
- `cortes_con_panel_solar`
- `cortes_con_planta`
- `cortes_sin_respaldo`
- `demanda_termica_estimada`
- `demanda_termica_por_antiguedad`
- `densidad_habitacional`
- `dependencia_red_estimada`
- `dependencia_respaldo`
- `division_por_antiguedad_inmueble_no_calculable`
- `division_por_consumo_anterior_no_calculable`
- `division_por_dias_facturacion_no_calculable`
- `division_por_dias_sin_electricidad_no_calculable`
- `division_por_equipos_no_calculable`
- `division_por_horas_actividad_no_calculable`
- `division_por_personas_no_calculable`
- `division_por_superficie_no_calculable`
- `electrodomesticos_antiguos`
- `equipos_alto_consumo_por_m2`
- `equipos_alto_consumo_por_persona`
- `equipos_apartamento`
- `equipos_casa`
- `equipos_comercial`
- `equipos_nivel_alto`
- `equipos_nivel_bajo`
- `equipos_nivel_medio`
- `equipos_por_m2`
- `equipos_por_persona`
- `exposicion_termica`
- `factor_aislamiento`
- `focos_por_m2`
- `focos_por_persona`
- `frecuencia_cortes_relativa`
- `generacion_solar_diaria`
- `generacion_solar_estacional`
- `generacion_solar_por_m2`
- `generacion_solar_por_persona`
- `generacion_solar_zona_costera`
- `generacion_solar_zona_interior`
- `generacion_solar_zona_suburbana`
- `grados_calor`
- `horas_aa_por_persona`
- `horas_uso_espacios_promedio`
- `horas_uso_espacios_total`
- `iluminacion_en_horario_nocturno`
- `inconsistencia_consumo`
- `inconsistencia_operativa`
- `indice_actividad_domestica`
- `indice_calidad_registro`
- `indice_ineficiencia_constructiva`
- `indice_ineficiencia_iluminacion`
- `indice_obsolescencia_equipos`
- `indice_permanencia_hogar`
- `indice_teletrabajo`
- `indice_vulnerabilidad_electrica`
- `inmueble_antiguo`
- `inmueble_y_equipos_antiguos`
- `intensidad_aa_por_m2`
- `intensidad_aa_por_persona`
- `intensidad_cortes`
- `intensidad_generacion_solar`
- `mes_cos`
- `mes_numero`
- `mes_sin`
- `ocupacion_apartamento`
- `ocupacion_casa`
- `ocupacion_comercial`
- `patron_cambio_extremo_consumo`
- `patron_consumo_cero`
- `personas_por_equipo`
- `pico_uso_diurno`
- `pico_uso_nocturno`
- `proporcion_iluminacion_led`
- `proporcion_uso_cocina`
- `proporcion_uso_dormitorios`
- `proporcion_uso_lavanderia`
- `proporcion_uso_oficina`
- `proporcion_uso_sala`
- `registro_consumo_no_confiable`
- `saldo_solar_por_m2`
- `saldo_solar_por_persona`
- `superficie_apartamento`
- `superficie_casa`
- `superficie_comercial`
- `superficie_nivel_alto`
- `superficie_nivel_bajo`
- `superficie_nivel_medio`
- `superficie_por_equipo`
- `superficie_por_persona`
- `tasa_autogeneracion_solar_previa`
- `temperatura_aislamiento_bueno`
- `temperatura_aislamiento_malo`
- `temperatura_aislamiento_regular`
- `temperatura_estacional`
- `temperatura_zona_costera`
- `temperatura_zona_interior`
- `temperatura_zona_suburbana`
- `tiene_alguna_correccion`
- `tiene_alguna_inconsistencia`
- `tiene_alguna_variable_imputada`
- `tiene_generacion_solar`
- `unidades_aa_por_m2`
- `unidades_aa_por_persona`
- `uso_espacios_por_m2`
- `uso_espacios_por_persona`
- `uso_respaldo_diario`
- `uso_respaldo_por_dia_corte`
- `variacion_consumo_absoluta_estimada`
- `variacion_consumo_magnitud`
- `vulnerabilidad_zona_costera`
- `vulnerabilidad_zona_interior`
- `vulnerabilidad_zona_suburbana`

### 7.3. Referencias cruzadas por categoría

| Categoría | Documento | Cantidad de columnas |
| --- | --- | --- |
| Banderas de corrección e inconsistencia | 04_Imputacion_Variables(13)(1).ipynb | 9 |
| One-Hot Encoding: Tipo de inmueble | 04_Imputacion_Variables(13)(1).ipynb | 3 |
| One-Hot Encoding: Zona geográfica | 04_Imputacion_Variables(13)(1).ipynb | 3 |
| One-Hot Encoding: Nivel socioeconómico | 04_Imputacion_Variables(13)(1).ipynb | 3 |
| One-Hot Encoding: Mes de referencia | 04_Imputacion_Variables(13)(1).ipynb | 12 |
| One-Hot Encoding: Horario pico de uso | 04_Imputacion_Variables(13)(1).ipynb | 4 |
| One-Hot Encoding: Aislamiento térmico | 04_Imputacion_Variables(13)(1).ipynb | 3 |
| One-Hot Encoding: Fuente de energía secundaria | 04_Imputacion_Variables(13)(1).ipynb | 4 |
| Divisiones no calculables | 05_Feature_Engineering(7)(1).ipynb | 8 |
| Ocupación y superficie | 05_Feature_Engineering(7)(1).ipynb | 4 |
| Uso de espacios | 05_Feature_Engineering(7)(1).ipynb | 13 |
| Aire acondicionado y demanda térmica | 05_Feature_Engineering(7)(1).ipynb | 14 |
| Equipamiento y tecnología | 05_Feature_Engineering(7)(1).ipynb | 12 |
| Iluminación | 05_Feature_Engineering(7)(1).ipynb | 11 |
| Consumo histórico | 05_Feature_Engineering(7)(1).ipynb | 10 |
| Generación solar | 05_Feature_Engineering(7)(1).ipynb | 10 |
| Cortes eléctricos y respaldo | 05_Feature_Engineering(7)(1).ipynb | 11 |
| Interacciones con el tipo de inmueble | 05_Feature_Engineering(7)(1).ipynb | 11 |
| Aislamiento y antigüedad | 05_Feature_Engineering(7)(1).ipynb | 9 |
| Estacionalidad | 05_Feature_Engineering(7)(1).ipynb | 7 |
| Horario pico | 05_Feature_Engineering(7)(1).ipynb | 5 |
| Interacciones con la zona geográfica | 05_Feature_Engineering(7)(1).ipynb | 11 |
| Interacciones con el nivel socioeconómico | 05_Feature_Engineering(7)(1).ipynb | 12 |
| Interacciones con la certificación energética | 05_Feature_Engineering(7)(1).ipynb | 4 |
| Conteos derivados de banderas | 05_Feature_Engineering(7)(1).ipynb | 5 |
| Indicadores de calidad y confiabilidad | 05_Feature_Engineering(7)(1).ipynb | 9 |
| Índice de calidad | 05_Feature_Engineering(7)(1).ipynb | 1 |

## 8. Conclusión

### 8.1. Aporte de la imputación y preparación

El notebook de imputación mejora la trazabilidad de los datos mediante banderas que conservan información sobre correcciones e inconsistencias. También asegura que las variables energéticas derivadas sean coherentes después de la imputación y convierte las categorías en entradas numéricas utilizables por modelos de aprendizaje automático.

### 8.2. Aporte de la ingeniería de características

El notebook de Feature Engineering transforma variables básicas en indicadores de densidad, intensidad, tendencia, estacionalidad, vulnerabilidad, interacción y calidad. Estas variables permiten que el modelo represente relaciones que no aparecen de forma explícita en las columnas originales.

### 8.3. Resultado final para el entrenamiento predictivo

El resultado es un conjunto de datos enriquecido con variables físicas, operativas, históricas, categóricas y de calidad. La documentación permite rastrear el origen de cada columna, distinguir las variables nuevas de las recalculadas y facilitar procesos posteriores de selección de características, entrenamiento y evaluación.
