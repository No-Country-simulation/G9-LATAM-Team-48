from __future__ import annotations

import logging
import time

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.logging_predicciones import inicializar_db, registrar_prediccion
from app.model_bootstrap import ensure_model_artifacts
from app.model_service import ModelNotLoadedError, model_service
from app.schemas import PredictRequest, PredictionResponse, SolicitudPrediccion

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

app = FastAPI(
    title="EnergIA ML Service",
    description=(
        "Inferencia del perfil energético. Contrato Spring en POST /predict; "
        "paridad datascience en /api/v3/* (mismo modelo v3)."
    ),
    version="3.0.0",
)


@app.on_event("startup")
def _load_model() -> None:
    ensure_model_artifacts()
    model_service.load()
    inicializar_db()
    if model_service.is_loaded and model_service.schema != "v3_bundle":
        log.warning(
            "Modelo activo con schema=%s (esperado v3_bundle): faltan artefactos v3 en la imagen "
            "y las predicciones no corresponden al modelo entrenado.",
            model_service.schema,
        )


def _health_body() -> dict:
    loaded = model_service.is_loaded
    return {
        "status": "ok" if loaded else "degraded",
        "version": "v3",
        "modelLoaded": loaded,
        "modelPath": str(model_service.model_path) if model_service.model_path else None,
        "schema": model_service.schema if loaded else None,
        "v3Bundle": model_service.schema == "v3_bundle",
    }


@app.get("/health")
@app.get("/api/v3/health")
def health() -> dict:
    body = _health_body()
    if not body["modelLoaded"]:
        return JSONResponse(status_code=503, content=body)
    return body


@app.get("/info")
@app.get("/api/v3/info")
def info() -> dict:
    meta = dict(model_service.metadata)
    meta.update(
        {
            "schema": model_service.schema,
            "modelLoaded": model_service.is_loaded,
            "modelPath": str(model_service.model_path) if model_service.model_path else None,
            "v3Bundle": model_service.schema == "v3_bundle",
        }
    )
    return meta


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    inicio = time.perf_counter()
    primer = exc.errors()[0] if exc.errors() else {}
    campo = primer.get("loc", [None])[-1]
    tipo = primer.get("type", "")

    if tipo == "missing":
        codigo = "CAMPO_FALTANTE"
        mensaje = f"Falta el campo obligatorio '{campo}'"
    elif tipo in ("greater_than_equal", "less_than_equal", "greater_than", "less_than"):
        codigo = "VALOR_FUERA_DE_RANGO"
        mensaje = f"El campo '{campo}' está fuera del rango permitido"
    else:
        codigo = "CAMPO_INVALIDO"
        mensaje = primer.get("msg", "Campo inválido")

    try:
        cuerpo = await request.json()
    except Exception:
        cuerpo = {}

    registrar_prediccion(
        http_status=400,
        input_dict=cuerpo if isinstance(cuerpo, dict) else {},
        latencia_ms=round((time.perf_counter() - inicio) * 1000, 2),
        codigo_error=codigo,
    )
    return JSONResponse(
        status_code=400,
        content={"error": {"codigo": codigo, "mensaje": mensaje, "campo": str(campo) if campo else None}},
    )


def _run_predict(user_id: str | None, features: dict) -> PredictionResponse:
    inicio = time.perf_counter()
    try:
        result = model_service.predict(user_id, features)
        registrar_prediccion(
            http_status=200,
            input_dict=features,
            latencia_ms=round((time.perf_counter() - inicio) * 1000, 2),
            nivel_predicho=result.nivel or result.nivelKey,
            confianza_pct=result.confianza_pct,
            probabilidades=result.probabilidades,
        )
        return result
    except ValidationError as ex:
        primer = ex.errors()[0] if ex.errors() else {}
        campo = primer.get("loc", [None])[-1]
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "codigo": "CAMPO_INVALIDO",
                    "mensaje": primer.get("msg", str(ex)),
                    "campo": str(campo) if campo else None,
                }
            },
        ) from ex
    except ValueError as ex:
        registrar_prediccion(
            http_status=400,
            input_dict=features,
            latencia_ms=round((time.perf_counter() - inicio) * 1000, 2),
            codigo_error="CAMPO_INVALIDO",
        )
        raise HTTPException(status_code=400, detail=str(ex)) from ex
    except ModelNotLoadedError as ex:
        raise HTTPException(status_code=503, detail=str(ex)) from ex
    except Exception as ex:
        log.exception("Error en inferencia")
        registrar_prediccion(
            http_status=500,
            input_dict=features,
            latencia_ms=round((time.perf_counter() - inicio) * 1000, 2),
            codigo_error="ERROR_INTERNO_MODELO",
        )
        raise HTTPException(
            status_code=500,
            detail={
                "error": {
                    "codigo": "ERROR_INTERNO_MODELO",
                    "mensaje": "Error inesperado al ejecutar el modelo",
                }
            },
        ) from ex


@app.post("/predict", response_model=PredictionResponse)
def predict(body: PredictRequest) -> PredictionResponse:
    """Contrato Spring (features anidadas)."""
    return _run_predict(body.userId, body.features)


@app.post("/api/v3/predict", response_model=PredictionResponse)
def predict_v3(body: SolicitudPrediccion) -> PredictionResponse:
    """Contrato datascience (12 campos en la raíz); misma respuesta enriquecida."""
    return _run_predict(None, body.as_feature_dict())
