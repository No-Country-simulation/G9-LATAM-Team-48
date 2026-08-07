# QA P0 probes - EnergIA (prod)
$ErrorActionPreference = "Continue"
$OutDir = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $OutDir "api-url.ps1")
$Api = $EnergyApiUrl
$Front = "https://g9-latam-team-48.vercel.app"
$results = [ordered]@{}
. (Join-Path $OutDir "load-qa-secrets.ps1")
Require-QaDemoCredentials

function Set-Result($id, $status, $note) {
    $results[$id] = @{ Status = $status; Note = $note }
    Write-Host ("[{0}] {1} - {2}" -f $status, $id, $note)
}

function Invoke-Json {
    param(
        [string]$Method,
        [string]$Url,
        [hashtable]$Headers = @{},
        [object]$Body = $null
    )
    $hdr = @{ Accept = "application/json" } + $Headers
    $params = @{
        Uri             = $Url
        Method          = $Method
        Headers         = $hdr
        UseBasicParsing = $true
        TimeoutSec      = 45
    }
    if ($null -ne $Body) {
        $params.ContentType = "application/json; charset=utf-8"
        $params.Body = ($Body | ConvertTo-Json -Depth 8 -Compress)
    }
    try {
        $resp = Invoke-WebRequest @params
        return @{
            Ok      = $true
            Code    = [int]$resp.StatusCode
            Content = $resp.Content
            Headers = $resp.Headers
        }
    }
    catch {
        $code = $null
        $content = $null
        if ($_.Exception.Response) {
            $code = [int]$_.Exception.Response.StatusCode
            try {
                $stream = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($stream)
                $content = $reader.ReadToEnd()
            } catch {}
        }
        return @{
            Ok      = $false
            Code    = $code
            Content = $content
            Error   = $_.Exception.Message
        }
    }
}

Write-Host "=== QA P0 EnergIA ==="
Write-Host "Front: $Front"
Write-Host "API:   $Api"
Write-Host ""

# --- P0-01 Vercel ---
$r = Invoke-Json -Method GET -Url $Front
if ($r.Ok -and $r.Code -eq 200 -and $r.Content -match "<!DOCTYPE html|<html") {
    $hasAssets = $r.Content -match "assets/"
    Set-Result "P0-01" "PASS" "Vercel 200; assets=$hasAssets; len=$($r.Content.Length)"
} else {
    Set-Result "P0-01" "FAIL" "code=$($r.Code) err=$($r.Error)"
}

$apiInBundle = $false
$googleInBundle = $false
if ($r.Ok) {
    $jsMatches = [regex]::Matches($r.Content, 'src="(/assets/[^"]+\.js)"')
    foreach ($m in $jsMatches) {
        $jsUrl = "$Front$($m.Groups[1].Value)"
        $js = Invoke-Json -Method GET -Url $jsUrl
        if ($js.Ok -and $js.Content) {
            if ($js.Content -match "g9-latam-team-48-production\.up\.railway\.app|railway\.app") { $apiInBundle = $true }
            if ($js.Content -match "[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com") { $googleInBundle = $true }
            if ($js.Content -match "accounts\.google|gsi/client") { $googleInBundle = $true }
        }
    }
}

# --- P0-02 CORS ---
$corsGet = Invoke-Json -Method GET -Url "$Api/api/consumos" -Headers @{ Origin = $Front }
$acao = $null
if ($corsGet.Headers -and $corsGet.Headers["Access-Control-Allow-Origin"]) {
    $acao = $corsGet.Headers["Access-Control-Allow-Origin"]
}
$corsOpt = Invoke-Json -Method OPTIONS -Url "$Api/api/consumos" -Headers @{
    Origin = $Front
    "Access-Control-Request-Method" = "GET"
}
$acaoOpt = $null
if ($corsOpt.Headers -and $corsOpt.Headers["Access-Control-Allow-Origin"]) {
    $acaoOpt = $corsOpt.Headers["Access-Control-Allow-Origin"]
}
$corsOk = ($corsGet.Ok -and $corsGet.Code -eq 200) -and (
    ($acao -eq $Front) -or ($acao -eq "*") -or ($acaoOpt -eq $Front) -or ($acaoOpt -eq "*") -or $apiInBundle
)
if ($corsOk) {
    Set-Result "P0-02" "PASS" "GET=$($corsGet.Code) ACAO=$acao; OPTIONS=$($corsOpt.Code) ACAO=$acaoOpt; bundleApi=$apiInBundle"
} else {
    Set-Result "P0-02" "FAIL" "GET=$($corsGet.Code) ACAO=$acao OPTIONS=$($corsOpt.Code) ACAO=$acaoOpt bundleApi=$apiInBundle"
}

