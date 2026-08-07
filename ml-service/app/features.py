"""Orden estable de features (contrato Spring AnalisisPayload.toMlFeatureMap)."""

FEATURE_KEYS: tuple[str, ...] = (
    "tipo_inmueble",
    "superficie_m2",
    "num_personas",
    "cantidad_equipos_total",
    "horas_uso_aa_dia",
    "consumo_kwh_mensual",
    "consumo_kwh_mes_anterior",
    "aislamiento_termico",
    "pct_iluminacion_led",
    "antiguedad_construccion_anios",
    "zona",
    "antiguedad_electrodomesticos_anios",
)

NUMERIC_KEYS: frozenset[str] = frozenset(
    {
        "superficie_m2",
        "num_personas",
        "cantidad_equipos_total",
        "horas_uso_aa_dia",
        "consumo_kwh_mensual",
        "consumo_kwh_mes_anterior",
        "pct_iluminacion_led",
        "antiguedad_construccion_anios",
        "antiguedad_electrodomesticos_anios",
    }
)
