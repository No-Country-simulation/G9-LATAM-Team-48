#!/usr/bin/env sh
# Activa hooks del repo (.githooks). Ejecutar una vez por clon.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
git config core.hooksPath .githooks
echo "OK: core.hooksPath = .githooks (prepare-commit-msg, commit-msg, pre-push)"
echo "Verifica con: git config --get core.hooksPath"
