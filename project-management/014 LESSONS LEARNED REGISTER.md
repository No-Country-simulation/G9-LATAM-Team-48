# LESSONS LEARNED REGISTER (Registro de Lecciones Aprendidas)

## Proyecto: EnergIA

### Propósito del documento

Documento de cierre que recopila los aprendizajes del proyecto EnergIA — qué funcionó, qué representó un desafío y qué se recomienda para futuras iteraciones — como parte del proceso de cierre del dominio de desempeño de Entrega del PMBOK® Guide – 8.ª Edición.

## Control del Documento

|  |  |
| --- | --- |
| Campo | Valor |
| Documento | Lessons Learned Register |
| Código | DOC-014 |
| Proyecto | EnergIA |
| Versión | 1.0 |
| Estado | Aprobado |
| Clasificación | Documento Interno |
| Metodología | Híbrida (PMBOK® Guide – 8.ª Edición + Scrum) |
| Modelo de Liderazgo | OSCAR |
| Autor | Equipo EnergIA (Team 48) — consolidado por Neil Jácome, Project Manager |
| Responsable | Project Manager |
| Fecha de Creación | 2026-08-17 |
| Última Actualización | 2026-08-20 |

## 1. Lo que funcionó bien

| ID | Categoría | Lección aprendida | Recomendación para el futuro |
| --- | --- | --- | --- |
| LL-01 | Gestión | El uso del PKB (DOC-001) como fuente única de verdad evitó contradicciones entre documentación técnica y de gestión | Adoptar un PKB desde el día 1 en futuros proyectos de equipo, incluso fuera de contexto de hackathon |
| LL-02 | Arquitectura | El fallback heurístico (`HeuristicPrediction`) ante fallas del microservicio ML evitó que el "cold start" de Render degradara la experiencia de usuario | Diseñar siempre un mecanismo de degradación controlada (graceful degradation) para dependencias externas en capa gratuita |
| LL-03 | Despliegue | Distribuir la solución en tres proveedores especializados (Vercel para frontend, OCI para backend/datos, Render para ML) permitió aprovechar capas gratuitas sin sacrificar funcionalidad | Evaluar arquitecturas multi-proveedor cuando el presupuesto es cero, en lugar de forzar todo a un único proveedor |
| LL-04 | Experiencia de Usuario | Detectar y comunicar proactivamente el bloqueo de Google Sign-In por ad-blockers (aviso visible) redujo la fricción de login sin necesitar rediseñar el flujo OAuth | Incluir detección de condiciones de entorno del usuario (bloqueadores, permisos) como parte del diseño de features de autenticación de terceros |
| LL-05 | Alcance | Priorizar un MVP con las 3 capas (frontend, backend, ML) integradas desde temprano, en lugar de perfeccionar un solo módulo, permitió llegar con producto demostrable al cierre | Mantener la regla "integración temprana y continua" en proyectos de plazo fijo |

## 2. Desafíos y áreas de mejora

| ID | Categoría | Desafío observado | Recomendación para el futuro |
| --- | --- | --- | --- |
| LL-06 | Calidad | No se implementó una suite de pruebas automatizadas end-to-end en el frontend; la validación de UI dependió de checklist manual | Incorporar Playwright (ya usado para capturas de pantalla) como suite E2E real en una siguiente iteración |
| LL-07 | Infraestructura | Backend y base de datos concentrados en una única VM de OCI representan un punto único de falla | Evaluar separación de servicios o redundancia si el proyecto continúa más allá del hackathon |
| LL-08 | Entorno alterno | El entorno LAN/NAS (QNAP) tuvo un bug de red con `docker compose`, que obligó a un workaround manual con `docker run` | Documentar y probar temprano los entornos alternos si van a usarse para demostraciones locales, evitando descubrir incompatibilidades tarde |
| LL-09 | Datos | La dependencia de datasets públicos/simulados introduce incertidumbre sobre la representatividad del modelo en escenarios reales | Planificar, en una fase futura, la recolección de datos reales o alianzas con proveedores de datos energéticos |
| LL-10 | Coordinación | Coordinar a un equipo remoto de 6 personas en 5 semanas exigió disciplina de comunicación constante | Formalizar desde el inicio (no de forma retrospectiva) los planes subsidiarios de comunicación y riesgos, para reducir la carga de gestión sobre el Project Manager al final del proyecto |

## 3. Recomendaciones Generales para Futuros Proyectos del Equipo

1. Elaborar la documentación de gestión PMBOK® **en paralelo** al desarrollo (no al final), aprovechando que ya se cuenta con un PKB desde la Semana 1.
2. Mantener el patrón de "un servicio gratuito por componente" como estrategia de arquitectura de bajo costo para futuros hackathons.
3. Incorporar pruebas automatizadas end-to-end como parte del Definition of Done si el proyecto tiene continuidad post-hackathon.
4. Formalizar un plan de continuidad (roadmap) si el equipo decide llevar EnergIA más allá del MVP de la demo.

## 4. Cierre

El proyecto EnergIA cumplió sus objetivos de alcance (DOC-004), cronograma (DOC-007) y calidad (DOC-012) dentro del plazo de cinco semanas del Hackathon ONE G9 – LATAM, con el MVP desplegado públicamente en https://g9-latam-team-48.vercel.app/. Se recomienda archivar este documento junto con el resto del catálogo de artefactos (DOC-001) como referencia para futuras ediciones del programa ONE.

## 5. Aprobación

| Rol | Nombre | Decisión |
| --- | --- | --- |
| Project Manager | Neil Jácome | Aprobado |
| Equipo EnergIA | Ver DOC-011 | Aprobado por consenso |

## Historial de Versiones

| Versión | Fecha | Autor | Descripción |
| --- | --- | --- | --- |
| 1.0 | 2026-08-20 | Neil Jácome | Registro de cierre de lecciones aprendidas del proyecto EnergIA. |
