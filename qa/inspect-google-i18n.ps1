$ErrorActionPreference = "Continue"
$Front = "https://g9-latam-team-48.vercel.app"
$html = (Invoke-WebRequest -Uri $Front -UseBasicParsing -TimeoutSec 30).Content
Write-Host ("HTML len={0}" -f $html.Length)
$scripts = [regex]::Matches($html, 'src="([^"]+)"')
foreach ($s in $scripts) { Write-Host ("script {0}" -f $s.Groups[1].Value) }

$m = [regex]::Matches($html, 'src="(/assets/[^"]+\.js)"')
foreach ($x in $m) {
    $url = $Front + $x.Groups[1].Value
    Write-Host ("fetch {0}" -f $url)
    $js = (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 60).Content
    Write-Host ("js len={0}" -f $js.Length)
    if ($js -match "googleusercontent") { Write-Host "HAS googleusercontent" }
    if ($js -match "7592855791") { Write-Host "HAS local client id prefix" }
    if ($js -match "accounts\.google|gsi/client") { Write-Host "HAS GIS refs" }
    if ($js -match "chooseLanguage|mapConfirmLanguage|Eleg") { Write-Host "HAS i18n language UI strings" }
    if ($js -match "historiaConsumos") { Write-Host "HAS historiaConsumos" }
    [regex]::Matches($js, "[0-9]{6,}-[a-z0-9]+\.apps\.googleusercontent\.com") | ForEach-Object {
        Write-Host ("CLIENT {0}" -f $_.Value)
    }
    $idx = $js.IndexOf("google")
    if ($idx -ge 0) {
        $start = [Math]::Max(0, $idx - 60)
        $len = [Math]::Min(200, $js.Length - $start)
        Write-Host ("google snippet: {0}" -f $js.Substring($start, $len))
    }
    $idx2 = $js.IndexOf("GOOGLE")
    if ($idx2 -ge 0) {
        $start2 = [Math]::Max(0, $idx2 - 40)
        $len2 = [Math]::Min(160, $js.Length - $start2)
        Write-Host ("GOOGLE snippet: {0}" -f $js.Substring($start2, $len2))
    }
    $idx3 = $js.IndexOf("Client")
    # look for import.meta env baked values pattern often ""
    if ($js -match 'VITE_GOOGLE_CLIENT_ID') { Write-Host "literal VITE_GOOGLE_CLIENT_ID present" }
}

# Local frontend env for comparison
$localEnv = "f:\Proyectos-Cursos\ALURA-G9\hackathon\G9-LATAM-Team-48\frontend\.env"
if (Test-Path $localEnv) {
    Get-Content $localEnv | Where-Object { $_ -match "GOOGLE" } | ForEach-Object { Write-Host ("local env: {0}" -f $_) }
}

# Google API behavior on prod
$OutDir = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $OutDir "api-url.ps1")
$Api = $EnergyApiUrl
try {
    $resp = Invoke-WebRequest -Uri "$Api/api/v1/auth/google" -Method POST -UseBasicParsing -TimeoutSec 30 `
        -ContentType "application/json" -Body '{"credential":"invalid.jwt.qa"}'
    Write-Host ("google api unexpected success {0}" -f $resp.StatusCode)
} catch {
    $code = [int]$_.Exception.Response.StatusCode
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $body = $reader.ReadToEnd()
    Write-Host ("google api code={0} body={1}" -f $code, $body)
}
