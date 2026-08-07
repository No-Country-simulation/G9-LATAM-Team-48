# QA P1 pendientes - EnergIA (prod). Admin CRUD crea/edita/borra un usuario QA.
$ErrorActionPreference = "Continue"
$OutDir = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $OutDir "api-url.ps1")
$Api = $EnergyApiUrl
$Front = "https://g9-latam-team-48.vercel.app"
. (Join-Path $OutDir "load-qa-secrets.ps1")
Require-QaDemoCredentials
Require-QaInbox
$results = [ordered]@{}
$stamp = Get-Date -Format "yyyyMMddHHmmss"

function Set-Result($id, $status, $note) {
    $results[$id] = @{ Status = $status; Note = $note }
    Write-Host ("[{0}] {1} - {2}" -f $status, $id, $note)
}

function Call-Api($method, $path, $body, $token) {
    $headers = @{ Accept = "application/json" }
    if ($token) { $headers.Authorization = "Bearer $token" }
    $params = @{
        Uri             = "$Api$path"
        Method          = $method
        Headers         = $headers
        UseBasicParsing = $true
        TimeoutSec      = 60
    }
    if ($null -ne $body) {
        $params.ContentType = "application/json; charset=utf-8"
        $params.Body = ($body | ConvertTo-Json -Compress)
    }
    try {
        $resp = Invoke-WebRequest @params
        $json = $null
        try { $json = $resp.Content | ConvertFrom-Json } catch {}
        return @{ Ok = $true; Code = [int]$resp.StatusCode; Json = $json; Raw = $resp.Content; Headers = $resp.Headers }
    }
    catch {
        $code = $null; $raw = $null; $json = $null
        if ($_.Exception.Response) {
            $code = [int]$_.Exception.Response.StatusCode
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $raw = $reader.ReadToEnd()
                try { $json = $raw | ConvertFrom-Json } catch {}
            } catch {}
        }
        return @{ Ok = $false; Code = $code; Json = $json; Raw = $raw; Error = $_.Exception.Message }
    }
}

function Get-Token($email, $password) {
    $r = Call-Api POST "/api/v1/auth/login" @{ email = $email; password = $password } $null
    return $r.Json.data.accessToken
}

Write-Host "=== QA P1 EnergIA (prod) ==="
Write-Host "API: $Api"
Write-Host ""

# --- P1-01 Consumos (sin login) ---
$cons = Call-Api GET "/api/consumos" $null $null
if ($cons.Ok -and $cons.Code -eq 200 -and $cons.Raw.Length -gt 10) {
    Set-Result "P1-01" "PASS" "GET /api/consumos 200 len=$($cons.Raw.Length)"
} else {
    Set-Result "P1-01" "FAIL" "code=$($cons.Code) len=$($cons.Raw.Length)"
}

# --- P1-02 Historia sin sesion ---
$histAnon = Call-Api GET "/api/analisis/mis" $null $null
if ($histAnon.Code -eq 401 -or $histAnon.Code -eq 403) {
    Set-Result "P1-02" "PASS" "GET /analisis/mis sin JWT -> $($histAnon.Code) (FE redirige a dashboard)"
} else {
    Set-Result "P1-02" "FAIL" "esperaba 401/403; got=$($histAnon.Code)"
}

# --- P1-03 Historia con USER ---
$tokenUser = Get-Token $script:QaDemoOperadorEmail $script:QaDemoOperadorPassword
$histUser = Call-Api GET "/api/analisis/mis" $null $tokenUser
if ($histUser.Ok -and $histUser.Code -eq 200) {
    $n = 0
    if ($histUser.Json.data) { $n = @($histUser.Json.data).Count }
    elseif ($histUser.Json -is [System.Array]) { $n = $histUser.Json.Count }
    Set-Result "P1-03" "PASS" "operador /analisis/mis 200 items~$n"
} else {
    Set-Result "P1-03" "FAIL" "code=$($histUser.Code) raw=$($histUser.Raw)"
}

