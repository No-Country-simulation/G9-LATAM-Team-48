<div align="center">

# ⚡ EnergIA — G9 LATAM Team 48

Repositorio del **Team 48** del Hackathon ONE G9 — LATAM.

Plataforma para el análisis y la optimización del consumo energético (**EnergIA**).

<div align="center">
<img src="./frontend/public/logo-energia.png" alt="EnergIA" width="220" />
</div>

</div>

---

## Estructura del repositorio

| Carpeta | Descripción |
|---------|-------------|
| [`frontend/`](./frontend) | Aplicación web (React + Vite) |
| [`backend/`](./backend) | API Spring Boot (JWT, Google, email, Análisis IA, admin, contacto) |
| [`ml-service/`](./ml-service) | Modelo ML (RandomForest + FastAPI) para Análisis IA |
| [`datascience/`](./datascience) | Notebooks, dataset y docs de ciencia de datos (no se despliega) |
| [`docs/`](./docs) | Documentación — índice en [`docs/README.md`](./docs/README.md); **prod:** [`docs/DEPLOY_PRODUCCION.md`](./docs/DEPLOY_PRODUCCION.md) |
| [`qa/`](./qa) | Checklist P0/P1, smoke scripts y notas NAS (sin tocar código de producto) |

> **Rama de deploy:** `Jorge-martinez` (Vercel + **OCI** + Render).  
> **Documentación de prod completa:** [`docs/DEPLOY_PRODUCCION.md`](./docs/DEPLOY_PRODUCCION.md) (servicios, URLs, env vars, ML, troubleshooting).

---

## Vista previa del frontend

> Tema claro/oscuro, mapa de idiomas, accesibilidad (lector de pantalla) y UI multilenguaje.
> Detalle completo en el [README del frontend](./frontend/README.md).

<div align="center">

### Dashboard — EnergIA

<img src="./frontend/screenshots/dashboard.png" alt="EnergIA Dashboard" width="900" />

</div>

<table>
  <tr>
    <td width="50%"><strong>Consumos</strong><br /><img src="./frontend/screenshots/consumos.png" alt="Consumos" /></td>
    <td width="50%"><strong>Análisis IA</strong><br /><img src="./frontend/screenshots/analisis-ia.png" alt="Análisis IA" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Historia de consumos</strong><br /><img src="./frontend/screenshots/historia-consumos.png" alt="Historia de consumos" /></td>
    <td width="50%"><strong>Mapa de idiomas</strong><br /><img src="./frontend/screenshots/mapa-idiomas.png" alt="Mapa de idiomas" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Recomendaciones</strong><br /><img src="./frontend/screenshots/recomendaciones.png" alt="Recomendaciones" /></td>
    <td width="50%"><strong>Contáctanos</strong> — formulario + Equipo 48<br /><img src="./frontend/screenshots/contacto.png" alt="Contáctanos" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Panel Admin — Usuarios</strong><br /><img src="./frontend/screenshots/admin-usuarios.png" alt="Panel Admin" /></td>
    <td width="50%"><strong>Admin — Análisis IA</strong><br /><img src="./frontend/screenshots/admin-analisis.png" alt="Admin Análisis IA" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Login</strong> — sin cartel<br /><img src="./frontend/screenshots/login.png" alt="Login limpio" /></td>
    <td width="50%"><strong>Login</strong> — aviso bloqueador<br /><img src="./frontend/screenshots/login-bloqueador.png" alt="Login con cartel" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Registro</strong><br /><img src="./frontend/screenshots/registro.png" alt="Registro" /></td>
    <td width="50%"><strong>Editar usuario</strong><br /><img src="./frontend/screenshots/admin-editar-usuario.png" alt="Editar usuario" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Crear usuario</strong><br /><img src="./frontend/screenshots/admin-crear-usuario.png" alt="Crear usuario" /></td>
    <td width="50%"><strong>Recuperar contraseña</strong><br /><img src="./frontend/screenshots/forgot-password.png" alt="Recuperar contraseña" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Nueva contraseña</strong> (vía link del mail)<br /><img src="./frontend/screenshots/reset-password.png" alt="Nueva contraseña" /></td>
    <td width="50%"><strong>Verificar email</strong> (vía link del mail)<br /><img src="./frontend/screenshots/verify-email.png" alt="Verificar email" /></td>
  </tr>
</table>

> **Nueva contraseña** y **Verificar email** se abren solo con el link del correo (`?resetToken=` / `?verifyToken=`). En **prod (OCI)** y **local** los mails salen por **Gmail SMTP** (`MAIL_*`). Detalle: [`docs/backend/AUTH_EMAIL_ADMIN.md`](./docs/backend/AUTH_EMAIL_ADMIN.md), [`docs/DEPLOY_PRODUCCION.md`](./docs/DEPLOY_PRODUCCION.md).

