# Propuesta de Reglas de Negocio — Módulo de Recomendaciones

> **Objetivo:** Definir la matriz lógica que conecta las variables crudas de consumo del usuario (validadas en `PredictionRequest`) con recomendaciones específicas y accionables. 
> Esta propuesta busca maximizar el ROI energético del usuario final, pasando de un modelo "caja negra" a uno basado en variables de uso real y contexto estructural.
> 
> **Nota para el equipo (Data Science & Frontend):** Por favor revisar y validar los umbrales sugeridos. Frontend deberá utilizar los `TipKey` para mapear los textos finales en la UI.

---

## Matriz de Decisión (Implementada en Patrón Strategy)

| Variable Analizada | Umbral Lógico Sugerido | Clave (TipKey) | Justificación de Negocio / Enfoque Estructural |
| :--- | :--- | :--- | :--- |
| **Uso Horario Pico** | `usoHorarioPico == true` | `PEAK` | **Optimización Tarifaria:** Consumir en horas pico impacta directamente en el costo final debido a penalizaciones. |
| **Climatización** | `horasClimatizacion >= 8` | `AC` | **Eficiencia Térmica:** >8 hs diarias sugiere un déficit en aislación o uso ineficiente del termostato. |
| **Carga de Equipos** | `cantidadEquipos >= 15` | `STANDBY` | **Mitigación de Consumo Fantasma:** Alto volumen de equipos conectados genera un gasto pasivo continuo. |
| **Perfil General** | `category == "MODERADO"` | `SHIFTS` | **Gestión de Hábitos:** Perfiles medios tienen alto margen para mejorar su eficiencia organizando tareas (lavado/planchado). |
| **Consumo Prolongado**| `horasAltoConsumo >= 10` | `LED` | **ROI de Infraestructura:** Uso intensivo indica necesidad de invertir en tecnología LED y sensores de movimiento. |
| **Inmueble: Comercio**| `tipoInmueble == "PEQUENO_ESTABLECIMIENTO_COMERCIAL"` | `COMMERCIAL`| **Políticas Comerciales:** Recomendar automatización de marquesinas, vitrinas y apagado fuera de horario comercial. |
| **Inmueble: Casa**| `tipoInmueble == "CASA_UNIFAMILIAR"` | `HOUSE`| **Mantenimiento Estructural:** Sugerir revisión de techos, fachadas y sistemas de riego/bombas que no aplican a edificios. |
| **Inmueble: Depto.**| `tipoInmueble == "APARTAMENTO"` | `APARTMENT`| **Optimización de Espacios:** Foco en ventilación cruzada y uso eficiente de luz natural en espacios cerrados sin control exterior. |

---

## Escalabilidad Técnica
Estas reglas se encuentran programadas en el backend utilizando el patrón de diseño **Strategy** (cumpliendo el principio *Open/Closed* de SOLID). Si desde el modelo predictivo o desde producto deciden ajustar un umbral o agregar un nuevo tipo de inmueble (ej. `OFICINA`), el cambio se realiza creando una única clase aislada, garantizando cero impacto en el código existente.
