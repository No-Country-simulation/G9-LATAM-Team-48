# Deploy en producción — EnergIA (Team 48)

Documento consolidado: **servicios en la nube**, **variables de entorno**, **flujo Análisis IA** y **cambios técnicos** en la rama `Jorge-martinez` (agosto 2026).

---

## 1. Arquitectura en producción (actual)

```text
Usuario
   │
   ▼
┌──────────────────────────────────────────────────────────┐
│  Vercel — frontend (React + Vite)                         │
│  Root: frontend/ · https://g9-latam-team-48.vercel.app    │
│  vercel.json: /api/* y /actuator/* → proxy al backend OCI │
└────────────────────────────┬─────────────────────────────┘
                             │ HTTPS (mismo origen; sin CORS)
                             ▼
┌──────────────────────────────────────────────────────────┐
│  OCI VM — backend (Spring Boot) + MySQL 8 (Podman)        │
│  IP pública :8080 · docker-compose.oci.yml                │
│  Repo en VM: ~/G9-LATAM-Team-48                           │
└────────┬───────────────────────────────┬───────────────────┘
         │ JDBC (contenedor db)          │ POST /predict
         ▼                               ▼
┌─────────────────────┐    ┌─────────────────────────────────┐
│ MySQL energia_ia    │    │ Render — ml-service (FastAPI)      │
│ Flyway V1–V12…      │    │ https://ml-service-lbfk.onrender.com│
│ ~95k filas dataset  │    │ Trio v3 .joblib                    │
└─────────────────────┘    └─────────────────────────────────┘
```

| Capa | Plataforma | Notas |
|------|------------|--------|
| Frontend | Vercel | Root `frontend`; rama `Jorge-martinez` |
| API + MySQL | **OCI VM** (Podman) | Spring `:8080`; MySQL solo en `127.0.0.1:3306` del host |
| ML inferencia | Render | Web Service Docker; root `ml-service` |
| Ciencia de datos | — | No se despliega (`datascience/`) |

**Rama de deploy:** `Jorge-martinez`.

El navegador **no** llama a Render ni a la IP de OCI directamente: Vercel reescribe `/api/*` hacia el backend (ver [`frontend/vercel.json`](../frontend/vercel.json)). Spring llama al ML con `PREDICTION_API_BASE_URL`.

---

## 2. URLs públicas (agosto 2026)

| Servicio | URL | Health / prueba |
|----------|-----|-----------------|
| Frontend (prod) | https://g9-latam-team-48.vercel.app | App en navegador |
| API vía Vercel | https://g9-latam-team-48.vercel.app/api/consumos | Mismo origen que el front |
| API directa (OCI) | http://163.176.248.56:8080 | `/actuator/health`, smoke QA |
| ML | https://ml-service-lbfk.onrender.com | `/health` → `modelLoaded: true` |

Smoke automatizado contra la API real: `ENERGY_API_URL=http://163.176.248.56:8080 .\qa\smoke-api.ps1` (incluye `/v3/api-docs`). Con base Vercel, `/v3/api-docs` **no** está en el proxy — usá la IP OCI para smoke completo.

---

## 3. Variables de entorno

### 3.1 Vercel (frontend)

En prod **no hace falta** `VITE_API_URL` si `vercel.json` proxea `/api` (base URL vacía = mismo origen). Solo en desarrollo local:

```env
# Opcional en prod con proxy OCI (dejar vacío o omitir):
# VITE_API_URL=

VITE_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
```

### 3.2 OCI VM — backend + MySQL

Archivo `.env` en la VM (junto a `docker-compose.oci.yml`; **no commitear**). Plantilla mínima:

```env
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=secreto-largo-y-aleatorio
JWT_EXPIRATION=86400000

MYSQL_DATABASE=energia_ia
MYSQL_USER=energia_app
MYSQL_PASSWORD=...
MYSQL_ROOT_PASSWORD=...

PREDICTION_API_BASE_URL=https://ml-service-lbfk.onrender.com
PREDICTION_API_TIMEOUT=60000

FRONTEND_BASE_URL=https://g9-latam-team-48.vercel.app
GOOGLE_CLIENT_ID=mismo-valor-que-VITE_GOOGLE_CLIENT_ID

MAIL_ENABLED=false
RESEND_API_KEY=...   # opcional
```

