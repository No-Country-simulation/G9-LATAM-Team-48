from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


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


class SolicitudPrediccion(BaseModel):
    model_config = ConfigDict(extra="forbid")  # rechaza campos no definidos en el contrato (Cap. 20)

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


class RespuestaPrediccion(BaseModel):
    nivel: str
    confianza_pct: float
    probabilidades: dict[str, float]


class DetalleError(BaseModel):
    codigo: str
    mensaje: str
    campo: str | None = None


class RespuestaError(BaseModel):
    error: DetalleError