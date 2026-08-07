# Análisis IA — módulo backend (integración)

Módulo para el formulario de Análisis Inteligente del frontend.
Persiste cada consulta y deja el envío por email en cola (`PENDING`).

**Producción (marzo 2026):** ML en [Render](https://render.com) (`ml-service-lbfk.onrender.com`), API en Railway, front en Vercel. Guía completa: [`../DEPLOY_PRODUCCION.md`](../DEPLOY_PRODUCCION.md).

## Piezas

| Pieza | Ubicación | Rol |
|-------|-----------|-----|
| API frontend | `com.alura.analisis` → `POST /api/analisis` | Fachada (público; login opcional para email) |
| Persistencia | tabla `analisis_consultas` (Flyway V2) | Historial + email |
| Predicción | `com.alura.prediction` → FastAPI | Cliente ML |
| Modelo | `ml-service/` (Python) | `model.joblib` + FastAPI |
| Config | `prediction.api.base-url` | `PREDICTION_API_BASE_URL` |

```text
Frontend (Vercel)
  → POST /api/analisis (AnalisisPayload, 12 campos)
  → Spring (Railway)
       → FastAPI /predict (12 claves snake_case)
       → perfil: nivelKey, confidence, ahorro, benchmark
       → AnalisisTipsComposer (mismo formulario + nivelKey → tipKeys)
       → respuesta JSON al front
  (si ML no responde: HeuristicPrediction + mismos pasos de tips)
```

El frontend **no** llama a Render; solo al backend.

## Modelo de producción (`model.joblib`)

Artefacto **definitivo** del equipo DS, versionado en Git:

[`ml-service/models/model.joblib`](../../ml-service/models/model.joblib)

No hay otro export pendiente ni reentrenamiento planificado para prod. Render carga ese archivo en cada deploy.

| Capa | Rol |
|------|-----|
| **Entrada API** | Siempre las **12 features** del formulario (`AnalisisPayload.toMlFeatureMap()`). |
| **Pipeline joblib** | Columnas internas del entrenamiento (`tipo_code`, `consumo`, `personas`, `equipos`, `area`, `climateHours`, …). En `/health` aparece como `"schema": "legacy"` (nombre técnico del adaptador, **no** “modelo obsoleto”). |
| **Adaptador Python** | `legacy_row_from_features` en `ml-service` traduce las 12 claves al frame que espera el pipeline. |
| **Salida ML** | Clasificación de perfil (`efficient` \| `moderate` \| `inefficient`), confianza, ahorro %, benchmark. **`tipKeys` vacío** en FastAPI. |
| **Sugerencias en UI** | `AnalisisTipsComposer` + reglas `RecommendationRule` usan **todo el formulario** (aislamiento, % LED, zona, antigüedades, etc.) y el `nivelKey` del ML. Ver [RECOMMENDATION.md](./RECOMMENDATION.md). |

Campos del formulario que alimentan sobre todo las **reglas de tips** (no las columnas internas del clasificador): aislamiento térmico, % iluminación LED, zona, antigüedad de construcción/electrodomésticos, consumo mes anterior. El perfil energético sí depende del joblib vía el adaptador (tipo, consumo, personas, equipos, m², horas AA, …).

Inspección local de columnas del pipeline:

```bash
cd ml-service && PYTHONPATH=. python scripts/inspect_model.py
```

## Base de datos

```sql
CREATE DATABASE energia_ia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

En `backend/.env` (ver `backend/.env.example`):

```env
APP_PERSISTENCE_TYPE=jpa
FLYWAY_ENABLED=true
JPA_DDL=validate
DB_URL=jdbc:mysql://localhost:3306/energia_ia?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=tu_password_mysql
DB_DRIVER=com.mysql.cj.jdbc.Driver
```

Migraciones:
- `V1__create_users_table.sql`
- `V2__create_analisis_consultas.sql`

## Cómo levantarlo (local)

```bash
# 1) ML
cd ml-service
python -m venv .venv
.\.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 2) Backend (con MySQL energia_ia)
cd backend
mvn spring-boot:run
```

Backend local: `PREDICTION_API_BASE_URL=http://localhost:8000` (ver `backend/.env.example`).

## Contrato ML (12 features de entrada)

El formulario envía `AnalisisPayload`; Spring traduce a snake_case vía `toMlFeatureMap()`.

Claves enviadas al ML (orden estable, ver `ml-service/app/features.py`):

`tipo_inmueble`, `superficie_m2`, `num_personas`, `cantidad_equipos_total`, `horas_uso_aa_dia`, `consumo_kwh_mensual`, `consumo_kwh_mes_anterior`, `aislamiento_termico`, `pct_iluminacion_led`, `antiguedad_construccion_anios`, `zona`, `antiguedad_electrodomesticos_anios`.

Detalle FastAPI: [`ml-service/README.md`](../../ml-service/README.md).

**Respuesta de `POST /api/analisis`** (Spring agrega persistencia/email; `tipKeys` los compone el backend):

```json
{
  "nivelKey": "efficient",
  "category": "efficient",
  "confidence": 0.73,
  "ahorro": 5,
  "tipKeys": ["keep", "monitor", "led"],
  "benchmark": 432.0,
  "emailStatus": "PENDING",
  "consultaId": 1
}
```

(`tipKeys` ilustrativo; lista real según reglas + nivel.)

Errores:

| HTTP | Caso |
|------|------|
| 401 | Sin token / sesión inválida |
| 400 | Body vacío o sin `consumo` |
| 503 | ML caído / timeout (puede usarse heurística según configuración) |

## Contrato `POST /api/analisis` (respuesta)

Ver JSON de ejemplo arriba. Validación en `AnalisisPayload` (Bean Validation).

## Alias (predicción)

- `POST /api/v1/predictions` — `{ "userId", "features": { ... } }`
- `POST /api/v1/predictions/analyze` — body plano (sin persistir/email)

## Frontend

```env
VITE_USE_MOCK_API=false
VITE_API_URL=http://localhost:8080
```

El análisis puede hacerse sin cuenta; con login/registro se encola email del resultado.

Prod: `VITE_API_URL` apunta al backend Railway (ver [`../DEPLOY_PRODUCCION.md`](../DEPLOY_PRODUCCION.md)).

## Swagger

[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) — tag **Analisis IA**.