**Redeploy backend en OCI** (tras `git pull` en la VM):

```bash
cd ~/G9-LATAM-Team-48/backend
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk
export PATH="$JAVA_HOME/bin:/usr/bin:$PATH"
mvn -B package -DskipTests
mkdir -p deploy && cp target/energy-backend-*.jar deploy/app.jar
sudo podman build --pull=never -f Dockerfile.repack -t g9-latam-team-48-backend:latest .
cd ~/G9-LATAM-Team-48
sudo DOCKER_HOST=unix:///run/podman/podman.sock \
  /usr/local/bin/docker-compose -f docker-compose.oci.yml up -d --force-recreate backend
curl -s http://127.0.0.1:8080/actuator/health
```

El primer arranque tras **Flyway V12** puede tardar **2–3 min** (índice + generación de rollups del dashboard). Reinicios siguientes son más rápidos si las tablas rollup ya están pobladas.

### 3.3 Render — ml-service

**Prioridad:** trio v3 (mismo que datascience en local):

- `columnas_requeridas_final_v3.joblib`
- `label_encoder_v3.joblib`
- `modelo_perfil_energetico_final_v3.joblib`

**Opción A — en la imagen Docker (recomendado):** versionar en Git bajo **`datascience/models/`** (export del notebook):

```powershell
# Copiar los 3 .joblib a datascience/models/ (ruta del notebook ..\models\)
.\scripts\add-datascience-v3-models.ps1
git commit -m "chore(ml): artefactos v3 datascience/models"
git push
```

Render usa `Dockerfile.monorepo` (`rootDir: .`) y copia automáticamente `datascience/models/*v3*.joblib` → `/app/models/`.

**Opción B — descarga al arrancar (sin commitear .joblib):**

En Render → Environment:

```env
MODEL_V3_BASE_URL=https://URL-publica-que-sirva-los-3-archivos-por-nombre
```

O URLs individuales:

```env
MODEL_V3_COLUMNS_URL=https://.../columnas_requeridas_final_v3.joblib
MODEL_V3_ENCODER_URL=https://.../label_encoder_v3.joblib
MODEL_V3_MODEL_URL=https://.../modelo_perfil_energetico_final_v3.joblib
```

Al startup, `model_bootstrap` descarga lo que falte y carga `schema=v3_bundle`.

**Fallback:** si no hay trio, usa `model.joblib` en la imagen o `MODEL_URL` (legacy).

Blueprint: [`render.yaml`](../render.yaml) y [`ml-service/render.yaml`](../ml-service/render.yaml).

Smoke:

```powershell
.\qa\smoke-ml.ps1 -BaseUrl https://ml-service-lbfk.onrender.com
```

### 3.4 Desarrollo local (alineado con prod)

| Terminal | Comando | Notas |
|----------|---------|--------|
| ML | `.\qa\start-local-ml.ps1` | Puerto 8000; copiar trio con `ml-service\scripts\copy-v3-models.ps1` |
| Backend | `backend\.env` + `mvn spring-boot:run` | `PREDICTION_API_BASE_URL=http://localhost:8000` |
| Frontend | `npm run dev` en `frontend/` | `VITE_API_URL=http://localhost:8080` (ver `frontend/.env.example`) |
| Stack Docker | `docker compose up -d --build` | Monta `./ml-service/models`; mismo trio v3 en esa carpeta |

Verificación ML local: `.\qa\smoke-ml.ps1`

---

## 4. ml-service (FastAPI)

### Artefacto v3 (Análisis IA — perfil energético)

