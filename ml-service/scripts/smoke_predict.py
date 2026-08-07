#!/usr/bin/env python3
"""Smoke test local o contra URL desplegada: python scripts/smoke_predict.py [BASE_URL]"""

from __future__ import annotations

import json
import sys
import urllib.error
import urllib.request

SAMPLE = {
    "userId": "smoke-test",
    "features": {
        "tipo_inmueble": "Casa Unifamiliar",
        "superficie_m2": 80,
        "num_personas": 3,
        "cantidad_equipos_total": 6,
        "horas_uso_aa_dia": 2,
        "consumo_kwh_mensual": 380,
        "consumo_kwh_mes_anterior": 360,
        "aislamiento_termico": "Regular",
        "pct_iluminacion_led": 40,
        "antiguedad_construccion_anios": 15,
        "zona": "Urbana Interior",
        "antiguedad_electrodomesticos_anios": 5,
    },
}


def main() -> int:
    base = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8000").rstrip("/")
    health_url = f"{base}/health"
    predict_url = f"{base}/predict"
    try:
        with urllib.request.urlopen(health_url, timeout=30) as resp:
            health = json.loads(resp.read().decode())
        print("health:", json.dumps(health, indent=2))
        if not health.get("modelLoaded"):
            print("FAIL: model not loaded", file=sys.stderr)
            return 1
    except urllib.error.URLError as ex:
        print(f"health failed: {ex}", file=sys.stderr)
        return 1

    body = json.dumps(SAMPLE).encode("utf-8")
    req = urllib.request.Request(
        predict_url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            out = json.loads(resp.read().decode())
        print("predict:", json.dumps(out, indent=2))
        if out.get("nivelKey") not in ("efficient", "moderate", "inefficient"):
            print("FAIL: unexpected nivelKey", file=sys.stderr)
            return 1
    except urllib.error.URLError as ex:
        print(f"predict failed: {ex}", file=sys.stderr)
        return 1
    print("OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
