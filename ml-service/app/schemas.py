from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    userId: str | None = None
    features: dict[str, Any] = Field(..., min_length=1)


class PredictionResponse(BaseModel):
    userId: str | None = None
    category: str
    nivelKey: str
    confidence: float
    ahorro: int
    tipKeys: list[str] = Field(default_factory=list)
    benchmark: float
