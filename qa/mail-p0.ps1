# Dispara los mails reales que faltan para P0-05 / P1-04.
$ErrorActionPreference = "Continue"
$OutDir = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $OutDir "api-url.ps1")
$Api = $EnergyApiUrl

. (Join-Path $PSScriptRoot "load-qa-secrets.ps1")
Require-QaInbox

$Inbox = $script:QaInbox
$stamp = Get-Date -Format "MMddHHmm"
$at = $Inbox.IndexOf("@")
if ($at -lt 1) { throw "QA_INBOX invalido" }
$Alias = $Inbox.Insert($at, "+qa$stamp")

function Post-Json($url, $body) {
    try {
        $resp = Invoke-WebRequest -Uri $url -Method POST -UseBasicParsing -TimeoutSec 45 `
            -ContentType "application/json; charset=utf-8" `
            -Body ($body | ConvertTo-Json -Compress)
        return @{ Code = [int]$resp.StatusCode; Body = $resp.Content }
    }
    catch {
        $code = $null; $content = $null
        if ($_.Exception.Response) {
            $code = [int]$_.Exception.Response.StatusCode
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $content = $reader.ReadToEnd()
            } catch {}
        }
        return @{ Code = $code; Body = $content; Error = $_.Exception.Message }
    }
}

Write-Host "=== Mails reales (revisar bandeja configurada en QA_INBOX) ==="
Write-Host ""

$qaPass = [Environment]::GetEnvironmentVariable("QA_THROWAWAY_PASSWORD")
if ([string]::IsNullOrWhiteSpace($qaPass)) { $qaPass = "qaTest1234" }

# 1) P0-05: cuenta nueva con alias +qa (Gmail entrega al mismo buzon si el SMTP lo permite)
$reg = Post-Json "$Api/api/v1/auth/register" @{
    name     = "QA Verify $stamp"
    email    = $Alias
    password = $qaPass
}
Write-Host "[register] $Alias -> code=$($reg.Code)"
Write-Host "           body=$($reg.Body)"

# 2) P1-04: reset password a la direccion exacta permitida por Resend
$forgot = Post-Json "$Api/api/v1/auth/forgot-password" @{ email = $Inbox }
Write-Host "[forgot-password] buzon QA -> code=$($forgot.Code)"
Write-Host "           body=$($forgot.Body)"

Write-Host ""
Write-Host "Siguiente paso manual:"
Write-Host " - Mail 'Verifica tu email' -> abrir link ?verifyToken= -> luego login con la cuenta de prueba"
Write-Host " - Mail 'Recuperar contrasena' -> confirma que el envio real funciona (no hace falta usar el link)"
Write-Host " - Si NO llega el alias + pero SI el buzon principal: Resend puede rechazar alias +; avisar para plan B"
