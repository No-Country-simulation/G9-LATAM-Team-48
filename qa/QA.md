# Checklist QA — EnergIA

Marcá **Pass / Fail / N/A** en cada fila. No hace falta cambiar código de producto para usar esta guía.

## Ambientes

| Ambiente | Frontend | Backend API |
|----------|----------|-------------|
| **Prod (demo)** | https://g9-latam-team-48.vercel.app | https://g9-latam-team-48-production.up.railway.app |
| **Local** | `http://localhost:5173` (`frontend/`) | `http://localhost:8080` (`backend/`) |

Rama de deploy: **`Jorge-martinez`**.

### Usuarios demo (prod / seed Flyway V6)

Emails públicos; contraseñas **fuera del repo** (`qa/secrets.local.ps1` o variables `QA_DEMO_*`).

| Email | Rol |
|-------|-----|
| `operador@energyai.com` | USER |
| `admin@energyai.com` | ADMIN |
| `team48@energyai.com` | USER |

---

## Automatizado (desde esta carpeta / monorepo)

Ejecutar **sin editar** front/back/DS; solo invocar sus runners:

```powershell
# Backend (JUnit) — desde raíz del repo
cd backend
mvn -q test

# Frontend (smoke de build)
cd ../frontend
npm run build

# Smoke API prod (solo lectura)
cd ../qa
.\smoke-api.ps1
```

| ID | Caso | Esperado | Resultado |
|----|------|----------|-----------|
| A1 | `mvn test` — AuthFlowIntegrationTest | Registro → verify → login → `/users/me`; login sin verify 409 | **Pass** (2026-07-27) |
| A2 | `mvn test` — RecommendationServiceImplTest | tipKeys según reglas | **Pass** (incluido en `mvn test`) |
| A3 | `mvn test` — EnergyApplicationTests | Context carga (perfil `test`) | **Pass** |
| A4 | `npm run build` (frontend) | Build Vite OK | **Pass** |
| A5 | Smoke Railway (`smoke-api.ps1`) | Críticos 2xx/401-403; opcionales pueden WARN | **Pass con WARN** (Swagger UI 500; `/actuator/health` 503) |

---

## P0 — Bloqueantes (manual / prod)

Corrida API/bundle: `qa/run-p0.ps1` (2026-07-27). UI de Google + mail real = MANUAL.

| ID | Área | Pasos | Esperado | Pass/Fail |
|----|------|-------|----------|-----------|
| P0-01 | Deploy | Abrir Vercel | App carga; sin errores de consola graves por API URL | **Pass** (HTML 200 + assets) |
| P0-02 | Deploy | Network: llamadas a Railway | CORS OK; no 403/failed por origen | **Pass** (ACAO = origen Vercel; API en bundle) |
| P0-03 | Auth email | Registro con email nuevo | 201; **sin** JWT; **no** se muestra token en UI | **Pass** (API 201 sin JWT; UI token no revisada) |
| P0-04 | Auth email | Login antes de verificar | Error / conflicto (no entra) | **Pass** (409) |
| P0-05 | Auth email | Abrir link `?verifyToken=` del mail → Verificar | Cuenta verificada | **Pass** (mail recibido en prod; flujo completo verificado en local — ver L-01…L-08) |
| P0-06 | Auth email | Login post-verify | Entra; sidebar / sesión OK | **Pass** (seed `operador@…` → JWT + `/me` 200) |
| P0-07 | Auth Google | Modal login: botón Google visible | Se ve GIS / botón | **Pass** (Client ID / GIS en bundle; confirmar botón en UI) |
| P0-08 | Auth Google | Completar login Google | Entra sin “Login con Google no está configurado” | **Pass** (login OAuth real OK en UI — 2026-07-28; Client ID Vercel + Railway) |
| P0-09 | Análisis IA | Formulario válido (área > 0) → enviar | Resultado predicción/heurística | **Pass** (200; tipKeys `led,peak,appliances,standby`) |
| P0-10 | Análisis IA | Área 0 o inválida | Validación; no envía o API 400 | **Pass** (400) |
| P0-11 | Recomendaciones | Abrir recomendaciones / tras análisis | Tips legibles (i18n tipKeys) | **Pass** (GET 200 + tipKeys del análisis) |
| P0-12 | Admin | Login `admin@energyai.com` | Ve menú Admin usuarios / análisis | **Pass** (login + `/me` role ADMIN; menú UI no revisado) |
| P0-13 | Admin | Listar usuarios | Lista carga | **Pass** (`GET /admin/users` 200) |

---

## P1 — Importantes

Corrida API: `qa/run-p1.ps1` + inspección bundle (`qa/inspect-google-i18n.ps1`) — 2026-07-27/28.

