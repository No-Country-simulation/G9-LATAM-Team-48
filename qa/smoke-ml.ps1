# Smoke del microservicio ML (local o Render)
param(
    [string]$BaseUrl = "http://127.0.0.1:8000"
)

$ErrorActionPreference = "Stop"
$BaseUrl = $BaseUrl.TrimEnd("/")

Write-Host "GET $BaseUrl/health"
$health = Invoke-RestMethod -Uri "$BaseUrl/health" -Method Get -TimeoutSec 90
$health | ConvertTo-Json

if (-not $health.modelLoaded) {
    Write-Host "FAIL: modelLoaded=false" -ForegroundColor Red
    exit 1
}

$schema = $health.schema
if ($schema -eq "v3_bundle") {
    Write-Host "OK schema v3_bundle (trio datascience)" -ForegroundColor Green
} elseif ($schema -eq "legacy") {
    Write-Host "WARN: schema legacy (model.joblib). Para prod v3 copiá el trio o MODEL_V3_* en Render." -ForegroundColor Yellow
} else {
    Write-Host "schema: $schema"
}

$body = @{
    userId = "qa-smoke"
    features = @{
        tipo_inmueble = "Casa Unifamiliar"
        superficie_m2 = 80
        num_personas = 3
        cantidad_equipos_total = 6
        horas_uso_aa_dia = 2
        consumo_kwh_mensual = 380
        consumo_kwh_mes_anterior = 360
        aislamiento_termico = "Regular"
        pct_iluminacion_led = 40
        antiguedad_construccion_anios = 15
        zona = "Urbana Interior"
        antiguedad_electrodomesticos_anios = 5
    }
} | ConvertTo-Json -Depth 5

$predict = Invoke-RestMethod -Uri "$BaseUrl/predict" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 90
Write-Host "predict:" ($predict | ConvertTo-Json -Compress)
Write-Host "OK nivelKey=$($predict.nivelKey)" -ForegroundColor Green
