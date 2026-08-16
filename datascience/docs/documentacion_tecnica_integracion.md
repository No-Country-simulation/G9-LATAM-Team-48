# Documentación Técnica de Integración — Microservicio ML (EnergIA)

Documento de entrega para: **Backend** (consumo del servicio) y **Docker/OCI** (empaquetado y despliegue). No requiere leer el resto del manual del proyecto para usar este documento.

## 1. Resumen

Este microservicio expone el modelo de clasificación de perfil energético (Eficiente / Ineficiente / Moderado) vía una API REST. Recibe 12 campos crudos capturados por el formulario y devuelve el nivel predicho con su confianza. Todo el feature engineering ocurre internamente en el Pipeline — quien consume la API nunca transforma datos manualmente.

## 2. Cómo ejecutar el servicio

**Requisitos:**
- Python 3.12
- Dependencias listadas en `api/requirements.txt`

**Estructura de carpetas requerida** (rutas relativas, deben mantenerse):
```
energia-inteligente-ml/
├── api/
│   └── app/            <- código del servicio
├── models/              <- artefactos del modelo (requerido en tiempo de ejecución)
└── src/
    └── features/        <- requerido en tiempo de ejecución (feature_engineer_v3.py)
```
El servicio carga `../models/model_pipeline_v3.joblib` y `../models/metadata_v3.json` con rutas relativas a `api/app/`. Si se empaqueta en un contenedor, estas 3 carpetas (`api/`, `models/`, `src/`) deben copiarse manteniendo esa posición relativa entre ellas.

**Comando de arranque:**
```bash
cd api
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Usar `--host 0.0.0.0` (no `127.0.0.1`) es obligatorio dentro de un contenedor — de lo contrario el servicio solo acepta conexiones desde dentro del propio contenedor.

**Variables de entorno:** ninguna requerida en la versión actual (todo se lee de archivos locales al contenedor). Si la integración con OCI Object Storage (pendiente, a cargo del equipo de infraestructura) reemplaza la carga local del modelo por una descarga desde un bucket, ese cambio debe documentarse aquí como una actualización de este mismo archivo.

## 3. Contrato de datos

Referencia completa: `docs/especificacion-formulario-modelo.md`. Resumen:

**Entrada — `POST /api/v3/predict`:**

| Campo | Tipo | Valores / Rango |
|---|---|---|
| `tipo_inmueble` | string (enum) | `Apartamento` / `Casa Unifamiliar` / `Pequeño Establecimiento Comercial` |
| `superficie_m2` | float | ≥ 0 |
| `num_personas` | integer | ≥ 1 |
| `cantidad_equipos_total` | integer | ≥ 0 |
| `horas_uso_aa_dia` | float | 0 a 24 |
| `consumo_kwh_mensual` | float | ≥ 0 |
| `consumo_kwh_mes_anterior` | float | ≥ 0 |
| `aislamiento_termico` | string (enum) | `Bueno` / `Malo` / `Regular` |
| `pct_iluminacion_led` | float | 0 a 100 |
| `antiguedad_construccion_anios` | float | ≥ 0 |
| `zona` | string (enum) | `Suburbana` / `Urbana Costera` / `Urbana Interior` |
| `antiguedad_electrodomesticos_anios` | float | ≥ 0 |

Los 12 campos son obligatorios. Los valores enum deben enviarse como texto plano exacto (mayúsculas, espacios, sin tildes) — no se normalizan automáticamente.

**Salida exitosa (`200`):**
```json
{
  "nivel": "Eficiente",
  "confianza_pct": 65.0,
  "probabilidades": {"Eficiente": 65.0, "Ineficiente": 10.0, "Moderado": 25.0}
}
```

**Error (`400` / `500`):**
```json
{"error": {"codigo": "CAMPO_INVALIDO", "mensaje": "...", "campo": "zona"}}
```

| Código | HTTP | Causa |
|---|---|---|
| `CAMPO_FALTANTE` | 400 | Falta un campo obligatorio |
| `CAMPO_INVALIDO` | 400 | Tipo o enum inválido |
| `VALOR_FUERA_DE_RANGO` | 400 | Numérico fuera de rango |
| `ERROR_INTERNO_MODELO` | 500 | Falla inesperada del Pipeline |

## 4. Endpoints

| Método | Ruta | Propósito |
|---|---|---|
| `GET` | `/api/v3/health` | Liveness check — confirma que el proceso está vivo y el modelo cargado |
| `GET` | `/api/v3/info` | Metadata del modelo activo (clases, métricas, columnas) |
| `POST` | `/api/v3/predict` | Predicción sobre un registro |

Documentación interactiva autogenerada disponible en `/docs` (Swagger) y `/redoc` una vez el servicio está corriendo.

## 5. Cómo validar que una instancia funciona correctamente

Antes de dar por buena una imagen/despliegue nuevo, correr la suite de pruebas de aceptación:

```bash
cd energia-inteligente-ml
pip install pytest httpx
pytest tests/test_aceptacion_capitulo21.py -v
```

Deben pasar 5 pruebas: 3 casos de no-regresión (uno por clase, contra los casos documentados en `reports/model_interpretation/`), suma de probabilidades = 100%, y manejo correcto de error interno simulado.

También se puede validar manualmente contra `/api/v3/health`, `/api/v3/info` y un `POST /api/v3/predict` de prueba (ver ejemplo de payload en la sección 3).

## 6. Documentación relacionada

| Documento | Contenido |
|---|---|
| `docs/documentacion_tecnica_seleccion_modelo.md` | Selección y comparación de los 6 modelos candidatos |
| `reports/model_interpretation/informe_interpretacion_modelo.md` | Interpretación SHAP, casos de estudio, sistema de recomendaciones |
| `docs/especificacion-formulario-modelo.md` | Contrato de datos completo (versión detallada de la sección 3) |
| `models/metadata_v3.json`, `export_log_v3.json` | Metadata y registro de exportación del modelo activo |
| `Manual_Cientifico_Datos.md` (Capítulos 1-27) | Proceso completo del proyecto, de principio a fin |

## 7. Dueño técnico

Ciencia de Datos / ML: Jharle Compres. Ingeniería y Análisis de Datos: Ricardo Chirinos.