# --- P1-11 Roles: USER no puede admin ---
$adminAsUser = Call-Api GET "/api/v1/admin/users" $null $tokenUser
if ($adminAsUser.Code -eq 403 -or $adminAsUser.Code -eq 401) {
    Set-Result "P1-11" "PASS" "USER -> GET /admin/users = $($adminAsUser.Code)"
} else {
    Set-Result "P1-11" "FAIL" "esperaba 403/401; got=$($adminAsUser.Code)"
}

$tokenAdmin = Get-Token $script:QaDemoAdminEmail $script:QaDemoAdminPassword

# --- P1-06 Admin create ---
$qaEmail = "qa.p1+$stamp@example.com"
$qaPass = "qaP1Test1234"
$created = Call-Api POST "/api/v1/admin/users" @{
    name          = "QA P1 $stamp"
    email         = $qaEmail
    password      = $qaPass
    role          = "USER"
    emailVerified = $true
} $tokenAdmin
$qaId = $null
if ($created.Ok -and ($created.Code -eq 200 -or $created.Code -eq 201)) {
    $qaId = $created.Json.data.id
    if (-not $qaId) { $qaId = $created.Json.data.user.id }
    $loginQa = Call-Api POST "/api/v1/auth/login" @{ email = $qaEmail; password = $qaPass } $null
    if ($loginQa.Ok -and $loginQa.Json.data.accessToken) {
        Set-Result "P1-06" "PASS" "create id=$qaId; login OK"
    } else {
        Set-Result "P1-06" "FAIL" "create OK pero login code=$($loginQa.Code) raw=$($loginQa.Raw)"
    }
} else {
    Set-Result "P1-06" "FAIL" "create code=$($created.Code) raw=$($created.Raw)"
}

# --- P1-07 Admin edit + soft delete ---
if ($qaId) {
    $edited = Call-Api PUT "/api/v1/admin/users/$qaId" @{
        name          = "QA P1 Editado $stamp"
        email         = $qaEmail
        role          = "USER"
        emailVerified = $true
    } $tokenAdmin
    $deleted = Call-Api DELETE "/api/v1/admin/users/$qaId" $null $tokenAdmin
    if ($edited.Ok -and ($edited.Code -eq 200) -and $deleted.Ok -and ($deleted.Code -eq 200 -or $deleted.Code -eq 204)) {
        Set-Result "P1-07" "PASS" "edit 200 + delete $($deleted.Code) id=$qaId"
    } else {
        Set-Result "P1-07" "FAIL" "edit=$($edited.Code) delete=$($deleted.Code) editBody=$($edited.Raw)"
    }
} else {
    Set-Result "P1-07" "SKIP" "sin id de P1-06"
}

# --- P1-08 Admin analisis ---
$adminAn = Call-Api GET "/api/v1/admin/analisis" $null $tokenAdmin
if ($adminAn.Ok -and $adminAn.Code -eq 200) {
    Set-Result "P1-08" "PASS" "GET /admin/analisis 200 len=$($adminAn.Raw.Length) (recalcular no ejecutado)"
} else {
    Set-Result "P1-08" "FAIL" "code=$($adminAn.Code) raw=$($adminAn.Raw)"
}

# --- P1-09 Contacto ---
$contact = Call-Api POST "/api/v1/contact" @{
    name    = "QA P1 Contact"
    email   = $script:QaInbox
    message = "Mensaje de prueba QA P1 automatizado. Puede ignorarse."
} $null
$emailStatus = $contact.Json.data.emailStatus
if (-not $emailStatus) { $emailStatus = $contact.Json.emailStatus }
if ($contact.Ok -and ($contact.Code -eq 200 -or $contact.Code -eq 201)) {
    Set-Result "P1-09" "PASS" "contact $($contact.Code) emailStatus=$emailStatus"
} else {
    Set-Result "P1-09" "FAIL" "code=$($contact.Code) raw=$($contact.Raw)"
}

