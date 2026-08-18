from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd

from app.benchmark import compute_benchmark
from app.config import MODELS_DIR, resolve_model_path
from app.feature_adapters import legacy_row_from_features, schema_from_column_names
from app.features import FEATURE_KEYS, NUMERIC_KEYS
from app.mapping import (
    confianza_pct,
    map_prediction_to_nivel,
    nivel_display_es,
    normalize_label,
)
from app.schemas import FeaturesV3, PredictionResponse
from app.v3_bundle import (
    V3Bundle,
    build_v3_input_frame,
    decode_v3_label,
    load_v3_bundle,
    transform_v3_features,
    v3_bundle_paths,
    v3_predict_proba,
)

log = logging.getLogger(__name__)


class ModelNotLoadedError(RuntimeError):
    pass


def _unwrap_artifact(raw: Any) -> tuple[Any, list[str] | None]:
    feature_columns: list[str] | None = None
    if isinstance(raw, dict):
        feature_columns = raw.get("feature_columns") or raw.get("features")
        if feature_columns is not None:
            feature_columns = list(feature_columns)
        for key in ("pipeline", "model", "estimator", "clf", "classifier"):
            if key in raw:
                return raw[key], feature_columns
    return raw, feature_columns


def _coerce_row(features: dict[str, Any]) -> dict[str, Any]:
    # Validación tipada (enums + rangos) alineada a API datascience.
    validated = FeaturesV3.model_validate(features).as_feature_dict()
    row: dict[str, Any] = {}
    for key in FEATURE_KEYS:
        value = validated[key]
        if key in NUMERIC_KEYS:
            row[key] = float(value)
        else:
            row[key] = str(value).strip()
    return row


def _frame_for_model(
    row: dict[str, Any],
    pipeline: Any,
    feature_columns: list[str] | None,
    schema: str,
) -> pd.DataFrame:
    names_in = getattr(pipeline, "feature_names_in_", None)
    if names_in is not None:
        cols = list(names_in)
    elif feature_columns:
        cols = feature_columns
    elif schema == "legacy":
        cols = list(legacy_row_from_features({}).keys())
    else:
        cols = list(FEATURE_KEYS)

    data = {col: [row[col] if col in row else None] for col in cols}
    missing = [c for c, v in data.items() if v[0] is None]
    if missing:
        raise ValueError(f"Features insuficientes para el pipeline: {missing}")
    return pd.DataFrame(data)


def _probabilities_map(
    model: Any,
    X: Any,
    y_encoder: Any | None,
) -> dict[str, float]:
    if not hasattr(model, "predict_proba"):
        return {}
    try:
        proba = model.predict_proba(X)[0]
        classes = getattr(model, "classes_", None)
        if classes is None:
            return {}
        out: dict[str, float] = {}
        for idx, cls in enumerate(classes):
            label = cls
            if y_encoder is not None and isinstance(cls, (int, np.integer)):
                try:
                    label = y_encoder.inverse_transform([int(cls)])[0]
                except Exception:
                    label = cls
            # Clave display ES si es posible
            key = str(label)
            nk, _, _ = map_prediction_to_nivel(label)
            display = nivel_display_es(nk)
            # Preferir etiqueta humana ES del encoder si ya viene así
            if normalize_label(key) in (
                "eficiente",
                "moderado",
                "ineficiente",
            ):
                display = {
                    "eficiente": "Eficiente",
                    "moderado": "Moderado",
                    "ineficiente": "Ineficiente",
                }[normalize_label(key)]
            out[display] = round(float(proba[idx]) * 100.0, 1)
        return out
    except Exception:
        log.debug("No se pudieron armar probabilidades", exc_info=True)
        return {}


def _build_response(
    *,
    user_id: str | None,
    nivel_key: str,
    category: str,
    confidence: float,
    ahorro: int,
    benchmark: float,
    probabilidades: dict[str, float] | None,
    schema: str,
) -> PredictionResponse:
    return PredictionResponse(
        userId=user_id,
        category=category,
        nivelKey=nivel_key,
        confidence=round(confidence, 4),
        ahorro=ahorro,
        tipKeys=[],
        benchmark=float(benchmark),
        nivel=nivel_display_es(nivel_key),
        confianza_pct=confianza_pct(confidence),
        probabilidades=probabilidades or None,
        schema=schema,
    )


