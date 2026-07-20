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
</table>

Documentación de auth, email y admin: [`docs/backend/AUTH_EMAIL_ADMIN.md`](./docs/backend/AUTH_EMAIL_ADMIN.md).

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

Hackathon ONE G9 — LATAM · Team 48

</div>
