# Microservicio ML — EnergIA

FastAPI que expone `POST /predict` para el backend Spring (`PREDICTION_API_BASE_URL`).

## Modelo (.joblib)

El artefacto **no va en Git** (ver `datascience/.gitignore`). Copialo antes de levantar el servicio:

```powershell
# Desde la raíz del repo (ajustá el nombre del archivo exportado)
Copy-Item ".\datascience\models\modelo_v3.joblib" ".\ml-service\models\modelo_v3.joblib"
```

O definí la ruta absoluta:

```powershell
$env:MODEL_PATH = "F:\ruta\al\modelo_v3.joblib"
```

Candidatos automáticos si no hay `MODEL_PATH`:

1. `ml-service/models/modelo_v3.joblib` (modelo DS de 12 features — **recomendado en prod**)
2. `ml-service/models/model.joblib`
3. `ml-service/artifacts/energy_classifier.joblib` (RandomForest legacy del hackathon; sirve para probar la integración)
4. `datascience/models/modelo_v3.joblib`

## Local (Windows)

```powershell
cd ml-service
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- Salud: `GET http://localhost:8000/health` → `modelLoaded: true`
- Inferencia: `POST http://localhost:8000/predict`

```json
{
  "userId": "opcional",
  "features": {
    "tipo_inmueble": "Casa Unifamiliar",
    "superficie_m2": 80,
    "num_personas": 3,
    "cantidad_equipos_total": 6,
    "horas_uso_aa_dia": 2,
    "consumo_kwh_mensual": 380,
    "consumo_kwh_mes_anterior": 360,
    "aislamiento_termico": "Regular",
    "pct_iluminacion_led": 40,
    "antiguedad_construccion_anios": 15,
    "zona": "Urbana Interior",
    "antiguedad_electrodomesticos_anios": 5
  }
}
```

Respuesta (compatible con `PredictionResponse` Java): `nivelKey`, `category`, `confidence`, `ahorro`, `benchmark`, `tipKeys` (vacío; Spring completa tips).

## Inspeccionar pipeline

```powershell
python scripts/inspect_model.py
```

## Docker / compose

Desde la raíz del repo (con el `.joblib` en `ml-service/models/`):

```bash
docker compose up -d --build ml
```

Backend en compose ya usa `PREDICTION_API_BASE_URL=http://ml:8000`.

## Railway (servicio aparte)

1. Nuevo servicio desde `ml-service/` (Dockerfile).
2. Subí el `.joblib` en el build (COPY en imagen, volumen, o URL + descarga en deploy).
3. Variable `MODEL_PATH=/app/models/modelo_v3.joblib` si aplica.
4. En el backend Spring: `PREDICTION_API_BASE_URL=https://<tu-ml>.up.railway.app` (sin barra final).

## Contrato

Las 12 features en snake_case deben coincidir con `AnalisisPayload.toMlFeatureMap()` en el backend y con el notebook de exportación del equipo DS.
