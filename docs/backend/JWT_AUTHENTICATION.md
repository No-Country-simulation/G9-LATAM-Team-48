# Autenticacion y Autorizacion con JWT — Energy Backend

> Guia del feature de seguridad basada en **JSON Web Tokens (JWT)**. Explica la
> justificacion, los beneficios, el diseno interno y como usarlo. Complementa a
> [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## Tabla de contenidos

1. [Que se implemento](#1-que-se-implemento)
2. [Justificacion: por que JWT](#2-justificacion-por-que-jwt)
3. [Beneficios](#3-beneficios)
4. [Diseno y componentes](#4-diseno-y-componentes)
5. [Flujo de autenticacion](#5-flujo-de-autenticacion)
6. [Configuracion](#6-configuracion)
7. [Uso de la API](#7-uso-de-la-api)
8. [Uso desde Swagger UI](#8-uso-desde-swagger-ui)
9. [Manejo de errores](#9-manejo-de-errores)
10. [Pruebas](#10-pruebas)
11. [Consideraciones de seguridad](#11-consideraciones-de-seguridad)
12. [Limitaciones actuales y mejoras futuras](#12-limitaciones-actuales-y-mejoras-futuras)

---

## 1. Que se implemento

- **Registro** de usuarios (`POST /api/v1/auth/register`).
- **Login** con emision de token (`POST /api/v1/auth/login`).
- **Autorizacion** de rutas mediante un filtro que valida el token en cada
  peticion.
- **Ruta protegida de ejemplo** (`GET /api/v1/users/me`) que devuelve el perfil
  del usuario autenticado.
- **Manejo centralizado de errores** (validacion, credenciales invalidas, etc.).
- **Integracion con Swagger UI** (boton *Authorize* con esquema Bearer).

> La persistencia es **en memoria** (`InMemoryUserRepository`): suficiente para
> un flujo funcional y testeable sin base de datos. Se sustituye por una
> implementacion real sin tocar el resto del codigo (ver seccion 12).

---

## 2. Justificacion: por que JWT

El backend es un **orquestador stateless** que expone una API REST consumida por
un frontend (y potencialmente por otros servicios). En ese contexto se eligio
JWT frente a las sesiones tradicionales con estado en servidor por:

- **Sin estado (stateless):** el token viaja en cada peticion y contiene la
  identidad del usuario. El servidor no necesita almacenar sesiones, lo que
  permite **escalar horizontalmente** (varias replicas detras de un balanceador)
  sin sesiones compartidas ni *sticky sessions*.
- **Desacoplamiento cliente/servidor:** encaja con una SPA/mobile que guarda el
  token y lo envia en la cabecera `Authorization`.
- **Interoperabilidad:** es un estandar (RFC 7519); cualquier cliente o servicio
  puede validarlo. Util si mas adelante otros modulos o el servicio FastAPI
  necesitan propagar identidad.
- **Autocontenido:** el token lleva sus *claims* (subject, expiracion) firmados,
  evitando una consulta a base de datos en cada peticion solo para saber quien
  es el usuario.

---

## 3. Beneficios

| Beneficio             | Detalle                                                                 |
|-----------------------|-------------------------------------------------------------------------|
| Escalabilidad         | Sin sesiones en servidor; replicas sin coordinacion de estado.          |
| Rendimiento           | Validacion local del token (firma), sin round-trip a la BD por peticion.|
| Separacion de capas   | La seguridad es infraestructura transversal, aislada de la logica.      |
| Testeabilidad         | Componentes desacoplados (interfaces) verificables de extremo a extremo.|
| Extensibilidad        | Facil anadir *claims* (roles, permisos) o refresh tokens en el futuro.  |
| Estandar              | Basado en RFC 7519; herramientas y librerias maduras (`jjwt`).          |

---

## 4. Diseno y componentes

El feature respeta la arquitectura por capas y el principio de **inversion de
dependencias**: las piezas dependen de abstracciones (`UserDetailsService`,
`UserRepository`), no de implementaciones concretas.

| Componente | Paquete | Responsabilidad |
|------------|---------|-----------------|
| `JwtService` | `security.jwt` | Genera, firma (HMAC-SHA256) y valida tokens; extrae *claims*. |
| `JwtAuthenticationFilter` | `security.filter` | Intercepta cada peticion, valida el token y puebla el `SecurityContext`. |
| `SecurityConfiguration` | `security.config` | Define la `SecurityFilterChain`, rutas publicas/protegidas, politica STATELESS y los beans `PasswordEncoder` y `AuthenticationManager`. |
| `UserDetailsServiceImpl` | `security.service` | Carga el usuario (via `UserRepository`) y lo mapea a `UserDetails`. |
| `AuthenticationService` | `auth.service` | Orquesta registro y login; emite el token. |
| `AuthController` | `auth.controller` | Expone `POST /register` y `POST /login`. |
| `UserController` | `user.controller` | Ruta protegida `GET /users/me` (demostracion). |
| `InMemoryUserRepository` | `user.repository` | Persistencia volatil de usuarios (temporal). |
| `GlobalExceptionHandler` | `common.exception` | Traduce excepciones a respuestas `ErrorResponse` homogeneas. |

**Decisiones de diseno relevantes:**

- El `JwtAuthenticationFilter` **no** es un bean de Spring: se instancia
  manualmente en `SecurityConfiguration`. Esto evita el doble registro como
  filtro de servlet (una peculiaridad de Spring Boot con beans de tipo `Filter`).
- La contrasena se almacena cifrada con **BCrypt**; nunca en texto plano.
- El rol del usuario se expone como autoridad de Spring con prefijo `ROLE_`.
- El email es el *subject* del token y el identificador de acceso.

---

## 5. Flujo de autenticacion

```
Registro / Login                          Peticion a ruta protegida
────────────────                          ──────────────────────────

Cliente                                   Cliente
  │  POST /auth/login {email,password}      │  GET /users/me
  │                                         │  Authorization: Bearer <token>
  ▼                                         ▼
AuthController                            JwtAuthenticationFilter
  │                                         │  1. Lee cabecera Authorization
  ▼                                         │  2. JwtService.extractUsername()
AuthenticationService                       │  3. UserDetailsService.load()
  │  AuthenticationManager.authenticate()   │  4. JwtService.isTokenValid()
  │  (verifica credenciales con BCrypt)     │  5. set SecurityContext
  ▼                                         ▼
JwtService.generateToken()                Controlador protegido
  │                                         │  (Authentication ya poblado)
  ▼                                         ▼
{ accessToken, tokenType: "Bearer" }      200 OK { perfil del usuario }
```

Si el token falta, esta expirado o es invalido, el `SecurityContext` queda
vacio y la cadena de seguridad responde **401/403** en las rutas protegidas.

---

## 6. Configuracion

Definida en `application.yml` (bloque `security.jwt`) y resuelta por variables de
entorno:

| Propiedad | Variable de entorno | Descripcion | Default (dev) |
|-----------|---------------------|-------------|---------------|
| `security.jwt.secret` | `JWT_SECRET` | Clave de firma HMAC. **Minimo 32 caracteres** (256 bits) para HS256. | *(placeholder inseguro)* |
| `security.jwt.expiration` | `JWT_EXPIRATION` | Vigencia del token en milisegundos. | `86400000` (24 h) |

> En el perfil `prod`, `JWT_SECRET` **no** tiene valor por defecto: la aplicacion
> no debe arrancar sin un secreto real. Nunca se debe versionar el secreto de
> produccion.

**Rutas publicas** (no requieren token), definidas en `SecurityConfiguration`:

- `/api/v1/auth/**` (registro y login)
- `/v3/api-docs/**`, `/swagger-ui/**`, `/swagger-ui.html` (documentacion)
- `/actuator/health` (health check)

Cualquier otra ruta requiere un token JWT valido.

---

## 7. Uso de la API

### 7.1 Registro

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana Torres","email":"ana@example.com","password":"secret123"}'
```

Respuesta `201 Created`:

```json
{
  "success": true,
  "message": "Usuario registrado correctamente.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer"
  },
  "timestamp": "2026-07-15T20:00:00Z"
}
```

### 7.2 Login

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@example.com","password":"secret123"}'
```

Respuesta `200 OK` con el mismo formato (token en `data.accessToken`).

### 7.3 Consumir una ruta protegida

```bash
TOKEN="<accessToken devuelto por login>"

curl http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN"
```

Respuesta `200 OK`:

```json
{
  "success": true,
  "message": null,
  "data": {
    "id": 1,
    "name": "Ana Torres",
    "email": "ana@example.com",
    "role": "USER"
  },
  "timestamp": "2026-07-15T20:01:00Z"
}
```

Sin la cabecera `Authorization`, la misma ruta responde **401/403**.

---

## 8. Uso desde Swagger UI

1. Abrir `http://localhost:8080/swagger-ui.html`.
2. Ejecutar `POST /api/v1/auth/login` y copiar `data.accessToken`.
3. Pulsar el boton **Authorize** (candado) e introducir el token.
4. Las rutas protegidas (marcadas con candado) ya envian la cabecera
   `Authorization: Bearer <token>` automaticamente.

---

## 9. Manejo de errores

El `GlobalExceptionHandler` devuelve respuestas homogeneas (`ErrorResponse`):

| Situacion | Codigo HTTP | Causa |
|-----------|-------------|-------|
| Datos de entrada invalidos | `400 Bad Request` | Falla la validacion (`@Valid`). Incluye `details` por campo. |
| Credenciales incorrectas | `401 Unauthorized` | `BadCredentialsException` en el login. |
| Email ya registrado | `409 Conflict` | `BusinessException` en el registro. |
| Usuario no encontrado | `404 Not Found` | `ResourceNotFoundException`. |
| Token ausente/invalido en ruta protegida | `401 / 403` | Cadena de seguridad de Spring. |

Ejemplo de error de validacion:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Error de validacion",
  "path": "/api/v1/auth/register",
  "details": [
    "email: El email no tiene un formato valido",
    "password: La contrasena debe tener al menos 8 caracteres"
  ],
  "timestamp": "2026-07-15T20:02:00Z"
}
```

---

## 10. Pruebas

El feature incluye pruebas de integracion de extremo a extremo
(`AuthFlowIntegrationTest`) que verifican, con `MockMvc`:

- Registro exitoso y emision de token (`201`).
- Login exitoso (`200`).
- Acceso a ruta protegida **sin** token -> rechazado (`4xx`).
- Acceso a ruta protegida **con** token -> `200` y datos correctos.
- Login con contrasena incorrecta -> `401`.
- Registro con payload invalido -> `400`.

Ejecucion:

```bash
cd backend
mvn test
```

---

## 11. Consideraciones de seguridad

- **Secreto robusto:** usar una clave aleatoria de >= 32 caracteres en
  `JWT_SECRET` (idealmente 64+). Nunca versionarla.
- **HTTPS obligatorio en produccion:** el token viaja en cada peticion; sin TLS
  puede ser interceptado.
- **Expiracion corta:** valores razonables (minutos/horas) reducen el impacto de
  un token filtrado. Complementar con *refresh tokens* (futuro).
- **BCrypt** para contrasenas: nunca almacenar contrasenas en texto plano.
- **CSRF deshabilitado** de forma deliberada: es correcto en una API stateless
  basada en tokens (no en cookies de sesion).
- **No exponer detalles internos** en los errores (el handler devuelve mensajes
  genericos para el `500`).

---

## 12. Limitaciones actuales y mejoras futuras

**Limitaciones (estado actual):**

- Persistencia **en memoria**: los usuarios se pierden al reiniciar.
- Sin *refresh tokens*: al expirar, el usuario debe volver a autenticarse.
- Autorizacion por autenticacion (rol `USER`); aun sin control por roles fino.

**Mejoras futuras:**

- **Persistencia real:** implementar `UserRepository` con Spring Data JPA
  (PostgreSQL/Oracle DB) y mapear `User` como entidad. No requiere cambios en la
  capa de seguridad gracias a la abstraccion.
- **Refresh tokens** y revocacion (lista negra / rotacion de claves).
- **Autorizacion por roles/permisos** con `@PreAuthorize` y jerarquia de roles.
- **Rate limiting** en los endpoints de autenticacion (mitigar fuerza bruta).
- **Auditoria** de inicios de sesion y eventos de seguridad.
- **Rotacion de secretos** gestionada por un *vault* (p. ej. OCI Vault).

---

> Mantener este documento actualizado ante cualquier cambio en el modelo de
> seguridad para que siga siendo la fuente de verdad del feature.
