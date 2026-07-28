# Flujo completo de correo contra el backend local (start-local-backend.ps1).
#
# Cuenta A: el script completa registro -> verify -> login usando el token expuesto.
# Cuenta B: solo registro; el mail queda en la bandeja para probar el link a mano.
$ErrorActionPreference = "Continue"
$Api = "http://localhost:8080"
$stamp = Get-Date -Format "MMddHHmm"
$Inbox = if ($env:QA_INBOX) { $env:QA_INBOX } else { "sandokan992000@gmail.com" }
$local, $domain = $Inbox -split "@", 2
$AccountA = "$local+auto$stamp@$domain"
$AccountB = "$local+link$stamp@$domain"
$Pass = "qaTest1234"

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
        return @{ Code = [int]$resp.StatusCode; Json = $json; Raw = $resp.Content }
    }
    catch {
        $code = $null; $raw = $null; $json = $null
        if ($_.Exception.Response) {
            $code = [int]$_.Exception.Response.StatusCode
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $raw = $reader.ReadToEnd()
                $json = $raw | ConvertFrom-Json
            } catch {}
        }
        return @{ Code = $code; Json = $json; Raw = $raw; Error = $_.Exception.Message }
    }
}

function Show($status, $id, $note) { Write-Host ("[{0}] {1} - {2}" -f $status, $id, $note) }

Write-Host "=== QA correo local ==="
Write-Host "API     : $Api"
Write-Host "Bandeja : $Inbox"
Write-Host ""

$health = Call-Api GET "/actuator/health" $null $null
if (-not $health.Code) {
    $docs = Call-Api GET "/v3/api-docs" $null $null
    if (-not $docs.Code) {
        Write-Host "Backend local no responde en $Api. Arranca qa/start-local-backend.ps1 primero."
        exit 1
    }
}

# --- Cuenta A: flujo automatico ---
$regA = Call-Api POST "/api/v1/auth/register" @{ name = "QA Auto $stamp"; email = $AccountA; password = $Pass } $null
$statusA = $regA.Json.data.emailStatus
$tokenA = $regA.Json.data.verificationToken
if ($regA.Code -eq 201) {
    Show "PASS" "L-01 registro" "$AccountA code=201 emailStatus=$statusA"
} else {
    Show "FAIL" "L-01 registro" "code=$($regA.Code) raw=$($regA.Raw)"
}
if ($statusA -eq "SENT") {
    Show "PASS" "L-02 envio SMTP" "mail real despachado a $AccountA (alias aceptado)"
} else {
    Show "FAIL" "L-02 envio SMTP" "emailStatus=$statusA (esperaba SENT)"
}

$loginPre = Call-Api POST "/api/v1/auth/login" @{ email = $AccountA; password = $Pass } $null
if ($loginPre.Code -eq 409 -or $loginPre.Code -eq 403 -or $loginPre.Code -eq 401) {
    Show "PASS" "L-03 login sin verificar" "bloqueado code=$($loginPre.Code)"
} else {
    Show "FAIL" "L-03 login sin verificar" "code=$($loginPre.Code) raw=$($loginPre.Raw)"
}

if ($tokenA) {
    Write-Host "        link equivalente: http://localhost:5173/?verifyToken=$tokenA"
    $verify = Call-Api POST "/api/v1/auth/verify-email" @{ token = $tokenA } $null
    if ($verify.Code -eq 200) {
        Show "PASS" "L-04 verify-email" "cuenta verificada con el token del link"
    } else {
        Show "FAIL" "L-04 verify-email" "code=$($verify.Code) raw=$($verify.Raw)"
    }

    $loginPost = Call-Api POST "/api/v1/auth/login" @{ email = $AccountA; password = $Pass } $null
    $jwt = $loginPost.Json.data.accessToken
    if ($loginPost.Code -eq 200 -and $jwt) {
        $me = Call-Api GET "/api/v1/users/me" $null $jwt
        Show "PASS" "L-05 login post-verify" "login 200; /me=$($me.Code) email=$($me.Json.data.email)"
    } else {
        Show "FAIL" "L-05 login post-verify" "code=$($loginPost.Code) raw=$($loginPost.Raw)"
    }
} else {
    Show "SKIP" "L-04/L-05" "sin token expuesto; usar el link del mail a mano"
}

# --- Reset password sobre la cuenta ya verificada ---
$forgot = Call-Api POST "/api/v1/auth/forgot-password" @{ email = $AccountA } $null
$resetToken = $forgot.Json.data.resetToken
if ($forgot.Code -eq 200 -and $forgot.Json.data.emailStatus -eq "SENT") {
    Show "PASS" "L-06 forgot-password" "mail enviado a $AccountA"
} else {
    Show "FAIL" "L-06 forgot-password" "code=$($forgot.Code) emailStatus=$($forgot.Json.data.emailStatus)"
}
if ($resetToken) {
    $newPass = "qaNueva12345"
    $reset = Call-Api POST "/api/v1/auth/reset-password" @{ token = $resetToken; newPassword = $newPass } $null
    if ($reset.Code -ne 200) {
        $reset = Call-Api POST "/api/v1/auth/reset-password" @{ token = $resetToken; password = $newPass } $null
    }
    if ($reset.Code -eq 200) {
        $loginNew = Call-Api POST "/api/v1/auth/login" @{ email = $AccountA; password = $newPass } $null
        if ($loginNew.Code -eq 200) {
            Show "PASS" "L-07 reset-password" "password cambiada y login con la nueva OK"
        } else {
            Show "FAIL" "L-07 reset-password" "reset 200 pero login nuevo code=$($loginNew.Code)"
        }
    } else {
        Show "FAIL" "L-07 reset-password" "code=$($reset.Code) raw=$($reset.Raw)"
    }
} else {
    Show "SKIP" "L-07 reset-password" "sin token expuesto; usar el link del mail"
}

# --- Cuenta B: queda para el click manual ---
$regB = Call-Api POST "/api/v1/auth/register" @{ name = "QA Link $stamp"; email = $AccountB; password = $Pass } $null
if ($regB.Code -eq 201 -and $regB.Json.data.emailStatus -eq "SENT") {
    Show "PASS" "L-08 mail para click manual" "$AccountB"
} else {
    Show "FAIL" "L-08 mail para click manual" "code=$($regB.Code) emailStatus=$($regB.Json.data.emailStatus)"
}

Write-Host ""
Write-Host "Manual pendiente:"
Write-Host " 1. Abrir la bandeja de $Inbox y buscar 'Verifica tu email' para $AccountB"
Write-Host " 2. Click en el link (http://localhost:5173/?verifyToken=...) con el front en npm run dev"
Write-Host " 3. Login con $AccountB / $Pass"
