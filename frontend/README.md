<div align="center">

# ⚡ EnergIA — Frontend

<div align="center">
<img src="./public/logo-energia.png" alt="EnergIA" width="220" />
</div>

**Plataforma web para el análisis y la optimización del consumo energético**

Dashboard interactivo, registro/login, multilenguaje, análisis asistido por IA y recomendaciones de ahorro.

Marca del producto: **EnergIA** (logo en [`public/logo-energia.png`](./public/logo-energia.png); header, favicon y títulos de UI).

<br />

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-3-FF6384)
![Estado](https://img.shields.io/badge/estado-demo%20online-success)

<br />

Hackathon ONE G9 · Team 48

</div>

---

## Tabla de contenidos

- [Deploy (demo)](#deploy-demo)
- [Vista previa](#vista-previa)
- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Scripts disponibles](#scripts-disponibles)
- [Variables de entorno](#variables-de-entorno)
- [Integración con el backend](#integración-con-el-backend)
- [Autenticación](#autenticación)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Equipo](#equipo)

---

## Deploy (demo)

| Capa | Dónde | Notas |
|------|--------|--------|
| Frontend | **Vercel** | Root Directory `frontend`, rama **`Jorge-martinez`** |
| Backend API | **Railway** | https://g9-latam-team-48-production.up.railway.app |
| MySQL | **Railway** | Migraciones Flyway + seed de usuarios demo |

En Vercel (Environment Variables):

```env
VITE_API_URL=https://g9-latam-team-48-production.up.railway.app
VITE_USE_MOCK_AUTH=false
VITE_USE_MOCK_API=false
```

Tras cambiar variables `VITE_*`, hace falta **Redeploy**. Un push a `Jorge-martinez` dispara deploy automático si está configurado.

> La URL de Railway es solo API: abrir `/` en el navegador puede devolver 403. Usá la app en Vercel.

---

## Vista previa

> La interfaz soporta **tema claro/oscuro** e **11 idiomas** (ES, EN, PT, FR, IT, DE, NL, PL, RO, CA, TR). La captura principal del Dashboard está en tema claro con marca **EnergIA**.

<div align="center">

### Dashboard — EnergIA

<img src="./screenshots/dashboard.png" alt="EnergIA Dashboard" width="900" />

</div>

<table>
  <tr>
    <td width="50%"><strong>Consumos</strong><br /><img src="./screenshots/consumos.png" alt="Consumos" /></td>
    <td width="50%"><strong>Análisis IA</strong> — formulario por tipo + gráfico vs referencia<br /><img src="./screenshots/analisis-ia.png" alt="Análisis IA" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Recomendaciones</strong><br /><img src="./screenshots/recomendaciones.png" alt="Recomendaciones" /></td>
    <td width="50%"><strong>Login</strong><br /><img src="./screenshots/login.png" alt="Login" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Registro</strong><br /><img src="./screenshots/registro.png" alt="Registro" /></td>
    <td width="50%"><strong>Panel Admin</strong><br /><img src="./screenshots/admin-usuarios.png" alt="Panel Admin" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Crear usuario</strong><br /><img src="./screenshots/admin-crear-usuario.png" alt="Crear usuario" /></td>
    <td width="50%"><strong>Editar usuario</strong><br /><img src="./screenshots/admin-editar-usuario.png" alt="Editar usuario" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Recuperar contraseña</strong><br /><img src="./screenshots/forgot-password.png" alt="Recuperar contraseña" /></td>
    <td width="50%"><strong>Nueva contraseña</strong> (solo vía link del mail)<br /><img src="./screenshots/reset-password.png" alt="Nueva contraseña" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Verificar email</strong> (solo vía link del mail)<br /><img src="./screenshots/verify-email.png" alt="Verificar email" /></td>
    <td width="50%"><strong>Contáctanos</strong> — formulario + Equipo 48 (flip cards)<br /><img src="./screenshots/contacto.png" alt="Contáctanos" /></td>
  </tr>
</table>

Para regenerar las capturas (con el front en `npm run dev`):

```bash
npm run screenshots
```

---

## Funcionalidades

| Módulo | Descripción |
|--------|-------------|
| **Dashboard** | Tarjetas de resumen, bloque “En simple” (lenguaje claro), gráfico mensual, mock **real vs predicción**, **pico vs valle** y recomendaciones destacadas. |
| **Consumos** | Totales, historial con estado (normal / sobre promedio) y gráfico de evolución. |
| **Análisis IA** | Formulario por tipo (**casa** / **fábrica mediana** / **fábrica grande**); gráfico en vivo; clasificación con **modelo ML** (RandomForest en FastAPI) o reglas locales de respaldo; nivel, confianza, ahorro y tips. |
| **Recomendaciones** | Tarjetas con categoría, prioridad y ahorro; resumen acumulado. |
| **Registro / Login** | Modal con pestañas; registro exige verificar email (mail SMTP) antes del login; contraseña ≥ 8 caracteres. |
| **Verificar email / Reset password** | Pantallas que solo se abren con el link del correo (`?verifyToken=` / `?resetToken=`). |
| **Panel Admin** | CRUD de usuarios (rol `ADMIN`): alta, edición, desactivación lógica; admins no se desactivan. |
| **Contáctanos** | Formulario de contacto + Equipo 48 en flip cards (LinkedIn, GitHub, portafolio, Instagram, email). |
| **Multilenguaje** | Selector en el header; detecta idioma del navegador (fallback inglés). |
| **Tema claro / oscuro** | Alternable desde el header; persistido en `localStorage`. |
| **Login opcional** | Navegación pública; sesión para acciones de operador. |

### Detalles de experiencia y calidad

- **Diseño responsive** con tres estados de menú (completo / solo iconos / hamburguesa).
- **Layout app shell**: header y menú fijos; scroll solo en el contenido.
- **Capa de servicios (mock → API)** en `services/`.
- **Estados de UI**: carga, error (reintentar) y vacío.
- **Accesibilidad**: respeta `prefers-reduced-motion` y foco por teclado.

---

## Tecnologías

| Herramienta | Uso |
|-------------|-----|
| [React 19](https://react.dev/) | Librería de interfaz |
| [Vite 7](https://vitejs.dev/) | Bundler y servidor de desarrollo |
| [Bootstrap 5](https://getbootstrap.com/) + [React Bootstrap](https://react-bootstrap.netlify.app/) | Estilos y componentes |
| [React Icons](https://react-icons.github.io/react-icons/) | Iconografía del menú |
| [Recharts](https://recharts.org/) | Gráficos |
| [Axios](https://axios-http.com/) | Cliente HTTP |
| [Playwright](https://playwright.dev/) (dev) | Regenerar capturas del README |

---

## Instalación

Requisitos: **Node.js 18+** y **npm**.

```bash
npm install
npm run dev
```

App en `http://localhost:5173`.

---

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Preview del build |
| `npm run screenshots` | Regenera PNG en `screenshots/` (requiere `npm run dev`) |

---

## Variables de entorno

Copiá `.env.example` a `.env`:

```env
VITE_API_URL=http://localhost:8080
VITE_USE_MOCK_AUTH=false
VITE_USE_MOCK_API=false
VITE_ML_API_URL=http://localhost:8000
```

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base del backend (`https://…` en prod). Vacío = misma origen (nginx/proxy en Docker). |
| `VITE_USE_MOCK_AUTH` | `true` = auth simulada; `false` = API JWT |
| `VITE_USE_MOCK_API` | `true` = datos mock; `false` = API real (predicción vía Spring) |
| `VITE_ML_API_URL` | URL del ML FastAPI (ej. `http://localhost:8000`). Si está definida, Análisis IA la usa primero. |

En producción la URL debe incluir el protocolo (`https://…`). Sin eso Axios falla con errores del tipo `Unsupported protocol …`.

---

## Integración con el backend

Con API real: `VITE_USE_MOCK_AUTH=false` y `VITE_API_URL` apuntando al backend (o vacío detrás de nginx).

| Método | Endpoint | Body / notas |
|:------:|----------|--------------|
| `POST` | `/api/v1/auth/register` | `{ "name", "email", "password" }` → crea cuenta y envía verificación (sin JWT) |
| `POST` | `/api/v1/auth/verify-email` | `{ "token" }` → marca `email_verified_at` |
| `POST` | `/api/v1/auth/resend-verification` | `{ "email" }` → reenvía enlace |
| `POST` | `/api/v1/auth/login` | `{ "email", "password" }` → `data.accessToken` (solo si el email está verificado) |
| `POST` | `/api/v1/auth/forgot-password` | `{ "email" }` → envía mail (sin abrir UI de reset) |
| `POST` | `/api/v1/auth/reset-password` | `{ "token", "newPassword" }` |
| `GET`/`POST`/`PUT`/`DELETE` | `/api/v1/admin/users` | CRUD admin (JWT + rol `ADMIN`) |
| `POST` | `/api/v1/contact` | `{ "name", "email", "message" }` → mail al inbox del equipo (público) |
| `GET` | `/api/consumos` | Lista mensual (mock o API) |
| `GET` | `/api/recomendaciones` | Recomendaciones |
| `POST` | `/api/analisis` | Payload plano del form → ML (ver abajo y `docs/backend/ANALISIS_IA.md`) |

### Análisis IA — modelo ML y payload

Prioridad al analizar: `VITE_ML_API_URL` → Spring `POST /api/analisis` → reglas locales (`iaService.js`).

Detalle: [`ml-service/README.md`](../ml-service/README.md) y [`docs/backend/ANALISIS_IA.md`](../docs/backend/ANALISIS_IA.md).

| `tipo` | Campos |
|--------|--------|
| `casa` | `consumo`, `personas`, `equipos`, `area`, `climateHours`, `peakUseHours` |
| `fabrica_mediana` | `consumo`, `turnos`, `maquinas`, `area`, `hoursPerDay`, `processIntensity`, `hasCompressedAir` |
| `fabrica_grande` | `consumo`, `lineas`, `maquinas`, `turnos`, `area`, `operatingDays`, `capacityPct`, `hasMonitoring`, `hasCompressedAir` |

Respuesta: `{ nivelKey, ahorro, tipKeys, benchmark, confidence }`.

Contrato propuesto para Data Analysis del Dashboard (mock en `src/data/analyticsMock.js`):

```json
{
  "months": ["january", "..."],
  "actualKwh": [],
  "predictedKwh": [],
  "peakKwh": [],
  "offPeakKwh": [],
  "category": "MEDIUM_CONSUMPTION",
  "confidence": 0.87,
  "cost": []
}
```

El token se envía como `Authorization: Bearer <accessToken>`.

---

## Autenticación

Cuentas demo (MySQL + Flyway V6, email ya verificado):

| Usuario | Email | Contraseña |
|---------|-------|------------|
| Operador | `operador@energyai.com` | `operador123` |
| Admin | `admin@energyai.com` | `admin1234` |
| Equipo 48 | `team48@energyai.com` | `team48123` |

**Flujo de registro real:**
1. Registrarse → llega mail de verificación (SMTP Gmail).
2. Abrir el link del mail → pantalla de verificación.
3. Recién ahí iniciar sesión.

**Forgot password:** solo el link del mail abre la pantalla de nueva contraseña.

Detalle backend (SMTP, Flyway, admin): [`docs/backend/AUTH_EMAIL_ADMIN.md`](../docs/backend/AUTH_EMAIL_ADMIN.md).

---

## Estructura del proyecto

```
frontend/
├── public/
│   ├── logo-energia.png       # Marca EnergIA (fondo transparente, tema claro)
│   ├── logo-energia-dark.png  # Variante para navbar oscura
│   └── equipo/                # Fotos de integrantes (PNG/JPG)
├── screenshots/            # Capturas del README
├── scripts/                # screenshots + utilidades i18n
├── src/
│   ├── components/
│   ├── context/            # Theme, Auth, Locale
│   ├── data/               # mocks + roster (`equipo.js`)
│   ├── i18n/               # diccionarios multilenguaje
│   ├── hooks/
│   ├── layouts/
│   ├── pages/              # Contáctanos incluye Equipo 48 (flip cards)
│   ├── services/           # auth, contact, consumos, análisis…
│   └── utils/
├── .env.example
└── package.json
```

---

## Equipo

Desarrollado durante el **Hackathon ONE G9 — Team 48**.

El roster vive en Contáctanos (flip cards). Datos en [`src/data/equipo.js`](./src/data/equipo.js); fotos en [`public/equipo/`](./public/equipo/).

| Integrante | Rol | Perfil |
|------------|-----|--------|
| Jorge Gustavo Martinez | Full Stack Developer | [LinkedIn](https://www.linkedin.com/in/jorgegustavomartinez) · [GitHub](https://github.com/TnlComputer) · [Portafolio](https://www.tnlcomputer.com.ar/portfolio.html) · [Instagram](https://www.instagram.com/tnlcomputer/) |
| Ricardo Chirinos | Data Analyst | [LinkedIn](https://www.linkedin.com/in/ricardo-alexander-chirinos-bustos) · [GitHub](https://github.com/RicardoACB) |
| Elizabeth Díaz Familia | Data Scientist | [LinkedIn](https://www.linkedin.com/in/eli-familia/) · [GitHub](https://github.com/Lizzy0981) · [Portafolio](https://lizzy0981.github.io/) |
| Carlos Miyen Brandolino | Backend Developer | — |
| Germán French | Backend Developer | [LinkedIn](https://www.linkedin.com/in/germanfrench-gf/) · [GitHub](https://github.com/GermanFrench) |
| Jharle Compres | Data Analyst | [LinkedIn](https://www.linkedin.com/in/jharle-compres-data) · [GitHub](https://github.com/JharleCompres) · [Portafolio](https://app.notion.com/p/jharlecompres/Portafolio-Profesional-Jharle-Compres-396da4b1305480c5bd7ccecf93cca4d5) |
| Neil Jacome | Project Manager | — |

Contacto del proyecto: `energyaiteam48@gmail.com`

<div align="center">

⚡ *EnergIA — energía más inteligente*

</div>
