# Despliegue ml-service

Modelo: **`ml-service/models/model.joblib`** (incluido en la imagen Docker).

## Render (gratis)

1. Cuenta en [render.com](https://render.com) → conectar GitHub.
2. **New → Blueprint** → repo `G9-LATAM-Team-48`, rama `Jorge-martinez`.
   - Usa el `render.yaml` de la raíz (servicio `g9-latam-ml`, rootDir `ml-service`).
3. Tras **Live**, copiá la URL (`https://….onrender.com`).
4. Probar:
   - `GET https://….onrender.com/health` → `modelLoaded: true`
   - `python ml-service/scripts/smoke_predict.py https://….onrender.com`

### Backend (Railway)

| Variable | Valor |
|----------|--------|
| `PREDICTION_API_BASE_URL` | `https://….onrender.com` (sin `/`) |
| `PREDICTION_API_TIMEOUT` | `60000` |

Redeploy backend. Análisis IA debe dejar de usar solo heurística.

**Nota:** plan free de Render duerme; la primera request puede tardar ~30–60 s.

## Railway (si hay cupo)

1. Mismo proyecto → **New service** → GitHub → root **`ml-service`**.
2. **Generate Domain**.
3. Mismas variables en el backend apuntando a la URL del ML.

## Variables ML (opcional)

| Variable | Default |
|----------|---------|
| `MODEL_PATH` | `/app/models/model.joblib` |
| `MODEL_URL` | descarga al arrancar si falta el archivo |

## Checklist cierre

- [ ] `/health` con `modelLoaded: true`
- [ ] `smoke_predict.py` OK contra URL prod
- [ ] `PREDICTION_API_BASE_URL` en backend
- [ ] Prueba Análisis IA en Vercel
