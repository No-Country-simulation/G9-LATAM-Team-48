# BUSINESS CASE

## Proyecto: EnergIA

### Propósito del documento

El presente Business Case sustenta la justificación de inversión de esfuerzo y recursos del equipo en el desarrollo de **EnergIA**, en el marco del Hackathon Oracle Next Education (ONE) — Generación 9, operado por No Country con el acompañamiento académico de Alura LATAM. Este documento es insumo directo para el **Project Charter (DOC-003)** y debe leerse en conjunto con el **Project Knowledge Base (DOC-001)**, fuente oficial del proyecto.

## Control del Documento

|  |  |
| --- | --- |
| Campo | Valor |
| Documento | Business Case |
| Código | DOC-002 |
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

## 1. Resumen Ejecutivo

El consumo energético residencial y de pequeños comercios suele gestionarse sin visibilidad real de patrones de uso, lo que dificulta identificar oportunidades de ahorro. **EnergIA** propone una plataforma que aplica Ciencia de Datos e Inteligencia Artificial para clasificar perfiles energéticos, estimar costos de consumo y generar recomendaciones prácticas de eficiencia, integrando una API REST propia y al menos un servicio de Oracle Cloud Infrastructure (OCI), tal como exigen las bases del Hackathon ONE G9.

El equipo (Team 48) evaluó la oportunidad de construir un MVP funcional en un plazo máximo de cinco semanas, priorizando aprendizaje aplicado, cumplimiento de las bases del hackathon y un producto demostrable ante jurado (formato "pitch"/demo en vivo).

## 2. Problema u Oportunidad de Negocio

- Los usuarios residenciales y pequeños comercios no cuentan con herramientas accesibles que traduzcan su consumo en kWh a un diagnóstico claro (perfil energético) y en acciones concretas de ahorro.
- Los programas de eficiencia energética existentes suelen requerir hardware adicional (medidores inteligentes) o conocimiento técnico previo, lo que limita su adopción.
- El Hackathon ONE G9 exige demostrar dominio integral del stack Oracle/Java + Ciencia de Datos + Cloud, lo que representa además una oportunidad formativa para los seis integrantes del equipo.

## 3. Alineación Estratégica

| Objetivo estratégico | Cómo lo atiende EnergIA |
| --- | --- |
| Cumplir las bases del Hackathon ONE G9 – LATAM | MVP funcional, API REST, clasificación por IA y uso de OCI |
| Fortalecer competencias técnicas del equipo (ONE) | Aplicación práctica de Java/Spring Boot, Python, Scikit-Learn y OCI |
| Generar un artefacto de portafolio profesional | Producto desplegado en producción (Vercel + OCI + Render) con documentación completa |
| Promover hábitos de consumo sostenible | Recomendaciones accionables basadas en el perfil energético del usuario |

## 4. Análisis de Opciones Consideradas

| Opción | Descripción | Resultado del análisis |
| --- | --- | --- |
| A. No actuar | No participar activamente en el hackathon con un producto propio | Descartada: incumple el objetivo formativo y las bases del programa ONE |
| B. Herramienta manual (hojas de cálculo / reportes estáticos) | Entregar solo análisis exploratorio de datos sin producto de software | Descartada: no cumple el requisito de API REST funcional ni demuestra integración full-stack + IA + OCI |
| C. Construir EnergIA (opción seleccionada) | Plataforma web + API + modelo ML + integración OCI, desarrollada en 5 semanas con metodología híbrida PMBOK® + Scrum | **Seleccionada**: cumple bases del hackathon, es alcanzable en el plazo y maximiza el valor formativo y de portafolio |

## 5. Beneficios Esperados

### Cuantitativos (indicadores de producto, no financieros)

- MVP funcional desplegado en producción antes del cierre del hackathon (Semana 5).
- API REST con endpoints de autenticación, análisis IA, recomendaciones, consumos y panel administrativo, verificados en checklist QA (P0/P1).
- Modelo de Machine Learning entrenado y servido vía FastAPI con contrato de 12 variables de entrada.
- Cobertura de interfaz en 21 idiomas y prácticas de accesibilidad (lector de pantalla, navegación por teclado).

### Cualitativos

- Fortalecimiento de competencias técnicas y de gestión de proyectos del equipo bajo un marco híbrido PMBOK® + Scrum.
- Evidencia de trabajo en equipo distribuido (modalidad remota) bajo un modelo de liderazgo OSCAR.
- Producto demostrable ante jurado del hackathon y utilizable como pieza de portafolio profesional individual y grupal.

## 6. Costos y Recursos

Al tratarse de un proyecto de hackathon académico sin presupuesto monetario asignado, el "costo" del proyecto se mide en **esfuerzo del equipo** (seis roles: 1 Project Manager, 1 Full Stack Developer, 2 Backend Developer, 2 Data Analyst) durante un máximo de cinco semanas en modalidad remota, más el uso de servicios cloud en capa gratuita o de bajo costo (Vercel, Render free tier, una VM OCI). El detalle de esfuerzo estimado por entregable se documenta en el **Cost Baseline (DOC-008)**.

No se identifican costos monetarios significativos que requieran aprobación de presupuesto; el principal recurso comprometido es el tiempo del equipo.

## 7. Cronograma de Alto Nivel

| Hito | Semana | Fecha estimada |
| --- | --- | --- |
| Kickoff e iniciación | Semana 1 | 2026-07-13 |
| Planeación completa (PKB, Charter, líneas base) | Semana 2 | 2026-07-20 al 2026-07-26 |
| Desarrollo del núcleo (backend, frontend, ML) | Semanas 3–4 | 2026-07-27 al 2026-08-09 |
| QA, despliegue e integración final | Semana 5 | 2026-08-10 al 2026-08-16 |
| Cierre, demo y entrega (pitch) | Post-cierre | 2026-08-17 al 2026-08-20 |

Detalle completo en **Schedule Baseline (DOC-007)**.

## 8. Riesgos Principales

- Plazo fijo e improrrogable de cinco semanas frente a un alcance ambicioso (full-stack + IA + Cloud).
- Dependencia de servicios en capa gratuita (Render, un único nodo OCI) con posibles límites de disponibilidad o "cold start".
- Coordinación de un equipo remoto de seis personas con disponibilidad variable.

Registro completo en **Risk Register (DOC-009)**.

## 9. Criterios de Éxito

1. MVP desplegado y accesible públicamente antes del cierre del hackathon.
2. Cumplimiento verificable de las bases del hackathon (API REST, IA, al menos un servicio OCI).
3. Checklist QA P0 (bloqueantes) en estado "Pass" al momento de la entrega.
4. Documentación de gestión (PMBOK®) y técnica completa y consistente con el PKB.

## 10. Recomendación

Se recomienda **aprobar** el desarrollo de EnergIA como propuesta oficial del Team 48 para el Hackathon ONE G9 – LATAM, autorizando al Project Manager a emitir el Project Charter (DOC-003) y dar inicio formal a la fase de planeación.

## 11. Aprobación

| Rol | Nombre | Decisión |
| --- | --- | --- |
| Project Manager | Neil Jácome | Aprobado |
| Equipo EnergIA (Team 48) | Ver Stakeholder Register (DOC-011) | Aprobado por consenso |

## Historial de Versiones

| Versión | Fecha | Autor | Descripción |
| --- | --- | --- | --- |
| 1.0 | 2026-08-20 | Neil Jácome | Consolidación formal del Business Case, con fecha de referencia alineada al kickoff real del proyecto (2026-07-13). |
