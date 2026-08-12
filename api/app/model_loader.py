import json
import os
import sys

import joblib

# Raíz del proyecto: dos niveles arriba de este archivo (api/app/ -> api/ -> raíz)
RAIZ_PROYECTO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(RAIZ_PROYECTO)


RUTA_MODELOS = os.path.join(RAIZ_PROYECTO, "models")

pipeline = joblib.load(os.path.join(RUTA_MODELOS, "model_pipeline_v3.joblib"))

with open(os.path.join(RUTA_MODELOS, "metadata_v3.json"), "r", encoding="utf-8") as f:
    metadata = json.load(f)

CLASES = metadata["clases"]

print(f"Pipeline v3 cargado. Clases: {CLASES}")