- **Producción / local:** trio en `ml-service/models/` (ver §3.3 y §3.4).
- **Entrada HTTP:** 12 features (`AnalisisPayload.toMlFeatureMap()`).
- **`/health`:** `"schema": "v3_bundle"` cuando cargó los 3 archivos; `"legacy"` si solo `model.joblib`.
- **Sugerencias:** clasificador → perfil/ahorro/benchmark; **`tipKeys` en Spring** (`AnalisisTipsComposer`).

### Legacy (`model.joblib`)

Respaldo en repo (~15 MB). Se usa **solo** si el trio v3 no está presente ni descargable.

### Endpoints

| Método | Ruta | Uso |
|--------|------|-----|
| GET | `/health` | Render health check; `modelLoaded`, `schema` |
| POST | `/predict` | Body `{ userId?, features: { 12 claves snake_case } }` |
| GET | `/docs` | Swagger (pruebas manuales) |

Contrato alineado con `PredictionResponse` (Java): `nivelKey`, `category`, `confidence`, `ahorro`, `benchmark`, `tipKeys` (vacío; Spring completa tips).

### Local / Docker

Ver [`ml-service/README.md`](../ml-service/README.md) y [`ml-service/DEPLOY.md`](../ml-service/DEPLOY.md).

Smoke test:

```bash
cd ml-service
set PYTHONPATH=.
python scripts/smoke_predict.py https://ml-service-lbfk.onrender.com
```

---

## 5. Flujo Análisis IA (prod)

1. Usuario completa formulario en Vercel → `POST /api/analisis` (público; email opcional con login).
2. Spring valida `AnalisisPayload` (@Valid) y arma `toMlFeatureMap()` (**12 features**).
3. `PredictionServiceImpl` → `FastApiPredictionClient` → Render `/predict` → **`model.joblib`** → `nivelKey`, `confidence`, `ahorro`, `benchmark` (`tipKeys` vacío desde Python).
4. Si Render no responde (timeout, cold start, error): **fallback** `HeuristicPrediction` (log en backend).
5. `AnalisisTipsComposer` enriquece el request con **métricas SHAP derivadas** (`AnalisisFeatureCalculator` + `CalculationProperties`), evalúa reglas (`occupancy`, `insulation`, `led`, …), combina tips ML + base por `nivelKey`; persiste consulta y, si hay login, sincroniza `user_recommendations` sin duplicar ACTIVE.

**Render Free:** instancia duerme; primera petición puede tardar ~30–60 s → `PREDICTION_API_TIMEOUT=60000`.

---

## 6. Dashboard y dataset

- Tabla `dataset_feature_engineering` (Flyway **V8**); ~95k filas importadas una vez (no mutables en prod).
- Flyway **V11** — catálogo `recommendation_catalog` (33 `tip_key`).
- Flyway **V12** — índice `mes_numero` + tablas rollup (`dataset_dashboard_monthly`, `_breakdown`, `_meta`).
- Al **arrancar** el backend, `DatasetDashboardRollupInitializer` pre-agrega el dataset en un solo scan (~30 s la primera vez; luego reutiliza tablas).
- **Cache Caffeine** en consumos / analytics (dataset inmutable).
- Badge **Dataset DS** en gráficos cuando aplica.
- Front: gráficos progresivos + Recharts lazy (`DashboardChartsLazy`); consumo/costo no esperan `analytics/overview`.

---

## 7. Operación y troubleshooting

| Síntoma | Causa habitual | Acción |
|---------|----------------|--------|
| 502 en Vercel al cargar dashboard | Backend OCI arrancando o caído | Esperar 2–3 min tras redeploy; `curl http://163.176.248.56:8080/actuator/health` |
| Primer deploy lento tras V12 | Generación de rollups ~95k filas | Normal una vez; log `Dashboard rollups generados en … ms` |
| `/actuator/health` → `"DOWN"` pero `/api/consumos` OK | Health de **mail** en deploys viejos | `MAIL_ENABLED=false`; `management.health.mail.enabled=false` en prod |
| `/swagger-ui.html` → 404 en prod | UI deshabilitada (`springdoc.swagger-ui.enabled=false`) | Normal; OpenAPI JSON en `/v3/api-docs` |
| Backend “failed to respond” | Puerto distinto de `PORT` | `SERVER_PORT=${{PORT}}` o commit que usa `${PORT}` en `server.port` |
| Análisis solo heurístico | ML caído o timeout | Probar `/health` en Render; revisar `PREDICTION_API_BASE_URL` |
| ML `/` → 404 | Normal | Usar `/health` o `/docs` |
| Build Render “no Dockerfile” | Root incorrecto | Root Directory **`ml-service`**, Dockerfile **`./Dockerfile`** |

