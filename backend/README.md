# Backend

La aplicacion analiza patrones de consumo energetico y clasifica a los usuarios
apoyandose en un modelo de **Machine Learning** desarrollado en Python
(FastAPI). Este backend en **Spring Boot** actua como orquestador central:
expone la API REST, gestiona la autenticacion con JWT y coordina los modulos de
prediccion, recomendaciones y calculo de costos.

---

## Qué se implementó (Análisis IA) — para integrar

Módulo **aparte**: no modifica recomendaciones, costos ni persistencia de
consumos. El equipo puede mergearlo sin pisar ese trabajo.

### Resumen

| Pieza | Detalle |
|-------|---------|
| `POST /api/analisis` | Fachada del formulario del frontend (`com.alura.analisis`) |
| `com.alura.prediction` | Cliente HTTP → FastAPI (`FastApiPredictionClient`) |
| Respuesta | `nivelKey`, `ahorro`, `tipKeys`, `benchmark`, `confidence` |
| Errores | `400` body inválido · `503` ML caído |
| Seguridad | `/api/analisis/**` y `/api/v1/predictions/**` públicos (demo) |
| CORS | Habilitado para el front en local |
| Compose | Servicio `ml` + `PREDICTION_API_BASE_URL=http://ml:8000` |

### Flujo

```text
Frontend → POST /api/analisis → Spring → ml-service (FastAPI :8000)
```

### Cómo probar en local

```bash
# Terminal 1 — modelo
cd ml-service
python -m venv .venv && .\.venv\Scripts\activate
pip install -r requirements.txt
python train.py
uvicorn app.main:app --reload --port 8000

# Terminal 2 — backend
cd backend
mvn spring-boot:run
```

Ejemplo:

```bash
curl -X POST http://localhost:8080/api/analisis ^
  -H "Content-Type: application/json" ^
  -d "{\"tipo\":\"casa\",\"consumo\":380,\"personas\":4,\"equipos\":8,\"area\":64,\"climateHours\":0,\"peakUseHours\":6}"
```

Guía completa de contrato e integración:
[`docs/backend/ANALISIS_IA.md`](../docs/backend/ANALISIS_IA.md).

Microservicio Python: [`ml-service/README.md`](../ml-service/README.md).

---

## Tecnologias

- **Java 21**
- **Spring Boot 3.3.x**
- **Maven**
- **Spring Web** (API REST)
- **Spring Security** + **JWT** (`jjwt`)
- **Spring Validation** (Bean Validation)
- **Lombok**
- **Springdoc OpenAPI** (Swagger UI)
- **Jackson** (serializacion JSON)
- **Spring Boot Actuator** (health checks)
- **Docker ready** 

---

## Requisitos previos

- JDK 21
- Maven 3.9+ (o el wrapper `./mvnw` si se agrega mas adelante)
- Docker (opcional, para ejecucion en contenedor)

---

## Como ejecutar

### 1. Desarrollo local (Maven)

```bash
cd backend
mvn spring-boot:run
```

La aplicacion arranca en `http://localhost:8080` con el perfil `dev` por defecto.

- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON:** `http://localhost:8080/v3/api-docs`
- **Health check:** `http://localhost:8080/actuator/health`

### 2. Empaquetado

```bash
mvn clean package
java -jar target/energy-backend-0.1.0-SNAPSHOT.jar
```

### 3. Docker

```bash
cd backend
docker build -t energy-backend:latest .
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e JWT_SECRET=un-secreto-largo-y-aleatorio \
  -e PREDICTION_API_BASE_URL=http://fastapi:8000 \
  energy-backend:latest
```

---

## Perfiles y configuracion

La configuracion se resuelve mediante variables de entorno (con valores por
defecto para desarrollo). Los perfiles disponibles son:

| Perfil | Archivo                  | Uso                                   |
|--------|--------------------------|---------------------------------------|
| `dev`  | `application-dev.yml`    | Desarrollo local (Swagger habilitado). |
| `prod` | `application-prod.yml`   | Produccion (secretos obligatorios).    |

### Variables de entorno principales

