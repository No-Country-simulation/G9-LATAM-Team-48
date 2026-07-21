<div align="center">

# ⚡ EnergyAI — G9 LATAM Team 48

Repositorio del **Team 48** del Hackathon ONE G9 — LATAM.

Plataforma para el análisis y la optimización del consumo energético.

</div>

---

## Estructura del repositorio

| Carpeta | Descripción |
|---------|-------------|
| [`frontend/`](./frontend) | Aplicación web (React + Vite) |
| [`backend/`](./backend) | API Spring Boot (JWT, predicción, recomendaciones) |
| [`ml-service/`](./ml-service) | Modelo ML (RandomForest + FastAPI) para Análisis IA |
| [`docs/`](./docs) | Documentación (arquitectura, deploy NAS, etc.) |

---

## Vista previa del frontend

> Tema claro/oscuro, multilenguaje y capturas en modo oscuro.
> Detalle completo en el [README del frontend](./frontend/README.md).

<div align="center">

### Dashboard

<img src="./frontend/screenshots/dashboard.png" alt="Dashboard" width="900" />

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

> Un push a `Jorge-martinez` redespliega Vercel y Railway si el auto-deploy está activo en esa rama (no uses `main`: ahí `frontend/` está vacío).

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

## Cómo ejecutar el frontend

```bash
cd frontend
npm install
npm run dev
```

App en `http://localhost:5173`. Credenciales, i18n, Docker/NAS y contrato API: [frontend/README.md](./frontend/README.md).

---

<div align="center">

Hackathon ONE G9 — LATAM · Team 48 · `energyaiteam48@gmail.com`

</div>
