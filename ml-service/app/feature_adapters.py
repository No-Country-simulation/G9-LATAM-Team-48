from __future__ import annotations

from typing import Any

from app.features import FEATURE_KEYS


def schema_from_column_names(names: list[str]) -> str:
    if not names:
        return "v3"
    if names[0] == "tipo_inmueble" or set(FEATURE_KEYS).issubset(set(names)):
        return "v3"
    if "tipo_code" in names:
        return "legacy"
    return "v3"


def _tipo_code(tipo_raw: object) -> int:
    text = str(tipo_raw or "Casa Unifamiliar").strip().lower()
    if "apartamento" in text or "departamento" in text:
        return 1
    if "comercial" in text or "establecimiento" in text:
        return 2
    return 0


def _pick(features: dict[str, Any], *keys: str, default: float = 0.0) -> float:
    for key in keys:
        if key in features and features[key] is not None:
            try:
                return float(features[key])
            except (TypeError, ValueError):
                continue
    return default


def legacy_row_from_features(features: dict[str, Any]) -> dict[str, float | int]:
    tipo = features.get("tipo_inmueble") or features.get("tipoInmueble") or features.get("tipo")
    peak = _pick(features, "horasAltoConsumo", "peakUseHours", "horas_alto_consumo", default=0)
    return {
        "tipo_code": _tipo_code(tipo),
        "consumo": _pick(features, "consumo_kwh_mensual", "consumoKwh", "consumo", default=300),
        "personas": _pick(features, "num_personas", "cantidadPersonas", "personas", default=3),
        "equipos": _pick(features, "cantidad_equipos_total", "cantidadEquipos", "equipos", default=5),
        "area": _pick(features, "superficie_m2", "areaM2", "area", default=70),
        "climateHours": _pick(features, "horas_uso_aa_dia", "horasClimatizacion", "climateHours", default=2),
        "peakUseHours": peak,
        "turnos": _pick(features, "turnos", default=0),
        "maquinas": _pick(features, "maquinas", default=0),
        "hoursPerDay": _pick(features, "hoursPerDay", default=0),
        "processIntensity_code": _pick(features, "processIntensity_code", default=0),
        "hasCompressedAir": int(_pick(features, "hasCompressedAir", default=0)),
        "lineas": _pick(features, "lineas", default=0),
        "operatingDays": _pick(features, "operatingDays", default=0),
        "capacityPct": _pick(features, "capacityPct", default=0),
        "hasMonitoring": int(_pick(features, "hasMonitoring", default=0)),
    }
