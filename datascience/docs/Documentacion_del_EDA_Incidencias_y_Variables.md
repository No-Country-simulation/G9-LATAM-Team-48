**Documentación del EDA:**

**Registro de Incidencias**

| **ID** | **Variable Afectada** | **Tipo de Problema** | **Descripción** | **Severidad** | **Responsable de Resolución** | **Estado** |
| --- | --- | --- | --- | --- | --- | --- |
| **INC-001** | perfil\_energetico | Validación del Target | Múltiples variantes tipográficas para referirse a un mismo concepto, incluyendo uso inconsistente de mayúsculas, minúsculas y espacios (ej. 'Moderado', 'moderado', 'MODERADO', 'Moderado '). | Crítica | Jharle Compres | Pendiente |
| **INC-002** | perfil\_energetico | Validación del Target | Presencia de datos faltantes ocultos codificados como cadenas de texto (ej. 'NO DATA', 'sin dato', 's/d', '-', 'N/A') en lugar de valores nulos reales reconocidos por el sistema. | Crítica | Jharle Compres | Pendiente |
| **INC-003** | Múltiples categóricas (ej. zona) | Validación de dominios | Inconsistencias de tipografía y duplicación de categorías por variaciones de texto (ej. "urbana costera", "Urbana Costera", "URBANA COSTERA") y representaciones de datos faltantes ("sin dato", "s/d"). | Alta | Ricardo Chirinos | Pendiente |
| **INC-004** | Categóricas y Binarias | Validación de dominios | Presencia de ruido y cardinalidad atípica, observándose 25 o 16 categorías en variables que idealmente deberían ser de tipo sí/no o representar zonas específicas. | Media | Ricardo Chirinos | Pendiente |
| **INC-005** | Múltiples (ej. horas\_dia\_cocina, generacion\_solar\_kwh\_mensual) | Validación de integridad | Presencia de valores nulos (NaN) dispersos aleatoriamente a lo largo del dataset, afectando variables críticas asociadas al consumo energético y hábitos. | Media | Ricardo Chirinos | Pendiente |

**Validación Estadística Inicial**

* **Número de registros:** Más de 95,000 observaciones.
* **Número de variables:** Múltiples documentadas; el análisis explora alrededor de 44 variables principales.
* **Cantidad de variables numéricas:** 31 variables consolidadas para análisis correlacional, abarcando estructura, ocupación, hábitos y facturación.
* **Cantidad de variables categóricas:** 13 variables cualitativas listadas para evaluación de cardinalidad y frecuencias.
* **Cantidad de valores faltantes por variable:** Distribución dispersa confirmada gráficamente, con afectación constante en variables como horas\_dia\_cocina, horas\_dia\_lavanderia, antiguedad\_electrodomesticos\_anios y generacion\_solar\_kwh\_mensual.
* **Distribución preliminar de la variable objetivo (perfil\_energetico):** Distribución inconsistente y fragmentada debido a ruido tipográfico y múltiples representaciones en texto para la ausencia de datos, lo que requiere estandarización obligatoria.