# --- P1-10 i18n: bundle Vercel tiene packs / tipKeys ---
$front = Call-Api GET "/" $null $null
# Call-Api with path only - fix: need full URL for front
$frontHtml = $null
try {
    $fr = Invoke-WebRequest -Uri $Front -UseBasicParsing -TimeoutSec 30
    $frontHtml = $fr.Content
} catch {}
$i18nOk = $false
$googleId = $null
$googleLocalId = "7592855791-re4uo5hrk2t8pkfsla9hbhj6v8qq2bnr.apps.googleusercontent.com"
if ($frontHtml) {
    $jsMatches = [regex]::Matches($frontHtml, 'src="(/assets/[^"]+\.js)"')
    foreach ($m in $jsMatches) {
        $jsUrl = "$Front$($m.Groups[1].Value)"
        try {
            $js = (Invoke-WebRequest -Uri $jsUrl -UseBasicParsing -TimeoutSec 45).Content
            if ($js -match "menu\.historiaConsumos|historiaConsumos|changeLanguage|i18next|setLocale|locale") { $i18nOk = $true }
            if ($js -match '"en"' -and $js -match '"es"') { $i18nOk = $true }
            if ($js -match "tipKeys|led|appliances") { $i18nOk = $true }
            $gm = [regex]::Match($js, '([0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com)')
            if ($gm.Success) { $googleId = $gm.Groups[1].Value }
        } catch {}
    }
}
# Also check source packs exist
$packsDir = Join-Path (Split-Path $OutDir -Parent) "frontend\src\i18n"
$packCount = 0
if (Test-Path $packsDir) {
    $packCount = @(Get-ChildItem -Path $packsDir -Recurse -Filter "*.js" | Where-Object { $_.Name -match '^(es|en)|packs' }).Count
}
if ($i18nOk -or $packCount -gt 2) {
    Set-Result "P1-10" "PASS" "i18n en bundle/packs (packs~$packCount); cambio de idioma UI = confirmar selector"
} else {
    Set-Result "P1-10" "MANUAL" "no detectado claramente en bundle; probar selector en UI"
}

# --- P1-12 / P0-08 Google env ---
$googleApi = Call-Api POST "/api/v1/auth/google" @{ credential = "invalid.jwt.qa" } $null
$googleConfigured = ($googleApi.Raw -notmatch "no esta configurado|not configured|GOOGLE_CLIENT") -and ($googleApi.Code -ne 503)
if ($googleId) {
    Set-Result "P1-12" "PASS" "Vercel ClientID=$googleId; API google code=$($googleApi.Code) configured=$googleConfigured"
} else {
    Set-Result "P1-12" "FAIL" "ClientID no encontrado en bundle Vercel"
}
if ($googleConfigured -and $googleId) {
    Set-Result "P0-08" "MANUAL" "env OK (ClientID bakeado + API responde); falta click real Google en UI"
} else {
    Set-Result "P0-08" "FAIL" "Google parece mal configurado: api=$($googleApi.Code) id=$googleId"
}

# Cleanup leftover qa.p0 example users if still present (best-effort)
$users = Call-Api GET "/api/v1/admin/users" $null $tokenAdmin
if ($users.Ok -and $users.Json.data) {
    foreach ($u in @($users.Json.data)) {
        if ($u.email -match '^qa\.(p0|p1)\+') {
            $null = Call-Api DELETE "/api/v1/admin/users/$($u.id)" $null $tokenAdmin
            Write-Host "cleanup deleted $($u.email) id=$($u.id)"
        }
    }
}

Write-Host ""
Write-Host "=== RESUMEN ==="
foreach ($k in $results.Keys) {
    Write-Host ("{0,-8} {1,-7} {2}" -f $k, $results[$k].Status, $results[$k].Note)
}

$outPath = Join-Path $OutDir "p1-results.json"
$export = @{}
foreach ($k in $results.Keys) { $export[$k] = $results[$k] }
$export | ConvertTo-Json -Depth 4 | Set-Content -Path $outPath -Encoding UTF8
Write-Host "Saved: $outPath"
