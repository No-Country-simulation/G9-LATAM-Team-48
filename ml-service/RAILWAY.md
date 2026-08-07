# Railway — checklist (solo clicks en la web)

Lo demás ya está en Git (`ml-service/` + `models/model.joblib` para que el deploy desde GitHub funcione sin volumen).

## Servicio nuevo: ML

1. **Add service** → mismo repo → **Root Directory:** `ml-service` → branch `Jorge-martinez`.
2. **Networking** → **Generate Domain**.
3. Variables (opcional si usás el modelo del repo):
   - `MODEL_PATH` = `/app/models/model.joblib` (default del Dockerfile)
   - Cuando tengan **modelo_v3**: reemplazar archivo en `models/` o usar `MODEL_URL` con link público al `.joblib`

4. Deploy → abrir `https://<tu-ml>.up.railway.app/health` → `modelLoaded: true`.

## Servicio existente: Backend (Spring)

1. **Variables** → agregar o editar:
   - `PREDICTION_API_BASE_URL` = `https://<tu-ml>.up.railway.app` (sin `/` final)
2. Redeploy automático.

## Lo que no se puede hacer desde el repo

- Crear el servicio ML en Railway (cuenta / proyecto).
- Pegar la URL del ML en el backend (depende del dominio que genere Railway).
- Vercel: sin cambios.

## Sustituir por modelo DS (12 features)

1. Export `modelo_v3.joblib` → subir a `ml-service/models/model.joblib` (commit `-f` si sigue en .gitignore) **o** variable `MODEL_URL`.
2. Redeploy ML. En `/health`, `schema` debe ser `v3`.
