# Lectura del padron de usuarios en prod (requiere admin). Solo GET.
$ErrorActionPreference = "Continue"
$Api = "https://g9-latam-team-48-production.up.railway.app"

$login = Invoke-RestMethod -Uri "$Api/api/v1/auth/login" -Method POST `
    -ContentType "application/json; charset=utf-8" `
    -Body (@{ email = "admin@energyai.com"; password = "admin1234" } | ConvertTo-Json -Compress)

$token = $login.data.accessToken
if (-not $token) { Write-Host "No token"; exit 1 }

$users = Invoke-RestMethod -Uri "$Api/api/v1/admin/users" -Method GET `
    -Headers @{ Authorization = "Bearer $token"; Accept = "application/json" }

$list = if ($users.data) { $users.data } else { $users }
$list | Select-Object id, email, role, emailVerified | Format-Table -AutoSize
