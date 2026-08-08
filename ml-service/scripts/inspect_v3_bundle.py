"""Inspecciona el trio v3 (columnas, encoder, modelo)."""

from __future__ import annotations

import sys
from pathlib import Path

import joblib

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from app.config import MODELS_DIR  # noqa: E402
from app.v3_bundle import (  # noqa: E402
    V3_COLUMNS_FILE,
    V3_ENCODER_FILE,
    V3_MODEL_FILE,
    load_v3_bundle,
    v3_bundle_paths,
)


def main() -> int:
    paths = v3_bundle_paths(MODELS_DIR)
    if not paths:
        print(f"No se encontró el trio v3 en {MODELS_DIR}")
        print(f"  Esperado: {V3_COLUMNS_FILE}, {V3_ENCODER_FILE}, {V3_MODEL_FILE}")
        return 1

    cols_p, enc_p, model_p = paths
    print("columnas:", cols_p)
    print("encoder:", enc_p)
    print("modelo:", model_p)

    bundle = load_v3_bundle(cols_p, enc_p, model_p)
    print("feature_columns:", bundle.feature_columns)
    print("model type:", type(bundle.model).__name__)
    if getattr(bundle.model, "classes_", None) is not None:
        print("model.classes_:", list(bundle.model.classes_))
    if bundle.y_encoder is not None:
        print("y_encoder.classes_:", list(getattr(bundle.y_encoder, "classes_", [])))
    if bundle.x_encoders:
        print("x_encoders keys:", list(bundle.x_encoders.keys()))

    raw_cols = joblib.load(cols_p)
    print("columnas raw type:", type(raw_cols).__name__)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
