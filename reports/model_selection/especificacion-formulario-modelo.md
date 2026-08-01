# Contrato de datos — Formulario EnergIA (Modelo v3)

Especificación del payload JSON que el formulario (Frontend) debe enviar a Backend, y que Backend debe reenviar al servicio del modelo de clasificación de perfil energético.

**Modelo:** LightGBM, 55 columnas verificadas, F1 macro = 0.91 (test set).

## Campos requeridos

| Campo (clave JSON) | Tipo de dato | Formato / Valores permitidos | Notas |
|---|---|---|---|
| `tipo_inmueble` | string (enum) | `Apartamento` / `Casa Unifamiliar` / `Pequeño Establecimiento Comercial` | Campo existente |
| `superficie_m2` | number (float) | ≥ 0 | Campo existente |
| `num_personas` | integer | ≥ 1 | Campo existente |
| `cantidad_equipos_total` | integer | ≥ 0 | Campo existente |
| `horas_uso_aa_dia` | number (float) | 0 a 24 | Campo existente |
| `consumo_kwh_mensual` | number (float) | ≥ 0 | Campo existente |
| `consumo_kwh_mes_anterior` | number (float) | ≥ 0 | Campo nuevo |
| `aislamiento_termico` | string (enum) | `Bueno` / `Malo` / `Regular` | Campo nuevo, dropdown |
| `pct_iluminacion_led` | number (float) | 0 a 100 | Campo nuevo — escala porcentual, NO proporción 0-1 |
| `antiguedad_construccion_anios` | number (float) | ≥ 0 | Campo nuevo |
| `zona` | string (enum) | `Suburbana` / `Urbana Costera` / `Urbana Interior` | Campo nuevo, dropdown |
| `antiguedad_electrodomesticos_anios` | number (float) | ≥ 0 | Campo nuevo |

## Ejemplo de payload JSON

```json
{
  "tipo_inmueble": "Casa Unifamiliar",
  "superficie_m2": 120.5,
  "num_personas": 4,
  "cantidad_equipos_total": 12,
  "horas_uso_aa_dia": 6.5,
  "consumo_kwh_mensual": 450.0,
  "consumo_kwh_mes_anterior": 430.0,
  "aislamiento_termico": "Regular",
  "pct_iluminacion_led": 65.0,
  "antiguedad_construccion_anios": 15,
  "zona": "Urbana Interior",
  "antiguedad_electrodomesticos_anios": 8
}
```

## A tener en cuenta

1. Los 2 campos existentes **"Horas de alto consumo por día"** y **"¿Hay consumo en horario pico?"** no son consumidos por esta versión del modelo — no hace falta modificarlos ni quitarlos del formulario, pero no afectan la predicción aunque vengan vacíos.
2. Los enums (`tipo_inmueble`, `aislamiento_termico`, `zona`) deben enviarse como el string plano **exacto** indicado en la tabla — mayúsculas, espacios y sin tildes tal cual. Cualquier variación se interpreta como categoría desconocida y degrada la predicción sin lanzar error visible. La codificación interna (one-hot y demás transformaciones) la resuelve el pipeline del equipo de Datos — Backend solo entrega estos 12 valores tal cual los captura el formulario.
3. `pct_iluminacion_led` va en escala 0-100, confirmado contra el dataset de entrenamiento.
4. Este contrato alimenta el pipeline final (55 columnas, F1 macro 0.91). La referencia interna completa de columnas está en `model_selection/columnas_requeridas_final.joblib` (uso exclusivo del equipo de Datos, Backend no necesita construir esas columnas manualmente).
