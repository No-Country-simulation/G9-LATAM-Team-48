# URL canónica del backend en Railway (prod). Override con ENERGY_API_URL.
$script:EnergyApiUrl = if ($env:ENERGY_API_URL) {
    $env:ENERGY_API_URL.TrimEnd("/")
} else {
    "https://g9-latam-team-48-production-f9a0.up.railway.app"
}
