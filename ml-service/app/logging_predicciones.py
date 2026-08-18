from __future__ import annotations

import json
import logging
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

log = logging.getLogger(__name__)

LOGS_DIR = Path(__file__).resolve().parents[1] / "logs"
DB_PATH = LOGS_DIR / "predicciones.db"


def inicializar_db() -> None:
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS predicciones (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                http_status INTEGER NOT NULL,
                codigo_error TEXT,
                nivel_predicho TEXT,
                confianza_pct REAL,
                probabilidades_json TEXT,
                input_json TEXT NOT NULL,
                latencia_ms REAL NOT NULL
            )
            """
        )
        conn.commit()
    finally:
        conn.close()


def registrar_prediccion(
    http_status: int,
    input_dict: dict,
    latencia_ms: float,
    codigo_error: str | None = None,
    nivel_predicho: str | None = None,
    confianza_pct: float | None = None,
    probabilidades: dict | None = None,
) -> None:
    try:
        LOGS_DIR.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(DB_PATH)
        try:
            conn.execute(
                """
                INSERT INTO predicciones
                (timestamp, http_status, codigo_error, nivel_predicho, confianza_pct,
                 probabilidades_json, input_json, latencia_ms)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    datetime.now(timezone.utc).isoformat(),
                    http_status,
                    codigo_error,
                    nivel_predicho,
                    confianza_pct,
                    json.dumps(probabilidades, ensure_ascii=False) if probabilidades else None,
                    json.dumps(input_dict, ensure_ascii=False),
                    latencia_ms,
                ),
            )
            conn.commit()
        finally:
            conn.close()
    except Exception:
        log.debug("No se pudo registrar predicción", exc_info=True)
