# Carga credenciales locales para scripts QA (nunca versionar secrets.local.ps1).
$ErrorActionPreference = "Stop"
$secretsFile = Join-Path $PSScriptRoot "secrets.local.ps1"
if (Test-Path $secretsFile) {
    . $secretsFile
}

function Get-QaSecret {
    param(
        [string]$Name,
        [string]$EnvName
    )
    $var = Get-Variable -Name $Name -Scope Script -ErrorAction SilentlyContinue
    if ($var -and -not [string]::IsNullOrWhiteSpace($var.Value)) {
        return $var.Value
    }
    $fromEnv = [Environment]::GetEnvironmentVariable($EnvName)
    if (-not [string]::IsNullOrWhiteSpace($fromEnv)) {
        return $fromEnv
    }
    return $null
}

$script:QaDemoOperadorEmail = Get-QaSecret -Name "QaDemoOperadorEmail" -EnvName "QA_DEMO_OPERADOR_EMAIL"
$script:QaDemoOperadorPassword = Get-QaSecret -Name "QaDemoOperadorPassword" -EnvName "QA_DEMO_OPERADOR_PASSWORD"
$script:QaDemoAdminEmail = Get-QaSecret -Name "QaDemoAdminEmail" -EnvName "QA_DEMO_ADMIN_EMAIL"
$script:QaDemoAdminPassword = Get-QaSecret -Name "QaDemoAdminPassword" -EnvName "QA_DEMO_ADMIN_PASSWORD"
$script:QaInbox = Get-QaSecret -Name "QaInbox" -EnvName "QA_INBOX"

function Require-QaDemoCredentials {
    if (-not $script:QaDemoOperadorEmail -or -not $script:QaDemoOperadorPassword) {
        throw "Faltan QA_DEMO_OPERADOR_EMAIL / QA_DEMO_OPERADOR_PASSWORD (o qa/secrets.local.ps1). Ver qa/secrets.local.ps1.example"
    }
    if (-not $script:QaDemoAdminEmail -or -not $script:QaDemoAdminPassword) {
        throw "Faltan QA_DEMO_ADMIN_EMAIL / QA_DEMO_ADMIN_PASSWORD (o qa/secrets.local.ps1). Ver qa/secrets.local.ps1.example"
    }
}

function Require-QaInbox {
    if (-not $script:QaInbox) {
        throw "Falta QA_INBOX (o qa/secrets.local.ps1). No commitear correos personales en el repo."
    }
}
