<# Imports the Data Science CSV after Flyway has applied V8. Requires MySQL Client and MYSQL_PWD. #>
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

$csvPath = (Resolve-Path -LiteralPath $DatasetPath).Path.Replace("\", "/").Replace("'", "''")
$columns = "tipo_inmueble,zona,nivel_socioeconomico,num_personas,superficie_m2,antiguedad_construccion_anios,mes_referencia,dias_facturacion,temperatura_promedio_c,tiene_aire_acondicionado,cantidad_unidades_aa,horas_uso_aa_dia,tiene_calentador_agua_electrico,tiene_lavadora,cantidad_tv_o_pantallas,cantidad_computadoras,pct_iluminacion_led,cantidad_focos,horas_uso_iluminacion_dia,otros_equipos_pequenos,cantidad_equipos_total,horario_pico_uso,horas_dia_cocina,horas_dia_sala_estar,horas_dia_dormitorios,horas_dia_oficina_estudio,horas_dia_lavanderia,aislamiento_termico,antiguedad_electrodomesticos_anios,fuente_energia_secundaria,dias_sin_electricidad_mes,horas_uso_planta_o_inversor_mes,generacion_solar_kwh_mensual,certificacion_energetica_previa,consumo_kwh_mes_anterior,variacion_pct_consumo_mensual,consumo_kwh_mensual,consumo_neto_facturado_kwh,costo_estimado_usd,consumo_kwh_por_m2,consumo_kwh_por_persona,perfil_energetico" -split ","
$rows = & mysql --host=$MySqlHost --port=$MySqlPort --user=$Username --database=$Database --batch --skip-column-names -e "SELECT COUNT(*) FROM dataset_consumo_energetico;"
if ([int]$rows -gt 0) {
    throw "La tabla ya tiene $rows registros. Se cancela para no reemplazar datos existentes."
}

$discardedColumns = @("@source_row_number", "@discarded_id_registro")
$variables = ($discardedColumns + ($columns | ForEach-Object { "@$_" })) -join ", "
$assignments = ($columns | ForEach-Object { "{0} = NULLIF(@{0}, '')" -f $_ }) -join ",`n  "
$sql = @"
LOAD DATA LOCAL INFILE '$csvPath'
INTO TABLE dataset_consumo_energetico
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
($variables)
SET
  $assignments;
SELECT COUNT(*) AS dataset_rows FROM dataset_consumo_energetico;
"@

$sql | & mysql --local-infile=1 --host=$MySqlHost --port=$MySqlPort --user=$Username --database=$Database
if ($LASTEXITCODE -ne 0) {
    throw "La importacion del dataset fallo."
}
