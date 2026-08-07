"""Imprime columnas esperadas por el pipeline joblib (debug local)."""

from __future__ import annotations

import sys

import joblib

from app.config import resolve_model_path


def main() -> int:
    path = resolve_model_path()
    if not path.is_file():
        print(f"No existe: {path}", file=sys.stderr)
        return 1
    raw = joblib.load(path)
    if isinstance(raw, dict):
        print("Claves del artefacto:", list(raw.keys()))
        obj = raw.get("pipeline") or raw.get("model") or raw
        cols = raw.get("feature_columns") or raw.get("features")
        if cols:
            print("feature_columns:", cols)
    else:
        obj = raw
    names = getattr(obj, "feature_names_in_", None)
    if names is not None:
        print("pipeline.feature_names_in_:", list(names))
    classes = getattr(obj, "classes_", None)
    if classes is not None:
        print("classes_:", list(classes))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