# --- P0-03 Register ---
$stamp = Get-Date -Format "yyyyMMddHHmmss"
$newEmail = "qa.p0+$stamp@example.com"
$reg = Invoke-Json -Method POST -Url "$Api/api/v1/auth/register" -Body @{
    name     = "QA P0 $stamp"
    email    = $newEmail
    password = "qaTest1234"
}
$hasJwt = $false
if ($reg.Content) {
    try {
        $regJson = $reg.Content | ConvertFrom-Json
        $d = $regJson.data
        if ($regJson.token -or $regJson.accessToken -or $regJson.jwt) { $hasJwt = $true }
        if ($d -and ($d.token -or $d.accessToken -or $d.jwt)) { $hasJwt = $true }
    } catch {}
}
if (($reg.Code -eq 201 -or $reg.Code -eq 200) -and -not $hasJwt) {
    Set-Result "P0-03" "PASS" "register code=$($reg.Code) email=$newEmail noJWT"
} elseif (($reg.Code -eq 201 -or $reg.Code -eq 200) -and $hasJwt) {
    Set-Result "P0-03" "FAIL" "register returned JWT unexpectedly code=$($reg.Code)"
} else {
    Set-Result "P0-03" "FAIL" "code=$($reg.Code) body=$($reg.Content) err=$($reg.Error)"
}

# --- P0-04 Login before verify ---
$loginUnverified = Invoke-Json -Method POST -Url "$Api/api/v1/auth/login" -Body @{
    email    = $newEmail
    password = "qaTest1234"
}
if ($loginUnverified.Code -eq 409 -or $loginUnverified.Code -eq 403 -or $loginUnverified.Code -eq 401) {
    Set-Result "P0-04" "PASS" "login blocked without verify code=$($loginUnverified.Code)"
} else {
    Set-Result "P0-04" "FAIL" "expected 409/403/401; got=$($loginUnverified.Code) body=$($loginUnverified.Content)"
}

# --- P0-05 Verify email (manual - need mailbox) ---
$verifyBad = Invoke-Json -Method POST -Url "$Api/api/v1/auth/verify-email" -Body @{ token = "token-invalido-qa" }
Set-Result "P0-05" "MANUAL" "no mailbox access; invalid token -> code=$($verifyBad.Code). Open ?verifyToken= from email."

# --- P0-06 Login post-verify (seed user) ---
$loginOp = Invoke-Json -Method POST -Url "$Api/api/v1/auth/login" -Body @{
    email    = $script:QaDemoOperadorEmail
    password = $script:QaDemoOperadorPassword
}
$tokenUser = $null
if ($loginOp.Ok -and $loginOp.Content) {
    try {
        $lj = $loginOp.Content | ConvertFrom-Json
        $tokenUser = $lj.token
        if (-not $tokenUser) { $tokenUser = $lj.accessToken }
        if (-not $tokenUser -and $lj.data) {
            $tokenUser = $lj.data.accessToken
            if (-not $tokenUser) { $tokenUser = $lj.data.token }
        }
    } catch {}
}
$me = $null
if ($tokenUser) {
    $me = Invoke-Json -Method GET -Url "$Api/api/v1/users/me" -Headers @{ Authorization = "Bearer $tokenUser" }
}
if ($loginOp.Ok -and $tokenUser -and $me.Ok) {
    Set-Result "P0-06" "PASS" "operador login OK; /me=$($me.Code); new-account verify remains MANUAL"
} else {
    Set-Result "P0-06" "FAIL" "login=$($loginOp.Code) me=$($me.Code) body=$($loginOp.Content)"
}

# --- P0-07 / P0-08 Google ---
$googleApi = Invoke-Json -Method POST -Url "$Api/api/v1/auth/google" -Body @{ credential = "invalid.jwt.qa" }
$googleConfigured = $true
if ($googleApi.Content -match "no esta configurado|no est. configurado|not configured|GOOGLE_CLIENT") {
    $googleConfigured = $false
}
if ($googleApi.Code -eq 503) { $googleConfigured = $false }

if ($googleInBundle) {
    Set-Result "P0-07" "PASS" "GIS/ClientID refs found in Vercel bundle (confirm button in UI)"
} else {
    Set-Result "P0-07" "MANUAL" "ClientID not found in JS bundle; check Google button in login modal"
}
if ($googleConfigured) {
    Set-Result "P0-08" "MANUAL" "API google code=$($googleApi.Code) (not 'unconfigured'); complete real Google login in UI"
} else {
    Set-Result "P0-08" "FAIL" "looks unconfigured: code=$($googleApi.Code) body=$($googleApi.Content)"
}

