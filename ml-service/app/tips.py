from __future__ import annotations

from typing import Any


def _num(features: dict[str, Any], key: str, default: float = 0.0) -> float:
    try:
        return float(features.get(key, default) or default)
    except (TypeError, ValueError):
        return default


def _yes(features: dict[str, Any], key: str) -> bool:
    value = features.get(key, "no")
    if isinstance(value, bool):
        return value
    return str(value).lower() in {"yes", "si", "sí", "true", "1"}


def tip_keys(nivel: str, features: dict[str, Any]) -> list[str]:
    tipo = str(features.get("tipo") or "casa")
    tips: list[str] = []

    if tipo == "casa":
        climate = _num(features, "climateHours")
        peak = _num(features, "peakUseHours")
        per_person = _num(features, "consumo") / max(_num(features, "personas", 1), 1)
        if nivel == "efficient":
            tips = ["keep", "monitor"]
            if climate >= 4:
                tips.append("ac")
        elif nivel == "inefficient":
            tips = ["ac", "replace", "night", "led"]
        else:
            tips = ["led", "peak", "appliances"]
        if climate >= 6:
            tips.append("insulation")
        if peak >= 5:
            tips.append("standby")
        if per_person > 180:
            tips.append("solar")
        return list(dict.fromkeys(tips))[:5]

    if tipo == "fabrica_mediana":
        if nivel == "efficient":
            return ["keep", "monitor", "shifts"]
        tips = (
            ["motors", "replace", "loadBalancing"]
            if nivel == "inefficient"
            else ["shifts", "motors", "peak"]
        )
        if _yes(features, "hasCompressedAir"):
            tips.append("compressedAir")
        if str(features.get("processIntensity")) == "alta":
            tips.append("processHeat")
        if _num(features, "turnos") >= 3 or _num(features, "hoursPerDay") >= 16:
            tips.append("night")
        return list(dict.fromkeys(tips))[:5]

    if nivel == "efficient":
        tips = ["keep", "monitor", "predictive"]
        if not _yes(features, "hasMonitoring"):
            tips.append("scada")
        return tips[:4]

    tips = (
        ["idleLines", "predictive", "schedules", "capacity"]
        if nivel == "inefficient"
        else ["schedules", "idleLines", "motors"]
    )
    if not _yes(features, "hasMonitoring"):
        tips.append("scada")
    capacity = _num(features, "capacityPct")
    if 0 < capacity < 60:
        tips.append("capacity")
    if _num(features, "lineas") >= 4 or _num(features, "operatingDays") >= 26:
        tips.append("peak")
    if _yes(features, "hasCompressedAir"):
        tips.append("compressedAir")
    return list(dict.fromkeys(tips))[:5]
