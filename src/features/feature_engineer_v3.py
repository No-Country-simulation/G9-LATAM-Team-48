import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin


def division_segura(numerador, denominador, valor_por_defecto=0):
    numerador = pd.Series(numerador).astype(float)
    denominador = pd.Series(denominador).astype(float)
    resultado = pd.Series(valor_por_defecto, index=numerador.index, dtype=float)
    mascara_valida = denominador.notna() & denominador.ne(0) & numerador.notna()
    resultado.loc[mascara_valida] = numerador.loc[mascara_valida] / denominador.loc[mascara_valida]
    resultado = resultado.replace([np.inf, -np.inf], valor_por_defecto).fillna(valor_por_defecto)
    return resultado


class FeatureEngineerV3(BaseEstimator, TransformerMixin):
    """
    Feature engineering oficial del modelo v3 (EnergIA).
    Traduce las 12 columnas crudas del contrato JSON a las 55 columnas
    que requiere el modelo. Sin parámetros aprendidos (fit() no hace nada).
    Fórmulas verificadas línea por línea contra 05_Feature_Engineering.ipynb.
    """

    def __init__(self, columnas_finales):
        self.columnas_finales = columnas_finales

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        df = X.copy()

        num_personas = pd.to_numeric(df["num_personas"], errors="coerce").fillna(0)
        superficie_m2 = pd.to_numeric(df["superficie_m2"], errors="coerce").fillna(0)
        antiguedad_inmueble = pd.to_numeric(df["antiguedad_construccion_anios"], errors="coerce").fillna(0)
        cantidad_equipos = pd.to_numeric(df["cantidad_equipos_total"], errors="coerce").fillna(0)
        antiguedad_equipos = pd.to_numeric(df["antiguedad_electrodomesticos_anios"], errors="coerce").fillna(0)
        consumo_anterior = pd.to_numeric(df["consumo_kwh_mes_anterior"], errors="coerce").fillna(0)
        horas_uso_aa = pd.to_numeric(df["horas_uso_aa_dia"], errors="coerce").fillna(0)
        consumo_kwh_mensual = pd.to_numeric(df["consumo_kwh_mensual"], errors="coerce").fillna(0)
        pct_led_crudo = pd.to_numeric(df["pct_iluminacion_led"], errors="coerce").fillna(0).clip(lower=0, upper=100)
        porcentaje_led = pct_led_crudo / 100

        apartamento = (df["tipo_inmueble"] == "Apartamento").astype(float)
        casa = (df["tipo_inmueble"] == "Casa Unifamiliar").astype(float)
        comercial = (df["tipo_inmueble"] == "Pequeño Establecimiento Comercial").astype(float)

        aislamiento_bueno = (df["aislamiento_termico"] == "Bueno").astype(float)
        aislamiento_regular = (df["aislamiento_termico"] == "Regular").astype(float)
        aislamiento_malo = (df["aislamiento_termico"] == "Malo").astype(float)

        zona_suburbana = (df["zona"] == "Suburbana").astype(int)
        zona_costera = (df["zona"] == "Urbana Costera").astype(int)
        zona_interior = (df["zona"] == "Urbana Interior").astype(int)

        if "_mes_numero_test" in df.columns:
            mes_numero = pd.to_numeric(df["_mes_numero_test"], errors="coerce").fillna(pd.Timestamp.now().month)
        else:
            mes_numero = pd.Series(pd.Timestamp.now().month, index=df.index)
        mes_sin = np.sin(2 * np.pi * mes_numero / 12)
        mes_cos = np.cos(2 * np.pi * mes_numero / 12)

        factor_aislamiento = aislamiento_malo * 1.30 + aislamiento_regular * 1.00 + aislamiento_bueno * 0.70
        factor_aislamiento = factor_aislamiento.where(factor_aislamiento.gt(0), 1)

        out = pd.DataFrame(index=df.index)

        out["superficie_por_persona"] = division_segura(superficie_m2, num_personas)
        out["densidad_habitacional"] = division_segura(num_personas, superficie_m2)
        out["superficie_por_equipo"] = division_segura(superficie_m2, cantidad_equipos)
        out["personas_por_equipo"] = division_segura(num_personas, cantidad_equipos)

        out["equipos_por_persona"] = division_segura(cantidad_equipos, num_personas)
        out["equipos_por_m2"] = division_segura(cantidad_equipos, superficie_m2)
        out["carga_equipos_antiguos"] = cantidad_equipos * antiguedad_equipos
        out["carga_equipos_antiguos_por_persona"] = division_segura(cantidad_equipos * antiguedad_equipos, num_personas)
        out["indice_obsolescencia_equipos"] = division_segura(antiguedad_equipos, antiguedad_inmueble)
        out["brecha_antiguedad_inmueble_equipos"] = antiguedad_inmueble - antiguedad_equipos
        out["horas_aa_por_persona"] = division_segura(horas_uso_aa, num_personas)

        out["proporcion_iluminacion_led"] = porcentaje_led

        out["consumo_anterior_por_persona"] = division_segura(consumo_anterior, num_personas)
        out["consumo_anterior_por_m2"] = division_segura(consumo_anterior, superficie_m2)
        out["consumo_anterior_por_equipo"] = division_segura(consumo_anterior, cantidad_equipos)
        out["consumo_anterior_comercial"] = consumo_anterior * comercial
        out["consumo_anterior_estacional"] = consumo_anterior * mes_sin

        out["superficie_apartamento"] = superficie_m2 * apartamento
        out["superficie_casa"] = superficie_m2 * casa
        out["superficie_comercial"] = superficie_m2 * comercial
        out["ocupacion_apartamento"] = num_personas * apartamento
        out["ocupacion_casa"] = num_personas * casa
        out["ocupacion_comercial"] = num_personas * comercial
        out["equipos_apartamento"] = cantidad_equipos * apartamento
        out["equipos_casa"] = cantidad_equipos * casa
        out["equipos_comercial"] = cantidad_equipos * comercial

        out["factor_aislamiento"] = factor_aislamiento
        out["antiguedad_aislamiento_malo"] = antiguedad_inmueble * aislamiento_malo
        out["antiguedad_aislamiento_regular"] = antiguedad_inmueble * aislamiento_regular
        out["antiguedad_aislamiento_bueno"] = antiguedad_inmueble * aislamiento_bueno
        out["indice_ineficiencia_constructiva"] = factor_aislamiento * antiguedad_inmueble
        out["inmueble_antiguo"] = (antiguedad_inmueble >= 30).astype(np.int64)
        out["electrodomesticos_antiguos"] = (antiguedad_equipos >= 10).astype(np.int64)
        out["inmueble_y_equipos_antiguos"] = ((antiguedad_inmueble >= 30) & (antiguedad_equipos >= 10)).astype(np.int64)

        out["mes_numero"] = mes_numero.astype(np.int64)
        out["mes_sin"] = mes_sin
        out["mes_cos"] = mes_cos

        out["num_personas"] = num_personas
        out["superficie_m2"] = superficie_m2
        out["antiguedad_construccion_anios"] = antiguedad_inmueble
        out["cantidad_equipos_total"] = cantidad_equipos
        out["horas_uso_aa_dia"] = horas_uso_aa
        out["antiguedad_electrodomesticos_anios"] = antiguedad_equipos
        out["pct_iluminacion_led"] = pct_led_crudo
        out["consumo_kwh_mes_anterior"] = consumo_anterior
        out["consumo_kwh_mensual"] = consumo_kwh_mensual

        out["tipo_inmueble_Apartamento"] = apartamento
        out["tipo_inmueble_Casa Unifamiliar"] = casa
        out["tipo_inmueble_Pequeño Establecimiento Comercial"] = comercial
        out["zona_Suburbana"] = zona_suburbana
        out["zona_Urbana Costera"] = zona_costera
        out["zona_Urbana Interior"] = zona_interior
        out["aislamiento_termico_Bueno"] = aislamiento_bueno
        out["aislamiento_termico_Malo"] = aislamiento_malo
        out["aislamiento_termico_Regular"] = aislamiento_regular

        return out[self.columnas_finales]