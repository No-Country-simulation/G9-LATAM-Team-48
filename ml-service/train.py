"""Generate synthetic energy data and train a RandomForest classifier."""

from __future__ import annotations

import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parent
ARTIFACTS = ROOT / "artifacts"
RNG = np.random.default_rng(42)

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

TIPO_MAP = {"casa": 0, "fabrica_mediana": 1, "fabrica_grande": 2}
INTENSITY_MAP = {"baja": 0, "media": 1, "alta": 2}
LABELS = ["efficient", "moderate", "inefficient"]


def benchmark(row: dict) -> float:
    tipo = row["tipo"]
    if tipo == "casa":
        return 300 * 0.45 + row["personas"] * 55 + row["area"] * 1.2 + row["climateHours"] * 25
    if tipo == "fabrica_mediana":
        intensity = {"baja": 0.8, "media": 1.0, "alta": 1.25}[row["processIntensity"]]
        return max(row["maquinas"] * 280 * (row["hoursPerDay"] / 8) * intensity, 3200)
    capacity = min(max(row["capacityPct"], 20), 100) / 100
    return max(
        row["lineas"] * 6500 * (row["operatingDays"] / 22) * capacity + row["area"] * 1.5,
        15750,
    )


def label_for(row: dict, bench: float) -> str:
    consumo = row["consumo"]
    tipo = row["tipo"]
    ratio = consumo / max(bench, 1)

    if tipo == "casa":
        per_person = consumo / max(row["personas"], 1)
        if per_person > 200 or ratio > 1.3:
            return "inefficient"
        if per_person < 90 and ratio < 0.9:
            return "efficient"
    elif tipo == "fabrica_mediana":
        per_mh = consumo / max(row["maquinas"] * max(row["hoursPerDay"], 1), 1)
        ref = bench / max(row["maquinas"] * max(row["hoursPerDay"], 1), 1)
        if per_mh > ref * 1.3:
            return "inefficient"
        if per_mh < ref * 0.8:
            return "efficient"
    else:
        per_m2 = consumo / max(row["area"], 1)
        ref = bench / max(row["area"], 1)
        if per_m2 > ref * 1.35:
            return "inefficient"
        if per_m2 < ref * 0.75:
            return "efficient"

    if ratio < 0.85:
        return "efficient"
    if ratio > 1.25:
        return "inefficient"
    return "moderate"


def sample_row(tipo: str) -> dict:
    if tipo == "casa":
        personas = int(RNG.integers(1, 8))
        area = float(RNG.uniform(35, 220))
        climate = float(RNG.uniform(0, 14))
        row = {
            "tipo": tipo,
            "personas": personas,
            "equipos": int(RNG.integers(2, 25)),
            "area": area,
            "climateHours": climate,
            "peakUseHours": float(RNG.uniform(0, 12)),
            "turnos": 0,
            "maquinas": 0,
            "hoursPerDay": 0,
            "processIntensity": "media",
            "hasCompressedAir": 0,
            "lineas": 0,
            "operatingDays": 0,
            "capacityPct": 0,
            "hasMonitoring": 0,
        }
        bench = benchmark(row)
        noise = float(RNG.uniform(0.55, 1.7))
        row["consumo"] = max(80, bench * noise + float(RNG.normal(0, 40)))
        return row

    if tipo == "fabrica_mediana":
        maquinas = int(RNG.integers(5, 60))
        hours = float(RNG.uniform(6, 24))
        intensity = str(RNG.choice(["baja", "media", "alta"]))
        row = {
            "tipo": tipo,
            "personas": 0,
            "equipos": 0,
            "area": float(RNG.uniform(400, 4000)),
            "climateHours": 0,
            "peakUseHours": 0,
            "turnos": int(RNG.integers(1, 4)),
            "maquinas": maquinas,
            "hoursPerDay": hours,
            "processIntensity": intensity,
            "hasCompressedAir": int(RNG.integers(0, 2)),
            "lineas": 0,
            "operatingDays": 0,
            "capacityPct": 0,
            "hasMonitoring": 0,
        }
        bench = benchmark(row)
        noise = float(RNG.uniform(0.5, 1.8))
        row["consumo"] = max(500, bench * noise + float(RNG.normal(0, 400)))
        return row

    lineas = int(RNG.integers(2, 12))
    area = float(RNG.uniform(2000, 20000))
    days = int(RNG.integers(15, 31))
    capacity = float(RNG.uniform(35, 100))
    row = {
        "tipo": tipo,
        "personas": 0,
        "equipos": 0,
        "area": area,
        "climateHours": 0,
        "peakUseHours": 0,
        "turnos": int(RNG.integers(1, 4)),
        "maquinas": int(RNG.integers(20, 200)),
        "hoursPerDay": float(RNG.uniform(8, 24)),
        "processIntensity": "media",
        "hasCompressedAir": int(RNG.integers(0, 2)),
        "lineas": lineas,
        "operatingDays": days,
        "capacityPct": capacity,
        "hasMonitoring": int(RNG.integers(0, 2)),
    }
    bench = benchmark(row)
    noise = float(RNG.uniform(0.5, 1.85))
    row["consumo"] = max(2000, bench * noise + float(RNG.normal(0, 2000)))
    return row


