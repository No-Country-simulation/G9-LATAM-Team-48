# Activa hooks del repo (.githooks). Ejecutar una vez por clon.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

git config core.hooksPath .githooks
Write-Host "OK: core.hooksPath = .githooks (prepare-commit-msg, commit-msg, pre-push)"
Write-Host "Verifica con: git config --get core.hooksPath"
