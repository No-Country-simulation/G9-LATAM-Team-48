# COST BASELINE (Línea Base de Costos)

## Proyecto: EnergIA

### Propósito del documento

Documenta el enfoque de costos del proyecto EnergIA. Por decisión explícita del Project Manager, este documento se mantiene **simple y sin desglose monetario detallado**, dado que el proyecto se desarrolla en el marco de un hackathon académico sin presupuesto asignado. El detalle de esfuerzo por paquete de trabajo se encuentra en el WBS Dictionary (DOC-006); el cronograma detallado en el Schedule Baseline (DOC-007).

## Control del Documento

|  |  |
| --- | --- |
| Campo | Valor |
| Documento | Cost Baseline |
| Código | DOC-008 |
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

## 1. Declaración de Alcance de este Documento

EnergIA es un proyecto de hackathon sin presupuesto monetario asignado por ninguno de los stakeholders (ONE, Alura LATAM, No Country). En consecuencia:

- **No se elabora** un presupuesto detallado en moneda (no hay tarifas de personal, contratos ni gastos aprobados).
- **No se realiza** un análisis de valor ganado (EVM) con cifras monetarias.
- El "costo" real y relevante del proyecto es el **tiempo del equipo**, ya cuantificado en días-persona en el WBS Dictionary (DOC-006), y el uso de servicios cloud, descrito a continuación de forma cualitativa.

## 2. Recursos Cloud Utilizados (Referencia, sin costo monetario para el equipo)

| Servicio | Proveedor | Plan | Costo para el equipo |
| --- | --- | --- | --- |
| Hosting Frontend | Vercel | Plan gratuito | $0 |
| Microservicio ML | Render | Plan gratuito (Free) | $0 |
| Backend + MySQL | Oracle Cloud Infrastructure (VM vía Podman) | Recursos del programa ONE / cuenta del equipo | Sin costo directo reportado al equipo |
| Correo transaccional | Gmail SMTP | Cuenta de equipo | $0 |
| Control de versiones | GitHub | Plan gratuito | $0 |

> No se identifican gastos monetarios que requieran aprobación de presupuesto por parte de un patrocinador.

## 3. Enfoque de Control de Costos

Dado que no existe presupuesto monetario, el control de "costos" del proyecto se realiza mediante el seguimiento del **esfuerzo (días-persona)** consumido por paquete de trabajo, comparado contra la estimación del WBS Dictionary (DOC-006), y mediante el monitoreo de los límites de uso de los servicios en capa gratuita (por ejemplo, cuota diaria de envío de Gmail SMTP ~500 correos/día, o "cold start" del plan gratuito de Render), registrados como riesgos en el Risk Register (DOC-009).

## 4. Aprobación

| Rol | Nombre | Decisión |
| --- | --- | --- |
| Project Manager | Neil Jácome | Aprobado |

## Historial de Versiones

| Versión | Fecha | Autor | Descripción |
| --- | --- | --- | --- |
| 1.0 | 2026-08-20 | Neil Jácome | Documento simplificado sin desglose monetario, por acuerdo con el Project Manager. |
