# Deploy en producción — EnergIA (Team 48)

Documento consolidado: **servicios en la nube**, **variables de entorno**, **flujo Análisis IA** y **cambios técnicos** incorporados en la rama `Jorge-martinez` (marzo 2026).

---

## 1. Arquitectura en producción

```text
Usuario
   │
   ▼
┌─────────────────────────────────────┐
│  Vercel — frontend (React + Vite)    │
│  Root: frontend/                     │
│  https://g9-latam-team-48.vercel.app │
└─────────────────┬───────────────────┘
                  │ HTTPS  VITE_API_URL
                  ▼
┌─────────────────────────────────────┐
│  Railway — backend (Spring Boot)     │
│  Root: backend/                      │
│  https://g9-latam-team-48-production-f9a0.up.railway.app
└────────┬─────────────────┬──────────┘
         │ JDBC            │ POST /predict (RestClient)
         ▼                 ▼
┌─────────────────┐  ┌─────────────────────────────────────┐
│ Railway MySQL   │  │  Render — ml-service (FastAPI)       │
│ energia_ia      │  │  Root: ml-service/                   │
│ Flyway V1–V8…   │  │  https://ml-service-lbfk.onrender.com │
└─────────────────┘  │  Trio v3 .joblib (imagen o MODEL_V3_*) │
                     └─────────────────────────────────────┘
```

| Capa | Plataforma | Proyecto / servicio | Root en Git |
|------|------------|---------------------|-------------|
| Frontend | Vercel | App Production | `frontend` |
| API | Railway | `G9-LATAM-Team-48` (backend) | `backend` |
| Base de datos | Railway | MySQL (mismo proyecto) | — |
| ML inferencia | Render | `ml-service` (Web Service, Docker) | `ml-service` |
| Ciencia de datos | — | No se despliega | `datascience/` |

**Rama de deploy:** `Jorge-martinez`.

El frontend **nunca** llama a Render; solo al backend. Spring llama al ML con `PREDICTION_API_BASE_URL`.

---

## 2. URLs públicas (marzo 2026)

| Servicio | URL | Health / prueba |
|----------|-----|-----------------|
| Frontend | https://g9-latam-team-48.vercel.app | App en navegador |
| Backend | https://g9-latam-team-48-production-f9a0.up.railway.app | `/actuator/health` (ver §7) |
| ML | https://ml-service-lbfk.onrender.com | `/health` → `modelLoaded: true`, `schema: v3_bundle` |

Si Railway regenera dominio, actualizá `VITE_API_URL` en Vercel y `FRONTEND_BASE_URL` en el backend.

---

## 3. Variables de entorno

### 3.1 Vercel (frontend)

```env
VITE_API_URL=https://g9-latam-team-48-production-f9a0.up.railway.app
VITE_USE_MOCK_AUTH=false
VITE_USE_MOCK_API=false
VITE_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
```

Deploy manual desde Git en Production cuando cambie la URL del API (evitar CLI salvo necesidad explícita).

### 3.2 Railway — backend

Plantilla (referencias al servicio **MySQL** del mismo proyecto Railway):

```env
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=${{PORT}}

JWT_SECRET=secreto-largo-y-aleatorio
JWT_EXPIRATION=86400000

APP_PERSISTENCE_TYPE=jpa
FLYWAY_ENABLED=true
JPA_DDL=validate

DB_DRIVER=com.mysql.cj.jdbc.Driver
DB_URL=jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

FRONTEND_BASE_URL=https://g9-latam-team-48.vercel.app

PREDICTION_API_BASE_URL=https://ml-service-lbfk.onrender.com
PREDICTION_API_TIMEOUT=60000

GOOGLE_CLIENT_ID=mismo-valor-que-VITE_GOOGLE_CLIENT_ID

MAIL_ENABLED=false
```

**No usar en Railway** variables del `.env` de Docker/NAS (`MYSQL_*` sueltas, `http://ml:8000`, `BACKEND_PORT`, etc.): Spring exige `DB_*` y el ML en prod es HTTPS en Render.

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
5. `AnalisisTipsComposer` combina reglas de recomendación + tips base por `nivelKey` (usa **todo** el mapa del formulario); persiste en `analisis_consultas`; respuesta al front (perfil + tabla de sugerencias i18n).

**Render Free:** instancia duerme; primera petición puede tardar ~30–60 s → `PREDICTION_API_TIMEOUT=60000`.

---

## 6. Dashboard y dataset

- Tabla `dataset_feature_engineering` (Flyway **V8**); analytics con `fromDataset: true`.
- Badge **Dataset DS** en gráficos cuando aplica.
- Consumos agregados del dataset (no consumo personal por usuario en dashboard demo).

---

## 7. Operación y troubleshooting

| Síntoma | Causa habitual | Acción |
|---------|----------------|--------|
| `/actuator/health` → `"DOWN"` pero `/api/consumos` OK | Health de **mail** (SMTP en Railway) en deploys viejos | `MAIL_ENABLED=false`; `management.health.mail.enabled=false` en prod; redeploy. En f9a0 suele responder **UP** |
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
| `a6f56c80` | fix(backend): PORT Railway |
| `fc878cf5` | fix(backend): actuator mail health |

---

## 9. Documentación relacionada

| Documento | Contenido |
|-----------|-----------|
| [README.md](../README.md) | Visión general y links |
| [docs/backend/ANALISIS_IA.md](./backend/ANALISIS_IA.md) | Contrato analisis / ML |
| [docs/backend/ARCHITECTURE.md](./backend/ARCHITECTURE.md) | Arquitectura Spring |
| [ml-service/README.md](../ml-service/README.md) | Contrato `/predict` |
| [ml-service/DEPLOY.md](../ml-service/DEPLOY.md) | Render / Railway ML |
| [backend/README.md](../backend/README.md) | API local |
| [frontend/README.md](../frontend/README.md) | Vercel |
| [qa/QA.md](../qa/QA.md) | Pruebas manuales |

---

## 10. Checklist post-deploy

Verificado en prod (2026-08-07):

- [x] Render `/health` → `modelLoaded: true` (`schema: legacy`)
- [x] Railway `/api/consumos` → 200 (`…-production-f9a0…`)
- [x] Vercel Análisis IA → nivel + confianza + sugerencias (validado en corridas P0 previas)
- [x] `PREDICTION_API_BASE_URL` apunta a Render (no `127.0.0.1` ni `http://ml:8000`)
- [x] Google OAuth: origin Vercel en Cloud Console (P0-08 Pass 2026-07-28)

Smoke automatizado: `qa/smoke-api.ps1` (usa `qa/api-url.ps1` o `ENERGY_API_URL`).

---

*Última actualización: despliegue prod con Render (ML) + Railway (API/MySQL) + Vercel (front).*
