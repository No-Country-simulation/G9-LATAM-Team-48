from __future__ import annotations

import logging

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse

from app.model_service import ModelNotLoadedError, model_service
from app.schemas import PredictRequest, PredictionResponse

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

app = FastAPI(
    title="EnergIA ML Service",
    description="Inferencia del perfil energético (contrato Spring PredictionResponse).",
    version="1.0.0",
)


@app.on_event("startup")
def _load_model() -> None:
    model_service.load()


@app.get("/health")
def health() -> dict:
    loaded = model_service.is_loaded
    body = {
        "status": "ok" if loaded else "degraded",
        "modelLoaded": loaded,
        "modelPath": str(model_service.model_path) if model_service.model_path else None,
        "schema": model_service.schema if loaded else None,
    }
    if not loaded:
        return JSONResponse(status_code=503, content=body)
    return body


@app.post("/predict", response_model=PredictionResponse)
def predict(body: PredictRequest) -> PredictionResponse:
    try:
        return model_service.predict(body.userId, body.features)
    except ValueError as ex:
        raise HTTPException(status_code=400, detail=str(ex)) from ex
    except ModelNotLoadedError as ex:
        raise HTTPException(status_code=503, detail=str(ex)) from ex
    except Exception as ex:
        log.exception("Error en inferencia")
        raise HTTPException(status_code=500, detail="Error interno en inferencia") from ex
