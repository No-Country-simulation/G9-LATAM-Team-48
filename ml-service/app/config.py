from __future__ import annotations

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"


def resolve_model_path() -> Path:
    """Ruta al artefacto joblib (env MODEL_PATH o candidatos en models/)."""
    explicit = os.getenv("MODEL_PATH") or os.getenv("ML_MODEL_PATH")
    if explicit:
        return Path(explicit).expanduser().resolve()

    candidates = (
        MODELS_DIR / "model.joblib",
        MODELS_DIR / "modelo.joblib",
        MODELS_DIR / "modelo_v3.joblib",
        BASE_DIR / "artifacts" / "energy_classifier.joblib",
    )
    for path in candidates:
        if path.is_file():
            return path.resolve()
    return (MODELS_DIR / "model.joblib").resolve()
