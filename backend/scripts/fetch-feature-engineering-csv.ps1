<# Descarga 03_feature_engineering.csv (Git LFS) desde la rama datascience. #>
param(
    [string]$OutDir = (Join-Path $PSScriptRoot "..\..\datascience\datasets\processed")
)

$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$outFile = Join-Path $OutDir "03_feature_engineering.csv"
$url = "https://media.githubusercontent.com/media/No-Country-simulation/G9-LATAM-Team-48/datascience/datasets/processed/03_feature_engineering.csv"

Write-Host "Descargando CSV (~150 MB)..."
curl.exe -L --fail -o $outFile $url
$size = (Get-Item $outFile).Length
if ($size -lt 1MB) {
    throw "Archivo demasiado pequeno ($size bytes). Revisa red o LFS."
}
Write-Host "Listo: $outFile ($([math]::Round($size/1MB, 1)) MB)"
