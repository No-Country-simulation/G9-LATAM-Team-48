# Datos de ejemplo (`resources/data`)

Esta carpeta contiene **datos de muestra estaticos** usados durante el
desarrollo inicial, mientras no exista una capa de persistencia real.

> Estos archivos son solo para prototipado y pruebas manuales. **No**
> representan datos productivos ni deben contener informacion sensible real.

## Archivos

| Archivo                    | Descripcion                                                        |
|----------------------------|--------------------------------------------------------------------|
| `sample-users.json`        | Usuarios de ejemplo (perfil publico, sin credenciales reales).     |
| `sample-predictions.json`  | Resultados de clasificacion simulados del modelo de ML.            |
| `sample-energy-data.json`  | Registros de consumo energetico de ejemplo por usuario y mes.      |

Cuando se implemente la persistencia y la integracion con FastAPI, estos
archivos deben retirarse o moverse a los recursos de test.
