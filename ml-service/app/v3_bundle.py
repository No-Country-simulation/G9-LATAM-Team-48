from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd

from app.features import FEATURE_KEYS, NUMERIC_KEYS
from app.mapping import normalize_label

log = logging.getLogger(__name__)

V3_COLUMNS_FILE = "columnas_requeridas_final_v3.joblib"
V3_ENCODER_FILE = "label_encoder_v3.joblib"
V3_MODEL_FILE = "modelo_perfil_energetico_final_v3.joblib"

CATEGORICAL_API_KEYS = frozenset({"tipo_inmueble", "aislamiento_termico", "zona"})

DERIVED_FROM_API: dict[str, Any] = {
    "consumo_kwh_por_persona": lambda b: float(b["consumo_kwh_mensual"])
    / max(float(b["num_personas"]), 1.0),
    "consumo_kwh_por_m2": lambda b: float(b["consumo_kwh_mensual"])
    / max(float(b["superficie_m2"]), 1.0),
}


@dataclass
class V3Bundle:
    model: Any
    feature_columns: list[str]
    x_encoders: dict[str, Any]
    y_encoder: Any | None
    x_preprocessor: Any | None


def v3_bundle_paths(models_dir: Path | None = None) -> tuple[Path, Path, Path] | None:
    from app.config import DATASCIENCE_MODELS_DIR, MODELS_DIR

    directories = [models_dir] if models_dir is not None else [MODELS_DIR, DATASCIENCE_MODELS_DIR]
    for directory in directories:
        cols = directory / V3_COLUMNS_FILE
        enc = directory / V3_ENCODER_FILE
        model = directory / V3_MODEL_FILE
        if cols.is_file() and enc.is_file() and model.is_file():
            return cols, enc, model
    return None


def _as_column_list(raw: Any) -> list[str]:
    if raw is None:
        return []
    if isinstance(raw, (list, tuple, np.ndarray, pd.Index)):
        return [str(c) for c in raw]
    if isinstance(raw, dict) and "columns" in raw:
        return _as_column_list(raw["columns"])
    raise TypeError(f"columnas_requeridas: tipo no soportado {type(raw)!r}")


def _coerce_api_row(features: dict[str, Any]) -> dict[str, Any]:
    row: dict[str, Any] = {}
    for key in FEATURE_KEYS:
        if key not in features or features[key] is None:
            raise ValueError(f"Falta la feature obligatoria: {key}")
        value = features[key]
        if key in NUMERIC_KEYS:
            row[key] = float(value)
        else:
            row[key] = str(value).strip()
    return row


def _safe_label_transform(encoder: Any, value: Any) -> int | float:
    text = str(value).strip()
    classes = list(getattr(encoder, "classes_", []))
    if text in classes:
        return encoder.transform([text])[0]
    norm = normalize_label(text)
    for candidate in classes:
        if normalize_label(candidate) == norm:
            return encoder.transform([candidate])[0]
    raise ValueError(
        f"Valor '{value}' fuera del dominio del encoder "
        f"(esperado uno de {classes[:8]}{'…' if len(classes) > 8 else ''})",
    )


def _parse_encoder_artifact(raw: Any) -> tuple[dict[str, Any], Any | None, Any | None]:
    """
    Soporta:
    - LabelEncoder de la variable objetivo (y)
    - dict[col -> LabelEncoder] para X
    - dict con claves 'target' / 'features' / 'x'
    - ColumnTransformer u otro preprocessor para X
    """
    x_encoders: dict[str, Any] = {}
    y_encoder: Any | None = None
    x_preprocessor: Any | None = None

    if isinstance(raw, dict):
        if "target" in raw or "y" in raw:
            y_encoder = raw.get("target") or raw.get("y")
        if "features" in raw or "x" in raw or "encoders" in raw:
            inner = raw.get("features") or raw.get("x") or raw.get("encoders")
            if isinstance(inner, dict):
                x_encoders = inner
            else:
                x_preprocessor = inner
        elif not y_encoder:
            # dict de encoders por columna
            if all(hasattr(v, "transform") for v in raw.values()):
                x_encoders = raw
            else:
                y_encoder = raw.get("label_encoder")
        return x_encoders, y_encoder, x_preprocessor

    if hasattr(raw, "get_feature_names_out") and hasattr(raw, "transform"):
        return {}, None, raw

    if hasattr(raw, "inverse_transform") and hasattr(raw, "classes_"):
        return {}, raw, None

    raise TypeError(f"label_encoder_v3: tipo no soportado {type(raw)!r}")


