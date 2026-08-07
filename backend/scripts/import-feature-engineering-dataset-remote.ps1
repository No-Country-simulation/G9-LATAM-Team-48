<#
Importa el CSV a Railway (u otro MySQL remoto) sin LOAD DATA LOCAL.
Railway deshabilita local_infile -> usar este script en lugar de import-feature-engineering-dataset.ps1

Requisitos:
  pip install pymysql
  python en PATH
#>
param(
    [Parameter(Mandatory = $true)] [string]$DatasetPath,
    [string]$MySqlHost = "localhost",
    [int]$MySqlPort = 3306,
    [string]$Database = "railway",
    [string]$Username = "root",
    [switch]$Replace
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$pyScript = Join-Path $scriptDir "import_feature_engineering_remote.py"

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    throw "No se encontro python en PATH."
}
if (-not (Test-Path $pyScript)) {
    throw "No se encontro $pyScript"
}

$resolvedPath = (Resolve-Path -LiteralPath $DatasetPath).Path
$password = $env:MYSQL_PWD
if (-not $password) {
    throw "Define MYSQL_PWD con la contraseña MySQL."
}

$args = @(
    $pyScript,
    "--csv", $resolvedPath,
    "--host", $MySqlHost,
    "--port", $MySqlPort,
    "--user", $Username,
    "--password", $password,
    "--database", $Database
)
if ($Replace) {
    $args += "--replace"
}

Write-Host "Import por lotes (puede tardar 10-20 min en Railway)..."
& python @args
if ($LASTEXITCODE -ne 0) {
    throw "La importacion por lotes fallo."
}
