# SCOPE STATEMENT (Enunciado del Alcance del Proyecto)

## Proyecto: EnergIA

### Propósito del documento

Este documento detalla el alcance del proyecto y del producto EnergIA, sus entregables, criterios de aceptación, exclusiones, restricciones y supuestos, desarrollando lo establecido en el Project Charter (DOC-003) y sirviendo de base para el WBS (DOC-005).

## Control del Documento

|  |  |
| --- | --- |
| Campo | Valor |
| Documento | Scope Statement |
| Código | DOC-004 |
| Proyecto | EnergIA |
| Versión | 1.0 |
| Estado | Aprobado |
| Clasificación | Documento Interno |
| Metodología | Híbrida (PMBOK® Guide – 8.ª Edición + Scrum) |
| Modelo de Liderazgo | OSCAR |
| Autor | Equipo EnergIA (Team 48) — consolidado por Neil Jácome, Project Manager |
| Responsable | Project Manager |
| Fecha de Creación | 2026-07-14 |
| Última Actualización | 2026-08-20 |

## 1. Descripción del Alcance del Producto

EnergIA es una plataforma web compuesta por: (a) una aplicación front-end para usuarios finales y administradores, (b) una API REST que centraliza autenticación, lógica de negocio y persistencia, (c) un microservicio de Machine Learning que clasifica perfiles energéticos, y (d) la infraestructura cloud necesaria para desplegar los tres componentes anteriores en un entorno accesible públicamente, incluyendo al menos un servicio de Oracle Cloud Infrastructure (OCI).

El producto permite a un usuario registrar datos de su vivienda o comercio (tipo de inmueble, consumo, superficie, personas, equipos, aislamiento, etc.), recibir una clasificación de su perfil energético, comparar su consumo contra una referencia y obtener recomendaciones priorizadas de eficiencia.

## 2. Entregables del Proyecto

| Código | Entregable | Descripción |
| --- | --- | --- |
| DEL-01 | Aplicación Web (MVP) | Front-end React con dashboard, consumos, historial, análisis IA, recomendaciones, admin, i18n y accesibilidad |
| DEL-02 | API REST | Backend Spring Boot: auth (JWT + Google), análisis IA, recomendaciones, consumos, contacto, administración |
| DEL-03 | Modelo de Machine Learning | Clasificador de perfil energético (pipeline v3 o `model.joblib`), servido vía FastAPI |
| DEL-04 | Dataset de entrenamiento | Dataset de consumo energético (crudo y procesado) usado para entrenar y evaluar el modelo |
| DEL-05 | Notebook de Ciencia de Datos | Pipeline documentado: EDA → limpieza → features → modelos → evaluación → exportación |
| DEL-06 | Integración OCI | Backend + MySQL desplegados en una VM de Oracle Cloud Infrastructure (Podman) |
| DEL-07 | Documentación técnica | READMEs de cada módulo, guías de arquitectura, autenticación, despliegue y ML |
| DEL-08 | Documentación de gestión | Conjunto de artefactos PMBOK® (DOC-001 a DOC-014) |

## 3. Criterios de Aceptación

| Entregable | Criterio de aceptación |
| --- | --- |
| DEL-01 | La aplicación carga en producción (Vercel), permite navegación sin sesión y flujo completo de registro/login/análisis con sesión |
| DEL-02 | Endpoints críticos responden según el checklist QA (P0-01 a P0-13, P1-01 a P1-12 en DOC-012 / `QA.md`) |
| DEL-03 | El endpoint `/predict` (o `/api/v3/predict`) responde con perfil energético, nivel, ahorro y `tipKeys` |
| DEL-04 / DEL-05 | Notebook ejecutable de extremo a extremo y dataset documentado en el diccionario de datos |
| DEL-06 | Backend accesible vía la IP pública de la VM OCI, con health check en `/actuator/health` |
| DEL-07 / DEL-08 | Documentos versionados, en Markdown, consistentes entre sí y con el PKB (DOC-001) |

## 4. Exclusiones del Alcance (fuera de alcance)

- Monetización real del producto o modelo de negocio comercial.
- Contratación de servicios OCI de nivel empresarial/pago más allá de lo necesario para la demo.
- Publicación en tiendas de aplicaciones móviles (la solución es exclusivamente web).
- Integración con medidores inteligentes (smart meters) reales; el consumo se ingresa manualmente o proviene de datasets públicos/simulados.
- Suite de pruebas automatizadas end-to-end en frontend (se cubre con checklist manual, ver Quality Management Plan DOC-012).
- Soporte multi-tenant o comercialización a terceros equipos del hackathon.
- Mantenimiento y soporte posteriores al cierre del hackathon, salvo continuidad voluntaria del equipo.

## 5. Restricciones

- Duración máxima de cinco semanas (kickoff 2026-07-13, cierre estimado 2026-08-16).
- Uso obligatorio de al menos un servicio de Oracle Cloud Infrastructure.
- API REST funcional como requisito de las bases del hackathon.
- Clasificación energética debe realizarse mediante Inteligencia Artificial.
- Cumplimiento de las bases del Hackathon ONE G9 – LATAM (operado por No Country).
- Equipo distribuido trabajando en modalidad 100% remota.

## 6. Supuestos

- Participación activa y sostenida de los seis integrantes del equipo durante las cinco semanas.
- Disponibilidad de los servicios de Oracle Cloud Infrastructure durante todo el proyecto.
- Disponibilidad de datos públicos o simulados suficientes para entrenar el modelo de Machine Learning.
- GitHub se mantiene como repositorio oficial y único punto de verdad del código fuente.
- Los servicios en capa gratuita utilizados (Vercel, Render) permanecen disponibles durante la ventana de evaluación del hackathon.

## 7. Estructura de Gobernanza del Alcance

Cualquier cambio de alcance debe registrarse como una nueva Architectural Decision Record (ADR) en el PKB (DOC-001) y, si afecta entregables o cronograma, reflejarse en el WBS (DOC-005), WBS Dictionary (DOC-006) y Schedule Baseline (DOC-007), siguiendo el proceso de control de cambios descrito en el Project Management Plan (DOC-013).

## 8. Aprobación

| Rol | Nombre | Decisión |
| --- | --- | --- |
| Project Manager | Neil Jácome | Aprobado |
| Equipo EnergIA | Ver DOC-011 | Aprobado por consenso |

## Historial de Versiones

| Versión | Fecha | Autor | Descripción |
| --- | --- | --- | --- |
| 1.0 | 2026-08-20 | Neil Jácome | Consolidación formal del Scope Statement, alineado al Business Case y Project Charter. |
