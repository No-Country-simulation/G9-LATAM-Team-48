# COMMUNICATION MANAGEMENT PLAN (Plan de Gestión de las Comunicaciones)

## Proyecto: EnergIA

### Propósito del documento

Define qué información se comunica, a quién, con qué frecuencia, por qué canal y quién es responsable, para asegurar que todos los interesados identificados en el Stakeholder Register (DOC-011) reciban la información que necesitan de forma oportuna.

## Control del Documento

|  |  |
| --- | --- |
| Campo | Valor |
| Documento | Communication Management Plan |
| Código | DOC-010 |
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

## 1. Objetivos de la Comunicación

- Mantener alineado al equipo remoto sobre avance, impedimentos y decisiones técnicas.
- Reportar avance a ONE, Alura LATAM y No Country conforme a los hitos del hackathon.
- Preparar y ejecutar una comunicación clara y efectiva en la demo/pitch ante los jurados.
- Registrar decisiones de arquitectura y gestión en el PKB (DOC-001) como fuente única de verdad.

## 2. Matriz de Comunicaciones

| Comunicación | Audiencia | Frecuencia | Canal | Responsable | Formato |
| --- | --- | --- | --- | --- | --- |
| Daily / stand-up | Equipo EnergIA (SH-001) | Diaria | Reunión virtual breve | Project Manager | Verbal, síncrona |
| Revisión y retrospectiva de sprint | Equipo EnergIA (SH-001) | Semanal (cierre de cada sprint, ver DOC-007) | Reunión virtual | Project Manager | Verbal + acta breve |
| Actualización del PKB / documentación | Equipo EnergIA (SH-001) | Continua, ante cada decisión relevante | Repositorio Git (Markdown) | Rol técnico correspondiente + PM | Escrita |
| Reporte de avance a ONE / Alura LATAM | ONE (SH-002), Alura LATAM (SH-003) | Según cronograma del programa | Canales oficiales del programa ONE | Project Manager | Escrita / formulario del programa |
| Comunicación de bases y plazos | No Country (SH-004) → Equipo | Según publicación de No Country | Canal oficial del Hackathon | Project Manager (recepción y difusión interna) | Escrita |
| Demo / Pitch final | Jurados del Hackathon (SH-005) | Única vez, al cierre (Semana 5 / cierre) | Presentación en vivo + demo desplegada | Equipo EnergIA (vocería: Project Manager) | Oral + visual (demo en producción) |
| Formulario de contacto | Usuarios Finales (SH-006) | Bajo demanda | Formulario "Contáctanos" de la plataforma → `energyaiteam48@gmail.com` | Equipo EnergIA | Escrita |
| Reporte de incidentes / QA | Equipo EnergIA | Ante cada hallazgo | Checklist QA (`QA.md`) + canal del equipo | Responsable QA rotativo | Escrita (tabla de checklist) |

## 3. Canales de Comunicación del Equipo

| Canal | Uso |
| --- | --- |
| Repositorio GitHub (monorepo `G9-LATAM-Team-48`) | Código, documentación técnica y de gestión, control de versiones (issues/PRs si aplica) |
| Correo del equipo (`energyaiteam48@gmail.com`) | Comunicación con usuarios finales y notificaciones transaccionales (Gmail SMTP) |
| Reuniones virtuales | Dailies, revisiones de sprint y coordinación puntual |
| Documentación Markdown (PKB y artefactos PMBOK®) | Fuente oficial y persistente de decisiones, para evitar pérdida de contexto entre reuniones |

## 4. Reglas de Comunicación Escrita

- Toda decisión de arquitectura relevante se registra como Architectural Decision Record (ADR) en el PKB (DOC-001).
- La documentación del proyecto se mantiene exclusivamente en Markdown para agilidad de edición y versionado en Git.
- Ningún documento derivado debe contradecir al PKB; ante una discrepancia, prevalece el PKB y se corrige el documento derivado.

## 5. Gestión de Escalamiento

| Situación | Escalamiento |
| --- | --- |
| Impedimento técnico dentro del equipo | Se resuelve en el daily o se escala al rol correspondiente (Backend/Frontend/Data) |
| Riesgo con exposición Alta (ver DOC-009) | El Project Manager lo comunica de inmediato al equipo y evalúa impacto en cronograma |
| Cambio de bases o plazos del Hackathon | No Country → Project Manager → difusión inmediata al equipo completo |

## 6. Aprobación

| Rol | Nombre | Decisión |
| --- | --- | --- |
| Project Manager | Neil Jácome | Aprobado |

## Historial de Versiones

| Versión | Fecha | Autor | Descripción |
| --- | --- | --- | --- |
| 1.0 | 2026-08-20 | Neil Jácome | Consolidación formal del Plan de Comunicaciones. |