---

## 8. Cambios técnicos documentados (implementación)

### Nuevo: `ml-service/`

- FastAPI: `app/main.py`, carga `model.joblib`, adaptador 12 features → pipeline DS, benchmark alineado a heurística Java.
- Docker, `render.yaml`, scripts `inspect_model.py`, `smoke_predict.py`.
- `model_bootstrap.py` opcional (`MODEL_URL`).

### Backend

- `application.yml` / `application-prod.yml`: `server.port` = `${SERVER_PORT:${PORT:8080}}`.
- `application-prod.yml`: `prediction.api.timeout` 60 s; health mail desactivado en prod.
- `backend/.env.example`: `PREDICTION_API_*` documentado.

### Frontend (commits previos en `Jorge-martinez`)

- Meses unificados i18n; perfil Eficiente/Moderado/Ineficiente; fix `yDomainWithPadding`; datos reales API; `vercel.json` / deploy Git.

### Infra / repo

- [`render.yaml`](../render.yaml) blueprint ML.
- `.gitignore`: `.joblib` global; excepción operativa `ml-service/models/model.joblib` commiteado con `-f`.

### Commits de referencia (ML + deploy)

| Commit | Descripción |
|--------|-------------|
| `3e53a456` | feat(ml-service): microservicio FastAPI |
| `d2dc17d3` | fix(ml-service): PORT Render |
| `00cdcf09` | model.joblib en repo, MODEL_URL, guía |
| `58a731b3` | Render blueprint, timeout ML, DEPLOY.md |
| `a6f56c80` | fix(backend): PORT en PaaS |
| `fc878cf5` | fix(backend): actuator mail health |
| `5b7e7fd7` | perf(dashboard): rollups V12 + cache Caffeine + índice `mes_numero` |
| `03a77fc3` | perf(front): gráficos progresivos, Recharts lazy |

---

## 9. Documentación relacionada

| Documento | Contenido |
|-----------|-----------|
| [README.md](../README.md) | Visión general y links |
| [docs/backend/ANALISIS_IA.md](./backend/ANALISIS_IA.md) | Contrato analisis / ML |
| [docs/backend/ARCHITECTURE.md](./backend/ARCHITECTURE.md) | Arquitectura Spring |
| [ml-service/README.md](../ml-service/README.md) | Contrato `/predict` |
| [ml-service/DEPLOY.md](../ml-service/DEPLOY.md) | Deploy Render ML |
| [backend/README.md](../backend/README.md) | API local |
| [frontend/README.md](../frontend/README.md) | Vercel |
| [qa/QA.md](../qa/QA.md) | Pruebas manuales |

---

## 10. Checklist post-deploy

Verificado en prod OCI + Vercel (2026-08-10):

- [x] Render `/health` → `modelLoaded: true`
- [x] OCI `/api/consumos` y `/api/analytics/overview` → 200 (~150 ms vía proxy Vercel)
- [x] Flyway V12 aplicado; log rollups en arranque
- [x] Vercel dashboard carga gráficos (hard refresh Ctrl+Shift+R)
- [x] `PREDICTION_API_BASE_URL` apunta a Render en `.env` OCI
- [x] Google OAuth: origin Vercel en Cloud Console

Smoke automatizado:

```powershell
$env:ENERGY_API_URL = "http://163.176.248.56:8080"
.\qa\smoke-api.ps1
```

---

*Última actualización: prod con **Vercel (front + proxy)** + **OCI (API/MySQL)** + **Render (ML)**.*