# --- P0-09 Analisis OK ---
$analisisOk = Invoke-Json -Method POST -Url "$Api/api/analisis" -Body @{
    tipoInmueble       = "casa"
    areaM2             = 80
    consumoKwh         = 250
    cantidadEquipos    = 5
    cantidadPersonas   = 3
    horasClimatizacion = 4
    horasAltoConsumo   = 4
    usoHorarioPico     = $true
}
$tips = $null
if ($analisisOk.Content) {
    try {
        $aj = $analisisOk.Content | ConvertFrom-Json
        $tips = $aj.tipKeys
    } catch {}
}
$tipsJoin = if ($tips) { ($tips -join ",") } else { "" }
if ($analisisOk.Ok -and ($analisisOk.Code -eq 200 -or $analisisOk.Code -eq 201) -and $tips) {
    Set-Result "P0-09" "PASS" "analisis code=$($analisisOk.Code) tipKeys=$tipsJoin"
} elseif ($analisisOk.Ok -and ($analisisOk.Code -eq 200 -or $analisisOk.Code -eq 201)) {
    Set-Result "P0-09" "PASS" "analisis code=$($analisisOk.Code) (tipKeys empty/unparsed)"
} else {
    Set-Result "P0-09" "FAIL" "code=$($analisisOk.Code) body=$($analisisOk.Content) err=$($analisisOk.Error)"
}

# --- P0-10 Area invalida ---
$analisisBad = Invoke-Json -Method POST -Url "$Api/api/analisis" -Body @{
    tipoInmueble       = "casa"
    areaM2             = 0
    consumoKwh         = 250
    cantidadEquipos    = 5
    cantidadPersonas   = 3
    horasClimatizacion = 4
    horasAltoConsumo   = 4
    usoHorarioPico     = $true
}
if ($analisisBad.Code -eq 400 -or $analisisBad.Code -eq 422) {
    Set-Result "P0-10" "PASS" "area 0 rejected code=$($analisisBad.Code)"
} else {
    Set-Result "P0-10" "FAIL" "expected 400/422; got=$($analisisBad.Code) body=$($analisisBad.Content)"
}

# --- P0-11 Recomendaciones ---
$rec = Invoke-Json -Method GET -Url "$Api/api/recomendaciones"
if ($rec.Ok -and $rec.Code -eq 200) {
    $preview = if ($rec.Content.Length -gt 120) { $rec.Content.Substring(0, 120) + "..." } else { $rec.Content }
    Set-Result "P0-11" "PASS" "recomendaciones 200; analisis tipKeys=$tipsJoin; preview=$preview"
} else {
    Set-Result "P0-11" "FAIL" "code=$($rec.Code)"
}

# --- P0-12 / P0-13 Admin ---
$loginAdmin = Invoke-Json -Method POST -Url "$Api/api/v1/auth/login" -Body @{
    email    = $script:QaDemoAdminEmail
    password = $script:QaDemoAdminPassword
}
$tokenAdmin = $null
$roleAdmin = $null
if ($loginAdmin.Content) {
    try {
        $adj = $loginAdmin.Content | ConvertFrom-Json
        $tokenAdmin = $adj.token
        if (-not $tokenAdmin) { $tokenAdmin = $adj.accessToken }
        if (-not $tokenAdmin -and $adj.data) {
            $tokenAdmin = $adj.data.accessToken
            if (-not $tokenAdmin) { $tokenAdmin = $adj.data.token }
        }
        $roleAdmin = $adj.role
        if (-not $roleAdmin -and $adj.user) { $roleAdmin = $adj.user.role }
        if (-not $roleAdmin -and $adj.data) { $roleAdmin = $adj.data.role }
    } catch {}
}
$meAdmin = $null
$usersList = $null
if ($tokenAdmin) {
    $meAdmin = Invoke-Json -Method GET -Url "$Api/api/v1/users/me" -Headers @{ Authorization = "Bearer $tokenAdmin" }
    $usersList = Invoke-Json -Method GET -Url "$Api/api/v1/admin/users" -Headers @{ Authorization = "Bearer $tokenAdmin" }
}
if ($loginAdmin.Ok -and $tokenAdmin -and $meAdmin.Ok) {
    $mePreview = $meAdmin.Content
    if ($mePreview.Length -gt 160) { $mePreview = $mePreview.Substring(0, 160) }
    Set-Result "P0-12" "PASS" "admin login OK; /me=$($meAdmin.Code) roleHint=$roleAdmin body=$mePreview"
} else {
    Set-Result "P0-12" "FAIL" "login=$($loginAdmin.Code) me=$($meAdmin.Code) body=$($loginAdmin.Content)"
}
if ($usersList -and $usersList.Ok -and $usersList.Code -eq 200) {
    Set-Result "P0-13" "PASS" "GET /admin/users 200 len=$($usersList.Content.Length)"
} else {
    $uc = if ($usersList) { $usersList.Code } else { "n/a" }
    $ub = if ($usersList) { $usersList.Content } else { "" }
    Set-Result "P0-13" "FAIL" "code=$uc body=$ub"
}

Write-Host ""
Write-Host "=== RESUMEN ==="
foreach ($k in $results.Keys) {
    Write-Host ("{0,-8} {1,-7} {2}" -f $k, $results[$k].Status, $results[$k].Note)
}

$outPath = Join-Path $OutDir "p0-results.json"
$export = @{}
foreach ($k in $results.Keys) { $export[$k] = $results[$k] }
$export | ConvertTo-Json -Depth 4 | Set-Content -Path $outPath -Encoding UTF8
Write-Host ""
Write-Host "Saved: $outPath"
