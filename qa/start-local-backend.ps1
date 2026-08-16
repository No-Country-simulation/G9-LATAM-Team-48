# Arranca el backend local para QA de correo.
#
# Diferencias con la corrida normal (no toca backend/.env):
#   - RESEND_API_KEY vacio  -> UserMailService cae a SMTP Gmail, que si entrega
#     a cualquier destinatario (Resend en modo test solo acepta su casilla duena).
#   - MAIL_FROM = cuenta Gmail autenticada (Gmail SMTP rechaza otro remitente).
#   - *_EXPOSE_TOKEN = true -> la API devuelve los tokens y el flujo se puede automatizar.
$ErrorActionPreference = "Stop"

$repo = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $repo "backend\.env"
if (-not (Test-Path $envFile)) { throw "No existe $envFile" }

Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
        $name = $Matches[1]
        $value = $Matches[2].Trim().Trim('"')
        Set-Item -Path "Env:$name" -Value $value
    }
}

$env:SPRING_PROFILES_ACTIVE = "dev"
$env:RESEND_API_KEY = ""
$env:MAIL_ENABLED = "true"
$env:MAIL_FROM = "EnergIA <$($env:MAIL_USERNAME)>"
$env:FRONTEND_BASE_URL = "http://localhost:5173"
$env:EMAIL_VERIFICATION_EXPOSE_TOKEN = "true"
$env:PASSWORD_RESET_EXPOSE_TOKEN = "true"

Write-Host "Perfil    : $($env:SPRING_PROFILES_ACTIVE)"
Write-Host "DB        : $($env:DB_URL)"
Write-Host "Mail via  : SMTP $($env:MAIL_HOST) como $($env:MAIL_USERNAME)"
Write-Host "Front URL : $($env:FRONTEND_BASE_URL)"
Write-Host ""

Set-Location (Join-Path $repo "backend")
mvn -q spring-boot:run
