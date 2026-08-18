from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class TipoInmueble(str, Enum):
    apartamento = "Apartamento"
    casa_unifamiliar = "Casa Unifamiliar"
    pequeno_comercial = "Pequeño Establecimiento Comercial"


class AislamientoTermico(str, Enum):
    bueno = "Bueno"
    malo = "Malo"
    regular = "Regular"


class Zona(str, Enum):
    suburbana = "Suburbana"
    urbana_costera = "Urbana Costera"
    urbana_interior = "Urbana Interior"


class PredictRequest(BaseModel):
    """Contrato Spring: features anidadas."""

    userId: str | None = None
    features: dict[str, Any] = Field(..., min_length=1)


class FeaturesV3(BaseModel):
    """12 features crudas del formulario (contrato datascience)."""

    model_config = ConfigDict(extra="ignore")

    tipo_inmueble: TipoInmueble
    superficie_m2: float = Field(ge=0)
    num_personas: int = Field(ge=1)
    cantidad_equipos_total: int = Field(ge=0)
    horas_uso_aa_dia: float = Field(ge=0, le=24)
    consumo_kwh_mensual: float = Field(ge=0)
    consumo_kwh_mes_anterior: float = Field(ge=0)
    aislamiento_termico: AislamientoTermico
    pct_iluminacion_led: float = Field(ge=0, le=100)
    antiguedad_construccion_anios: float = Field(ge=0)
    zona: Zona
    antiguedad_electrodomesticos_anios: float = Field(ge=0)

    @field_validator("num_personas", "cantidad_equipos_total", mode="before")
    @classmethod
    def _as_int(cls, value: Any) -> Any:
        if isinstance(value, bool):
            raise TypeError("valor booleano no válido")
        if isinstance(value, float) and value.is_integer():
            return int(value)
        return value

    def as_feature_dict(self) -> dict[str, Any]:
        return self.model_dump(mode="json")


class SolicitudPrediccion(FeaturesV3):
    """Body plano estilo API datascience: POST /api/v3/predict."""

    model_config = ConfigDict(extra="forbid")


class PredictionResponse(BaseModel):
    """Contrato Spring + campos extras alineados a datascience."""

    userId: str | None = None
    category: str
    nivelKey: str
    confidence: float
    ahorro: int
    tipKeys: list[str] = Field(default_factory=list)
    benchmark: float
    # Paridad con API datascience (opcionales; Spring los ignora si no los mapea)
    nivel: str | None = None
    confianza_pct: float | None = None
    probabilidades: dict[str, float] | None = None
    schema: str | None = None
