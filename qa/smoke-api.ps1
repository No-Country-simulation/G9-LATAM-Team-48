# Smoke API de solo lectura — EnergIA (Railway)
# No muta datos. No toca frontend/backend/datascience.
$ErrorActionPreference = "Continue"
$OutDir = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $OutDir "api-url.ps1")
$Base = $EnergyApiUrl

function Invoke-Probe {
    param(
        [string]$Name,
        [string]$Url,
        [int[]]$Accept,
        [switch]$Optional
    )
    $code = $null
    $err = $null
    try {
        $resp = Invoke-WebRequest -Uri $Url -Method GET -UseBasicParsing -TimeoutSec 30
        $code = [int]$resp.StatusCode
    }
    catch {
        if ($_.Exception.Response) {
            $code = [int]$_.Exception.Response.StatusCode
        }
        else {
            $err = $_.Exception.Message
        }
    }

    if ($null -ne $code -and ($Accept -contains $code)) {
        Write-Host ("[PASS] {0} -> {1}" -f $Name, $code)
        return @{ Ok = $true; Optional = [bool]$Optional }
    }

    $detail = if ($null -ne $code) { "$code" } else { $err }
    if ($Optional) {
        Write-Host ("[WARN] {0} -> {1} (opcional; acepta {2})" -f $Name, $detail, ($Accept -join ","))
        return @{ Ok = $true; Optional = $true; Warned = $true }
    }
    Write-Host ("[FAIL] {0} -> {1} (acepta {2})" -f $Name, $detail, ($Accept -join ","))
    return @{ Ok = $false; Optional = $false }
}

Write-Host "Smoke API: $Base"
Write-Host ("=" * 60)

$criticalFail = 0
$warns = 0

$r = Invoke-Probe -Name "GET /api/consumos" -Url "$Base/api/consumos" -Accept @(200)
if (-not $r.Ok) { $criticalFail++ }

$r = Invoke-Probe -Name "GET /api/recomendaciones" -Url "$Base/api/recomendaciones" -Accept @(200)
if (-not $r.Ok) { $criticalFail++ }

$r = Invoke-Probe -Name "GET /v3/api-docs" -Url "$Base/v3/api-docs" -Accept @(200)
if (-not $r.Ok) { $criticalFail++ }

$r = Invoke-Probe -Name "GET /api/v1/users/me (sin JWT)" -Url "$Base/api/v1/users/me" -Accept @(401, 403)
if (-not $r.Ok) { $criticalFail++ }

# Prod: UI deshabilitada → 404 (500 en deploys anteriores sin ProdSwaggerDisabledController).
$r = Invoke-Probe -Name "GET /swagger-ui.html" -Url "$Base/swagger-ui.html" -Accept @(200, 302, 404, 500) -Optional
if ($r.Warned) { $warns++ }

$r = Invoke-Probe -Name "GET /actuator/health" -Url "$Base/actuator/health" -Accept @(200) -Optional
if ($r.Warned) { $warns++ }

Write-Host ("=" * 60)
if ($criticalFail -gt 0) {
    Write-Host "RESULT: FAIL ($criticalFail critical, $warns warn)"
    exit 1
}
if ($warns -gt 0) {
    Write-Host "RESULT: PASS_WITH_WARNINGS ($warns warn)"
    exit 0
}
Write-Host "RESULT: PASS"
exit 0
