# WBS DICTIONARY (Diccionario de la EDT)

## Proyecto: EnergIA

### Propósito del documento

Complementa el WBS (DOC-005) definiendo, para cada paquete de trabajo de nivel de control, su descripción, entregable asociado, responsable, criterios de aceptación y esfuerzo estimado en días-persona.

## Control del Documento

|  |  |
| --- | --- |
| Campo | Valor |
| Documento | WBS Dictionary |
| Código | DOC-006 |
| Proyecto | EnergIA |
| Versión | 1.0 |
| Estado | Aprobado |
| Clasificación | Documento Interno |
| Metodología | Híbrida (PMBOK® Guide – 8.ª Edición + Scrum) |
| Modelo de Liderazgo | OSCAR |
| Autor | Equipo EnergIA (Team 48) — consolidado por Neil Jácome, Project Manager |
| Responsable | Project Manager |
| Fecha de Creación | 2026-07-15 |
| Última Actualización | 2026-08-20 |

## 1. Diccionario de Paquetes de Trabajo

### 1.1 Gestión del Proyecto

| Campo | Detalle |
| --- | --- |
| Descripción | Iniciación, planeación, seguimiento, control y cierre del proyecto bajo metodología híbrida PMBOK® + Scrum |
| Entregable | DEL-08 (Documentación de gestión) |
| Responsable | ROL-001 Project Manager |
| Criterios de aceptación | DOC-001 a DOC-014 completos, aprobados y consistentes entre sí |
| Esfuerzo estimado | 25 días-persona (a lo largo de las 5 semanas) |

### 1.2 Ciencia de Datos

| Campo | Detalle |
| --- | --- |
| Descripción | Recolección de dataset, EDA, limpieza, feature engineering, entrenamiento, evaluación y exportación del modelo de clasificación de perfil energético |
| Entregable | DEL-04 (Dataset de entrenamiento), DEL-05 (Notebook de Ciencia de Datos) |
| Responsable | ROL-004 Data Analyst |
| Criterios de aceptación | Notebook ejecutable de extremo a extremo; artefacto `.joblib` exportado y documentado en diccionario de datos |
| Esfuerzo estimado | 20 días-persona |

### 1.3 Backend (API REST)

| Campo | Detalle |
| --- | --- |
| Descripción | Desarrollo de la API Spring Boot: autenticación, análisis IA, recomendaciones, consumos, contacto, administración y persistencia MySQL/Flyway |
| Entregable | DEL-02 (API REST) |
| Responsable | ROL-003 Backend Developer |
| Criterios de aceptación | Endpoints operativos según checklist QA (P0/P1); Swagger UI disponible en `dev` |
| Esfuerzo estimado | 30 días-persona |

### 1.4 Microservicio ML

| Campo | Detalle |
| --- | --- |
| Descripción | API FastAPI que sirve el modelo entrenado, con adaptadores de features (legacy y v3) y endpoints de salud/predicción |
| Entregable | DEL-03 (Modelo de Machine Learning) |
| Responsable | ROL-004 Data Analyst (con apoyo de ROL-003 Backend Developer para integración) |
| Criterios de aceptación | `/health` y `/predict` responden correctamente; contrato de 12 features validado por el backend |
| Esfuerzo estimado | 12 días-persona |

### 1.5 Frontend

| Campo | Detalle |
| --- | --- |
| Descripción | Aplicación React con dashboard, autenticación, análisis IA, recomendaciones, historial, panel admin, i18n (21 idiomas) y accesibilidad |
| Entregable | DEL-01 (Aplicación Web MVP) |
| Responsable | ROL-002 Full Stack Developer |
| Criterios de aceptación | Build de producción exitoso (`npm run build`); flujo de usuario completo verificado en checklist QA |
| Esfuerzo estimado | 28 días-persona |

### 1.6 Infraestructura y DevOps

| Campo | Detalle |
| --- | --- |
| Descripción | Contenerización, despliegue en Vercel (frontend), VM OCI vía Podman (backend + MySQL) y Render (ML); entorno LAN/NAS opcional |
| Entregable | DEL-06 (Integración OCI) |
| Responsable | ROL-003 Backend Developer (rol de infraestructura) |
| Criterios de aceptación | Servicios accesibles públicamente; health checks en verde; al menos un servicio OCI en uso activo |
| Esfuerzo estimado | 10 días-persona |

### 1.7 Calidad (QA)

| Campo | Detalle |
| --- | --- |
| Descripción | Pruebas automatizadas (JUnit, build frontend), checklist manual P0/P1 y smoke tests de producción |
| Entregable | Verificación de DEL-01, DEL-02, DEL-03 |
| Responsable | Equipo EnergIA (rotativo, coordinado por el Project Manager) |
| Criterios de aceptación | Checklist P0 100% Pass; P1 sin bloqueantes abiertos |
| Esfuerzo estimado | 8 días-persona |

### 1.8 Documentación

| Campo | Detalle |
| --- | --- |
| Descripción | Documentación técnica (READMEs, arquitectura, despliegue, autenticación) y de gestión (PMBOK®) |
| Entregable | DEL-07 (Documentación técnica), DEL-08 (Documentación de gestión) |
| Responsable | Project Manager (gestión) y cada rol técnico (documentación de su módulo) |
| Criterios de aceptación | Documentos en Markdown, versionados y sin contradicciones con el PKB |
| Esfuerzo estimado | 10 días-persona |

### 1.9 Cierre y Entrega

| Campo | Detalle |
| --- | --- |
| Descripción | Preparación y ejecución de la demo/pitch ante jurado, y registro de lecciones aprendidas |
| Entregable | Todos (DEL-01 a DEL-08) presentados en conjunto |
| Responsable | Project Manager + Equipo EnergIA |
| Criterios de aceptación | Demo presentada dentro del plazo del hackathon; Lessons Learned Register (DOC-014) completo |
| Esfuerzo estimado | 5 días-persona |

## 2. Resumen de Esfuerzo Total Estimado

| Paquete EDT | Esfuerzo (días-persona) |
| --- | --- |
| 1.1 Gestión del Proyecto | 25 |
| 1.2 Ciencia de Datos | 20 |
| 1.3 Backend | 30 |
| 1.4 Microservicio ML | 12 |
| 1.5 Frontend | 28 |
| 1.6 Infraestructura y DevOps | 10 |
| 1.7 Calidad (QA) | 8 |
| 1.8 Documentación | 10 |
| 1.9 Cierre y Entrega | 5 |
| **Total** | **148** |

> Nota: el esfuerzo total (148 días-persona) es un estimado de planeación distribuido entre los seis integrantes del equipo a lo largo de cinco semanas (35 días calendario), con dedicación parcial y en paralelo entre paquetes. No representa horas facturables ni costo monetario (ver Cost Baseline, DOC-008).

## 3. Aprobación

| Rol | Nombre | Decisión |
| --- | --- | --- |
| Project Manager | Neil Jácome | Aprobado |

## Historial de Versiones

| Versión | Fecha | Autor | Descripción |
| --- | --- | --- | --- |
| 1.0 | 2026-08-20 | Neil Jácome | Consolidación formal del WBS Dictionary. |
