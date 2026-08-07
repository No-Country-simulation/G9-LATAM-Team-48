# Microservicio ML — EnergIA

FastAPI (`POST /predict`) consumido por Spring vía `PREDICTION_API_BASE_URL`.

**Deploy en producción:** [`../docs/DEPLOY_PRODUCCION.md`](../docs/DEPLOY_PRODUCCION.md) · [`DEPLOY.md`](./DEPLOY.md)

## Modelo de producción

Artefacto **definitivo** versionado en Git (export del pipeline de datascience):

**`models/model.joblib`**

- Carga por defecto (`MODEL_PATH=/app/models/model.joblib` en Docker).
- **Entrada:** el backend envía **12 features** (`AnalisisPayload.toMlFeatureMap()`), mismas claves que el formulario Análisis IA.
- **Interno:** el pipeline fue entrenado con columnas propias del notebook (`tipo_code`, `consumo`, `personas`, `equipos`, `area`, `climateHours`, …). `GET /health` reporta `"schema": "legacy"` cuando detecta esas columnas — es el comportamiento **esperado** en prod, no un placeholder.
- **Adaptador:** `app/feature_adapters.py` → `legacy_row_from_features` construye la fila para `predict`.
- **Salidas ML:** `nivelKey` / `category` (`efficient` | `moderate` | `inefficient`), `confidence`, `ahorro`, `benchmark`.
- **`tipKeys`:** siempre `[]` aquí; Spring (`AnalisisTipsComposer`) genera sugerencias con reglas + formulario completo + `nivelKey`.

Si en el futuro el artefacto exportara directamente las 12 columnas snake_case, el servicio auto-detecta schema `v3` y omite el adaptador legacy (mismo archivo de reemplazo + redeploy).

Sustituir el artefacto: reemplazá `models/model.joblib` y redeploy (o `MODEL_URL` + `MODEL_PATH`).

### Qué usa el clasificador vs las reglas Spring

| Origen formulario | Uso típico |
|-------------------|------------|
| tipo, consumo, personas, equipos, m², horas AA | Adaptador → pipeline → **perfil** |
| aislamiento, % LED, zona, antigüedades, consumo mes anterior | Sobre todo **reglas de tips** en el backend (junto con el perfil ML) |

Ver [`docs/backend/ANALISIS_IA.md`](../docs/backend/ANALISIS_IA.md) y [`docs/backend/RECOMMENDATION.md`](../docs/backend/RECOMMENDATION.md).

## Local

```powershell
cd ml-service
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Smoke test:

```powershell
$env:PYTHONPATH="."
python scripts/smoke_predict.py
python scripts/inspect_model.py
```

## Docker / compose

```bash
docker compose up -d --build ml
```

Backend: `PREDICTION_API_BASE_URL=http://ml:8000`

## Deploy gratis (Render) — recomendado si Railway no da cupo

1. [render.com](https://render.com) → **New → Blueprint** → repo `G9-LATAM-Team-48` (usa `render.yaml` en la raíz).
   - O **Web Service** → repo → **Root Directory:** `ml-service` → Docker.
2. Tras el deploy, URL tipo `https://g9-latam-ml.onrender.com`.
3. Railway backend → Variables:
   - `PREDICTION_API_BASE_URL=https://g9-latam-ml.onrender.com`
   - `PREDICTION_API_TIMEOUT=60000` (cold start Render free)

Ver también `DEPLOY.md`.

## Railway (alternativa)

Segundo servicio en el mismo proyecto, **Root Directory** `ml-service`. Ver `DEPLOY.md`.

## Contrato `POST /predict`

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

Respuesta alineada con `PredictionResponse` (Java). `tipKeys` vacío; Spring completa tips.