def load_v3_bundle(cols_path: Path, encoder_path: Path, model_path: Path) -> V3Bundle:
    columns_raw = joblib.load(cols_path)
    encoder_raw = joblib.load(encoder_path)
    model = joblib.load(model_path)

    feature_columns = _as_column_list(columns_raw)
    feature_columns = [c for c in feature_columns if c != "perfil_energetico"]
    names_in = getattr(model, "feature_names_in_", None)
    if names_in is not None:
        feature_columns = list(names_in)
    elif not feature_columns:
        feature_columns = list(FEATURE_KEYS)

    x_encoders, y_encoder, x_preprocessor = _parse_encoder_artifact(encoder_raw)
    log.info(
        "Bundle v3: %s columnas, encoders X=%s, preprocessor=%s, encoder y=%s",
        len(feature_columns),
        list(x_encoders.keys()) if x_encoders else "—",
        type(x_preprocessor).__name__ if x_preprocessor else "—",
        type(y_encoder).__name__ if y_encoder else "—",
    )
    return V3Bundle(
        model=model,
        feature_columns=feature_columns,
        x_encoders=x_encoders,
        y_encoder=y_encoder,
        x_preprocessor=x_preprocessor,
    )


def build_v3_input_frame(
    features: dict[str, Any],
    bundle: V3Bundle,
) -> pd.DataFrame:
    base = _coerce_api_row(features)
    for col in bundle.feature_columns:
        if col in base:
            continue
        if col in DERIVED_FROM_API:
            base[col] = DERIVED_FROM_API[col](base)

    missing = [c for c in bundle.feature_columns if c not in base]
    if missing:
        raise ValueError(
            f"El modelo v3 requiere columnas que no vienen en el payload ML: {missing}. "
            f"Enviadas: {list(base.keys())}",
        )

    row: dict[str, Any] = {}
    for col in bundle.feature_columns:
        raw_val = base[col]
        if col in bundle.x_encoders:
            row[col] = _safe_label_transform(bundle.x_encoders[col], raw_val)
        elif col in CATEGORICAL_API_KEYS and not isinstance(raw_val, (int, float)):
            # Modelo entrenado con strings categóricos
            row[col] = raw_val
        else:
            row[col] = float(raw_val) if col in NUMERIC_KEYS else raw_val

    return pd.DataFrame([row], columns=bundle.feature_columns)


def transform_v3_features(frame: pd.DataFrame, bundle: V3Bundle) -> Any:
    if bundle.x_preprocessor is not None:
        return bundle.x_preprocessor.transform(frame)
    return frame


def decode_v3_label(raw: Any, bundle: V3Bundle) -> Any:
    if bundle.y_encoder is not None and isinstance(raw, (int, np.integer)):
        try:
            return bundle.y_encoder.inverse_transform([int(raw)])[0]
        except Exception:
            pass
    if bundle.y_encoder is not None and isinstance(raw, (float, np.floating)):
        try:
            return bundle.y_encoder.inverse_transform([int(raw)])[0]
        except Exception:
            pass
    return raw


def v3_predict_proba(
    model: Any, X: Any, raw_label: Any, y_encoder: Any | None
) -> float:
    if not hasattr(model, "predict_proba"):
        return 0.85
    try:
        proba = model.predict_proba(X)[0]
        classes = getattr(model, "classes_", None)
        if classes is None:
            return float(np.max(proba))
        decoded = raw_label
        if y_encoder is not None and isinstance(raw_label, (int, np.integer)):
            try:
                decoded = y_encoder.inverse_transform([int(raw_label)])[0]
            except Exception:
                decoded = raw_label
        target_str = str(decoded)
        for idx, cls in enumerate(classes):
            if str(cls) == target_str or normalize_label(cls) == normalize_label(target_str):
                return float(proba[idx])
        return float(np.max(proba))
    except Exception:
        return 0.85
