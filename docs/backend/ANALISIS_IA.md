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
Frontend (Vercel)  →  POST /api/analisis  →  Spring (Railway)
                                              →  FastAPI (Render) /predict
                                              →  fallback HeuristicPrediction si ML falla
                                              →  AnalisisTipsComposer + persistencia
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

## Contrato ML (12 features)

El formulario envía `AnalisisPayload`; Spring traduce a snake_case vía `toMlFeatureMap()` (tipo inmueble, superficie, consumos, aislamiento, zona, etc.). El servicio Python adapta al pipeline de `model.joblib` (schema `legacy` en prod actual).

Detalle FastAPI: [`ml-service/README.md`](../../ml-service/README.md).

**Response**:

```json
{
  "nivelKey": "efficient",
  "category": "efficient",
  "confidence": 0.73,
  "ahorro": 5,
  "tipKeys": ["keep", "monitor", "standby"],
  "benchmark": 432.0,
  "emailStatus": "PENDING",
  "consultaId": 1
}
```

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
