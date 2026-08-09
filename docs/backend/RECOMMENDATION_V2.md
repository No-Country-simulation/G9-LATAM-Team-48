# Motor de Recomendaciones V2 (Persistencia y Antiduplicados) — Energy Backend

> Guía actualizada del feature de recomendaciones energéticas. Explica la evolución de la arquitectura para incorporar la persistencia de datos, la integración con las variables SHAP del modelo ML (v3) y la nueva lógica de prevención de duplicados (Historial por Usuario). Complementa a `ARCHITECTURE.md` y `RECOMMENDATION.md`.

---

## Tabla de contenidos

1. [Evolución de la Arquitectura](#1-evolución-de-la-arquitectura)
2. [Diseño de Base de Datos (Flyway & JPA)](#2-diseño-de-base-de-datos-flyway--jpa)
3. [Flujo de Persistencia y Antiduplicados](#3-flujo-de-persistencia-y-antiduplicados)
4. [Integración con ML y SHAP](#4-integración-con-ml-y-shap)
5. [Administración por Terminal (CLI)](#5-administración-por-terminal-cli)
6. [Pruebas y Validaciones](#6-pruebas-y-validaciones)

---

## 1. Evolución de la Arquitectura

La versión inicial del motor de recomendaciones operaba completamente en memoria de forma transaccional. Con los nuevos requerimientos de negocio, la arquitectura ha evolucionado hacia un modelo persistente que separa el **Catálogo Maestro** del **Historial del Usuario**.

### Nuevas Responsabilidades:
*   **Catálogo de Recomendaciones (Staging):** Diccionario estático de recomendaciones disponibles (`TipKey`, tipo de mensaje, título interna).
*   **Historial Antiduplicados:** Tabla relacional que asocia a un usuario con las recomendaciones que ya se le han emitido y continúan activas, evitando saturar la interfaz con mensajes repetidos.
*   **Orquestación en Dos Niveles:**
    *   Nivel 1: Recomendaciones basadas en umbrales fijos (Alertas para categoría `INEFICIENTE`).
    *   Nivel 2: Recomendaciones basadas en variables dinámicas o *fallback* SHAP (Oportunidades para categoría `MODERADO`).

---

## 2. Diseño de Base de Datos (Flyway & JPA)

Se implementó un esquema relacional estructurado mediante migraciones Flyway (`V9__...`):

### 2.1. Tabla `recommendations` (Catálogo Maestro)
Contiene la definición base de las estrategias.
*   `id` (PK, UUID)
*   `tip_key` (VARCHAR, UNIQUE) - Identificador corto enviado al Frontend (ej. `AC`, `COMMERCIAL`).
*   `title` (VARCHAR) - Referencia interna para administración.
*   `type` (VARCHAR) - `ALERTA` (crítico) u `OPORTUNIDAD` (mejora).

### 2.2. Tabla `user_recommendations` (Historial)
Registra el ciclo de vida de la recomendación para un usuario.
*   `id` (PK, UUID)
*   `user_id` (FK -> `users.id`)
*   `recommendation_id` (FK -> `recommendations.id`)
*   `status` (VARCHAR) - `ACTIVE` (enviada al front), `DISMISSED` (descartada/comprendida).
*   `created_at` (TIMESTAMP)

*Restricción:* Índice único compuesto o restricción lógica a nivel de servicio para garantizar que un mismo `user_id` no tenga dos veces la misma `recommendation_id` en estado `ACTIVE`.

---

## 3. Flujo de Persistencia y Antiduplicados

El flujo en `PredictionServiceImpl` y `RecommendationServiceImpl` fue refactorizado para interactuar con la base de datos:

1.  **Inferencia:** El usuario envía su formulario. Se consulta al modelo ML (FastAPI) y se obtiene la categoría (Ej: `MODERADO`).
2.  **Registro Inicial:** Se persiste el resultado de la consulta (`AnalisisConsultaEntity`) asociado al `userId`.
3.  **Evaluación Strategy:** El motor de reglas evalúa las variables del usuario y selecciona las estrategias aplicables (ej. `TipKey.AC`, `TipKey.LED`).
4.  **Filtro Antiduplicados:**
    *   El servicio consulta `UserRecommendationRepository` buscando las recomendaciones activas del `userId`.
    *   Filtra las `TipKey` obtenidas en el paso 3 que *ya existen* en el historial activo del usuario.
5.  **Persistencia:** Las `TipKey` nuevas y válidas se asocian en la tabla `user_recommendations`.
6.  **Respuesta al Cliente:** Solo se devuelven al Frontend las recomendaciones novedosas.

---

## 4. Integración con ML y SHAP

El modelo de Machine Learning (LightGBM, v3) fue auditado mediante valores SHAP, revelando que el percentil global de corte dejaba a la clase `MODERADO` sin recomendaciones.

**Solución adoptada en el Backend:**
Se diseñó un disparador por categoría (`ConsumptionCategory`):
*   `EFICIENTE`: Genera un mensaje base positivo, sin recomendaciones de corrección.
*   `INEFICIENTE`: Activa el **Nivel 1** (Alertas). Evalúa reglas con umbrales fijos rígidos (Ej. falta de aislamiento, alto consumo por ocupante).
*   `MODERADO`: Activa el **Nivel 2** (Oportunidades). Si no aplican alertas, aplica un *fallback* evaluando la variable específica del request (equivalente a la de mayor peso SHAP positivo) que tenga mayor margen de mejora.

---

## 5. Administración por Terminal (CLI)

Para facilitar la gestión del Catálogo Maestro (`recommendations`), se incorporó un servicio administrativo de línea de comandos.

*   **Componente:** `RecommendationAdminService` (Capa de servicio CRUD).
*   **Mecanismo:** Un `CommandLineRunner` condicional (o perfil específico de Spring Boot) que se activa por terminal.
*   **Funcionalidad:** Permite a los desarrolladores y administradores crear nuevas claves `TipKey`, actualizar el tipo (`ALERTA`/`OPORTUNIDAD`) o aplicar bajas lógicas sin requerir una interfaz gráfica de administración en el MVP.

---

## 6. Pruebas y Validaciones

El refactor incluyó la actualización de la suite de pruebas unitarias (`RecommendationServiceImplTest`):
*   **Validación de Historial:** Mocks en `UserRecommendationRepository` para asegurar que el motor ignora reglas ya asignadas al usuario.
*   **Persistencia:** Verificación del correcto guardado de las entidades en la BD al finalizar el flujo.
*   **Reglas SHAP:** Tests específicos que validan la transición de umbrales entre clase `MODERADO` y clase `INEFICIENTE` según las variables clave analizadas en el informe SHAP.
