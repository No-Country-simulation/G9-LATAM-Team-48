from __future__ import annotations

from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.features import (
    FEATURE_COLUMNS,
    ahorro_for,
    compute_benchmark,
    features_to_vector,
)
from app.tips import tip_keys

ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = ROOT / "artifacts" / "energy_classifier.joblib"

app = FastAPI(
    title="EnergyAI ML Service",
    description="Clasificador de eficiencia energética (RandomForest)",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_model = None


def get_model():
    global _model
    if _model is None:
        if not MODEL_PATH.exists():
            raise HTTPException(
                status_code=503,
                detail="Modelo no entrenado. Ejecutá: python train.py",
            )
        _model = joblib.load(MODEL_PATH)
    return _model


class PredictRequest(BaseModel):
    userId: str | None = None
    features: dict[str, Any] = Field(default_factory=dict)


class PredictResponse(BaseModel):
    userId: str | None = None
    category: str
    nivelKey: str
    confidence: float
    ahorro: int
    tipKeys: list[str]
    benchmark: float


@app.get("/health")
def health():
    ready = MODEL_PATH.exists()
    return {"status": "ok" if ready else "model_missing", "modelLoaded": ready}


@app.post("/predict", response_model=PredictResponse)
def predict(body: PredictRequest):
    features = body.features or {}
    # Allow flat body style: { "consumo": 380, "tipo": "casa", ... }
    if "consumo" in body.model_dump() and "consumo" not in features:
        raw = body.model_dump(exclude_none=True)
        features = {k: v for k, v in raw.items() if k not in {"userId", "features"}}

    model = get_model()
    vector = features_to_vector(features)
    frame = pd.DataFrame([vector], columns=FEATURE_COLUMNS)
    proba = model.predict_proba(frame)[0]
    classes = list(model.classes_)
    idx = int(proba.argmax())
    nivel = str(classes[idx])
    confidence = float(proba[idx])
    bench = float(compute_benchmark(features))

    return PredictResponse(
        userId=body.userId,
        category=nivel,
        nivelKey=nivel,
        confidence=round(confidence, 4),
        ahorro=ahorro_for(nivel),
        tipKeys=tip_keys(nivel, features),
        benchmark=bench,
    )


@app.post("/analyze", response_model=PredictResponse)
def analyze(body: dict[str, Any]):
    """Accepts the frontend form payload directly."""
    return predict(PredictRequest(features=body))
