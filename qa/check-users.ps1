# Lectura del padron de usuarios en prod (requiere admin). Solo GET.
$ErrorActionPreference = "Continue"
$OutDir = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $OutDir "api-url.ps1")
$Api = $EnergyApiUrl

. (Join-Path $PSScriptRoot "load-qa-secrets.ps1")
Require-QaDemoCredentials

$login = Invoke-RestMethod -Uri "$Api/api/v1/auth/login" -Method POST `
    -ContentType "application/json; charset=utf-8" `
    -Body (@{
        email    = $script:QaDemoAdminEmail
        password = $script:QaDemoAdminPassword
    } | ConvertTo-Json -Compress)

$token = $login.data.accessToken
if (-not $token) { Write-Host "No token"; exit 1 }

$users = Invoke-RestMethod -Uri "$Api/api/v1/admin/users" -Method GET `
    -Headers @{ Authorization = "Bearer $token"; Accept = "application/json" }

$list = if ($users.data) { $users.data } else { $users }
$list | Select-Object id, email, role, emailVerified | Format-Table -AutoSize
