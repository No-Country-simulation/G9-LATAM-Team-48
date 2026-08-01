<div align="center">

# ⚡ EnergIA — Frontend

<div align="center">
<img src="./public/logo-energia.png" alt="EnergIA" width="220" />
</div>

**Aplicación web para analizar y optimizar el consumo energético**

Dashboard, autenticación (email y Google), análisis asistido por IA, recomendaciones, panel administrativo e interfaz multilenguaje.

<br />

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-3-FF6384)
![Estado](https://img.shields.io/badge/demo-online-success)

<br />

Hackathon ONE G9 · Team 48

</div>

---

## Tabla de contenidos

- [Demo en producción](#demo-en-producción)
- [Características](#características)
- [Stack tecnológico](#stack-tecnológico)
- [Requisitos e instalación](#requisitos-e-instalación)
- [Configuración](#configuración)
- [Scripts](#scripts)
- [Autenticación y sesión](#autenticación-y-sesión)
- [Internacionalización](#internacionalización)
- [Accesibilidad](#accesibilidad)
- [Integración con la API](#integración-con-la-api)
- [Análisis IA (frontend)](#análisis-ia-frontend)
- [Experiencia de usuario](#experiencia-de-usuario)
- [Capturas de pantalla](#capturas-de-pantalla)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Documentación relacionada](#documentación-relacionada)
- [Calidad y pruebas](#calidad-y-pruebas)
- [Equipo](#equipo)

---

## Demo en producción

| Componente | URL / ubicación |
|------------|-----------------|
| **Frontend** | [g9-latam-team-48.vercel.app](https://g9-latam-team-48.vercel.app) |
| **API (Railway)** | `https://g9-latam-team-48-production.up.railway.app` |
| **Deploy Git** | Rama **`Jorge-martinez`** · Vercel **Root Directory:** `frontend` |

La URL de Railway es **solo API**; abrir `/` en el navegador puede responder 403. Usá siempre la app en Vercel.

Tras cambiar variables `VITE_*` en Vercel, ejecutá **Redeploy** (Vite embebe env en build).

---

## Características

| Módulo | Descripción |
|--------|-------------|
| **Dashboard** | KPIs de consumo y costo, resumen en lenguaje claro, gráfico mensual, comparativas mock (real vs predicción, pico vs valle) y recomendaciones destacadas. |
| **Consumos** | Totales, historial con indicador normal / sobre promedio y evolución gráfica. |
| **Historia de consumos** | Análisis guardados del usuario autenticado; reenvío de mail según backend. |
| **Análisis IA** | Formulario por tipo de inmueble (apartamento, casa, comercio); resultado con nivel, confianza, ahorro y tips i18n. |
| **Recomendaciones** | Catálogo de tips traducidos (hábitos e inmueble). |
| **Registro / login** | Modal unificado: email + contraseña, recuperación y **Google Sign-In** (GIS) si hay Client ID. |
| **Verificar email / reset** | Rutas dedicadas activadas solo por link del correo (`verifyToken`, `resetToken`). |
| **Panel admin** | CRUD de usuarios y vista global de análisis IA (rol `ADMIN`). |
| **Contáctanos** | Formulario de contacto y equipo en flip cards. |
| **Mapa de idiomas** | Selector visual con confirmación (desktop y móvil). |
| **Tema claro / oscuro** | Toggle en header; persistido en `localStorage`. |
| **Navegación pública** | La app es usable sin sesión; historial y admin requieren login. |

---

## Stack tecnológico

| Tecnología | Rol |
|------------|-----|
| [React 19](https://react.dev/) | UI declarativa y enrutado por estado (`pagina`) |
| [Vite 7](https://vitejs.dev/) | Dev server y build de producción |
| [Bootstrap 5](https://getbootstrap.com/) + [React Bootstrap](https://react-bootstrap.netlify.app/) | Layout, modales, utilidades |
| [Recharts](https://recharts.org/) | Gráficos del dashboard y consumos |
| [Axios](https://axios-http.com/) | Cliente HTTP hacia Spring / ML |
| [React Icons](https://react-icons.github.io/react-icons/) | Iconografía del menú |
| [Playwright](https://playwright.dev/) (dev) | Capturas automatizadas para este README |

Estado global: **Context API** (`AuthContext`, `LocaleContext`, `ThemeContext`, `NavigationContext`). Anuncios para lectores de pantalla: **`SrAnnouncer`**.

---

## Requisitos e instalación

- **Node.js 18+**
- **npm**

```bash
cd frontend
npm install
cp .env.example .env   # ajustar URLs y Client ID
npm run dev
```

Aplicación en **http://localhost:5173**.

Para API local: backend en `:8080` o apuntar `VITE_API_URL` a Railway (ver [Configuración](#configuración) y [`qa/README.md`](../qa/README.md)).

---

## Configuración

Copiá [`.env.example`](./.env.example) → `.env`.

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | Base URL del backend. En prod: `https://g9-latam-team-48-production.up.railway.app`. Vacío = misma origen (Docker/nginx). |
| `VITE_USE_MOCK_AUTH` | `true` → login simulado; `false` → JWT real. |
| `VITE_USE_MOCK_API` | `true` → datos mock; `false` → API Spring. |
| `VITE_ML_API_URL` | FastAPI ML opcional (`:8000`). Si está definida, Análisis IA la intenta primero. |
| `VITE_GOOGLE_CLIENT_ID` | Client ID OAuth **Web** (mismo valor que `GOOGLE_CLIENT_ID` en Railway). Sin esto, no se muestra el botón Google. |

**Google Cloud Console** (OAuth Web): registrar **Authorized JavaScript origins** para cada URL de prueba, por ejemplo:

- `http://localhost:5173`
- `https://g9-latam-team-48.vercel.app`
- Cada **preview** de Vercel que uses (origen exacto de la barra de direcciones)

En Vercel (prod), ejemplo mínimo:

```env
VITE_API_URL=https://g9-latam-team-48-production.up.railway.app
VITE_USE_MOCK_AUTH=false
VITE_USE_MOCK_API=false
VITE_GOOGLE_CLIENT_ID=<tu-client-id>.apps.googleusercontent.com
```

Las contraseñas demo **no** van en el repo; ver [`qa/README.md`](../qa/README.md).

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run build` | Build estático en `dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run screenshots` | Genera PNG en `screenshots/` (requiere `npm run dev` y, para Google en capturas, `VITE_GOOGLE_CLIENT_ID`) |
| `npm run bake:world-map` | Regenera assets del mapa de idiomas |

---

## Autenticación y sesión

### Email y contraseña

1. **Registro** → el backend envía mail de verificación (SMTP).
2. **Verificar** → ruta `/verify-email?verifyToken=…`.
3. **Login** → JWT solo si el email está verificado.

Recuperación: **olvidé contraseña** envía link; **reset** solo con `resetToken` del mail.

### Google Sign-In

- Botón **Google Identity Services** en login y registro.
- El backend valida el ID token en `POST /api/v1/auth/google` y emite JWT (email considerado verificado).
- **Bloqueadores de anuncios** pueden impedir el script o el popup: la UI muestra aviso **después de un clic fallido** en Google; el login por email sigue disponible.

### Sesión JWT (cliente)

- Token y perfil en **`localStorage`** (`token`, `user`); no hay refresh token en esta demo.
- Expiración según `JWT_EXPIRATION` del backend.
- Si el token vence o `/users/me` responde 401/403: limpieza de sesión, dashboard sin modal de login automático, rutas protegidas no montadas hasta reautenticarse.
- Hidratación: no se muestra UI “logueada” hasta validar token con `/api/v1/users/me`.

### Cuentas demo (seed Flyway V6)

| Rol | Email |
|-----|--------|
| Operador | `operador@energyai.com` |
| Admin | `admin@energyai.com` |
| Equipo 48 | `team48@energyai.com` |

Detalle SMTP, admin y Google en backend: [`docs/backend/AUTH_EMAIL_ADMIN.md`](../docs/backend/AUTH_EMAIL_ADMIN.md).

---

## Internacionalización

- **21 idiomas** con UI completa; packs adicionales en el mapa (traducción parcial con fallback a inglés).
- Detección inicial del idioma del navegador; fallback **español**.
- Persistencia: `localStorage.locale`.
- Atributo **`lang`** en `<html>` sincronizado con el locale activo.
- Diccionarios: `src/i18n/` (`locales/`, `sections/`, `packs/`).

---

## Accesibilidad

La interfaz está pensada para **teclado** y **lectores de pantalla** (NVDA, Narrador, VoiceOver):

- Enlaces **saltar al contenido** y **saltar al menú**.
- Landmarks semánticos (`header`, `nav`, `main`, `aside`).
- **`SrAnnouncer`**: cambios de página, idioma, tema, sesión y apertura del modal de login.
- Formularios con **labels**; errores con roles ARIA donde aplica.
- Gráficos Recharts acompañados de **tabla de datos** para SR (`ChartSrTable`, clase `visually-hidden`).
- Botones solo icono con **`aria-label`** en header y acciones admin.

Guía de pruebas (sin ser usuario no vidente), claves `a11y.*` y mantenimiento: **[`docs/frontend/ACCESIBILIDAD.md`](../docs/frontend/ACCESIBILIDAD.md)**.

---

## Integración con la API

Cliente: `src/services/api.js` (Axios + interceptor 401).

| Método | Ruta | Uso |
|:------:|------|-----|
| `POST` | `/api/v1/auth/register` | Alta + verificación por mail |
| `POST` | `/api/v1/auth/login` | JWT (email verificado) |
| `POST` | `/api/v1/auth/google` | `{ credential }` → JWT |
| `POST` | `/api/v1/auth/verify-email` | Confirmar cuenta |
| `POST` | `/api/v1/auth/resend-verification` | Reenviar mail |
| `POST` | `/api/v1/auth/forgot-password` | Solicitar reset |
| `POST` | `/api/v1/auth/reset-password` | Nueva contraseña |
| `GET` | `/api/v1/users/me` | Perfil (Bearer) |
| `GET/POST/PUT/DELETE` | `/api/v1/admin/users` | Admin usuarios |
| `POST` | `/api/v1/contact` | Formulario contacto |
| `GET` | `/api/consumos` | Series de consumo |
| `GET` | `/api/recomendaciones` | Recomendaciones |
| `POST` | `/api/analisis` | Análisis IA (Spring → ML/heurística) |

Cabecera autenticada: `Authorization: Bearer <accessToken>`.

---

## Análisis IA (frontend)

- Página `AnalisisIA.jsx`: validación de campos, envío a cadena **ML directo** → **Spring** → **heurística local** (`iaService.js`).
- Tipos: `APARTAMENTO`, `CASA_UNIFAMILIAR`, `PEQUENO_ESTABLECIMIENTO_COMERCIAL`.
- Respuesta esperada: `nivelKey`, `ahorro`, `tipKeys`, `benchmark`, `confidence`.

Documentación de contrato: [`docs/backend/ANALISIS_IA.md`](../docs/backend/ANALISIS_IA.md), [`ml-service/README.md`](../ml-service/README.md).

Mock del dashboard (Data Analysis): `src/data/analyticsMock.js`.

---

## Experiencia de usuario

- **App shell**: header fijo, sidebar en desktop, offcanvas en móvil.
- **Estados**: `Loader`, `ErrorState` (reintentar), `EmptyState`.
- **Capa de servicios** con conmutación mock/API vía env.
- **Responsive**: menú hamburguesa &lt; `md`, grid Bootstrap en tarjetas y gráficos.

---

## Capturas de pantalla

Galería en [`screenshots/`](./screenshots/). Índice: [`screenshots/README.md`](./screenshots/README.md).

<div align="center">

### Dashboard

<img src="./screenshots/dashboard.png" alt="Dashboard EnergIA" width="900" />

</div>

<table>
  <tr>
    <td width="50%"><strong>Consumos</strong><br /><img src="./screenshots/consumos.png" alt="Consumos" /></td>
    <td width="50%"><strong>Análisis IA</strong><br /><img src="./screenshots/analisis-ia.png" alt="Análisis IA" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Historia de consumos</strong><br /><img src="./screenshots/historia-consumos.png" alt="Historia" /></td>
    <td width="50%"><strong>Mapa de idiomas</strong><br /><img src="./screenshots/mapa-idiomas.png" alt="Mapa idiomas" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Recomendaciones</strong><br /><img src="./screenshots/recomendaciones.png" alt="Recomendaciones" /></td>
    <td width="50%"><strong>Contáctanos</strong><br /><img src="./screenshots/contacto.png" alt="Contacto" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Admin — Usuarios</strong><br /><img src="./screenshots/admin-usuarios.png" alt="Admin usuarios" /></td>
    <td width="50%"><strong>Admin — Análisis</strong><br /><img src="./screenshots/admin-analisis.png" alt="Admin análisis" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Login</strong> (email + Google)<br /><img src="./screenshots/login.png" alt="Login" /></td>
    <td width="50%"><strong>Registro</strong> (email + Google)<br /><img src="./screenshots/registro.png" alt="Registro" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Recuperar contraseña</strong><br /><img src="./screenshots/forgot-password.png" alt="Forgot password" /></td>
    <td width="50%"><strong>Verificar email / Reset</strong> (vía link del mail)<br /><img src="./screenshots/verify-email.png" alt="Verify email" /></td>
  </tr>
</table>

Regenerar (con dev server activo y `.env` con Google si querés el botón en las capturas):

```bash
npm run screenshots
```

Las pantallas **verify** y **reset** dependen del link del correo; en demo el SMTP puede no entregar a todas las bandejas.

---

## Estructura del proyecto

```
frontend/
├── public/                 # Estáticos (logos, fotos equipo)
├── screenshots/            # PNG del README
├── scripts/                # Playwright, mapa idiomas
├── src/
│   ├── components/         # UI reutilizable (charts, modals, SrAnnouncer…)
│   ├── context/            # Auth, Locale, Theme, Navigation
│   ├── data/               # Mocks y roster equipo
│   ├── hooks/              # useFetch, etc.
│   ├── i18n/               # Traducciones
│   ├── layouts/            # MainLayout (shell + skip links)
│   ├── pages/              # Vistas por ruta lógica
│   ├── services/           # API, auth, consumos, análisis
│   └── utils/              # Sesión, validación, Google GIS helpers
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

## Documentación relacionada

| Documento | Contenido |
|-----------|-----------|
| [`docs/frontend/ACCESIBILIDAD.md`](../docs/frontend/ACCESIBILIDAD.md) | Accesibilidad y pruebas SR |
| [`docs/backend/AUTH_EMAIL_ADMIN.md`](../docs/backend/AUTH_EMAIL_ADMIN.md) | Auth, mail, admin |
| [`docs/backend/ANALISIS_IA.md`](../docs/backend/ANALISIS_IA.md) | Contrato análisis |
| [`backend/README.md`](../backend/README.md) | API Spring |
| [`qa/README.md`](../qa/README.md) | Smoke P0/P1, secretos locales |
| [`README.md`](../README.md) | Visión general del monorepo |

---

## Calidad y pruebas

- Checklist y scripts: carpeta [`qa/`](../qa/) (`run-p0.ps1`, `run-p1.ps1`, inspección Google/i18n).
- Build de producción: `npm run build` antes de merge a rama de deploy.
- Google Sign-In en prod: validar origen OAuth + variables Vercel/Railway alineadas.

---

## Equipo

Desarrollado en el **Hackathon ONE G9 — Team 48**.

Roster en la página **Contáctanos** (`src/data/equipo.js`, fotos en `public/equipo/`).

| Integrante | Rol |
|------------|-----|
| Jorge Gustavo Martinez | Full Stack |
| Ricardo Chirinos | Data Analyst |
| Elizabeth Díaz Familia | Data Scientist |
| Carlos Miyen Brandolino | Backend |
| Germán French | Backend |
| Jharle Compres | Data Analyst |
| Neil Jacome | Project Manager |

Contacto: **energyaiteam48@gmail.com**

<div align="center">

⚡ *EnergIA — energía más inteligente*

</div>
