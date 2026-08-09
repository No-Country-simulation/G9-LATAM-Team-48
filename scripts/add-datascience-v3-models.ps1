# Añade el trio v3 desde datascience/models al repo (git add -f)
$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent $PSScriptRoot
$models = Join-Path $repo "datascience\models"
$names = @(
    "columnas_requeridas_final_v3.joblib",
    "label_encoder_v3.joblib",
    "modelo_perfil_energetico_final_v3.joblib"
)

$missing = @()
foreach ($n in $names) {
    if (-not (Test-Path (Join-Path $models $n))) { $missing += $n }
}
if ($missing.Count -gt 0) {
    Write-Host "Faltan en datascience/models:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "  $_" }
    Write-Host ""
    Write-Host "Exportá desde notebooks/06_Modelos.ipynb a ..\models\ (carpeta datascience/models)."
    exit 1
}

Set-Location $repo
foreach ($n in $names) {
    git add -f "datascience/models/$n"
    Write-Host "staged datascience/models/$n"
}

Write-Host ""
Write-Host "Siguiente: git commit -m 'chore(ml): versionar artefactos v3 en datascience/models'"
Write-Host "Luego: .\ml-service\scripts\copy-v3-models.ps1  (opcional, copia a ml-service/models)"
