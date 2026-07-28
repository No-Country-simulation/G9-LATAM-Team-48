# Dataset de Consumo Energético — Versión Ampliada (Datos Crudos)

## ⚠️ Sigue siendo un dataset sintético

Generado con la misma simulación bottom-up de la primera versión (consumo = suma del gasto real de cada equipo × horas de uso), ahora con más registros, más variables, y **ensuciado intencionalmente** para que sirva como tu carpeta de "datos crudos" antes de la limpieza.

## Números generales

- **Filas totales:** 99,024 (96,000 registros base + 1,920 duplicados exactos + 960 cuasi-duplicados + 144 filas vacías)
- **Columnas:** 44 (43 variables + 1 columna artefacto `Unnamed: 0`, típica de exportaciones desde Excel/pandas)
- **Peso del archivo:** ~24 MB
- **Ubicación sugerida:** `datos_crudos/dataset_consumo_energetico_CRUDO.csv`

## Variables nuevas respecto a la primera versión

| Columna | Qué aporta |
|---|---|
| `dias_facturacion` | El mes no siempre tiene 30 días exactos de facturación (28-31) |
| `temperatura_promedio_c` | Variable exógena — clima influye directamente en el uso de A/C |
| `fuente_energia_secundaria` | Ninguna / Planta eléctrica / Inversor con baterías / Panel Solar — muy relevante en contexto dominicano por los apagones |
| `dias_sin_electricidad_mes` | Días sin servicio eléctrico regular en el mes (apagones), varía por zona |
| `horas_uso_planta_o_inversor_mes` | Dependencia de energía de respaldo |
| `generacion_solar_kwh_mensual` | Energía autogenerada, si tiene panel solar |
| `certificacion_energetica_previa` | Si el inmueble tiene evaluación energética previa (variable de bajo poder predictivo, a propósito — no todas las columnas de un dataset real son igual de útiles, parte del ejercicio es identificarlo) |
| `consumo_kwh_mes_anterior` | Consumo del mes previo — feature de tendencia |
| `variacion_pct_consumo_mensual` | % de variación respecto al mes anterior |
| `consumo_neto_facturado_kwh` | Consumo real menos crédito solar (lo que se factura de verdad, tipo net-metering) |

`costo_estimado_usd` ahora se calcula sobre `consumo_neto_facturado_kwh × 0.75`, no sobre el consumo bruto — así el panel solar sí tiene impacto financiero real, que es justo el diferencial que pide tu proyecto.

## 🧪 Categorías de "ruido" inyectado (para tu proceso de limpieza)

No te doy la lista fila por fila — eso es el ejercicio — pero sí las **categorías** para que sepas qué buscar:

**1. Nulos con múltiples representaciones** (no todos son `NaN` vacío — vas a encontrar `"-"`, `"N/A"`, `"?"`, `"s/d"`, `"sin dato"`, `"NO DATA"`, celdas vacías `""`). Tasas distintas por columna: entre 1.5% en variables centrales (`consumo_kwh_mensual`, `superficie_m2`) y hasta 12% en variables más difíciles de recolectar en campo (`certificacion_energetica_previa`, `aislamiento_termico`). Incluso `perfil_energetico` (tu variable objetivo) tiene ~2.5% de nulos, simulando registros sin etiquetar todavía.

**2. Outliers** en variables numéricas clave: `consumo_kwh_mensual`, `superficie_m2` (incluye una mezcla de unidades m²/ft² en un pequeño % de filas), `num_personas`, `antiguedad_construccion_anios`, `horas_uso_aa_dia`, `pct_iluminacion_led`, `costo_estimado_usd` (incluye signos negativos), `dias_sin_electricidad_mes`.

**3. Problemas de formato:**
- `id_registro` con variantes: minúsculas, guion bajo en vez de guion, espacios extra, ceros a la izquierda faltantes
- Columnas booleanas (`tiene_aire_acondicionado`, `tiene_calentador_agua_electrico`, `tiene_lavadora`, `certificacion_energetica_previa`) mezclando `True/False`, `Sí/No`, `S/N`, `1/0`, `TRUE/FALSE`, `verdadero/falso`
- Texto categórico con mayúsculas/minúsculas inconsistentes y espacios extra (`tipo_inmueble`, `zona`, `nivel_socioeconomico`, `aislamiento_termico`, `horario_pico_uso`, `fuente_energia_secundaria`, incluso `perfil_energetico`)
- Números guardados como texto con coma decimal en vez de punto (formato europeo/latino) en varias columnas numéricas
- `mes_referencia` con formatos mezclados: abreviado ("Ene"), numérico ("01"), o en inglés ("January") — simula fuentes con distinto locale
- **Encoding corrupto (mojibake)** en `tipo_inmueble` (para "Pequeño...") y `fuente_energia_secundaria` (para "Planta eléctrica") — mismo tipo de problema que ya resolviste en tu dataset chileno
- Texto suelto en celdas numéricas (`"error"`, `"pendiente revisión"`, `"verificar"`, `"dato dañado"`, `"#REF!"`)

**4. Inconsistencias lógicas** (más difíciles de detectar con `.isna()` — requieren reglas de validación):
- Filas con `tiene_aire_acondicionado = False` pero `horas_uso_aa_dia > 0`
- `cantidad_equipos_total` que no cuadra con la suma real de equipos individuales
- `generacion_solar_kwh_mensual > 0` en registros donde `fuente_energia_secundaria` no es "Panel Solar"

**5. Duplicados:**
- ~1,920 filas duplicadas **exactas** (mismo `id_registro`, mismo contenido — doble carga del mismo registro)
- ~960 filas **cuasi-duplicadas** (mismo contenido, `id_registro` nuevo — mismo caso cargado dos veces con folio distinto)

**6. Filas completamente vacías:** ~144 filas 100% nulas (exportación accidental desde Excel)

**7. Columna artefacto:** `Unnamed: 0` — típico residuo de un `to_csv()` sin `index=False` en algún paso previo del pipeline real. Puedes descartarla.

## Sugerencia de flujo de trabajo

1. Sube `dataset_consumo_energetico_CRUDO.csv` a tu carpeta `datos_crudos/`.
2. Documenta cada decisión de limpieza (qué eliminaste, qué imputaste, qué normalizaste, qué descartaste) — es evidencia de tu proceso, no solo el resultado.
3. Cuando termines, guarda la versión resultante en `dataset_limpio/`.
4. Presta especial atención a: (a) verificar `costo_estimado_usd ≈ consumo_neto_facturado_kwh × 0.75` como regla de validación cruzada, y (b) decidir con criterio propio si conservas o eliminas los duplicados — como te comenté en el dataset original, esa decisión debe quedar documentada y justificada por ti, no aplicada mecánicamente.

Si quieres, cuando llegues a esa etapa te ayudo con el código de limpieza (pandas) — pero eso ya te toca decidirlo y trabajarlo a ti primero, como bien dijiste que necesitas para tu proceso paso a paso.