Documentación de auth, email y admin: [`docs/backend/AUTH_EMAIL_ADMIN.md`](./docs/backend/AUTH_EMAIL_ADMIN.md).

---

## Deploy (demo en línea)

| Capa | Plataforma | URL / notas |
|------|------------|-------------|
| **Frontend** | [Vercel](https://vercel.com) | https://g9-latam-team-48.vercel.app — Root `frontend`, rama `Jorge-martinez` |
| **Backend + MySQL** | **OCI VM** (Podman) | API `:8080` — proxy desde Vercel (`frontend/vercel.json` → `163.176.248.56:8080`) |
| **ML (Análisis IA)** | [Render](https://render.com) | https://ml-service-lbfk.onrender.com — Root `ml-service`, Docker, plan Free |

Detalle, variables `.env` completas y cambios técnicos: **[`docs/DEPLOY_PRODUCCION.md`](./docs/DEPLOY_PRODUCCION.md)**.

Variables mínimas del front en Vercel (Production):

```env
# Con proxy OCI en vercel.json, VITE_API_URL puede omitirse (mismo origen).
VITE_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
```

Backend (OCI): `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `PREDICTION_API_BASE_URL=https://ml-service-lbfk.onrender.com`, `PREDICTION_API_TIMEOUT=60000`, credenciales MySQL en `.env` de la VM. Plantilla completa en [`docs/DEPLOY_PRODUCCION.md`](./docs/DEPLOY_PRODUCCION.md).

En Google Cloud Console → OAuth Web: origins `https://g9-latam-team-48.vercel.app` y `http://localhost:5173`.
Usuarios demo (emails en Flyway **V6**; contraseñas solo por canal del equipo / variables QA, **no en Git**):

| Email | Rol |
|-------|-----|
| `operador@energyai.com` | USER |
| `admin@energyai.com` | ADMIN |
| `team48@energyai.com` | USER |

> Un push a `Jorge-martinez` redespliega Vercel (front). El backend en OCI se actualiza con `git pull` + rebuild en la VM (ver [`docs/DEPLOY_PRODUCCION.md`](./docs/DEPLOY_PRODUCCION.md)).

---

## Highlights recientes

- **Deploy prod:** Vercel (front + proxy `/api`) + **OCI (API/MySQL)** + **Render (ml-service)** — ver [`docs/DEPLOY_PRODUCCION.md`](./docs/DEPLOY_PRODUCCION.md)
- **Dashboard perf:** rollups Flyway V12, cache Caffeine, gráficos progresivos en front (~150 ms API vía proxy)
- **ml-service:** FastAPI + **`models/model.joblib`** (artefacto DS definitivo); formulario **12 campos** → perfil ML; **sugerencias** vía Spring — [`docs/backend/ANALISIS_IA.md`](./docs/backend/ANALISIS_IA.md)
- **Google Sign-In**
- **Auth por email** (registro/verify/login, forgot/reset, admin CRUD)
- **Análisis IA** con `AnalisisPayload`, ML + fallback `HeuristicPrediction`, historial, email
- **Dashboard** datos dataset (Flyway V8), rollups V12, badge Dataset DS
- **Recomendaciones** tip keys + i18n; **Contáctanos** + **Admin**
- **Mapa idiomas** / i18n / a11y; **QA** en [`qa/`](./qa)

---

## Equipo 48

| Integrante | Rol |
|------------|-----|
| Jorge Gustavo Martinez | Full Stack Developer |
| Ricardo Chirinos | Data Analyst |
| Elizabeth Díaz Familia | Data Scientist |
| Carlos Miyen Brandolino | Backend Developer |
| Germán French | Backend Developer |
| Jharle Compres | Data Analyst |
| Neil Jacome | Project Manager |

Perfiles y fotos: pantalla **Contáctanos** del frontend. Detalle y links: [frontend/README.md § Equipo](./frontend/README.md#equipo).

---

## Cómo ejecutar

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend (otra terminal)
cd backend && mvn spring-boot:run

# ML opcional
cd ml-service && uvicorn app.main:app --reload --port 8000
```

Front en `http://localhost:5173`. Más detalle: [frontend/README.md](./frontend/README.md) · [backend/README.md](./backend/README.md) · [datascience/README.md](./datascience/README.md) · [qa/README.md](./qa/README.md).

---

<div align="center">

Hackathon ONE G9 — LATAM · Team 48 · EnergIA · `energyaiteam48@gmail.com`

</div>