| Variable                  | Descripcion                              | Default (dev)            |
|---------------------------|------------------------------------------|--------------------------|
| `SPRING_PROFILES_ACTIVE`  | Perfil activo                            | `dev`                    |
| `SERVER_PORT`             | Puerto HTTP                              | `8080`                   |
| `JWT_SECRET`              | Secreto de firma del JWT                 | *(placeholder inseguro)* |
| `JWT_EXPIRATION`          | Expiracion del token (ms)                | `86400000`               |
| `PREDICTION_API_BASE_URL` | URL base del servicio FastAPI            | `http://localhost:8000`  |

> En `prod`, `JWT_SECRET` y `PREDICTION_API_BASE_URL` **no** tienen valor por
> defecto: la aplicacion no debe arrancar sin ellos.

---

## Estructura de carpetas

```
backend
├── Dockerfile
├── pom.xml
└── src
    ├── main
    │   ├── java/com/alura
    │   │   ├── config          # Configuracion transversal (OpenAPI, CORS...)
    │   │   ├── security        # Infraestructura de seguridad JWT
    │   │   │   ├── jwt         #   Generacion/validacion de tokens
    │   │   │   ├── filter      #   Filtros de la cadena de seguridad
    │   │   │   ├── service     #   UserDetailsService
    │   │   │   └── config      #   SecurityFilterChain
    │   │   ├── auth            # Login / registro / emision de tokens
    │   │   ├── analisis        # Fachada Analisis IA (POST /api/analisis)
    │   │   ├── prediction      # Cliente del servicio de ML (FastAPI)
    │   │   ├── recommendation  # Motor de reglas de recomendacion
    │   │   ├── cost            # Calculo de costos energeticos
    │   │   ├── user            # Gestion de usuarios
    │   │   ├── common          # Excepciones, respuestas, mappers, utils
    │   │   ├── infrastructure  # Adaptadores externos (HTTP, storage, OCI)
    │   │   └── EnergyApplication.java
    │   └── resources
    │       ├── application.yml
    │       ├── application-dev.yml
    │       ├── application-prod.yml
    │       ├── data            # Datos de ejemplo para prototipado
    │       └── static
    └── test/java/com/alura     # Pruebas (contextLoads base)
```

Cada modulo sigue una **arquitectura por capas** (`controller` -> `service` ->
`repository`/`client`) con DTOs y modelos propios.

---

## Documentacion tecnica

- [`docs/backend/ARCHITECTURE.md`](../docs/backend/ARCHITECTURE.md) — decisiones
  de diseno, responsabilidades de cada paquete, principios SOLID y como
  incorporar nuevos modulos.
- [`docs/backend/JWT_AUTHENTICATION.md`](../docs/backend/JWT_AUTHENTICATION.md) —
  feature de autenticacion/autorizacion con JWT: justificacion, beneficios,
  diseno y uso.
- [`docs/backend/ANALISIS_IA.md`](../docs/backend/ANALISIS_IA.md) —
  modulo Analisis IA (Spring + FastAPI): contrato, env y como integrarlo.

---

## Autenticacion (JWT)

El backend usa autenticacion **stateless** con JSON Web Tokens. Endpoints
principales:

| Metodo | Ruta | Acceso | Descripcion |
|--------|------|--------|-------------|
| `POST` | `/api/v1/auth/register` | Publico | Registra un usuario y emite un token. |
| `POST` | `/api/v1/auth/login` | Publico | Autentica y emite un token. |
| `GET`  | `/api/v1/users/me` | Protegido | Perfil del usuario autenticado. |

Ejemplo rapido:

```bash
# 1. Login y captura del token
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@example.com","password":"secret123"}' | jq -r .data.accessToken)

# 2. Consumir una ruta protegida
curl http://localhost:8080/api/v1/users/me -H "Authorization: Bearer $TOKEN"
```

> Detalle completo (configuracion, flujo, manejo de errores y seguridad) en
> [`docs/backend/JWT_AUTHENTICATION.md`](../docs/backend/JWT_AUTHENTICATION.md).

---

## Convenciones y buenas practicas

- **Clean Code** y **SOLID** como base.
- Una responsabilidad por clase; alta cohesion y bajo acoplamiento.
- Interfaces para los limites del sistema (clientes externos, persistencia).
- DTOs inmutables (`record`) para los contratos de la API.
- Preparado para **pruebas unitarias** e **integracion continua**.

> Implementados: autenticacion JWT y **Analisis IA** (`/api/analisis` +
> `prediction` → FastAPI). Recomendaciones, costos y persistencia de consumos
> siguen pendientes / en esqueleto.
