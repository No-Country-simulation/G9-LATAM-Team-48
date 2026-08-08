from __future__ import annotations

import logging
import os
import urllib.error
import urllib.request
from pathlib import Path

from app.config import MODELS_DIR, resolve_model_path
from app.v3_bundle import (
    V3_COLUMNS_FILE,
    V3_ENCODER_FILE,
    V3_MODEL_FILE,
    v3_bundle_paths,
)

log = logging.getLogger(__name__)

USER_AGENT = "EnergIA-ml-service/1.0"


def _download(url: str, dest: Path, timeout: int = 180) -> bool:
    dest.parent.mkdir(parents=True, exist_ok=True)
    log.info("Descargando %s → %s", url, dest)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=timeout) as response:
            data = response.read()
        dest.write_bytes(data)
        log.info("OK %s (%s bytes)", dest.name, len(data))
        return True
    except (urllib.error.URLError, OSError, TimeoutError) as ex:
        log.error("Fallo descarga %s: %s", url, ex)
        return False


def _url_for(filename: str) -> str:
    """URL explícita por archivo o MODEL_V3_BASE_URL + nombre."""
    env_key = {
        V3_COLUMNS_FILE: "MODEL_V3_COLUMNS_URL",
        V3_ENCODER_FILE: "MODEL_V3_ENCODER_URL",
        V3_MODEL_FILE: "MODEL_V3_MODEL_URL",
    }[filename]
    explicit = (os.getenv(env_key) or "").strip()
    if explicit:
        return explicit
    base = (os.getenv("MODEL_V3_BASE_URL") or os.getenv("ML_MODEL_V3_BASE_URL") or "").strip().rstrip("/")
    if base:
        return f"{base}/{filename}"
    return ""


def ensure_v3_bundle(models_dir: Path | None = None) -> bool:
    """
    Descarga los 3 .joblib v3 si faltan y hay URLs configuradas.
    Returns True si el trio queda completo en disco.
    """
    directory = models_dir or MODELS_DIR
    if v3_bundle_paths(directory) is not None:
        return True

    pending = [name for name in (V3_COLUMNS_FILE, V3_ENCODER_FILE, V3_MODEL_FILE) if not (directory / name).is_file()]
    if not pending:
        return v3_bundle_paths(directory) is not None

    for filename in pending:
        url = _url_for(filename)
        if not url:
            continue
        _download(url, directory / filename)

    return v3_bundle_paths(directory) is not None


def ensure_legacy_model_file() -> None:
    """MODEL_URL → un solo pipeline (model.joblib) si no hay bundle v3."""
    if v3_bundle_paths(MODELS_DIR) is not None:
        return

    path = resolve_model_path()
    if path.is_file():
        return

    url = (os.getenv("MODEL_URL") or os.getenv("ML_MODEL_URL") or "").strip()
    if not url:
        return

    _download(url, path)


def ensure_model_artifacts() -> None:
    """Arranque: v3 (prioridad) → legacy MODEL_URL."""
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    if ensure_v3_bundle():
        log.info("Artefactos v3 listos en %s", MODELS_DIR)
        return
    ensure_legacy_model_file()
