# SCHEDULE BASELINE (Línea Base del Cronograma)

## Proyecto: EnergIA

### Propósito del documento

Establece la línea base de cronograma aprobada para el proyecto EnergIA, contra la cual se mide el desempeño temporal real. Se basa en el WBS (DOC-005) y el WBS Dictionary (DOC-006).

## Control del Documento

|  |  |
| --- | --- |
| Campo | Valor |
| Documento | Schedule Baseline |
| Código | DOC-007 |
| Proyecto | EnergIA |
| Versión | 1.0 |
| Estado | Aprobado |
| Clasificación | Documento Interno |
| Metodología | Híbrida (PMBOK® Guide – 8.ª Edición + Scrum) |
| Modelo de Liderazgo | OSCAR |
| Autor | Equipo EnergIA (Team 48) — consolidado por Neil Jácome, Project Manager |
| Responsable | Project Manager |
| Fecha de Creación | 2026-07-16 |
| Última Actualización | 2026-08-20 |

## 1. Parámetros del Cronograma

| Campo | Valor |
| --- | --- |
| Fecha de inicio del proyecto | 2026-07-13 (lunes) |
| Fecha de fin planificada | 2026-08-16 (domingo) |
| Duración total | 5 semanas (35 días calendario) |
| Unidad de planificación | Sprint semanal (Scrum) |
| Reserva de cierre / demo | 2026-08-17 al 2026-08-20 |

## 2. Cronograma por Sprint (Vista de Hitos)

| Sprint | Semana | Fechas | Enfoque principal | Hito de cierre de sprint |
| --- | --- | --- | --- | --- |
| Sprint 1 | Semana 1 | 2026-07-13 al 2026-07-19 | Iniciación: Business Case, Charter, discovery técnico, setup de repos | Charter y Business Case aprobados (2026-07-13) |
| Sprint 2 | Semana 2 | 2026-07-20 al 2026-07-26 | Planeación: PKB publicado, Scope, WBS, líneas base y planes subsidiarios; primeros endpoints backend y notebook EDA | PKB publicado (2026-07-20); primer corte de P0 API (2026-07-27) |
| Sprint 3 | Semana 3 | 2026-07-27 al 2026-08-02 | Desarrollo núcleo: auth, análisis IA (backend + ML), dashboard y formulario frontend | Integración backend–ML–frontend funcional (2026-08-02) |
| Sprint 4 | Semana 4 | 2026-08-03 al 2026-08-09 | Hardening: recomendaciones, panel admin, i18n, accesibilidad, despliegue inicial | Despliegue en Vercel + OCI + Render (2026-08-09) |
| Sprint 5 | Semana 5 | 2026-08-10 al 2026-08-16 | QA, corrección de hallazgos y cierre técnico | Checklist P0/P1 en Pass (2026-08-11); smoke prod Pass (2026-08-10) |
| Cierre | Post-sprint | 2026-08-17 al 2026-08-20 | Preparación de demo/pitch, documentación final, lecciones aprendidas | Entrega y presentación ante jurado |

## 3. Vista de Cronograma (Gantt simplificado)

```
Paquete EDT                 S1      S2      S3      S4      S5      Cierre
1.1 Gestión del Proyecto    ███     ███     ██      ██      ██      ███
1.2 Ciencia de Datos        ██      ███     ██
1.3 Backend                         ██      ███     ██      █
1.4 Microservicio ML                        ██      ██
1.5 Frontend                        ██      ███     ███     █
1.6 Infraestructura                                 ██      █
1.7 Calidad (QA)                                    █       ███
1.8 Documentación           █       ██                              ███
1.9 Cierre y Entrega                                                ███
```

## 4. Hitos Principales (Línea Base)

| Hito | Fecha línea base | Entregable / documento relacionado |
| --- | --- | --- |
| M1 — Aprobación de Charter | 2026-07-13 | DOC-002, DOC-003 |
| M2 — Publicación del PKB y líneas base | 2026-07-20 | DOC-001, DOC-004 a DOC-008 |
| M3 — Integración backend–ML–frontend | 2026-08-02 | DEL-01, DEL-02, DEL-03 |
| M4 — Despliegue en producción | 2026-08-09 | DEL-06 |
| M5 — Checklist QA P0/P1 aprobado | 2026-08-11 | DEL-01, DEL-02, DEL-03 (verificación) |
| M6 — Cierre y demo ante jurado | 2026-08-16 al 2026-08-20 | DEL-01 a DEL-08 |

## 5. Supuestos y Restricciones del Cronograma

- Cadencia de Sprint semanal con reuniones diarias breves (daily) y revisión/retrospectiva al cierre de cada semana.
- La fecha de fin (2026-08-16) es una restricción dura impuesta por las bases del Hackathon; no admite prórroga.
- Los hitos M3 a M5 dependen de la disponibilidad de los servicios cloud en capa gratuita (Render, Vercel) y de la VM OCI.

## 6. Control de Cambios al Cronograma

Cualquier desviación relevante (más de 2 días respecto a un hito) debe registrarse como riesgo o incidencia en el Risk Register (DOC-009) y comunicarse según el Communication Management Plan (DOC-010). Los cambios de línea base requieren aprobación del Project Manager y se documentan en el historial de versiones de este documento.

## 7. Aprobación

| Rol | Nombre | Decisión |
| --- | --- | --- |
| Project Manager | Neil Jácome | Aprobado |

## Historial de Versiones

| Versión | Fecha | Autor | Descripción |
| --- | --- | --- | --- |
| 1.0 | 2026-08-20 | Neil Jácome | Consolidación formal de la línea base de cronograma, con evidencia de cumplimiento verificada contra `QA.md` (P0/P1, smoke prod). |
