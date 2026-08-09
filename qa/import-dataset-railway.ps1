# Importar dataset feature engineering (V8) a MySQL Railway
# Requiere: pip install pymysql y CSV 03_feature_engineering.csv

param(
    [Parameter(Mandatory = $true)]
    [string]$CsvPath,
    [string]$Host = $env:RAILWAY_MYSQL_HOST,
    [int]$Port = $(if ($env:RAILWAY_MYSQL_PORT) { [int]$env:RAILWAY_MYSQL_PORT } else { 3306 }),
    [string]$User = $env:RAILWAY_MYSQL_USER,
    [string]$Password = $env:RAILWAY_MYSQL_PASSWORD,
    [string]$Database = $env:RAILWAY_MYSQL_DATABASE,
    [switch]$Replace
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$script = Join-Path $root 'backend\scripts\import_feature_engineering_remote.py'

if (-not (Test-Path $script)) {
    throw "No se encuentra $script"
}
if (-not (Test-Path $CsvPath)) {
    throw "CSV no encontrado: $CsvPath"
}
foreach ($var in @('Host', 'User', 'Database')) {
    if (-not (Get-Variable -Name $var -ValueOnly)) {
        throw "Falta -$var o variable RAILWAY_MYSQL_*"
    }
}

$args = @(
    $script,
    '--csv', (Resolve-Path $CsvPath).Path,
    '--host', $Host,
    '--port', $Port,
    '--user', $User,
    '--database', $Database
)
if ($Password) { $args += @('--password', $Password) }
if ($Replace) { $args += '--replace' }

Write-Host "Importando dataset a $Database @ $Host ..."
python @args
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host 'Listo. Verifica GET /api/consumos -> fromDataset: true'
