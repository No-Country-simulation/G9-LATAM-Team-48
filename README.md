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
| [`backend/`](./backend) | API Spring Boot (JWT, predicción, recomendaciones, fallback heurístico) |
| [`ml-service/`](./ml-service) | Modelo ML (RandomForest + FastAPI) para Análisis IA |
| [`datascience/`](./datascience) | Notebooks, dataset y docs de ciencia de datos (no se despliega) |
| [`docs/`](./docs) | Documentación (arquitectura, auth, recomendaciones, deploy) |

> **Rama de deploy:** `Jorge-martinez` (Vercel + Railway). No uses `main` para el front: ahí `frontend/` puede estar vacío.

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
    <td width="50%"><strong>Recomendaciones</strong><br /><img src="./frontend/screenshots/recomendaciones.png" alt="Recomendaciones" /></td>
    <td width="50%"><strong>Login</strong><br /><img src="./frontend/screenshots/login.png" alt="Login" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Registro</strong><br /><img src="./frontend/screenshots/registro.png" alt="Registro" /></td>
    <td width="50%"><strong>Panel Admin</strong><br /><img src="./frontend/screenshots/admin-usuarios.png" alt="Panel Admin" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Crear usuario</strong><br /><img src="./frontend/screenshots/admin-crear-usuario.png" alt="Crear usuario" /></td>
    <td width="50%"><strong>Editar usuario</strong><br /><img src="./frontend/screenshots/admin-editar-usuario.png" alt="Editar usuario" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Recuperar contraseña</strong><br /><img src="./frontend/screenshots/forgot-password.png" alt="Recuperar contraseña" /></td>
    <td width="50%"><strong>Nueva contraseña</strong><br /><img src="./frontend/screenshots/reset-password.png" alt="Nueva contraseña" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Verificar email</strong><br /><img src="./frontend/screenshots/verify-email.png" alt="Verificar email" /></td>
    <td width="50%"><strong>Contáctanos</strong> — formulario + Equipo 48<br /><img src="./frontend/screenshots/contacto.png" alt="Contáctanos" /></td>
  </tr>
</table>

**Capturas pendientes** (para refrescar el README): mapa de idiomas, Historial de consumos y Admin · Análisis IA. Lista y nombres de archivo en [`frontend/screenshots/README.md`](./frontend/screenshots/README.md).

Documentación de auth, email y admin: [`docs/backend/AUTH_EMAIL_ADMIN.md`](./docs/backend/AUTH_EMAIL_ADMIN.md).

---

## Deploy (demo en línea)

| Capa | Plataforma | URL / notas |
|------|------------|-------------|
| **Frontend** | [Vercel](https://vercel.com) | App pública (Root Directory `frontend`, rama `Jorge-martinez`) |
| **Backend** | [Railway](https://railway.app) | https://g9-latam-team-48-production.up.railway.app |
| **Base de datos** | Railway MySQL | Flyway crea tablas y usuarios demo al arrancar |

Variables del front en Vercel (Production / Preview):

```env
VITE_API_URL=https://g9-latam-team-48-production.up.railway.app
VITE_USE_MOCK_AUTH=false
VITE_USE_MOCK_API=false
```

Usuarios demo:

| Email | Contraseña | Rol |
|-------|------------|-----|
| `operador@energyai.com` | `operador123` | USER |
| `admin@energyai.com` | `admin1234` | ADMIN |
| `team48@energyai.com` | `team48123` | USER |

> Un push a `Jorge-martinez` redespliega Vercel y Railway si el auto-deploy está activo en esa rama.

---

## Highlights recientes

- **Mapa de idiomas** (desktop: hover; móvil: tap + confirmar)
- **i18n ampliado** (21 idiomas con UI completa + packs; tip keys y textos del mapa)
- **Accesibilidad**: skip links, landmarks, anuncios para lector de pantalla
- **Recomendaciones granulares** (tip keys por hábitos e inmueble) + fallback `HeuristicPrediction` sin ML
- **Datascience** como carpeta hermana (EDA / dataset / notebooks)

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

Front en `http://localhost:5173`. Más detalle: [frontend/README.md](./frontend/README.md) · [backend/README.md](./backend/README.md) · [datascience/README.md](./datascience/README.md).

---

<div align="center">

Hackathon ONE G9 — LATAM · Team 48 · EnergIA · `energyaiteam48@gmail.com`

</div>
