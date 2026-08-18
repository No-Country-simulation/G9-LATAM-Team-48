from __future__ import annotations

import re
import unicodedata


def normalize_label(raw: object) -> str:
    if raw is None:
        return ""
    text = str(raw).strip()
    text = unicodedata.normalize("NFKD", text)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    return re.sub(r"\s+", " ", text).lower()


def map_prediction_to_nivel(raw_label: object) -> tuple[str, str, int]:
    """
    Devuelve (nivelKey, category, ahorro_pct_sugerido) para PredictionResponse Java.
    """
    label = normalize_label(raw_label)
    if any(k in label for k in ("ineficiente", "inefficient", "alto", "high")):
        return "inefficient", "inefficient", 28
    if any(k in label for k in ("eficiente", "efficient", "bajo", "low")):
        return "efficient", "efficient", 5
    if any(k in label for k in ("moderado", "moderate", "medio", "medium")):
        return "moderate", "moderate", 15
    return "moderate", "moderate", 15


def nivel_display_es(nivel_key: str) -> str:
    return {
        "efficient": "Eficiente",
        "moderate": "Moderado",
        "inefficient": "Ineficiente",
    }.get(str(nivel_key).strip().lower(), "Moderado")


def confianza_pct(confidence: float) -> float:
    return round(float(confidence) * 100.0, 1)
