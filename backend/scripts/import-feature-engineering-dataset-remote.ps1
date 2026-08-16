<#
Importa el CSV a MySQL remoto (OCI, túnel SSH, etc.) sin LOAD DATA LOCAL.
Usar cuando local_infile no está disponible.

Requisitos:
  pip install pymysql
  python en PATH
  MYSQL_PWD en el entorno
#>
param(
    [Parameter(Mandatory = $true)] [string]$DatasetPath,
    [string]$MySqlHost = "localhost",
    [int]$MySqlPort = 3306,
    [string]$Database = "energia_ia",
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

Write-Host "Import por lotes (puede tardar varios minutos en MySQL remoto)..."
& python @args
if ($LASTEXITCODE -ne 0) {
    throw "La importacion por lotes fallo."
}
