# Arquitectura del Backend — Energy Backend

> Guia tecnica de referencia del backend orquestador del Hackathon ONE G9
> (Alura + Oracle). Su objetivo es que **cualquier desarrollador nuevo**
> comprenda por que la arquitectura esta organizada de esta forma y como
> extenderla sin romper los principios de diseno.
>
> **Despliegue en produccion (Vercel + OCI + Render):** [`../DEPLOY_PRODUCCION.md`](../DEPLOY_PRODUCCION.md).

---

## Tabla de contenidos

1. [Vision general](#1-vision-general)
2. [Por que esta arquitectura](#2-por-que-esta-arquitectura)
3. [Diagrama de alto nivel](#3-diagrama-de-alto-nivel)
4. [Responsabilidades de cada paquete](#4-responsabilidades-de-cada-paquete)
5. [Principios SOLID considerados](#5-principios-solid-considerados)
6. [Separacion entre autenticacion, prediccion y recomendaciones](#6-separacion-entre-autenticacion-prediccion-y-recomendaciones)
7. [Por que prediction es un cliente HTTP hacia FastAPI](#7-por-que-prediction-es-un-cliente-http-hacia-fastapi)
8. [Como agregar nuevos modulos](#8-como-agregar-nuevos-modulos)
9. [Convenciones de nombres](#9-convenciones-de-nombres)
10. [Estrategia para mantener bajo acoplamiento](#10-estrategia-para-mantener-bajo-acoplamiento)
11. [Estrategia de escalabilidad](#11-estrategia-de-escalabilidad)
12. [Preparacion para pruebas y CI](#12-preparacion-para-pruebas-y-ci)
13. [Posibles mejoras futuras](#13-posibles-mejoras-futuras)

---

## 1. Vision general

El backend es el **orquestador central** de la solucion. No entrena ni ejecuta
el modelo de Machine Learning (eso vive en un microservicio Python/FastAPI);
en cambio, coordina el flujo completo de negocio:

1. Autentica al usuario (JWT).
2. Recibe datos de consumo energetico.
3. Solicita al servicio de ML la **clasificacion** del usuario.
4. Genera **recomendaciones** a partir de esa clasificacion.
5. Calcula el **costo estimado** del consumo.
6. Devuelve una respuesta homogenea al frontend.

La arquitectura elegida es **por capas y organizada por modulos de negocio
(package-by-feature)**, con limites explicitos hacia los sistemas externos.

---

## 2. Por que esta arquitectura

Se evaluaron tres estilos y se eligio una combinacion pragmatica adecuada al
contexto de un hackathon (velocidad) que **no comprometa la calidad** a mediano
plazo:

### Package-by-feature (modulos de negocio) en lugar de package-by-layer global

En vez de tener paquetes globales `controllers`, `services`, `repositories`
(que crecen sin control y mezclan dominios), cada **funcionalidad** vive en su
propio paquete (`auth`, `prediction`, `recommendation`, `cost`, `user`). Dentro
de cada modulo se mantiene la separacion por capas.

**Ventajas:**

- **Alta cohesion:** todo lo relacionado con una funcionalidad esta junto.
- **Bajo acoplamiento entre modulos:** cada uno evoluciona de forma
  independiente.
- **Escalabilidad organizacional:** distintas personas pueden trabajar en
  modulos distintos con minimos conflictos.
- **Camino natural hacia microservicios:** si en el futuro se decide extraer un
  modulo, sus limites ya estan definidos.

### Arquitectura por capas dentro de cada modulo

`controller` (entrada) -> `service` (logica) -> `repository`/`client` (salida),
con `dto` y `model` como estructuras de datos.

Esto separa las **preocupaciones**: el transporte HTTP no se mezcla con la
logica de negocio, y la logica de negocio no se mezcla con el acceso a datos o a
servicios externos.

### Limites explicitos hacia el exterior (puertos y adaptadores, ligero)

Los puntos de contacto con el mundo exterior (servicio FastAPI, persistencia,
almacenamiento, OCI) se modelan como **interfaces** en el dominio y se
implementan en `infrastructure` o en el `client` del modulo. Es una version
ligera de la arquitectura hexagonal: suficiente para desacoplar, sin la
ceremonia completa.

---

## 3. Diagrama de alto nivel

```
                        ┌─────────────────────────┐
                        │        Frontend         │
                        └────────────┬────────────┘
                                     │ HTTP/REST (JWT)
                                     ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         ENERGY BACKEND (Spring Boot)                   │
│                                                                        │
│   security ──► filtra y valida cada peticion (JWT)                     │
│                                                                        │
│   auth ──► user            (login/registro, gestion de usuarios)       │
│                                                                        │
│   prediction ──► client ───────────────┐                              │
│   recommendation ──► rules             │                              │
│   cost                                 │                              │
│                                        │                              │
│   common (respuestas, errores, utils)  │                              │
│   infrastructure (HTTP, storage, OCI)  │                              │
└────────────────────────────────────────┼──────────────────────────────┘
                                          │ HTTP/REST
                                          ▼
                        ┌─────────────────────────┐
                        │  Servicio ML (FastAPI)   │
                        │   modelo de clasificacion │
                        └─────────────────────────┘
```

---

## 4. Responsabilidades de cada paquete

Base: `com.alura`.

### `config`
Configuracion transversal de la aplicacion: documentacion OpenAPI/Swagger,
CORS, beans compartidos. **No** contiene logica de negocio.

### `security`
Infraestructura de autenticacion y autorizacion basada en JWT. Subpaquetes:

- `security.jwt` — `JwtService`: generacion, firma y validacion de tokens.
- `security.filter` — `JwtAuthenticationFilter`: intercepta cada peticion,
  extrae el token y (a futuro) puebla el contexto de seguridad.
- `security.service` — `UserDetailsServiceImpl`: carga los datos del usuario
  para Spring Security (delegara en el modulo `user`).
- `security.config` — `SecurityConfiguration`: define la `SecurityFilterChain`,
  rutas publicas/protegidas, politica de sesiones STATELESS y los beans
  `PasswordEncoder` y `AuthenticationManager`.

> La seguridad es **infraestructura transversal**, por eso vive en su propio
> arbol y no dentro de `auth`. `auth` la usa; no la implementa.

### `auth`
Caso de uso de **autenticacion**: `login`, `registro` y emision de tokens.
Capas: `controller`, `service` (`AuthenticationService`), `dto`
(`LoginRequest`, `RegisterRequest`, `AuthResponse`), `model`.

### `prediction`
**Cliente** del servicio de Machine Learning (FastAPI). Capas:
`controller`, `service` (`PredictionService`), `client` (`PredictionClient`,
la abstraccion del transporte HTTP), `dto` (`PredictionRequest`,
`PredictionResponse`), `model`.

### `recommendation`
Genera recomendaciones a partir de la clasificacion. Preparado como **motor de
reglas**: `service` (`RecommendationService`), `rules` (`RecommendationRule`,
contrato de cada regla — patron Strategy), `dto`.

### `cost`
Calcula el **costo energetico estimado** aplicando la tarifa al consumo.
`service` (`CostService`), `dto` (`CostRequest`, `CostResponse`). Modulo
independiente porque es una preocupacion de negocio distinta y reutilizable.

### `user`
Gestion de usuarios. `controller`, `service` (`UserService`), `repository`
(`UserRepository`, abstraccion de persistencia **sin JPA todavia**), `dto`,
`model` (`User`, POJO puro sin anotaciones de persistencia).

### `common`
Componentes reutilizables transversales:

- `common.response` — `ApiResponse` y `ErrorResponse`: formato homogeneo de
  salida de la API.
- `common.exception` — excepciones de negocio (`ResourceNotFoundException`,
  `BusinessException`) y `GlobalExceptionHandler` (manejo centralizado).
- `common.mapper` — `GenericMapper`: contrato de mapeo entidad<->DTO.
- `common.util` — utilidades genericas.
- `common.constants` — `ApiConstants`: constantes compartidas.

### `infrastructure`
Adaptadores hacia sistemas externos:

- `infrastructure.client` — `RestClientConfig`: configuracion base de clientes
  HTTP (timeouts, interceptores, manejo de errores).
- `infrastructure.storage` — `StorageService`: abstraccion de almacenamiento.
- `infrastructure.oci` — `OciConfig`: integracion futura con Oracle Cloud.

---

## 5. Principios SOLID considerados

- **S — Responsabilidad unica:** cada clase tiene un unico motivo para cambiar.
  El controlador solo traduce HTTP; el servicio orquesta la logica; el cliente
  solo habla con FastAPI. Los DTOs solo transportan datos.

- **O — Abierto/Cerrado:** el motor de recomendaciones (`RecommendationRule`)
  permite agregar nuevas reglas creando nuevas implementaciones, **sin
  modificar** el codigo existente. Lo mismo aplica a `StorageService` o
  `PredictionClient`.

- **L — Sustitucion de Liskov:** las abstracciones (`PredictionClient`,
  `UserRepository`, `StorageService`) definen contratos que cualquier
  implementacion debe respetar por completo, de modo que sean intercambiables.

- **I — Segregacion de interfaces:** interfaces pequenas y especificas
  (`CostService`, `RecommendationService`, `PredictionService`) en lugar de una
  interfaz monolitica. Cada consumidor depende solo de lo que necesita.

- **D — Inversion de dependencias:** las capas altas dependen de **abstracciones**,
  no de implementaciones concretas. El `PredictionService` depende de la
  interfaz `PredictionClient`, no de un `RestClient` concreto. Spring inyecta la
  implementacion en tiempo de ejecucion.

---

## 6. Separacion entre autenticacion, prediccion y recomendaciones

Son **tres preocupaciones de negocio distintas** y deliberadamente aisladas:

| Modulo           | Pregunta que responde                        | Depende de              |
|------------------|----------------------------------------------|-------------------------|
| `auth`/`security`| ¿Quien eres y puedes entrar?                 | `user`                  |
| `prediction`     | ¿A que categoria de consumo perteneces?      | Servicio FastAPI (ML)   |
| `recommendation` | Dado tu perfil, ¿que deberias hacer?         | Salida de `prediction`  |

Beneficios de mantenerlos separados:

- **Cambios aislados:** modificar las reglas de recomendacion no toca la
  seguridad ni la integracion con ML.
- **Despliegue y evolucion independientes:** cada modulo puede crecer,
  probarse y (si hiciera falta) extraerse por separado.
- **Claridad de flujo:** el orquestador compone
  `prediction -> recommendation -> cost` de forma explicita y legible.

El flujo tipico compone los modulos sin acoplarlos: la salida de `prediction`
(una categoria) es la entrada de `recommendation` y `cost`, pero cada modulo
ignora los detalles internos de los demas.

---

## 7. Por que prediction sera un cliente HTTP hacia FastAPI

El modelo de Machine Learning se desarrolla en **Python** (ecosistema natural de
ML: pandas, scikit-learn, etc.) y se expone como un microservicio **FastAPI**.
El backend Java **no** reimplementa el modelo; lo **consume** por HTTP.

Razones de diseno:

1. **Poliglota por responsabilidad:** cada tecnologia en lo que es fuerte —
   Python para ML, Java/Spring para orquestacion y seguridad empresarial.
2. **Desacoplamiento y despliegue independiente:** el modelo puede reentrenarse
   y redeployarse sin recompilar ni redeployar el backend.
3. **Escalabilidad independiente:** el servicio de inferencia (intensivo en CPU)
   escala por separado del backend (intensivo en I/O).
4. **Testeabilidad:** al modelar la integracion como la interfaz
   `PredictionClient`, en los tests se sustituye por un doble (mock/stub) sin
   necesidad de levantar FastAPI.

Por eso `prediction` tiene un subpaquete `client` con la interfaz
`PredictionClient`: es el **puerto**; su implementacion concreta (con
`RestClient`/`WebClient`) sera el **adaptador**, configurado en
`infrastructure.client` y apuntando a `prediction.api.base-url`.

---

## 8. Como agregar nuevos modulos

Para incorporar un nuevo modulo de negocio (por ejemplo, `billing` o `report`):

1. **Crear el paquete** `com.alura.<modulo>` con sus capas segun necesidad:
   `controller`, `service`, `dto`, y `client`/`repository` si habla con el
   exterior o persiste datos.
2. **Definir primero los contratos:** DTOs (`record`) y la **interfaz** del
   servicio. La implementacion viene despues.
3. **Depender de abstracciones:** si el modulo consume un sistema externo,
   define una interfaz (puerto) e implementala en `infrastructure`.
4. **Reutilizar `common`:** usar `ApiResponse`/`ErrorResponse` para las salidas
   y las excepciones de `common.exception`.
5. **Exponer via controlador** con el prefijo `ApiConstants.API_BASE_PATH`
   (`/api/v1/...`).
6. **Anadir pruebas** unitarias del servicio (con dobles de sus dependencias) y,
   si aplica, de integracion del controlador.
7. **Documentar** el paquete con un `package-info.java`.

> Regla de oro: un modulo nuevo **no** debe modificar el codigo de otro modulo.
> Si necesita datos de otro, los consume a traves de su interfaz de servicio.

---

## 9. Convenciones de nombres

| Elemento             | Convencion                          | Ejemplo                     |
|----------------------|-------------------------------------|-----------------------------|
| Paquete              | minusculas, singular, por feature   | `com.alura.prediction`      |
| Controlador          | `<Recurso>Controller`               | `PredictionController`      |
| Servicio (interfaz)  | `<Caso>Service`                     | `RecommendationService`     |
| Servicio (impl.)     | `<Caso>ServiceImpl`                 | `RecommendationServiceImpl` |
| Cliente externo      | `<Sistema>Client`                   | `PredictionClient`          |
| Repositorio          | `<Entidad>Repository`               | `UserRepository`            |
| DTO de entrada       | `<Accion>Request`                   | `LoginRequest`              |
| DTO de salida        | `<Accion>Response`                  | `PredictionResponse`        |
| Modelo de dominio    | sustantivo singular                 | `User`                      |
| Excepcion            | `<Motivo>Exception`                 | `ResourceNotFoundException` |
| Configuracion        | `<Tema>Config` / `<Tema>Configuration` | `OpenApiConfig`          |
| Constantes           | clase `final` no instanciable       | `ApiConstants`              |
| Rutas REST           | `kebab-case`, plural, versionadas   | `/api/v1/predictions`       |

Otras convenciones:

- **DTOs inmutables** con `record`.
- **Interfaz para el servicio**; la implementacion como `...Impl` (facilita
  dobles de prueba y multiples implementaciones).
- Un **`package-info.java`** por paquete, documentando su responsabilidad.

---

## 10. Estrategia para mantener bajo acoplamiento

- **Programar contra interfaces** en los limites del sistema (`PredictionClient`,
  `UserRepository`, `StorageService`).
- **Inyeccion de dependencias por constructor** (Spring): las dependencias son
  explicitas, `final` e inmutables; nada de `new` para colaboradores.
- **DTOs en las fronteras:** los modelos de dominio no se exponen directamente
  en la API; se mapean a DTOs (via `common.mapper`). Un cambio interno no rompe
  el contrato publico.
- **Comunicacion entre modulos solo a traves de servicios**, nunca accediendo a
  las clases internas (repositorios, clientes) de otro modulo.
- **Sin dependencias circulares:** el flujo es unidireccional
  (`controller -> service -> client/repository`).
- **Configuracion externalizada:** URLs, secretos y timeouts viven en
  `application*.yml`/variables de entorno, no en el codigo.

---

## 11. Estrategia de escalabilidad

### Escalabilidad tecnica

- **Backend sin estado (stateless):** autenticacion por JWT, sin sesiones en
  servidor. Permite escalar horizontalmente detras de un balanceador
  (varias replicas del contenedor).
- **Inferencia desacoplada:** el servicio FastAPI escala de forma
  independiente del backend segun la carga de predicciones.
- **Contenerizacion (Docker):** imagen reproducible lista para orquestadores
  (Kubernetes / OCI Container Instances).
- **Perfiles de configuracion** (`dev`/`prod`) para adaptar recursos por
  entorno.

### Escalabilidad de codigo/equipo

- **Package-by-feature:** nuevos modulos se anaden sin tocar los existentes.
- **Limites claros:** cada modulo puede extraerse a un microservicio si su
  carga o su ciclo de vida lo justifican.
- **Contratos estables (DTOs versionados, `/api/v1`):** la evolucion no rompe a
  los consumidores.

---

## 12. Preparacion para pruebas y CI

- **Testeabilidad por diseno:** interfaces + inyeccion por constructor permiten
  aislar cada unidad con dobles (Mockito).
- **Piramide de pruebas sugerida:**
  - *Unitarias* — servicios y reglas, sin contexto de Spring.
  - *De rebanada (slice)* — `@WebMvcTest` para controladores,
    `@RestClientTest` para el cliente de prediccion.
  - *De integracion* — `@SpringBootTest` (ya existe `contextLoads` como red de
    seguridad basica).
- **Integracion continua:** el proyecto compila con `mvn clean verify`; la
  prueba de arranque del contexto falla ante configuraciones invalidas. El
  `Dockerfile` multi-stage produce artefactos reproducibles para el pipeline.

---

## 13. Posibles mejoras futuras

- **Persistencia real:** implementar `UserRepository` con Spring Data JPA
  (PostgreSQL/MySQL) y mapear `User` como entidad.
- **Resiliencia en el cliente de ML:** timeouts, reintentos y *circuit breaker*
  (Resilience4j) para las llamadas a FastAPI.
- **Cache** de predicciones/recomendaciones frecuentes.
- **Motor de reglas configurable** (externalizar reglas de recomendacion a
  configuracion o base de datos en lugar de codigo).
- **Observabilidad avanzada:** metricas Micrometer + Prometheus, trazas
  distribuidas (OpenTelemetry) entre backend y FastAPI.
- **Seguridad reforzada:** refresh tokens, rotacion de claves, rate limiting.
- **Contratos formales:** validacion de esquema (OpenAPI) del contrato con
  FastAPI y pruebas de contrato (consumer-driven).
- **Despliegue en OCI:** completar `infrastructure.oci` (Object Storage,
  secrets/Vault) y automatizar el despliegue.
- **CI/CD completo:** pipeline con build, test, analisis estatico
  (SonarQube/SpotBugs) y publicacion de imagen.

---

> Este documento debe evolucionar junto con el codigo. Al introducir un cambio
> arquitectonico relevante, actualizalo para que siga siendo la fuente de verdad
> del diseno del backend.
