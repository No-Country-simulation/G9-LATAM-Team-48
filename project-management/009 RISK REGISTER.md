# RISK REGISTER (Registro de Riesgos)

## Proyecto: EnergIA

### Propósito del documento

Identifica, analiza y da seguimiento a los riesgos del proyecto EnergIA, siguiendo el dominio de desempeño de Incertidumbre del PMBOK® Guide – 8.ª Edición. Es un documento vivo que se actualiza durante todo el ciclo de vida del proyecto.

## Control del Documento

|  |  |
| --- | --- |
| Campo | Valor |
| Documento | Risk Register |
| Código | DOC-009 |
| Proyecto | EnergIA |
| Versión | 1.0 |
| Estado | Aprobado |
| Clasificación | Documento Interno |
| Metodología | Híbrida (PMBOK® Guide – 8.ª Edición + Scrum) |
| Modelo de Liderazgo | OSCAR |
| Autor | Equipo EnergIA (Team 48) — consolidado por Neil Jácome, Project Manager |
| Responsable | Project Manager |
| Fecha de Creación | 2026-07-17 |
| Última Actualización | 2026-08-20 |

## 1. Escala de Probabilidad e Impacto

| Nivel | Probabilidad | Impacto |
| --- | --- | --- |
| Alto | > 60% | Compromete un hito o entregable crítico |
| Medio | 30–60% | Retraso o degradación menor, mitigable |
| Bajo | < 30% | Impacto marginal, absorbible por el equipo |

## 2. Registro de Riesgos

| ID | Categoría | Descripción | Prob. | Impacto | Exposición | Estrategia | Mitigación / Respuesta | Responsable | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RSK-001 | Cronograma | Plazo fijo de 5 semanas frente a un alcance multidisciplinario (full-stack + IA + Cloud) | Alto | Alto | Alta | Mitigar | Priorización estricta del backlog (MVP primero), sprints semanales con revisión de alcance | Project Manager | Materializado y gestionado (entregado dentro del plazo) |
| RSK-002 | Técnico / Infraestructura | "Cold start" del plan gratuito de Render puede demorar la primera respuesta del microservicio ML (~60s) | Alto | Medio | Media-Alta | Mitigar | `PREDICTION_API_TIMEOUT=60000` configurado en backend; fallback `HeuristicPrediction` si ML no responde a tiempo | Backend Developer | Mitigado (fallback operativo) |
| RSK-003 | Técnico / Infraestructura | Backend y base de datos MySQL concentrados en una única VM de OCI (punto único de falla) | Medio | Alto | Media | Aceptar / Monitorear | Health checks (`/actuator/health`), monitoreo manual, reinicio vía Podman documentado en NAS-DOCKER.md como referencia operativa | Backend Developer | Monitoreado |
| RSK-004 | Operativo | Límite diario de envío de Gmail SMTP (~500 correos/día) podría afectar verificación de cuentas en picos de uso (p. ej. jurado probando el producto) | Bajo | Medio | Baja | Aceptar | Monitoreo de `emailStatus` en respuestas de API; uso de cuenta dedicada del equipo (`energyaiteam48@gmail.com`) | Project Manager | Aceptado |
| RSK-005 | Experiencia de Usuario | Bloqueadores de anuncios (uBlock, Privacy Badger) impiden la apertura del popup de Google Sign-In | Alto | Medio | Media-Alta | Mitigar | Detección en cliente (temporizador ~2–3.2s) y aviso visible al usuario para deshabilitar el bloqueador; login por email siempre disponible como alternativa | Full Stack Developer | Mitigado (validado en QA P0-08) |
| RSK-006 | Infraestructura alterna | `docker compose` falla por bug de red en el NAS QNAP (entorno LAN alterno, fuera de producción) | Medio | Bajo | Baja | Mitigar | Workaround documentado con `docker run` directo y variables de entorno explícitas (ver NAS-DOCKER.md) | Backend Developer | Mitigado |
| RSK-007 | Calidad | Ausencia de suite de pruebas automatizadas end-to-end en el frontend | Alto | Medio | Media-Alta | Mitigar | Checklist manual QA (P0/P1) como control compensatorio; `npm run build` como smoke de compilación | Equipo EnergIA | Aceptado con control compensatorio |
| RSK-008 | Recursos Humanos | Disponibilidad variable de un equipo remoto de 6 personas durante 5 semanas | Medio | Alto | Media | Mitigar | Modelo de liderazgo OSCAR, dailies breves, distribución de roles clara (ver Stakeholder/Communication Plan) | Project Manager | Monitoreado |
| RSK-009 | Datos | Dependencia de datos públicos o simulados de consumo energético; posibles sesgos o huecos en el dataset | Medio | Medio | Media | Mitigar | EDA documentado, diccionario de datos y notas de incidencias en `datascience/docs/` | Data Analyst | Mitigado |
| RSK-010 | Configuración | Múltiples copias del repositorio en el NAS (`CACHEDEV1_DATA`, `CACHEDEV3_DATA`) pueden desincronizarse | Bajo | Bajo | Baja | Aceptar | Convención explícita: usar siempre la copia en `CACHEDEV1_DATA/proyectos` para build/rebuild | Backend Developer | Aceptado |
| RSK-011 | Seguridad | Exposición accidental de secretos (contraseñas demo, `JWT_SECRET`) si se documentan dentro del repositorio | Bajo | Alto | Media | Mitigar | Contraseñas y variables sensibles fuera de Git (`qa/secrets.local.ps1`, variables `QA_DEMO_*`, `.env` no versionado) | Equipo EnergIA | Mitigado |
| RSK-012 | Externo | Interrupciones de los proveedores cloud (Vercel, Render) fuera del control del equipo, especialmente durante la evaluación del jurado | Bajo | Alto | Media | Aceptar / Monitorear | Verificación de smoke tests de producción antes de la demo (`qa/smoke-api.ps1`) | Project Manager | Monitoreado |

## 3. Matriz de Exposición (resumen)

| Exposición | Cantidad de riesgos |
| --- | --- |
| Alta / Media-Alta | 4 (RSK-001, RSK-002, RSK-005, RSK-007) |
| Media | 5 (RSK-003, RSK-008, RSK-009, RSK-011, RSK-012) |
| Baja | 3 (RSK-004, RSK-006, RSK-010) |

## 4. Proceso de Actualización

Este registro se revisa al cierre de cada sprint (ver Schedule Baseline, DOC-007) y ante la aparición de nuevos hallazgos durante QA (DOC-012). Los riesgos materializados que impacten alcance o cronograma se registran también en el Lessons Learned Register (DOC-014).

## 5. Aprobación

| Rol | Nombre | Decisión |
| --- | --- | --- |
| Project Manager | Neil Jácome | Aprobado |

## Historial de Versiones

| Versión | Fecha | Autor | Descripción |
| --- | --- | --- | --- |
| 1.0 | 2026-08-20 | Neil Jácome | Consolidación del registro de riesgos con evidencia real observada durante el proyecto (QA.md, NAS-DOCKER.md, READMEs). |
