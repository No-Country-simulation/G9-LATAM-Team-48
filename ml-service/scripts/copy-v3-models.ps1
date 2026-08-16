# Copia el trio v3 desde datascience/models (o ruta custom) a ml-service/models/
# Acepta model_pipeline_v3.joblib (export DS) y lo copia como modelo_perfil_energetico_final_v3.joblib
param(
    [string]$SourceDir = "",
    [switch]$WhatIf
)

$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$dest = Join-Path $repo "ml-service\models"

$canonical = @(
    "columnas_requeridas_final_v3.joblib",
    "label_encoder_v3.joblib",
    "modelo_perfil_energetico_final_v3.joblib"
)

function Resolve-ModelSource([string]$dir) {
    $perfil = Join-Path $dir "modelo_perfil_energetico_final_v3.joblib"
    $pipeline = Join-Path $dir "model_pipeline_v3.joblib"
    if (Test-Path $perfil) { return $perfil }
    if (Test-Path $pipeline) { return $pipeline }
    return $null
}

if (-not $SourceDir) {
    $candidates = @(
        (Join-Path $repo "datascience\models"),
        (Join-Path $repo "ml-service\models"),
        (Join-Path $repo "models")
    )
    foreach ($c in $candidates) {
        $probe = Join-Path $c "columnas_requeridas_final_v3.joblib"
        if ((Test-Path $probe) -and (Resolve-ModelSource $c)) {
            $SourceDir = $c
            break
        }
    }
}

if (-not $SourceDir -or -not (Test-Path $SourceDir)) {
    Write-Host "No se encontró carpeta con columnas_requeridas_final_v3.joblib + pipeline/perfil."
    Write-Host "Uso: .\scripts\copy-v3-models.ps1 -SourceDir 'C:\ruta\a\models'"
    exit 1
}

Write-Host "Origen : $SourceDir"
Write-Host "Destino: $dest"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$missing = @()
foreach ($name in $canonical) {
    $dst = Join-Path $dest $name
    if ($name -eq "modelo_perfil_energetico_final_v3.joblib") {
        $src = Resolve-ModelSource $SourceDir
        if (-not $src) {
            $missing += "$name (ni model_pipeline_v3.joblib)"
            continue
        }
    } else {
        $src = Join-Path $SourceDir $name
        if (-not (Test-Path $src)) {
            $missing += $name
            continue
        }
    }
    if ($WhatIf) {
        Write-Host "Copiaría $(Split-Path $src -Leaf) -> $name"
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
