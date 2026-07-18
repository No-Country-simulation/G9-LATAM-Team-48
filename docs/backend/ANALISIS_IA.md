# Análisis IA — módulo backend (integración)

Módulo **aparte** para el formulario de Análisis Inteligente del frontend.
No modifica auth, recomendaciones ni costos: el resto del equipo puede
integrarlo sin tocar su trabajo.

## Piezas

| Pieza | Ubicación | Rol |
|-------|-----------|-----|
| API frontend | `com.alura.analisis` → `POST /api/analisis` | Fachada del formulario |
| Predicción | `com.alura.prediction` → FastAPI | Cliente ML + DTOs |
| Modelo | `ml-service/` (Python) | RandomForest + `/predict` `/analyze` |
| Config | `prediction.api.base-url` | `PREDICTION_API_BASE_URL` |

```text
Frontend  →  POST /api/analisis  →  Spring (analisis + prediction)
                                   →  FastAPI ml-service :8000
```

## Cómo levantarlo (local)

```bash
# 1) ML
cd ml-service
python -m venv .venv
.\.venv\Scripts\activate   # Windows
pip install -r requirements.txt
python train.py
uvicorn app.main:app --reload --port 8000

# 2) Backend
cd backend
mvn spring-boot:run
# PREDICTION_API_BASE_URL=http://localhost:8000 (default en dev)
```

## Contrato `POST /api/analisis`

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

Tipos: `casa` | `fabrica_mediana` | `fabrica_grande` (campos extras según tipo).

**Response**:

```json
{
  "nivelKey": "efficient",
  "category": "efficient",
  "confidence": 0.73,
  "ahorro": 5,
  "tipKeys": ["keep", "monitor", "standby"],
  "benchmark": 432.0
}
```

Errores:

| HTTP | Caso |
|------|------|
| 400 | Body vacío o sin `consumo` |
| 503 | ML caído / timeout |

Público (sin JWT) para facilitar la demo del formulario.

## Alias

- `POST /api/v1/predictions` — `{ "userId", "features": { ... } }`
- `POST /api/v1/predictions/analyze` — mismo body plano que `/api/analisis`

## Frontend

Con ML directo (dev):

```env
VITE_ML_API_URL=http://localhost:8000
```

Vía Spring (integración / Docker):

```env
VITE_USE_MOCK_API=false
VITE_ML_API_URL=
VITE_API_URL=http://localhost:8080
```

El front llama `POST /api/analisis` y, si falla, usa reglas locales.

## Qué no toca este módulo

- Login / JWT / usuarios
- Recomendaciones
- Costos
- Persistencia de consumos

Solo agregar el paquete `analisis` + `prediction` (ya cableados) y el servicio
`ml-service` en compose (`PREDICTION_API_BASE_URL=http://ml:8000`).

## Swagger

Con el backend arriba: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)  
Tag **Analisis IA**.