| ID | Área | Pasos | Esperado | Pass/Fail |
|----|------|-------|----------|-----------|
| P1-01 | Consumos | Abrir Consumos (sin login) | Datos / gráfico visibles | **Pass** (`GET /api/consumos` 200) |
| P1-02 | Historia | Sin sesión → Historia | Redirige o bloquea (dashboard) | **Pass** (`GET /analisis/mis` 403; FE redirige) |
| P1-03 | Historia | Con sesión USER | Historial de análisis/consumos | **Pass** (operador → 200) |
| P1-04 | Forgot password | Pedir reset | Mensaje OK (mail puede no llegar en demo) | **Pass** (mail de Germán + local L-06 + prod SENT) |
| P1-05 | Reset password | Link `?resetToken=` | Cambia password; login nuevo | **Pass** (mail de Germán + local L-07) |
| P1-06 | Admin CRUD | Crear usuario (verificado) | Usuario aparece; puede login | **Pass** (create + login; luego cleanup) |
| P1-07 | Admin | Editar / eliminar (cuidado en prod) | Cambios reflejados | **Pass** (PUT 200 + DELETE soft 200) |
| P1-08 | Admin análisis | Listar / recalcular si aplica | Sin error 500 | **Pass** (`GET /admin/analisis` 200; recalcular no ejecutado) |
| P1-09 | Contacto | Enviar formulario contacto | OK o feedback claro | **Pass** (200; `emailStatus=SENT`) |
| P1-10 | i18n | Cambiar idioma (mapa / selector) | UI y tips cambian de idioma | **Pass** (packs es/en/… + strings en bundle Vercel; selector en Header) |
| P1-11 | Roles | USER no ve Admin | Menú admin oculto / 403 API | **Pass** (USER → `/admin/users` 403) |
| P1-12 | Google env | Vercel `VITE_GOOGLE_CLIENT_ID` + Railway `GOOGLE_CLIENT_ID` | Mismo Client ID; sin espacios raros en `=` | **Pass** (mismo Client ID en Vercel y local; Railway verifica tokens) |

---

## Correo — corrida local (SMTP Gmail)

En prod el correo sale por **Resend en modo test**, que solo entrega a la casilla dueña
configurada en Resend (variable `QA_INBOX` en scripts locales) y puede rechazar alias `+`.
En local se puede usar el **SMTP Gmail** del equipo (`backend/.env`, gitignored), que entrega
a cualquier destinatario; así el flujo se prueba las veces que haga falta.

```powershell
# Terminal 1 — backend local (SMTP en vez de Resend, tokens expuestos)
.\qa\start-local-backend.ps1

# Terminal 2 — flujo completo de correo
.\qa\run-mail-local.ps1
```

| ID | Caso | Esperado | Resultado |
|----|------|----------|-----------|
| L-01 | Registro cuenta nueva | 201; sin JWT | **Pass** (2026-07-27) |
| L-02 | Envío real por SMTP | `emailStatus: SENT` (alias `+` aceptado) | **Pass** |
| L-03 | Login sin verificar | 409 | **Pass** |
| L-04 | `verify-email` con el token del link | Cuenta verificada | **Pass** |
| L-05 | Login post-verify | 200 + `/users/me` OK | **Pass** |
| L-06 | Forgot password | Mail enviado | **Pass** |
| L-07 | Reset password + login con la nueva | 200 | **Pass** |
| L-08 | Mail extra para click manual en UI | Llega a la bandeja | **Pass** |

## Límites (prueba manual obligatoria)

- **Correo en prod (Resend modo test):** solo entrega a la casilla dueña de la cuenta,
  hoy la casilla dueña de Resend (`QA_INBOX`). Verificado el 2026-07-27: alias `+qa` → `emailStatus: FAILED`;
  dirección exacta → `emailStatus: SENT`. Para enviar a cualquier destinatario en prod habría que
  verificar un dominio en Resend (Railway Hobby bloquea SMTP).
- **Ojo:** si `RESEND_API_KEY` está seteada, `UserMailService` la prioriza y el SMTP nunca se usa.
  Por eso `start-local-backend.ps1` la vacía para la corrida local.
- **Google Sign-In:** el click OAuth real se validó manualmente en prod (2026-07-28).
- No hay suite E2E en frontend; UI = esta checklist (+ opcional `npm run screenshots` en `frontend/`, solo capturas).

## Registro de corrida

| Fecha | Ambiente | Quién | A1–A5 | P0 fallidos | Notas |
|-------|----------|-------|-------|-------------|-------|
| 2026-07-27 | local + Railway | agente | A1–A4 Pass; A5 Pass+WARN | (manual pendiente) | Swagger UI 500 y actuator health 503 en prod; API negocio OK |
| 2026-07-27 | prod (Vercel+Railway) | agente | — | ninguno (P0-05/08 Manual) | `run-p0.ps1`: 11 Pass API; falta verify por mail + Google UI |
| 2026-07-27 | local (SMTP Gmail) | agente | — | ninguno | `run-mail-local.ps1`: L-01…L-08 Pass; queda P0-08 (Google UI) |
| 2026-07-27 | prod (mail real) | equipo | — | — | Forgot/reset ya OK con mail de Germán; P1-04/05 Pass |
| 2026-07-28 | prod | agente | — | ninguno | `run-p1.ps1`: P1-01…12 Pass; P0-08 Pass(env); cleanup qa.p0+ |
| 2026-07-28 | prod (UI) | equipo | — | ninguno | Google Sign-In OAuth real OK → P0-08 Pass completo; checklist P0/P1 cerrada |
