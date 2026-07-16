<div align="center">

# ⚡ EnergyAI — Frontend

**Plataforma web para el análisis y la optimización del consumo energético**

Dashboard interactivo, análisis asistido por IA, recomendaciones de ahorro y acceso para operadores.

<br />

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-3-FF6384)
![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)

<br />

Hackathon ONE G9 · Team 48

</div>

---

## Tabla de contenidos

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

## Vista previa

> La interfaz soporta **tema claro y oscuro**. Las capturas están tomadas en modo oscuro.

<div align="center">

### Dashboard

<img src="./screenshots/dashboard.png" alt="Dashboard" width="900" />

</div>

<table>
  <tr>
    <td width="50%"><strong>Consumos</strong><br /><img src="./screenshots/consumos.png" alt="Consumos" /></td>
    <td width="50%"><strong>Análisis IA</strong><br /><img src="./screenshots/analisis-ia.png" alt="Análisis IA" /></td>
  </tr>
  <tr>
    <td width="50%"><strong>Recomendaciones</strong><br /><img src="./screenshots/recomendaciones.png" alt="Recomendaciones" /></td>
    <td width="50%" valign="top"><strong>Login (modal)</strong><br /><img src="./screenshots/login.png" alt="Login" /></td>
  </tr>
</table>

---

## Funcionalidades

| Módulo | Descripción |
|--------|-------------|
| **Dashboard** | Tarjetas con consumo del último mes, costo y promedio, más gráfico mensual y recomendaciones destacadas. |
| **Consumos** | Resumen (total, costo, promedio), tabla del historial con estado (normal / sobre promedio) y gráfico de evolución. |
| **Análisis IA** | Formulario (kWh, personas, equipos) que devuelve nivel de eficiencia, ahorro estimado y recomendaciones. |
| **Recomendaciones** | Tarjetas con categoría, prioridad, descripción y ahorro estimado; resumen con ahorro potencial acumulado. |
| **Tema claro / oscuro** | Alternable desde el header y persistido en `localStorage`; todos los componentes se adaptan. |
| **Login opcional** | La navegación es pública; el inicio de sesión (modal) queda reservado para acciones de operador. |

### Detalles de experiencia y calidad

- **Diseño responsive** con tres estados de menú:
  - Escritorio (≥ 992px): menú lateral completo con iconos y texto.
  - Tablet (768–991px): menú lateral angosto, solo iconos.
  - Móvil (< 768px): menú hamburguesa desplegable.
- **Layout tipo app shell**: header y menú siempre visibles; solo el contenido hace scroll.
- **Capa de servicios (mock → API)**: los datos se consumen desde `services/`; al conectar el backend solo cambia la configuración, no las páginas.
- **Estados de UI**: carga (spinner), error (con opción de reintentar) y vacío en cada sección.
- **Accesibilidad**: animaciones sutiles que respetan `prefers-reduced-motion` y foco visible por teclado.

---

## Tecnologías

| Herramienta | Uso |
|-------------|-----|
| [React 19](https://react.dev/) | Librería de interfaz |
| [Vite 7](https://vitejs.dev/) | Bundler y servidor de desarrollo |
| [Bootstrap 5](https://getbootstrap.com/) + [React Bootstrap](https://react-bootstrap.netlify.app/) | Estilos y componentes (modal, offcanvas) |
| [React Icons](https://react-icons.github.io/react-icons/) | Iconografía del menú |
| [Recharts](https://recharts.org/) | Gráficos de consumo |
| [Axios](https://axios-http.com/) | Cliente HTTP hacia el backend |

---

## Instalación

Requisitos: **Node.js 18+** y **npm**.

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar el entorno de desarrollo
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

---

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Compila la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente el build de producción |

---

## Variables de entorno

Copiá `.env.example` a `.env` y ajustá según el entorno:

```env
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK_AUTH=true
VITE_USE_MOCK_API=true
```

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base del backend |
| `VITE_USE_MOCK_AUTH` | `true` usa login simulado; `false` usa la API real |
| `VITE_USE_MOCK_API` | `true` usa datos simulados; `false` consume la API real |

---

## Integración con el backend

Al tener el backend disponible, establecé `VITE_USE_MOCK_API=false` y `VITE_USE_MOCK_AUTH=false`, y configurá `VITE_API_URL`. Los servicios ya esperan estos endpoints:

| Método | Endpoint | Descripción |
|:------:|----------|-------------|
| `POST` | `/api/auth/login` | Inicio de sesión (devuelve `token` y `user`) |
| `POST` | `/api/auth/logout` | Cierre de sesión |
| `GET` | `/api/consumos` | Lista de consumos mensuales |
| `GET` | `/api/recomendaciones` | Lista de recomendaciones |
| `POST` | `/api/analisis` | Análisis de consumo (recibe `consumo`, `personas`, `equipos`) |

El token se adjunta automáticamente en el header `Authorization: Bearer <token>` de cada petición autenticada.

---

## Autenticación

Mientras el backend no esté conectado, se puede ingresar con estas cuentas de ejemplo:

| Usuario | Email | Contraseña |
|---------|-------|------------|
| Operador | `operador@energyai.com` | `1234` |
| Admin | `admin@energyai.com` | `admin123` |
| Equipo 48 | `team48@energyai.com` | `team48` |

> También funciona cualquier email válido con una contraseña de 4 o más caracteres.

**Pasos:**
1. Ejecutar `npm run dev` y abrir `http://localhost:5173`.
2. Hacer clic en **Iniciar sesión** (header).
3. Usar una credencial de la tabla o el botón **Usar operador de ejemplo**.

---

## Estructura del proyecto

```
frontend/
├── screenshots/            # Capturas usadas en este README
├── src/
│   ├── components/         # UI reutilizable (Header, Sidebar, cards, estados, modal)
│   ├── context/            # ThemeContext y AuthContext
│   ├── data/               # Datos de ejemplo y configuración del menú
│   ├── hooks/              # useFetch (loading / error / data)
│   ├── layouts/            # Layout principal (app shell)
│   ├── pages/              # Dashboard, Consumos, Análisis IA, Recomendaciones
│   ├── services/           # API, autenticación y servicios de datos
│   ├── utils/              # Utilidades (formato de nombres, etc.)
│   └── index.css           # Estilos globales y animaciones
├── .env.example            # Variables de entorno de referencia
├── .gitignore
└── package.json
```

---

## Equipo

Desarrollado durante el **Hackathon ONE G9 — Team 48**.

<div align="center">

⚡ *EnergyAI — energía más inteligente*

</div>
