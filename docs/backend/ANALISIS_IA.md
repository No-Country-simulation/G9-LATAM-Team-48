# Análisis IA — módulo backend (integración)

Módulo para el formulario de Análisis Inteligente del frontend.
Persiste cada consulta y deja el envío por email en cola (`PENDING`).

## Piezas

| Pieza | Ubicación | Rol |
|-------|-----------|-----|
| API frontend | `com.alura.analisis` → `POST /api/analisis` | Fachada (JWT) |
| Persistencia | tabla `analisis_consultas` (Flyway V2) | Historial + email |
| Predicción | `com.alura.prediction` → FastAPI | Cliente ML |
| Modelo | `ml-service/` (Python) | RandomForest |
| Config | `prediction.api.base-url` | `PREDICTION_API_BASE_URL` |

```text
Frontend (JWT)  →  POST /api/analisis  →  Spring (guardar + ML)
                                         →  FastAPI ml-service :8000
                                         →  email PENDING (stub SMTP)
```

## Base de datos

```sql
CREATE DATABASE energia_ia;
```

En `backend/.env` (ver `backend/.env.example`):

```env
APP_PERSISTENCE_TYPE=jpa
FLYWAY_ENABLED=true
JPA_DDL=validate
DB_URL=jdbc:postgresql://localhost:5432/energia_ia
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_DRIVER=org.postgresql.Driver
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
python train.py
uvicorn app.main:app --reload --port 8000

# 2) Backend (con Postgres energia_ia)
cd backend
mvn spring-boot:run
```

## Contrato `POST /api/analisis`

**Requiere** `Authorization: Bearer <jwt>` (login o registro previo).

**Request** (payload plano del form):

```json
{
  "tipo": "casa",
  "consumo": 380,
  "personas": 4,
  "equipos": 8,
  "area": 64,
  "climateHours": 0,
  "peakUseHours": 6
}
```

Tipos: `casa` | `fabrica_mediana` | `fabrica_grande`.

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
| 503 | ML caído / timeout |

## Alias (predicción)

- `POST /api/v1/predictions` — `{ "userId", "features": { ... } }`
- `POST /api/v1/predictions/analyze` — body plano (sin persistir/email)

## Frontend

```env
VITE_USE_MOCK_API=false
VITE_API_URL=http://localhost:8080
```

El formulario exige login/registro antes de analizar. Muestra el resultado en pantalla
y avisa que el email queda pendiente de envío.

## Swagger

[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) — tag **Analisis IA**.
