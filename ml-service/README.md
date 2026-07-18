# EnergyAI — ML Service

Microservicio FastAPI con un **RandomForest** entrenado para clasificar el consumo energético:

- `efficient` / `moderate` / `inefficient`

Entrena con datos sintéticos alineados a las reglas del formulario (casa / fábrica mediana / grande).

## Requisitos

- Python 3.11+

## Instalación y entrenamiento

```bash
cd ml-service
python -m venv .venv

# Windows
.\.venv\Scripts\activate
# Linux/macOS
# source .venv/bin/activate

pip install -r requirements.txt
python train.py
```

Genera `artifacts/energy_classifier.joblib` (~80% accuracy en hold-out sintético).

## Levantar el servicio

```bash
uvicorn app.main:app --reload --port 8000
```

- Health: [http://localhost:8000/health](http://localhost:8000/health)
- Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Endpoints

### `POST /analyze` (payload del frontend)

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

### `POST /predict` (contrato Spring)

```json
{
  "userId": "demo",
  "features": { "tipo": "casa", "consumo": 380, "personas": 4 }
}
```

### Respuesta

```json
{
  "nivelKey": "efficient",
  "category": "efficient",
  "confidence": 0.91,
  "ahorro": 5,
  "tipKeys": ["keep", "monitor"],
  "benchmark": 448
}
```

## Uso desde el frontend

En `frontend/.env`:

```env
VITE_ML_API_URL=http://localhost:8000
```

El Análisis IA llama al modelo; si no responde, usa las reglas locales.

## Uso vía Spring Boot

```text
Frontend → POST /api/v1/predictions/analyze → Spring → FastAPI /predict
```

Variable: `PREDICTION_API_BASE_URL=http://localhost:8000`

## Docker

```bash
# desde la raíz del repo
docker compose up -d --build ml
```
