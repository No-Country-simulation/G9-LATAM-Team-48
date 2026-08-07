<#
Imports the complete Data Science feature-engineering CSV after Flyway applies V9.
Requires MySQL Client and the MYSQL_PWD environment variable.
#>
param(
    [Parameter(Mandatory = $true)] [string]$DatasetPath,
    [string]$MySqlHost = "localhost",
    [int]$MySqlPort = 3306,
    [string]$Database = "energia_ia",
    [string]$Username = "energia_app"
)

$ErrorActionPreference = "Stop"
if (-not (Get-Command mysql -ErrorAction SilentlyContinue)) {
    throw "No se encontro MySQL Client (comando mysql)."
}

function Convert-DbColumnName([string]$Name) {
    $normal = $Name.Normalize([Text.NormalizationForm]::FormD)
    $ascii = -join ($normal.ToCharArray() | Where-Object {
        [Globalization.CharUnicodeInfo]::GetUnicodeCategory($_) -ne [Globalization.UnicodeCategory]::NonSpacingMark
    })
    return (($ascii.ToLowerInvariant() -replace '[^a-z0-9]+', '_').Trim('_'))
}

$resolvedPath = (Resolve-Path -LiteralPath $DatasetPath).Path
$header = (Get-Content -LiteralPath $resolvedPath -TotalCount 1).Split(',')
$columns = @($header | ForEach-Object { Convert-DbColumnName $_ })
if ($columns.Count -ne 238) {
    throw "El CSV debe tener 238 columnas; se encontraron $($columns.Count)."
}
if (($columns | Group-Object | Where-Object Count -gt 1).Count -gt 0) {
    throw "La conversion de encabezados produjo nombres duplicados."
}

$rows = & mysql --host=$MySqlHost --port=$MySqlPort --user=$Username --database=$Database --batch --skip-column-names -e "SELECT COUNT(*) FROM dataset_feature_engineering;"
if ([int]$rows -gt 0) {
    throw "La tabla ya tiene $rows registros. Se cancela para no reemplazar datos existentes."
}

$csvPath = $resolvedPath.Replace("\", "/").Replace("'", "''")
$variables = (0..($columns.Count - 1) | ForEach-Object { "@v$_" }) -join ", "
$assignments = (0..($columns.Count - 1) | ForEach-Object { "  ``$($columns[$_])`` = NULLIF(@v$_, '')" }) -join ",`n"
$sql = @"
LOAD DATA LOCAL INFILE '$csvPath'
INTO TABLE dataset_feature_engineering
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
($variables)
SET
$assignments;
SELECT COUNT(*) AS dataset_rows FROM dataset_feature_engineering;
"@

$sql | & mysql --local-infile=1 --host=$MySqlHost --port=$MySqlPort --user=$Username --database=$Database
if ($LASTEXITCODE -ne 0) {
    throw "La importacion del dataset procesado fallo."
}
