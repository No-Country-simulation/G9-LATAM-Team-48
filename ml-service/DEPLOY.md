# Despliegue ml-service

Inferencia para **Análisis IA** (Spring → `POST /predict`).

## Modelo v3 (datascience)

Archivos en `ml-service/models/`:

1. `columnas_requeridas_final_v3.joblib`
2. `label_encoder_v3.joblib`
3. `modelo_perfil_energetico_final_v3.joblib`

Local:

```powershell
cd ml-service
.\scripts\copy-v3-models.ps1 -SourceDir "C:\ruta\a\models"
.\scripts\inspect_v3_bundle.py   # PYTHONPATH=. python ...
.\qa\start-local-ml.ps1          # desde raíz del repo
```

## Render (prod actual)

1. [render.com](https://render.com) → repo → Blueprint [`render.yaml`](../render.yaml) (`rootDir: ml-service`).
2. **Opción A:** commitear los 3 `.joblib` (`git add -f`) y redeploy Docker.
3. **Opción B:** Environment en Render:

   - `MODEL_V3_BASE_URL` (base pública; el servicio pide `/{nombre}.joblib`), **o**
   - `MODEL_V3_COLUMNS_URL`, `MODEL_V3_ENCODER_URL`, `MODEL_V3_MODEL_URL`

4. Verificar:

```powershell
.\qa\smoke-ml.ps1 -BaseUrl https://ml-service-lbfk.onrender.com
```

Esperado: `schema: v3_bundle`, `v3Bundle: true`.

## Railway (backend) + Vercel (frontend)

| Dónde | Variable | Valor |
|-------|----------|--------|
| Railway | `PREDICTION_API_BASE_URL` | `https://ml-service-lbfk.onrender.com` |
| Railway | `PREDICTION_API_TIMEOUT` | `60000` |
| Vercel | `VITE_API_URL` | URL Railway backend |
| Vercel | `VITE_USE_MOCK_API` | `false` |

El frontend **no** llama a Render; solo Railway.

## Legacy

`model.joblib` en imagen si **no** hay trio v3. `/health` → `schema: legacy`.

| Variable | Uso |
|----------|-----|
| `MODEL_URL` | Descarga `model.joblib` si falta (sin v3) |

## Checklist

- [ ] `/health` → `modelLoaded: true`, preferible `v3_bundle`
- [ ] `qa/smoke-ml.ps1` OK (local y Render)
- [ ] Railway `PREDICTION_API_BASE_URL` apunta a Render ML
- [ ] Análisis IA en Vercel devuelve perfil coherente

Guía completa: [`docs/DEPLOY_PRODUCCION.md`](../docs/DEPLOY_PRODUCCION.md).
