# PROJECT MANAGEMENT PLAN (Plan para la Dirección del Proyecto)

## Proyecto: EnergIA

### Propósito del documento

El Project Management Plan es el documento **integrador** que describe cómo se ejecuta, se monitorea, se controla y se cierra el proyecto EnergIA. Consolida y referencia todos los planes subsidiarios y líneas base (DOC-002 a DOC-012, DOC-014), y es consistente con el Project Knowledge Base (DOC-001), fuente oficial del proyecto.

## Control del Documento

|  |  |
| --- | --- |
| Campo | Valor |
| Documento | Project Management Plan |
| Código | DOC-013 |
| Proyecto | EnergIA |
| Versión | 1.0 |
| Estado | Aprobado |
| Clasificación | Documento Interno |
| Metodología | Híbrida (PMBOK® Guide – 8.ª Edición + Scrum) |
| Modelo de Liderazgo | OSCAR |
| Autor | Equipo EnergIA (Team 48) — consolidado por Neil Jácome, Project Manager |
| Responsable | Project Manager |
| Fecha de Creación | 2026-07-20 |
| Última Actualización | 2026-08-20 |

## 1. Enfoque de Ciclo de Vida y Adaptación (Tailoring)

EnergIA utiliza un enfoque **híbrido**: los cinco "focus areas" del PMBOK® Guide – 8.ª Edición (Iniciación, Planeación, Ejecución, Monitoreo y Control, Cierre) organizan la gobernanza y documentación del proyecto, mientras que la ejecución técnica sigue **Scrum** con sprints semanales (ver Schedule Baseline, DOC-007). El modelo de liderazgo aplicado es **OSCAR** (Outcome, Situation, Choices, Actions, Review), utilizado por el Project Manager en la conducción de dailies y retrospectivas.

| Dominio de desempeño (PMBOK® 8.ª Ed.) | Cómo se aplica en EnergIA |
| --- | --- |
| Interesados | Stakeholder Register (DOC-011), Communication Management Plan (DOC-010) |
| Equipo | Roles definidos en el PKB (DOC-001), liderazgo OSCAR |
| Enfoque de Desarrollo y Ciclo de Vida | Híbrido PMBOK® + Scrum, sprints semanales |
| Planificación | Scope Statement (DOC-004), WBS (DOC-005), WBS Dictionary (DOC-006) |
| Trabajo del Proyecto | Ejecución técnica por módulo (backend, frontend, ML, datos, infraestructura) |
| Entrega | Criterios de aceptación por entregable (DOC-004), Quality Management Plan (DOC-012) |
| Medición | Métricas de calidad y checklist QA (DOC-012), avance de cronograma (DOC-007) |
| Incertidumbre | Risk Register (DOC-009) |

## 2. Mapa de Planes Subsidiarios y Líneas Base

| Código | Documento | Contenido que gestiona |
| --- | --- | --- |
| DOC-002 | Business Case | Justificación y viabilidad del proyecto |
| DOC-003 | Project Charter | Autorización formal, objetivos, autoridad del PM |
| DOC-004 | Scope Statement | Alcance del producto, entregables, exclusiones |
| DOC-005 | WBS | Descomposición jerárquica del alcance |
| DOC-006 | WBS Dictionary | Detalle de cada paquete de trabajo |
| DOC-007 | Schedule Baseline | Línea base de cronograma (línea base) |
| DOC-008 | Cost Baseline | Enfoque de costos (sin presupuesto monetario) |
| DOC-009 | Risk Register | Identificación y respuesta a riesgos |
| DOC-010 | Communication Management Plan | Matriz de comunicaciones |
| DOC-011 | Stakeholder Register | Identificación y estrategia de interesados |
| DOC-012 | Quality Management Plan | Estándares, métricas y control de calidad |
| DOC-014 | Lessons Learned Register | Cierre y aprendizajes |

Este documento no repite el contenido de cada plan subsidiario; los referencia como fuente autoritativa de su dominio respectivo.

## 3. Gestión de Cambios (Change Management)

| Elemento | Definición |
| --- | --- |
| Solicitud de cambio | Cualquier integrante del equipo puede proponer un cambio de alcance, cronograma o arquitectura |
| Registro | Se documenta como una nueva Architectural Decision Record (ADR) en el PKB (DOC-001) |
| Evaluación de impacto | El Project Manager evalúa impacto en Scope Statement (DOC-004), Schedule Baseline (DOC-007) y Risk Register (DOC-009) |
| Aprobación | Project Manager, con consulta al equipo en la siguiente daily o revisión de sprint |
| Comunicación | Según Communication Management Plan (DOC-010) |

## 4. Gestión de la Configuración

- Repositorio único oficial: GitHub, monorepo `G9-LATAM-Team-48`.
- Flujo de ramas: `main` (producción), `develop`/`Jorge-martinez` (desarrollo), `feature/*`, `hotfix/*` (convención del PKB).
- Versionado semántico (SemVer) para artefactos de software.
- Documentación exclusivamente en Markdown, versionada junto al código.

## 5. Monitoreo y Control

| Mecanismo | Frecuencia | Referencia |
| --- | --- | --- |
| Daily / stand-up | Diaria | DOC-010 |
| Revisión y retrospectiva de sprint | Semanal | DOC-007 |
| Revisión del Risk Register | Al cierre de cada sprint | DOC-009 |
| Checklist QA (P0/P1) y smoke tests | Antes de cada hito de despliegue | DOC-012 |
| Revisión de avance del catálogo de artefactos | Continua | DOC-001 |

## 6. Criterios de Cierre del Proyecto

El proyecto se declara cerrado cuando: (a) el MVP está desplegado y accesible en producción, (b) el checklist QA P0 está en Pass, (c) la demo fue presentada ante los Jurados del Hackathon (SH-005), y (d) el Lessons Learned Register (DOC-014) está completo y aprobado.

## 7. Integración con el Project Knowledge Base

Este Project Management Plan no sustituye al PKB (DOC-001); lo desarrolla. Ante cualquier discrepancia entre este documento y el PKB, prevalece el PKB, y este plan debe corregirse en su siguiente versión.

## 8. Aprobación

| Rol | Nombre | Decisión |
| --- | --- | --- |
| Project Manager | Neil Jácome | Aprobado |
| Equipo EnergIA | Ver DOC-011 | Aprobado por consenso |

## Historial de Versiones

| Versión | Fecha | Autor | Descripción |
| --- | --- | --- | --- |
| 1.0 | 2026-08-20 | Neil Jácome | Consolidación formal del Project Management Plan, integrando los 12 planes/líneas base subsidiarios. |
