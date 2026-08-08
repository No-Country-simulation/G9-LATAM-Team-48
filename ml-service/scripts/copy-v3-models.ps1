# Copia el trio v3 desde la carpeta models del datascience (o ruta custom) a ml-service/models/
param(
    [string]$SourceDir = "",
    [switch]$WhatIf
)

$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$dest = Join-Path $repo "ml-service\models"

$files = @(
    "columnas_requeridas_final_v3.joblib",
    "label_encoder_v3.joblib",
    "modelo_perfil_energetico_final_v3.joblib"
)

if (-not $SourceDir) {
    $candidates = @(
        (Join-Path $repo "datascience\models"),
        (Join-Path $repo "ml-service\models"),
        (Join-Path $repo "models")
    )
    foreach ($c in $candidates) {
        $probe = Join-Path $c $files[0]
        if (Test-Path $probe) {
            $SourceDir = $c
            break
        }
    }
}

if (-not $SourceDir -or -not (Test-Path $SourceDir)) {
    Write-Host "No se encontró carpeta con columnas_requeridas_final_v3.joblib."
    Write-Host "Uso: .\scripts\copy-v3-models.ps1 -SourceDir 'C:\ruta\a\models'"
    exit 1
}

Write-Host "Origen : $SourceDir"
Write-Host "Destino: $dest"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$missing = @()
foreach ($name in $files) {
    $src = Join-Path $SourceDir $name
    $dst = Join-Path $dest $name
    if (-not (Test-Path $src)) {
        $missing += $name
        continue
    }
    if ($WhatIf) {
        Write-Host "Copiaría $name"
    } else {
        Copy-Item -Force $src $dst
        Write-Host "OK $name"
    }
}

if ($missing.Count -gt 0) {
    Write-Host "Faltan en origen: $($missing -join ', ')" -ForegroundColor Yellow
    exit 1
}

if (-not $WhatIf) {
    Write-Host ""
    Write-Host "Verificación:"
    Push-Location (Join-Path $repo "ml-service")
    $env:PYTHONPATH = "."
    python scripts/inspect_v3_bundle.py
    Pop-Location
}
