# Datascience — EnergIA

Material de ciencia de datos del hackathon (EDA, limpieza, features y modelos).
**No forma parte del deploy** de frontend/backend en prod: carpeta hermana para
experimentación y documentación del modelo. `datasets/processed/` está en `.gitignore` (CSV local, no se sube).

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

El servicio ML (`ml-service`) carga el **artefacto de producción definitivo** en
[`../ml-service/models/model.joblib`](../ml-service/models/model.joblib) (commiteado en el monorepo).
Ese `.joblib` es el export del pipeline entrenado en notebooks; **no** hay otro modelo pendiente de subir para la demo.

- FastAPI recibe las **12 features** del formulario y las adapta a las columnas internas del pipeline.
- Perfil energético → ML; sugerencias en la UI → reglas Spring + i18n frontend.

El fallback heurístico del backend Spring aplica si FastAPI no responde.
