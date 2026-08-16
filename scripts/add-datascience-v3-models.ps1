# Añade el trio v3 desde datascience/models al repo (git add -f)
$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent $PSScriptRoot
$models = Join-Path $repo "datascience\models"
$names = @(
    "columnas_requeridas_final_v3.joblib",
    "label_encoder_v3.joblib",
    "modelo_perfil_energetico_final_v3.joblib",
    "model_pipeline_v3.joblib",
    "metadata_v3.json",
    "export_log_v3.json",
    "training_config_v3.json"
)

$missing = @()
$required = @(
    "columnas_requeridas_final_v3.joblib",
    "label_encoder_v3.joblib"
)
foreach ($n in $required) {
    if (-not (Test-Path (Join-Path $models $n))) { $missing += $n }
}
$hasModel = (Test-Path (Join-Path $models "modelo_perfil_energetico_final_v3.joblib")) -or
            (Test-Path (Join-Path $models "model_pipeline_v3.joblib"))
if (-not $hasModel) { $missing += "modelo_perfil_energetico_final_v3.joblib|model_pipeline_v3.joblib" }

if ($missing.Count -gt 0) {
    Write-Host "Faltan en datascience/models:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "  $_" }
    exit 1
}

# Si solo está el pipeline, crear alias canónico
$perfil = Join-Path $models "modelo_perfil_energetico_final_v3.joblib"
$pipeline = Join-Path $models "model_pipeline_v3.joblib"
if (-not (Test-Path $perfil) -and (Test-Path $pipeline)) {
    Copy-Item -Force $pipeline $perfil
    Write-Host "Creado alias modelo_perfil_energetico_final_v3.joblib desde pipeline"
}

Set-Location $repo
foreach ($n in $names) {
    $p = Join-Path $models $n
    if (Test-Path $p) {
        git add -f "datascience/models/$n"
        Write-Host "staged datascience/models/$n"
    }
}

Write-Host ""
Write-Host "Siguiente: git commit -m 'chore(ml): versionar artefactos v3 en datascience/models'"
Write-Host "Luego: .\ml-service\scripts\copy-v3-models.ps1  (opcional, copia a ml-service/models)"
