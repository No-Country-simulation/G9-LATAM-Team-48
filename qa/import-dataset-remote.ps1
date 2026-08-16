# Importar dataset feature engineering (V8) a MySQL remoto (OCI, túnel SSH, etc.)
# Requiere: pip install pymysql y CSV 03_feature_engineering.csv
#
# Variables opcionales: MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE

param(
    [Parameter(Mandatory = $true)]
    [string]$CsvPath,
    [string]$Host = $env:MYSQL_HOST,
    [int]$Port = $(if ($env:MYSQL_PORT) { [int]$env:MYSQL_PORT } else { 3306 }),
    [string]$User = $env:MYSQL_USER,
    [string]$Password = $env:MYSQL_PASSWORD,
    [string]$Database = $(if ($env:MYSQL_DATABASE) { $env:MYSQL_DATABASE } else { 'energia_ia' }),
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
foreach ($var in @('Host', 'User')) {
    if (-not (Get-Variable -Name $var -ValueOnly)) {
        throw "Falta -$var o variable MYSQL_HOST / MYSQL_USER"
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
