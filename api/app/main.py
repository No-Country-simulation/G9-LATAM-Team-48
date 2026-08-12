from app.model_loader import metadata
from fastapi import FastAPI

app = FastAPI(title="EnergIA - Servicio de Predicción de Perfil Energético", version="v3")


@app.get("/api/v3/health")
def health():
    return {"status": "ok", "version": "v3"}


@app.get("/api/v3/info")
def info():
    return metadata

import time

import pandas as pd
from app.logging_predicciones import inicializar_db, registrar_prediccion
from app.model_loader import CLASES, pipeline
from app.schemas import RespuestaPrediccion, SolicitudPrediccion
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


@app.on_event("startup")
def al_iniciar():
    inicializar_db()


@app.exception_handler(RequestValidationError)
async def manejador_errores_validacion(request: Request, exc: RequestValidationError):
    inicio = time.perf_counter()
    primer_error = exc.errors()[0]
    campo = primer_error["loc"][-1] if primer_error["loc"] else None
    tipo = primer_error["type"]

    if tipo == "missing":
        codigo = "CAMPO_FALTANTE"
        mensaje = f"Falta el campo obligatorio '{campo}'"
    elif tipo in ("greater_than_equal", "less_than_equal", "greater_than", "less_than"):
        codigo = "VALOR_FUERA_DE_RANGO"
        mensaje = f"El campo '{campo}' está fuera del rango permitido"
    else:
        codigo = "CAMPO_INVALIDO"
        mensaje = primer_error["msg"]

    try:
        cuerpo_crudo = await request.json()
    except Exception:
        cuerpo_crudo = {}

    registrar_prediccion(
        http_status=400,
        input_dict=cuerpo_crudo,
        latencia_ms=round((time.perf_counter() - inicio) * 1000, 2),
        codigo_error=codigo,
    )

    return JSONResponse(
        status_code=400,
        content={"error": {"codigo": codigo, "mensaje": mensaje, "campo": str(campo) if campo else None}}
    )


@app.post("/api/v3/predict", response_model=RespuestaPrediccion)
def predict(solicitud: SolicitudPrediccion):
    inicio = time.perf_counter()
    datos_entrada = solicitud.model_dump(mode="json")

    try:
        datos = pd.DataFrame([datos_entrada])
        probas = pipeline.predict_proba(datos)[0]
        idx_predicho = probas.argmax()

        nivel = CLASES[idx_predicho]
        confianza = round(float(probas[idx_predicho]) * 100, 1)
        probabilidades = {clase: round(float(p) * 100, 1) for clase, p in zip(CLASES, probas)}

        registrar_prediccion(
            http_status=200,
            input_dict=datos_entrada,
            latencia_ms=round((time.perf_counter() - inicio) * 1000, 2),
            nivel_predicho=nivel,
            confianza_pct=confianza,
            probabilidades=probabilidades,
        )

        return RespuestaPrediccion(nivel=nivel, confianza_pct=confianza, probabilidades=probabilidades)

    except Exception:
        registrar_prediccion(
            http_status=500,
            input_dict=datos_entrada,
            latencia_ms=round((time.perf_counter() - inicio) * 1000, 2),
            codigo_error="ERROR_INTERNO_MODELO",
        )
        return JSONResponse(
            status_code=500,
            content={"error": {"codigo": "ERROR_INTERNO_MODELO", "mensaje": "Error inesperado al ejecutar el modelo"}}
        )