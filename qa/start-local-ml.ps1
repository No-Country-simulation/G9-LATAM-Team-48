# ML local (puerto 8000) — backend: PREDICTION_API_BASE_URL=http://localhost:8000
$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent $PSScriptRoot
$ml = Join-Path $repo "ml-service"
$envFile = Join-Path $ml ".env"

if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
            Set-Item -Path "Env:$($Matches[1])" -Value $Matches[2].Trim().Trim('"')
        }
    }
}

$trio = @(
    "columnas_requeridas_final_v3.joblib",
    "label_encoder_v3.joblib",
    "modelo_perfil_energetico_final_v3.joblib"
)
$modelsDir = Join-Path $ml "models"
$hasV3 = ($trio | ForEach-Object { Test-Path (Join-Path $modelsDir $_) }) -notcontains $false
$hasLegacy = Test-Path (Join-Path $modelsDir "model.joblib")

if (-not $hasV3 -and -not $hasLegacy) {
    Write-Host "Sin modelos en ml-service/models. Ejecutá: ml-service/scripts/copy-v3-models.ps1" -ForegroundColor Yellow
}

Write-Host "ML local → http://localhost:8000/health (schema v3_bundle esperado con trio v3)"
Set-Location $ml
$env:PYTHONPATH = "."
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
