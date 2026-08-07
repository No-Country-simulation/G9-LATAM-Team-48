from __future__ import annotations

from typing import Any


def _normalize_tipo(features: dict[str, Any]) -> str:
    raw = (
        features.get("tipo_inmueble")
        or features.get("tipoInmueble")
        or features.get("tipo")
        or "Casa Unifamiliar"
    )
    text = str(raw).strip().lower()
    if text in ("apartamento", "departamento"):
        return "APARTAMENTO"
    if "comercial" in text or text in ("comercio", "local_comercial"):
        return "PEQUENO_ESTABLECIMIENTO_COMERCIAL"
    if text in ("casa", "casa_unifamiliar", "casa unifamiliar"):
        return "CASA_UNIFAMILIAR"
    return str(raw).strip().upper()


def _first_float(features: dict[str, Any], *keys: str, default: float = 0.0) -> float:
    for key in keys:
        if key in features and features[key] is not None:
            try:
                return float(features[key])
            except (TypeError, ValueError):
                continue
    return default


def compute_benchmark(features: dict[str, Any]) -> float:
    """Misma lógica que HeuristicPrediction (backend) para benchmark coherente en UI."""
    tipo = _normalize_tipo(features)
    consumo = _first_float(
        features,
        "consumo_kwh_mensual",
        "consumoKwh",
        "consumo",
    )
    _ = consumo  # benchmark no depende del consumo real, solo del perfil del inmueble
    personas = _first_float(
        features,
        "num_personas",
        "cantidadPersonas",
        "personas",
        default=2 if tipo == "APARTAMENTO" else 3,
    )
    area = _first_float(
        features,
        "superficie_m2",
        "areaM2",
        "area",
        default=55 if tipo == "APARTAMENTO" else 80,
    )
    climate = _first_float(
        features,
        "horas_uso_aa_dia",
        "horasClimatizacion",
        "climateHours",
        default=2,
    )

    if tipo == "APARTAMENTO":
        base, person_factor, area_factor = 220, 55, 1.2
    elif tipo == "PEQUENO_ESTABLECIMIENTO_COMERCIAL":
        base, person_factor, area_factor = 650, 70, 2.2
    else:
        base, person_factor, area_factor = 300, 55, 1.2

    return round(base * 0.45 + personas * person_factor + area * area_factor + climate * 25)
