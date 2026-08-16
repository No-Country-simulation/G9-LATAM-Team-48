# Análisis IA — módulo backend (integración)

Módulo para el formulario de Análisis Inteligente del frontend.
Persiste cada consulta y deja el envío por email en cola (`PENDING`).

**Producción (agosto 2026):** ML en [Render](https://render.com), API + MySQL en **OCI VM**, front en Vercel (proxy `/api`). Guía: [`../DEPLOY_PRODUCCION.md`](../DEPLOY_PRODUCCION.md).

## Piezas

| Pieza | Ubicación | Rol |
|-------|-----------|-----|
| API frontend | `com.alura.analisis` → `POST /api/analisis` | Fachada (público; login opcional para email) |
| Persistencia | tabla `analisis_consultas` (Flyway V2) | Historial + email |
| Predicción | `com.alura.prediction` → FastAPI | Cliente ML |
| Modelo | `ml-service/` (Python) | Trio v3 o `model.joblib` + FastAPI |
| Config | `prediction.api.base-url` | `PREDICTION_API_BASE_URL` |

```text
Frontend (Vercel)
  → POST /api/analisis (AnalisisPayload, 12 campos)
  → Spring (OCI / local)
       → FastAPI /predict (12 claves snake_case)
       → perfil: nivelKey, confidence, ahorro, benchmark
       → AnalisisTipsComposer (mismo formulario + nivelKey → tipKeys)
       → respuesta JSON al front
  (si ML no responde: HeuristicPrediction + mismos pasos de tips)
```

El frontend **no** llama a Render; solo al backend.

## Modelo ML (v3 datascience)

**Objetivo prod/local:** trio en `ml-service/models/`:

- `columnas_requeridas_final_v3.joblib`
- `label_encoder_v3.joblib`
- `modelo_perfil_energetico_final_v3.joblib`

FastAPI arma la fila según columnas + encoders y predice perfil. `/health` → `"schema": "v3_bundle"`.

Copia local: `ml-service/scripts/copy-v3-models.ps1`. Render: imagen Docker con los 3 archivos o `MODEL_V3_*` (ver [`../DEPLOY_PRODUCCION.md`](../DEPLOY_PRODUCCION.md)).

| Capa | Rol |
|------|-----|
| **Entrada API** | **12 features** (`AnalisisPayload.toMlFeatureMap()`). |
| **Bundle v3** | Columnas en orden del DS + `label_encoder_v3` + clasificador. |
| **Fallback** | [`model.joblib`](../../ml-service/models/model.joblib) → `"schema": "legacy"` + adaptador `legacy_row_from_features`. |
| **Salida ML** | `nivelKey`, confianza, ahorro, benchmark. **`tipKeys` vacío** en FastAPI. |
| **Tips UI** | `AnalisisTipsComposer` + formulario completo. Ver [RECOMMENDATION.md](./RECOMMENDATION.md). |

Inspección:

```bash
cd ml-service && PYTHONPATH=. python scripts/inspect_v3_bundle.py
# legacy: python scripts/inspect_model.py
```

Smoke:

```powershell
.\qa\smoke-ml.ps1 -BaseUrl http://127.0.0.1:8000
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
VITE_API_URL=http://localhost:8080
```

El análisis puede hacerse sin cuenta; con login/registro se encola email del resultado.

Prod: API vía proxy Vercel `/api` o `VITE_API_URL` directo (ver [`../DEPLOY_PRODUCCION.md`](../DEPLOY_PRODUCCION.md)).

## Swagger

[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) — tag **Analisis IA**.
