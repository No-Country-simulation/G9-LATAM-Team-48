# Datascience — EnergIA

Material de ciencia de datos del hackathon (EDA, limpieza, features y modelos).
**No forma parte del deploy** de frontend/backend en Railway: vive como carpeta
hermana para experimentación y documentación del modelo.

## Contenido

| Ruta | Descripción |
|------|-------------|
| `datasets/raw/` | Dataset crudo de consumo energético |
| `notebooks/` | Pipeline: EDA → limpieza → features → modelos → evaluación → exportación |
| `docs/` | Catálogo, diccionario de datos, EDA e incidencias, manual científico |
| `requirements.txt` | Dependencias Python del entorno de notebooks |

## Setup rápido

```bash
cd datascience
python -m venv .venv
# Windows
.\.venv\Scripts\activate
# macOS/Linux
# source .venv/bin/activate
pip install -r requirements.txt
python test_environment.py
```

Abrí los notebooks con Jupyter / VS Code desde esta carpeta.

## Relación con el backend

El servicio ML (`ml-service`) carga el artefacto de producción en
[`../ml-service/models/model.joblib`](../ml-service/models/model.joblib).
El fallback heurístico del backend Spring aplica si FastAPI no responde.
