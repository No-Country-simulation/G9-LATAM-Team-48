# PROJECT CHARTER

## Proyecto: EnergIA

### Propósito del documento

El Project Charter autoriza formalmente la existencia del proyecto **EnergIA**, otorga al Project Manager la autoridad para aplicar recursos del equipo a las actividades del proyecto, y establece los objetivos, el alcance de alto nivel, los hitos y los criterios de éxito. Se basa en el **Business Case (DOC-002)** y es consistente con el **Project Knowledge Base (DOC-001)**.

## Control del Documento

|  |  |
| --- | --- |
| Campo | Valor |
| Documento | Project Charter |
| Código | DOC-003 |
| Proyecto | EnergIA |
| Versión | 1.0 |
| Estado | Aprobado |
| Clasificación | Documento Interno |
| Metodología | Híbrida (PMBOK® Guide – 8.ª Edición + Scrum) |
| Modelo de Liderazgo | OSCAR |
| Autor | Equipo EnergIA (Team 48) — consolidado por Neil Jácome, Project Manager |
| Responsable | Project Manager |
| Fecha de Creación | 2026-07-13 |
| Última Actualización | 2026-08-20 |

## 1. Información General del Proyecto

| Campo | Valor |
| --- | --- |
| Código del Proyecto | ENERGIA-2026-HK01 |
| Nombre Oficial | EnergIA – Plataforma Inteligente para el Análisis y Optimización del Consumo Energético |
| Programa | Oracle Next Education (ONE) – Generación 9 |
| Operador del Hackathon | No Country |
| Aliado Académico | Alura LATAM |
| Equipo | Team 48 – G9 LATAM |
| Modalidad | Remota |
| Fecha de Inicio (Kickoff) | 2026-07-13 |
| Duración Máxima | 5 semanas (fin estimado: 2026-08-16) |
| Enlace de la Demo (producción) | https://g9-latam-team-48.vercel.app/ |

## 2. Propósito y Justificación

EnergIA responde a la necesidad de ofrecer a usuarios residenciales y pequeños comercios un diagnóstico claro de su consumo energético y recomendaciones de eficiencia, mediante Ciencia de Datos e Inteligencia Artificial. El proyecto es además el vehículo con el que el Team 48 cumple las bases del Hackathon ONE G9 – LATAM. El detalle de justificación se encuentra en el Business Case (DOC-002).

## 3. Objetivos del Proyecto y Criterios de Éxito Medibles

| # | Objetivo | Criterio de éxito (medible) |
| --- | --- | --- |
| O1 | Entregar un MVP funcional | Aplicación web desplegada y accesible públicamente antes del 2026-08-20 |
| O2 | Exponer una API REST funcional | Endpoints de auth, análisis IA, recomendaciones, consumos y admin operativos (checklist QA DOC-012) |
| O3 | Clasificar perfiles energéticos con IA | Modelo ML servido vía FastAPI con contrato de 12 variables, con fallback heurístico ante fallas |
| O4 | Integrar al menos un servicio OCI | Backend y base de datos MySQL desplegados en una VM de Oracle Cloud Infrastructure |
| O5 | Cumplir las bases del hackathon | Checklist P0 (bloqueantes) en estado Pass al cierre del proyecto |
| O6 | Gestionar el proyecto con rigor PM | Documentación PMBOK® completa (DOC-001 a DOC-014) coherente con el PKB |

## 4. Descripción de Alto Nivel / Requisitos

- Aplicación web (React) con dashboard de consumo, historial, análisis IA, recomendaciones, autenticación (email + Google), panel administrativo, internacionalización y accesibilidad.
- API REST (Java + Spring Boot) que orquesta autenticación JWT, análisis IA, recomendaciones, consumos, contacto y administración, con persistencia en MySQL (Flyway) y envío de correo transaccional.
- Microservicio de Machine Learning (Python + FastAPI) que sirve el modelo de clasificación de perfil energético.
- Infraestructura desplegada en Vercel (frontend), una VM de OCI vía Podman (backend + MySQL) y Render (microservicio ML).

## 5. Riesgos de Alto Nivel

- Plazo fijo de cinco semanas frente a un alcance multidisciplinario (full-stack + Data Science + Cloud).
- Dependencia de servicios en capa gratuita con posibles límites (p. ej. "cold start" en Render, cuota diaria de Gmail SMTP).
- Coordinación remota de un equipo de seis personas con disponibilidad variable.

Detalle completo en el Risk Register (DOC-009).

## 6. Hitos de Alto Nivel

| Hito | Fecha objetivo |
| --- | --- |
| Aprobación del Business Case y Charter | 2026-07-13 |
| Publicación del PKB y líneas base (alcance, cronograma) | 2026-07-20 |
| MVP de backend, frontend y modelo ML integrados | 2026-08-02 |
| Despliegue en producción (Vercel + OCI + Render) | 2026-08-09 |
| Checklist QA P0/P1 aprobado | 2026-08-11 |
| Cierre del proyecto y demo ante jurado | 2026-08-16 al 2026-08-20 |

## 7. Presupuesto Resumido

El proyecto no cuenta con presupuesto monetario asignado; los recursos comprometidos son el tiempo del equipo y servicios cloud en capa gratuita o de bajo costo. Ver Cost Baseline (DOC-008).

## 8. Stakeholders Clave

| ID | Stakeholder | Tipo |
| --- | --- | --- |
| SH-001 | Equipo EnergIA (Team 48) | Interno |
| SH-002 | Oracle Next Education (ONE) | Externo |
| SH-003 | Alura LATAM | Externo |
| SH-004 | No Country | Externo |
| SH-005 | Jurados del Hackathon | Externo |
| SH-006 | Usuarios Finales | Externo |

Detalle en el Stakeholder Register (DOC-011).

## 9. Requisitos de Aprobación del Proyecto

El proyecto se considera exitoso y cerrado cuando: (a) el MVP esté desplegado y accesible, (b) el checklist QA P0 esté en estado Pass, (c) el producto sea presentado ante los jurados del Hackathon dentro del plazo establecido por No Country, y (d) la documentación de gestión y técnica esté completa. La aceptación final del entregable (evaluación de la demo) corresponde a los Jurados del Hackathon (SH-005); la aceptación interna de los artefactos de gestión corresponde al Project Manager.

## 10. Project Manager Asignado y Nivel de Autoridad

| Campo | Valor |
| --- | --- |
| Project Manager | Neil Jácome |
| Autoridad sobre recursos | Coordina la asignación de tareas del equipo dentro del Team 48; no gestiona presupuesto monetario |
| Autoridad de decisión | Aprueba artefactos de gestión, prioriza el backlog junto al equipo (metodología híbrida) y escala riesgos/impedimentos a los stakeholders externos cuando aplica |

## 11. Patrocinio

El proyecto se enmarca en el programa Oracle Next Education (ONE) – Generación 9, operado por No Country, con acompañamiento académico de Alura LATAM. No existe un patrocinador financiero individual: el Charter es autorizado por consenso del equipo y validado por el rol de Project Manager, en el contexto de las bases del hackathon.

## 12. Aprobación

| Rol | Nombre | Firma / Decisión |
| --- | --- | --- |
| Project Manager | Neil Jácome | Aprobado |
| Equipo EnergIA | Ver DOC-011 | Aprobado por consenso |

## Historial de Versiones

| Versión | Fecha | Autor | Descripción |
| --- | --- | --- | --- |
| 1.0 | 2026-08-20 | Neil Jácome | Consolidación formal del Project Charter, alineado al kickoff real del proyecto (2026-07-13). |