class EnergyModelService:
    def __init__(self) -> None:
        self._pipeline: Any | None = None
        self._feature_columns: list[str] | None = None
        self._model_path: Path | None = None
        self._classes: list[Any] | None = None
        self._schema: str = "v3"
        self._v3: V3Bundle | None = None
        self._metadata: dict[str, Any] | None = None

    @property
    def model_path(self) -> Path | None:
        return self._model_path

    @property
    def is_loaded(self) -> bool:
        return self._pipeline is not None

    @property
    def schema(self) -> str:
        return self._schema

    @property
    def metadata(self) -> dict[str, Any]:
        if self._metadata is not None:
            return self._metadata
        return {
            "version_modelo": "v3" if self._schema == "v3_bundle" else self._schema,
            "schema": self._schema,
            "modelPath": str(self._model_path) if self._model_path else None,
            "modelLoaded": self.is_loaded,
            "clases": ["Eficiente", "Ineficiente", "Moderado"],
            "cantidad_features_crudas_requeridas": len(FEATURE_KEYS),
            "features_crudas": list(FEATURE_KEYS),
        }

    def load(self) -> None:
        self._metadata = self._load_metadata_file()
        bundle_paths = v3_bundle_paths()
        if bundle_paths is not None:
            cols_p, enc_p, model_p = bundle_paths
            self._model_path = model_p
            try:
                self._v3 = load_v3_bundle(cols_p, enc_p, model_p)
                self._pipeline = self._v3.model
                self._feature_columns = list(self._v3.feature_columns)
                self._classes = getattr(self._pipeline, "classes_", None)
                self._schema = "v3_bundle"
                log.info(
                    "Modelo v3 (3 artefactos) cargado desde %s (%s columnas)",
                    model_p.parent,
                    len(self._feature_columns),
                )
                return
            except Exception:
                log.exception("Falló la carga del bundle v3; se intentará model.joblib")
                self._v3 = None

        path = resolve_model_path()
        self._model_path = path
        if not path.is_file():
            log.warning(
                "No se encontró el modelo en %s. Colocá el .joblib exportado ahí o definí MODEL_PATH.",
                path,
            )
            self._pipeline = None
            return

        raw = joblib.load(path)
        pipeline, feature_columns = _unwrap_artifact(raw)
        self._pipeline = pipeline
        self._feature_columns = feature_columns
        self._classes = getattr(pipeline, "classes_", None)
        names_in = getattr(pipeline, "feature_names_in_", None)
        cols = list(names_in) if names_in is not None else (feature_columns or list(FEATURE_KEYS))
        self._schema = schema_from_column_names(cols)
        log.info("Modelo cargado desde %s (schema=%s)", path, self._schema)

    def _load_metadata_file(self) -> dict[str, Any] | None:
        candidates = (
            MODELS_DIR / "metadata_v3.json",
            MODELS_DIR.parent.parent / "datascience" / "models" / "metadata_v3.json",
        )
        for path in candidates:
            if path.is_file():
                try:
                    import json

                    return json.loads(path.read_text(encoding="utf-8"))
                except Exception:
                    log.warning("No se pudo leer metadata %s", path, exc_info=True)
        return None

    def predict(self, user_id: str | None, features: dict[str, Any]) -> PredictionResponse:
        if self._pipeline is None:
            raise ModelNotLoadedError(
                f"Modelo no cargado. Esperado en: {self._model_path}"
            )

        if self._schema == "v3_bundle" and self._v3 is not None:
            return self._predict_v3_bundle(user_id, features)

        row = (
            _coerce_row(features)
            if self._schema == "v3"
            else legacy_row_from_features(features)
        )
        frame = _frame_for_model(row, self._pipeline, self._feature_columns, self._schema)

        raw_label = self._pipeline.predict(frame)[0]
        confidence = self._confidence(frame, raw_label)
        probs = _probabilities_map(self._pipeline, frame, None)

        if str(raw_label) in ("efficient", "moderate", "inefficient"):
            nivel_key = category = str(raw_label)
            _, _, ahorro = map_prediction_to_nivel(nivel_key)
        else:
            nivel_key, category, ahorro = map_prediction_to_nivel(raw_label)
        benchmark = compute_benchmark(features)

        return _build_response(
            user_id=user_id,
            nivel_key=nivel_key,
            category=category,
            confidence=confidence,
            ahorro=ahorro,
            benchmark=benchmark,
            probabilidades=probs,
            schema=self._schema,
        )

    def _predict_v3_bundle(
        self, user_id: str | None, features: dict[str, Any]
    ) -> PredictionResponse:
        assert self._v3 is not None
        bundle = self._v3
        if bundle.is_full_pipeline:
            frame = pd.DataFrame([_coerce_row(features)])
            X = frame
        else:
            frame = build_v3_input_frame(features, bundle)
            X = transform_v3_features(frame, bundle)
        raw_label = bundle.model.predict(X)[0]
        decoded = decode_v3_label(raw_label, bundle)
        confidence = v3_predict_proba(bundle.model, X, raw_label, bundle.y_encoder)
        probs = _probabilities_map(bundle.model, X, bundle.y_encoder)

        if str(decoded) in ("efficient", "moderate", "inefficient"):
            nivel_key = category = str(decoded)
            _, _, ahorro = map_prediction_to_nivel(nivel_key)
        else:
            nivel_key, category, ahorro = map_prediction_to_nivel(decoded)
        benchmark = compute_benchmark(features)

        return _build_response(
            user_id=user_id,
            nivel_key=nivel_key,
            category=category,
            confidence=confidence,
            ahorro=ahorro,
            benchmark=benchmark,
            probabilidades=probs,
            schema=self._schema,
        )

    def _confidence(self, frame: pd.DataFrame, raw_label: Any) -> float:
        pipeline = self._pipeline
        assert pipeline is not None
        if not hasattr(pipeline, "predict_proba"):
            return 0.85
        try:
            proba = pipeline.predict_proba(frame)[0]
            classes = self._classes
            if classes is None:
                return float(np.max(proba))
            label_str = str(raw_label)
            for idx, cls in enumerate(classes):
                if str(cls) == label_str:
                    return float(proba[idx])
            return float(np.max(proba))
        except Exception:
            log.debug("predict_proba no disponible; confidence por defecto", exc_info=True)
            return 0.85


model_service = EnergyModelService()
