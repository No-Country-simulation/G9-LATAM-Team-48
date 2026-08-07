from __future__ import annotations

import logging
import os
import urllib.error
import urllib.request
from pathlib import Path

from app.config import resolve_model_path

log = logging.getLogger(__name__)


def ensure_model_file() -> None:
    """
    Si MODEL_URL está definida y el archivo local no existe, lo descarga a MODEL_PATH
    (o la ruta resuelta por resolve_model_path).
    """
    path = resolve_model_path()
    if path.is_file():
        return

    url = (os.getenv("MODEL_URL") or os.getenv("ML_MODEL_URL") or "").strip()
    if not url:
        return

    path.parent.mkdir(parents=True, exist_ok=True)
    log.info("Descargando modelo desde MODEL_URL hacia %s", path)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "EnergIA-ml-service/1.0"})
        with urllib.request.urlopen(req, timeout=120) as response:
            data = response.read()
        path.write_bytes(data)
        log.info("Modelo descargado (%s bytes)", len(data))
    except (urllib.error.URLError, OSError, TimeoutError) as ex:
        log.error("No se pudo descargar MODEL_URL: %s", ex)
