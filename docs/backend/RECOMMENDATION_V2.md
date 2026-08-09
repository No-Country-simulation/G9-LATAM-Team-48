# Motor de Recomendaciones V2 (Persistencia y Antiduplicados) — Energy Backend

> Guía actualizada del feature de recomendaciones energéticas. Explica la evolución de la arquitectura para incorporar la persistencia de datos, el patrón Strategy, la integración con las variables predictivas del modelo ML (valores SHAP) y la nueva lógica de prevención de duplicados (Historial por Usuario). Complementa a `ARCHITECTURE.md`.

---

## Tabla de contenidos

1. [Evolución de la Arquitectura](#1-evolución-de-la-arquitectura)
2. [Diseño de Base de Datos (Flyway & JPA)](#2-diseño-de-base-de-datos-flyway--jpa)
3. [Flujo de Persistencia y Antiduplicados](#3-flujo-de-persistencia-y-antiduplicados)
4. [Integración con ML y Análisis SHAP](#4-integración-con-ml-y-análisis-shap)
5. [Administración por Terminal (CLI)](#5-administración-por-terminal-cli)
6. [Pruebas y Validaciones](#6-pruebas-y-validaciones)

---

## 1. Evolución de la Arquitectura

La versión inicial del motor de recomendaciones operaba completamente en memoria de forma transaccional. Con los nuevos requerimientos de negocio, la arquitectura ha evolucionado hacia un modelo persistente, robusto y fuertemente tipado aplicando principios **SOLID** y Clean Code (SRP, Polimorfismo).

### Nuevos Componentes Clave:
*   **`RecommendationRule` (Strategy Pattern):** Interfaz base que define la firma de evaluación para cada regla de negocio. Permite agregar nuevos criterios sin alterar el orquestador principal.
*   **Catálogo de Recomendaciones (Staging):** Diccionario estático poblado por Flyway con las recomendaciones maestras (enum `TipKey`, tipo de mensaje `INFO/ALERTA/OPORTUNIDAD`, y título).
*   **Historial Antiduplicados:** Tabla relacional que asocia a un usuario con las recomendaciones que ya se le han emitido y continúan activas, evitando fatiga de notificaciones.
*   **DTOs Tipados:** Uso de `RecommendationRequest` (vía patrón Builder) y `RecommendationResponse` para asegurar un contrato estricto con el frontend.

---

## 2. Diseño de Base de Datos (Flyway & JPA)

Se implementó un esquema relacional estructurado mediante migraciones Flyway:

### 2.1. Migración V9 (`V9__create_recommendations_tables.sql`)

Crea la infraestructura relacional base:

*   `recommendation_catalog`: Contiene la definición base de las estrategias.
    *   `id` (BIGINT, PK) - Llave primaria autoincremental.
    *   `tip_key` (VARCHAR, UNIQUE) - Identificador fuerte (ej. `LOW_CONSUMPTION_BASE`, `INSULATION_DEFICIENT`).
    *   `title` (VARCHAR) - Referencia interna y texto a mostrar.
    *   `type` (VARCHAR) - Nivel de urgencia (`INFO`, `ALERTA`, `OPORTUNIDAD`).
*   `user_recommendations`: Registra el ciclo de vida de la sugerencia.
    *   `id` (BIGINT, PK) - Llave primaria autoincremental.
    *   `user_id` (BIGINT, FK -> `users.id`) - Usuario dueño de la recomendación.
    *   `recommendation_id` (BIGINT, FK -> `recommendation_catalog.id`) - Referencia al catálogo.
    *   `status` (VARCHAR) - `ACTIVE` (activa en el front), `DISMISSED` (descartada/resuelta).

### 2.2. Migración V10 (`V10__insert_recommendation_catalog.sql`)
Puebla la tabla `recommendation_catalog` con 33 recomendaciones exhaustivas que cubren los 8 dominios de análisis SHAP del modelo (Perfiles de consumo, Climatización, Aislamiento Térmico, Iluminación, Consumo Standby, Densidad de Equipos, Horarios Comerciales y Hábitos Per Cápita).

---

### Reemplaza la Sección 3 completa con esto:

```markdown
## 3. Flujo de Persistencia y Antiduplicados

El flujo fue dividido en dos responsabilidades claras (Principio SRP) para interactuar con la base de datos de forma eficiente y segura:

1.  **Evaluación Strategy (`RecommendationServiceImpl`):** El orquestador principal analiza los datos de entrada, inyecta la sugerencia base, y ejecuta todas las clases dinámicas que implementan `RecommendationRule` (ej. `HighOccupantConsumptionRule`) para obtener las claves (`TipKey`) candidatas.
2.  **Delegación de Historial (`RecommendationHistoryService`):** El orquestador pasa estas claves candidatas a este servicio, el cual está dedicado exclusivamente a la capa de datos.
3.  **Filtro Antiduplicados:** El servicio de historial lanza una consulta JPQL optimizada al `UserRecommendationRepository` para obtener las `TipKey` en estado `ACTIVE` del usuario, y descarta de la lista de candidatas aquellas que ya existen.
4.  **Persistencia de Novedades:** Las reglas verdaderamente nuevas se insertan en `user_recommendations` con estado `ACTIVE` y sus entidades son devueltas al orquestador.
5.  **Respuesta al Cliente:** `RecommendationServiceImpl` mapea las nuevas entidades a DTOs (`RecommendationItem`), calcula sus prioridades de visualización y retorna el `RecommendationResponse` final.

---

## 4. Integración con ML y Análisis SHAP

Las reglas de negocio (`RecommendationRule`) están directamente correlacionadas con el análisis de importancia de características (SHAP) del modelo LightGBM.

*   `EFICIENTE`: Genera un mensaje base positivo (`LOW_CONSUMPTION_BASE`), omitiendo reglas correctivas restrictivas.
*   `INEFICIENTE`: Activa validaciones de **Nivel 1 (Alertas)** basadas en variables críticas SHAP (ej. `consumoAnteriorPorPersona`, `factorAislamiento`).
*   `MODERADO`: Activa validaciones de **Nivel 2 (Oportunidades)**, sugiriendo mejoras de eficiencia (ej. migraciones LED o gestión de consumo Standby).

---

## 5. Administración por Terminal (CLI)

Para facilitar la gestión y auditoría del Catálogo Maestro durante el desarrollo, se incorporó un servicio administrativo de línea de comandos.

*   **Componente:** `RecommendationCliRunner` y `RecommendationAdminService`.
*   **Activación:** Se controla vía la propiedad `app.cli.enabled=true` en `application-dev.yml`.
*   **Funcionalidad:** Al levantar Spring Boot, pausa la carga y despliega un menú interactivo en la terminal para listar las recomendaciones actualmente cargadas en base de datos. Se manejan los recursos adecuadamente (`try-with-resources`) para evitar fugas de memoria (`Resource leak`).

---

## 6. Pruebas y Validaciones

Se rediseñó la suite de testing para garantizar la seguridad de tipos, el manejo de dependencias nulas (Null Safety) y la robustez lógica:

*   **`RecommendationServiceImplTest`:** Valida que el pipeline orqueste las clases `RecommendationRule` y asigne correctamente las categorías (Frontend Keys).
*   **`RecommendationAntiduplicateTest`:** Prueba de integración de la lógica de negocio simulando un historial activo en el repositorio. Garantiza que si el modelo dispara una recomendación ya presente, esta se omita y solo las claves nuevas (`TipKey`) lleguen a la respuesta final.

**Cómo ejecutar la verificación total por terminal:**
```bash
mvn clean test
```