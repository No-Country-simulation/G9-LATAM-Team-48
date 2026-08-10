# Autenticación, email y Panel Admin — EnergyAI

> Complementa [`JWT_AUTHENTICATION.md`](./JWT_AUTHENTICATION.md). Documenta lo
> implementado en el hackathon: verificación de email, SMTP, recuperación de
> contraseña, soft delete y CRUD de usuarios para administradores.

---

## Tabla de contenidos

1. [Resumen](#1-resumen)
2. [Modelo de datos](#2-modelo-de-datos)
3. [Verificación de email](#3-verificación-de-email)
4. [Recuperación de contraseña](#4-recuperación-de-contraseña)
5. [Envío SMTP (Gmail)](#5-envío-smtp-gmail)
6. [Panel Admin (CRUD)](#6-panel-admin-crud)
7. [Endpoints](#7-endpoints)
8. [Frontend](#8-frontend)
9. [Variables de entorno](#9-variables-de-entorno)
10. [Flujo de prueba local](#10-flujo-de-prueba-local)

---

## 1. Resumen

| Capacidad | Comportamiento |
|-----------|----------------|
| Registro | Crea usuario **sin JWT**. Envía mail de verificación. |
| Login | Solo si `email_verified_at` no es null. |
| Verificar email | Link `/?verifyToken=...` → pantalla → `POST /verify-email`. |
| Forgot password | Envía mail; **no** abre la UI de reset en el modal. |
| Reset password | Solo con link `/?resetToken=...` del correo. |
| Admin CRUD | Rol `ADMIN`; alta/edición/desactivación (soft delete). |
| Alta por admin | Usuario queda **verificado**; password temporal por mail. |
| Soft delete | Columna `users.deleted_at`; admins no se pueden desactivar. |

Los tokens de verificación/reset **no se exponen** en la respuesta JSON al
frontend (evita auto-abrir pantallas). Solo viajan en el email.

---

## 2. Modelo de datos

Migraciones Flyway relevantes (`backend/src/main/resources/db/migration/`):

| Versión | Contenido |
|---------|-----------|
| V1 | Tabla `users` |
| V3 | `password_reset_tokens` |
| V4 | `users.deleted_at` (borrado lógico) |
| V5 | `users.email_verified_at` + `email_verification_tokens` |
| V6 | Seed usuarios demo (`operador`, `admin`, `team48`) |

### `users.email_verified_at`

- `NULL` → email no verificado (no puede hacer login).
- Con timestamp → verificado.
- Usuarios existentes al aplicar V5 quedan verificados (backfill).

### `email_verification_tokens`

Token de un solo uso, con `expires_at` y `used_at`.

---

## 3. Verificación de email

```
Registro → User (email_verified_at = null)
        → token en email_verification_tokens
        → mail con link http://localhost:5173/?verifyToken=<token>
        → UI VerifyEmail → POST /api/v1/auth/verify-email
        → email_verified_at = now()
        → Login OK
```

Servicios clave:

- `AuthenticationService` — registro / login (gate de verificación).
- `EmailVerificationService` — emisión, verify, resend.
- `UserMailService` — envío SMTP (o log si falla / está deshabilitado).

Config:

```yaml
app.email-verification.expose-token: false   # no devolver token al cliente
app.email-verification.ttl-hours: 48
```

---

## 4. Recuperación de contraseña

```
Forgot → token en password_reset_tokens
      → mail con link /?resetToken=<token>
      → UI ResetPassword → POST /api/v1/auth/reset-password
```

El modal de login solo muestra el mensaje “revisá tu email”; **no** navega a
la pantalla de reset.

Config:

```yaml
app.password-reset.expose-token: false
app.password-reset.ttl-hours: 24
```

---

## 5. Envío SMTP (Gmail)

Dependencia: `spring-boot-starter-mail`.

`UserMailService` envía:

- Verificación de email
- Reset de contraseña
- Bienvenida con password temporal (alta admin)

### Gmail

1. Activar **verificación en 2 pasos**.
2. Generar **App Password** (no usar la contraseña normal de la cuenta).
3. Configurar en `backend/.env` (archivo local, **no versionar**):

```env
MAIL_ENABLED=true
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu_cuenta@gmail.com
MAIL_PASSWORD=xxxx xxxx xxxx xxxx
MAIL_FROM=tu_cuenta@gmail.com
FRONTEND_BASE_URL=http://localhost:5173
```

Estados de respuesta: `SENT` | `FAILED` | `PENDING` | `SKIPPED`.

Si el envío falla, el backend deja el contenido/link en los logs.

---

## 6. Panel Admin (CRUD)

- Rutas API: `/api/v1/admin/users` (requiere JWT + rol `ADMIN`).
- Frontend: página **Panel Admin** (`AdminUsuarios.jsx`), visible solo a admins.
- Soft delete: no borra la fila; setea `deleted_at`.
- No se puede desactivar un usuario con rol `ADMIN` ni la propia cuenta.
- Alta sin password: genera temporal, envía mail de bienvenida y marca email
  como verificado.

---

## 7. Endpoints

### Auth (público)

| Método | Ruta | Notas |
|--------|------|--------|
| `POST` | `/api/v1/auth/register` | Sin JWT; envía verificación |
| `POST` | `/api/v1/auth/login` | Exige email verificado |
| `POST` | `/api/v1/auth/verify-email` | `{ "token" }` |
| `POST` | `/api/v1/auth/resend-verification` | `{ "email" }` |
| `POST` | `/api/v1/auth/forgot-password` | `{ "email" }` |
| `POST` | `/api/v1/auth/reset-password` | `{ "token", "newPassword" }` |

### Admin (rol ADMIN)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/admin/users` | Listar activos |
| `GET` | `/api/v1/admin/users/{id}` | Detalle |
| `POST` | `/api/v1/admin/users` | Crear |
| `PUT` | `/api/v1/admin/users/{id}` | Actualizar |
| `DELETE` | `/api/v1/admin/users/{id}` | Soft delete |

### Usuario autenticado

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/users/me` | Perfil |

---

## 8. Frontend

| Pieza | Rol |
|-------|-----|
| `LoginModal` | Login / registro / forgot (sin auto-navegar a reset/verify) |
| `VerifyEmail` | Se abre solo con `?verifyToken=` |
| `ResetPassword` | Se abre solo con `?resetToken=` |
| `AdminUsuarios` | CRUD admin |
| `AuthContext` | Sesión JWT; registro no inicia sesión |

Variables típicas (`frontend/.env`):

```env
VITE_API_URL=http://localhost:8080
```

---

## 9. Variables de entorno

Ver `backend/.env.example`. Arranque local típico:

```env
APP_PERSISTENCE_TYPE=jpa
FLYWAY_ENABLED=true
JPA_DDL=validate
DB_URL=jdbc:mysql://localhost:3306/energia_ia?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=***
SPRING_PROFILES_ACTIVE=dev
# + MAIL_* como arriba
```

---

## 10. Flujo de prueba local

1. MySQL con DB `energia_ia`; backend con Flyway + SMTP.
2. Frontend en `:5173` con mock auth/API en `false`.
3. Registrarse → llegar mail → abrir link → login.
4. Forgot password → llegar mail → abrir link → nueva contraseña.
5. Login como `admin@energyai.com` → Panel Admin → CRUD.

Cuentas demo (migración Flyway `V6__seed_demo_users.sql`; email ya verificado):

| Usuario | Email | Rol |
|---------|-------|-----|
| Operador | `operador@energyai.com` | USER |
| Admin | `admin@energyai.com` | ADMIN |
| Team 48 | `team48@energyai.com` | USER |

> Contraseñas demo: canal del equipo o `QA_DEMO_*` — no commitear en Git.

> La DB `energia_ia` se crea a mano
> (`CREATE DATABASE energia_ia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`)
> o con Docker (`MYSQL_DATABASE`). Flyway solo crea tablas y el seed demo.
