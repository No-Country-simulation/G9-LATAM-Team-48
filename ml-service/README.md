# Microservicio ML — EnergIA

FastAPI consumido por Spring vía `PREDICTION_API_BASE_URL`.

| Método | Ruta | Uso |
|--------|------|-----|
| `GET` | `/health` · `/api/v3/health` | Liveness + schema (`v3_bundle`) |
| `GET` | `/info` · `/api/v3/info` | Metadata del modelo (clases, métricas) |
| `POST` | `/predict` | Contrato Spring (`{ userId, features }`) |
| `POST` | `/api/v3/predict` | Contrato datascience (12 campos en la raíz) |

Ambos `POST` usan el mismo Pipeline v3 y responden el contrato Spring **más** campos DS: `nivel`, `confianza_pct`, `probabilidades`.

**Deploy en producción:** [`../docs/DEPLOY_PRODUCCION.md`](../docs/DEPLOY_PRODUCCION.md) · [`DEPLOY.md`](./DEPLOY.md)

## Modelo de producción

### Opción A — trio v3 (recomendado, datascience)

Copiá los **tres** `.joblib` en `ml-service/models/`:

| Archivo | Rol |
|---------|-----|
| `columnas_requeridas_final_v3.joblib` | Orden/nombres de columnas de entrada |
| `label_encoder_v3.joblib` | Encoder(s) de categorías y/o objetivo `perfil_energetico` |
| `modelo_perfil_energetico_final_v3.joblib` | Clasificador entrenado |

Si los tres existen, FastAPI los carga con **prioridad** (`GET /health` → `"schema": "v3_bundle"`).  
El backend sigue enviando las **12 features** del formulario (`AnalisisPayload.toMlFeatureMap()`); el servicio arma la fila según `columnas_requeridas` y aplica los encoders antes de `predict`.

Inspección local:

```powershell
cd ml-service
$env:PYTHONPATH="."
python scripts/inspect_v3_bundle.py
python scripts/smoke_predict.py
```

### Opción B — pipeline único (`model.joblib`)

Artefacto versionado en Git (export anterior del pipeline):

**`models/model.joblib`**

- Se usa solo si **no** está el trio v3.
- **Entrada:** 12 features del formulario.
- **Interno:** columnas legacy (`tipo_code`, `consumo`, `personas`, …). `GET /health` → `"schema": "legacy"`.
- **Adaptador:** `app/feature_adapters.py` → `legacy_row_from_features`.

Sustituir artefactos: copiar los `.joblib` en `models/` y redeploy (o `MODEL_URL` + `MODEL_PATH`).

### Qué usa el clasificador vs las reglas Spring

| Origen formulario | Uso típico |
|-------------------|------------|
| tipo, consumo, personas, equipos, m², horas AA | Adaptador → pipeline → **perfil** |
| aislamiento, % LED, zona, antigüedades, consumo mes anterior | Sobre todo **reglas de tips** en el backend (junto con el perfil ML) |

Ver [`docs/backend/ANALISIS_IA.md`](../docs/backend/ANALISIS_IA.md) y [`docs/backend/RECOMMENDATION.md`](../docs/backend/RECOMMENDATION.md).

## Local y Docker Compose

```powershell
# 1) Copiar trio v3
cd ml-service
.\scripts\copy-v3-models.ps1

# 2) ML
..\qa\start-local-ml.ps1

# 3) Backend (otra terminal): PREDICTION_API_BASE_URL=http://localhost:8000
# 4) Front: VITE_API_URL=http://localhost:8080 → npm run dev
```

Stack completo: desde la raíz, `docker compose up -d --build` (monta `ml-service/models`).

Despliegue Render + OCI + Vercel: [`DEPLOY.md`](./DEPLOY.md) y [`../docs/DEPLOY_PRODUCCION.md`](../docs/DEPLOY_PRODUCCION.md).

## Local (solo uvicorn)

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

## Deploy en Render (prod)

1. [render.com](https://render.com) → **New → Blueprint** → repo `G9-LATAM-Team-48` (usa `render.yaml` en la raíz).
   - O **Web Service** → repo → **Root Directory:** `ml-service` → Docker.
2. Tras el deploy, URL tipo `https://ml-service-lbfk.onrender.com`.
3. Backend OCI (`.env` en la VM):
   - `PREDICTION_API_BASE_URL=https://ml-service-lbfk.onrender.com`
   - `PREDICTION_API_TIMEOUT=60000` (cold start Render free)

Ver también `DEPLOY.md`.

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
