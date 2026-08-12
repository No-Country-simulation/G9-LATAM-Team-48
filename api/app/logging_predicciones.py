import json
import os
import sqlite3
from datetime import datetime, timezone

RUTA_DB = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "logs", "predicciones.db"))


def inicializar_db():
    conn = sqlite3.connect(RUTA_DB)
    conn.execute("""
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
    """)
    conn.commit()
    conn.close()


def registrar_prediccion(http_status, input_dict, latencia_ms, codigo_error=None,
                          nivel_predicho=None, confianza_pct=None, probabilidades=None):
    conn = sqlite3.connect(RUTA_DB)
    conn.execute(
        """INSERT INTO predicciones
           (timestamp, http_status, codigo_error, nivel_predicho, confianza_pct, probabilidades_json, input_json, latencia_ms)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            datetime.now(timezone.utc).isoformat(),
            http_status,
            codigo_error,
            nivel_predicho,
            confianza_pct,
            json.dumps(probabilidades, ensure_ascii=False) if probabilidades else None,
            json.dumps(input_dict, ensure_ascii=False),
            latencia_ms,
        )
    )
    conn.commit()
    conn.close()