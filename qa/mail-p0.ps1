# Dispara los mails reales que faltan para P0-05 / P1-04.
# Buzon disponible en la demo: sandokan992000@gmail.com (Resend en modo test).
$ErrorActionPreference = "Continue"
$Api = "https://g9-latam-team-48-production.up.railway.app"
$Inbox = "sandokan992000@gmail.com"
$stamp = Get-Date -Format "MMddHHmm"
$Alias = "sandokan992000+qa$stamp@gmail.com"

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

Write-Host "=== Mails reales (revisar bandeja de $Inbox) ==="
Write-Host ""

# 1) P0-05: cuenta nueva con alias +qa (Gmail entrega al mismo buzon)
$reg = Post-Json "$Api/api/v1/auth/register" @{
    name     = "QA Verify $stamp"
    email    = $Alias
    password = "qaTest1234"
}
Write-Host "[register] $Alias -> code=$($reg.Code)"
Write-Host "           body=$($reg.Body)"

# 2) P1-04: reset password a la direccion exacta permitida por Resend
$forgot = Post-Json "$Api/api/v1/auth/forgot-password" @{ email = $Inbox }
Write-Host "[forgot-password] $Inbox -> code=$($forgot.Code)"
Write-Host "           body=$($forgot.Body)"

Write-Host ""
Write-Host "Siguiente paso manual:"
Write-Host " - Mail 'Verifica tu email' -> abrir link ?verifyToken= -> luego login con $Alias / qaTest1234"
Write-Host " - Mail 'Recuperar contrasena' -> confirma que el envio real funciona (no hace falta usar el link)"
Write-Host " - Si NO llega el de $Alias pero SI el de ${Inbox}: Resend rechaza alias +; avisar para plan B"
