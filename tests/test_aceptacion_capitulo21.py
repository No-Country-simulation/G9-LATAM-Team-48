import os
import sys

import pandas as pd
import pytest
from fastapi.testclient import TestClient

RAIZ_PROYECTO = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(os.path.join(RAIZ_PROYECTO, "api"))

from api.app import model_loader
from api.app.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="module")
def dataset():
    ruta = os.path.join(RAIZ_PROYECTO, "datasets", "processed", "03_feature_engineering.csv")
    return pd.read_csv(ruta, sep=",", encoding="utf-8-sig")


def onehot_a_categoria(fila, prefijo, categorias):
    for cat in categorias:
        if fila[f"{prefijo}_{cat}"] == 1:
            return cat
    return None


def construir_payload(fila):
    return {
        "tipo_inmueble": onehot_a_categoria(fila, "tipo_inmueble",
            ["Apartamento", "Casa Unifamiliar", "Pequeño Establecimiento Comercial"]),
        "superficie_m2": float(fila["superficie_m2"]),
        "num_personas": int(fila["num_personas"]),
        "cantidad_equipos_total": int(fila["cantidad_equipos_total"]),
        "horas_uso_aa_dia": float(fila["horas_uso_aa_dia"]),
        "consumo_kwh_mensual": float(fila["consumo_kwh_mensual"]),
        "consumo_kwh_mes_anterior": float(fila["consumo_kwh_mes_anterior"]),
        "aislamiento_termico": onehot_a_categoria(fila, "aislamiento_termico", ["Bueno", "Malo", "Regular"]),
        "pct_iluminacion_led": float(fila["pct_iluminacion_led"]),
        "antiguedad_construccion_anios": float(fila["antiguedad_construccion_anios"]),
        "zona": onehot_a_categoria(fila, "zona", ["Suburbana", "Urbana Costera", "Urbana Interior"]),
        "antiguedad_electrodomesticos_anios": float(fila["antiguedad_electrodomesticos_anios"]),
    }


# Casos de estudio documentados en reports/model_interpretation/ (Capítulo 17)
CASOS_DOCUMENTADOS = [
    {"indice": 73863, "nivel_esperado": "Eficiente", "confianza_esperada": 99.69},
    {"indice": 45695, "nivel_esperado": "Ineficiente", "confianza_esperada": 99.82},
    {"indice": 90191, "nivel_esperado": "Moderado", "confianza_esperada": 98.07},
]


@pytest.mark.parametrize("caso", CASOS_DOCUMENTADOS, ids=[c["nivel_esperado"] for c in CASOS_DOCUMENTADOS])
def test_no_regresion_casos_shap(client, dataset, caso):
    """Checklist Cap. 21, punto 4: el modelo servido coincide con lo documentado en la interpretación."""
    fila = dataset.loc[caso["indice"]]
    payload = construir_payload(fila)

    respuesta = client.post("/api/v3/predict", json=payload)
    assert respuesta.status_code == 200

    cuerpo = respuesta.json()
    assert cuerpo["nivel"] == caso["nivel_esperado"]
    assert abs(cuerpo["confianza_pct"] - caso["confianza_esperada"]) < 0.5


def test_probabilidades_suman_100(client, dataset):
    """Checklist Cap. 21, punto 3: verificado sobre un lote, no un solo caso suelto."""
    for caso in CASOS_DOCUMENTADOS:
        fila = dataset.loc[caso["indice"]]
        payload = construir_payload(fila)
        respuesta = client.post("/api/v3/predict", json=payload)
        total = sum(respuesta.json()["probabilidades"].values())
        assert abs(total - 100.0) < 0.2


def test_error_interno_modelo(client, monkeypatch):
    """Checklist Cap. 21, punto 2 (el código de error que faltaba probar: ERROR_INTERNO_MODELO)."""
    def predict_proba_roto(self, X):
        raise RuntimeError("Fallo simulado para prueba de aceptación")

    monkeypatch.setattr(model_loader.pipeline.__class__, "predict_proba", predict_proba_roto)

    payload = {
        "tipo_inmueble": "Casa Unifamiliar", "superficie_m2": 120.5, "num_personas": 4,
        "cantidad_equipos_total": 12, "horas_uso_aa_dia": 6.5, "consumo_kwh_mensual": 450.0,
        "consumo_kwh_mes_anterior": 430.0, "aislamiento_termico": "Regular",
        "pct_iluminacion_led": 65.0, "antiguedad_construccion_anios": 15,
        "zona": "Urbana Interior", "antiguedad_electrodomesticos_anios": 8,
    }
    respuesta = client.post("/api/v3/predict", json=payload)
    assert respuesta.status_code == 500
    assert respuesta.json()["error"]["codigo"] == "ERROR_INTERNO_MODELO"