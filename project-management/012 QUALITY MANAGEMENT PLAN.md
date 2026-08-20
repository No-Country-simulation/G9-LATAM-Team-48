# QUALITY MANAGEMENT PLAN (Plan de Gestión de la Calidad)

## Proyecto: EnergIA

### Propósito del documento

Define el enfoque, los estándares, las métricas y las responsabilidades de calidad del proyecto EnergIA, formalizando las prácticas ya aplicadas por el equipo y documentadas en `qa/QA.md`.

## Control del Documento

|  |  |
| --- | --- |
| Campo | Valor |
| Documento | Quality Management Plan |
| Código | DOC-012 |
| Proyecto | EnergIA |
| Versión | 1.0 |
| Estado | Aprobado |
| Clasificación | Documento Interno |
| Metodología | Híbrida (PMBOK® Guide – 8.ª Edición + Scrum) |
| Modelo de Liderazgo | OSCAR |
| Autor | Equipo EnergIA (Team 48) — consolidado por Neil Jácome, Project Manager |
| Responsable | Project Manager |
| Fecha de Creación | 2026-07-18 |
| Última Actualización | 2026-08-20 |

## 1. Estándares de Calidad

| Ámbito | Estándar aplicado |
| --- | --- |
| Backend | Clean Code y principios SOLID; DTOs inmutables (`record`); arquitectura por capas (`controller` → `service` → `repository`/`client`) |
| Frontend | Componentización reutilizable, Context API para estado global, accesibilidad (landmarks semánticos, `aria-label`, `SrAnnouncer`) |
| Datos / ML | Pipeline documentado (EDA → limpieza → features → modelo → evaluación → exportación), diccionario de datos |
| Documentación | Markdown consistente con el PKB (DOC-001), sin contradicciones entre documentos derivados |
| Infraestructura | Health checks activos (`/actuator/health`, `/health` en ML), variables de entorno obligatorias en `prod` (sin valores por defecto inseguros) |

## 2. Métricas de Calidad

| Métrica | Meta | Fuente |
| --- | --- | --- |
| Checklist P0 (bloqueantes) | 100% Pass antes del cierre | `qa/QA.md` |
| Checklist P1 (importantes) | Sin bloqueantes abiertos | `qa/QA.md` |
| Pruebas automatizadas backend (JUnit) | `mvn test` en verde | `backend/` |
| Build de producción frontend | `npm run build` sin errores | `frontend/` |
| Smoke test de producción | Endpoints críticos en 2xx/401-403 esperado | `qa/smoke-api.ps1` |
| Tiempo de respuesta API (referencia) | ~150 ms vía proxy Vercel (dataset con rollups V12) | `qa/QA.md` (2026-08-10) |

## 3. Actividades de Aseguramiento de Calidad (QA)

| Actividad | Herramienta / Script | Responsable | Frecuencia |
| --- | --- | --- | --- |
| Pruebas unitarias backend | `mvn test` (JUnit): `AuthFlowIntegrationTest`, `RecommendationServiceImplTest`, `EnergyApplicationTests` | Backend Developer | En cada cambio relevante |
| Build de verificación frontend | `npm run build` | Full Stack Developer | En cada cambio relevante |
| Smoke API en producción | `qa/smoke-api.ps1` | Equipo QA rotativo | Antes de cada hito de despliegue |
| Checklist manual P0 | `qa/run-p0.ps1` + verificación UI (Google Sign-In, mail real) | Equipo QA rotativo | Antes del cierre de cada sprint relevante |
| Checklist manual P1 | `qa/run-p1.ps1` + `qa/inspect-google-i18n.ps1` | Equipo QA rotativo | Antes del cierre |
| Flujo de correo end-to-end (SMTP local) | `qa/start-local-backend.ps1` + `qa/run-mail-local.ps1` | Backend Developer | Antes de validar auth/email |

## 4. Control de Calidad (evidencia registrada)

Resumen de resultados registrados en `qa/QA.md` (evidencia histórica, no se reinterpreta aquí):

| Corrida | Ambiente | Resultado |
| --- | --- | --- |
| 2026-07-27 | Prod (Vercel + OCI), API | 11/11 Pass (P0-05/08 marcados manual) |
| 2026-07-27 | Local (SMTP Gmail) | L-01 a L-08 Pass |
| 2026-07-28 | Prod, API + UI | P1-01 a P1-12 Pass; P0-08 (Google UI) Pass |
| 2026-08-10 | Prod smoke OCI | A5 Pass; rollups V12 activos; ~150 ms vía proxy |

## 5. Criterios de Aceptación de Calidad

Un entregable se considera de calidad aceptable cuando: (a) pasa las pruebas automatizadas correspondientes, (b) no tiene hallazgos P0 abiertos en el checklist manual, y (c) su documentación técnica está actualizada y no contradice al PKB (DOC-001).

## 6. Roles y Responsabilidades de Calidad

| Rol | Responsabilidad de calidad |
| --- | --- |
| Project Manager | Verifica que el checklist P0 esté en Pass antes de autorizar el cierre de un hito |
| Backend Developer | Mantiene pruebas JUnit y responde a hallazgos de API |
| Full Stack Developer | Mantiene el build de producción y la checklist de accesibilidad/i18n |
| Data Analyst | Valida la calidad del dataset y las métricas del modelo (matriz de confusión, `probabilidades`, `confianza_pct`) |
| Equipo EnergIA (rotativo) | Ejecuta checklist manual P0/P1 antes de cada hito de despliegue |

## 7. Mejora Continua

Los hallazgos de QA que revelen oportunidades de mejora (por ejemplo, ausencia de suite E2E automatizada en frontend, ver RSK-007 en DOC-009) se registran también en el Lessons Learned Register (DOC-014) para futuras iteraciones del producto.

## 8. Aprobación

| Rol | Nombre | Decisión |
| --- | --- | --- |
| Project Manager | Neil Jácome | Aprobado |

## Historial de Versiones

| Versión | Fecha | Autor | Descripción |
| --- | --- | --- | --- |
| 1.0 | 2026-08-20 | Neil Jácome | Consolidación formal del Plan de Calidad, con evidencia real tomada de `qa/QA.md`. |