def build_dataset(n: int = 6000) -> pd.DataFrame:
    rows = []
    tipos = ["casa", "fabrica_mediana", "fabrica_grande"]
    for _ in range(n):
        tipo = str(RNG.choice(tipos))
        row = sample_row(tipo)
        bench = benchmark(row)
        row["benchmark"] = bench
        row["label"] = label_for(row, bench)
        rows.append(row)
    return pd.DataFrame(rows)


def to_features(df: pd.DataFrame) -> pd.DataFrame:
    out = pd.DataFrame()
    out["tipo_code"] = df["tipo"].map(TIPO_MAP).astype(float)
    out["consumo"] = df["consumo"].astype(float)
    out["personas"] = df["personas"].astype(float)
    out["equipos"] = df["equipos"].astype(float)
    out["area"] = df["area"].astype(float)
    out["climateHours"] = df["climateHours"].astype(float)
    out["peakUseHours"] = df["peakUseHours"].astype(float)
    out["turnos"] = df["turnos"].astype(float)
    out["maquinas"] = df["maquinas"].astype(float)
    out["hoursPerDay"] = df["hoursPerDay"].astype(float)
    out["processIntensity_code"] = df["processIntensity"].map(INTENSITY_MAP).fillna(1).astype(float)
    out["hasCompressedAir"] = df["hasCompressedAir"].astype(float)
    out["lineas"] = df["lineas"].astype(float)
    out["operatingDays"] = df["operatingDays"].astype(float)
    out["capacityPct"] = df["capacityPct"].astype(float)
    out["hasMonitoring"] = df["hasMonitoring"].astype(float)
    return out[FEATURE_COLUMNS]


def train() -> None:
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    df = build_dataset(6000)
    X = to_features(df)
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    pipe = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            (
                "model",
                RandomForestClassifier(
                    n_estimators=180,
                    max_depth=12,
                    random_state=42,
                    n_jobs=-1,
                    class_weight="balanced",
                ),
            ),
        ]
    )
    pipe.fit(X_train, y_train)
    preds = pipe.predict(X_test)
    report = classification_report(y_test, preds, digits=3)
    print(report)

    model_path = ARTIFACTS / "energy_classifier.joblib"
    meta_path = ARTIFACTS / "model_meta.json"
    joblib.dump(pipe, model_path)
    meta_path.write_text(
        json.dumps(
            {
                "features": FEATURE_COLUMNS,
                "labels": LABELS,
                "tipo_map": TIPO_MAP,
                "intensity_map": INTENSITY_MAP,
                "samples": int(len(df)),
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"Saved {model_path}")
    print(f"Saved {meta_path}")


if __name__ == "__main__":
    train()
