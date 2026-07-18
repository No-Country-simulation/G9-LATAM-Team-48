from __future__ import annotations

from typing import Any

TIPO_MAP = {"casa": 0, "fabrica_mediana": 1, "fabrica_grande": 2}
INTENSITY_MAP = {"baja": 0, "media": 1, "alta": 2}

FEATURE_COLUMNS = [
    "tipo_code",
    "consumo",
    "personas",
    "equipos",
    "area",
    "climateHours",
    "peakUseHours",
    "turnos",
    "maquinas",
    "hoursPerDay",
    "processIntensity_code",
    "hasCompressedAir",
    "lineas",
    "operatingDays",
    "capacityPct",
    "hasMonitoring",
]


def _num(features: dict[str, Any], key: str, default: float = 0.0) -> float:
    value = features.get(key, default)
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _yes(features: dict[str, Any], key: str) -> float:
    value = features.get(key, "no")
    if isinstance(value, bool):
        return 1.0 if value else 0.0
    if isinstance(value, (int, float)):
        return 1.0 if value else 0.0
    return 1.0 if str(value).lower() in {"yes", "si", "sí", "true", "1"} else 0.0


def compute_benchmark(features: dict[str, Any]) -> float:
    tipo = str(features.get("tipo") or "casa")
    if tipo == "casa":
        personas = _num(features, "personas", 3)
        area = _num(features, "area", 80)
        climate = _num(features, "climateHours", 2)
        return round(300 * 0.45 + personas * 55 + area * 1.2 + climate * 25)
    if tipo == "fabrica_mediana":
        machines = _num(features, "maquinas", 20)
        hours = _num(features, "hoursPerDay", 8)
        intensity = str(features.get("processIntensity") or "media")
        factor = {"baja": 0.8, "media": 1.0, "alta": 1.25}.get(intensity, 1.0)
        return round(max(machines * 280 * (hours / 8) * factor, 3200))
    lines = _num(features, "lineas", 4)
    area = _num(features, "area", 5000)
    days = _num(features, "operatingDays", 22)
    capacity = min(max(_num(features, "capacityPct", 75), 20), 100) / 100
    return round(max(lines * 6500 * (days / 22) * capacity + area * 1.5, 15750))


def features_to_vector(features: dict[str, Any]) -> list[float]:
    tipo = str(features.get("tipo") or "casa")
    intensity = str(features.get("processIntensity") or "media")
    row = {
        "tipo_code": float(TIPO_MAP.get(tipo, 0)),
        "consumo": _num(features, "consumo"),
        "personas": _num(features, "personas"),
        "equipos": _num(features, "equipos"),
        "area": _num(features, "area"),
        "climateHours": _num(features, "climateHours"),
        "peakUseHours": _num(features, "peakUseHours"),
        "turnos": _num(features, "turnos"),
        "maquinas": _num(features, "maquinas"),
        "hoursPerDay": _num(features, "hoursPerDay"),
        "processIntensity_code": float(INTENSITY_MAP.get(intensity, 1)),
        "hasCompressedAir": _yes(features, "hasCompressedAir"),
        "lineas": _num(features, "lineas"),
        "operatingDays": _num(features, "operatingDays"),
        "capacityPct": _num(features, "capacityPct"),
        "hasMonitoring": _yes(features, "hasMonitoring"),
    }
    return [row[col] for col in FEATURE_COLUMNS]


def ahorro_for(nivel: str) -> int:
    return {"efficient": 5, "moderate": 15, "inefficient": 28}.get(nivel, 15)
