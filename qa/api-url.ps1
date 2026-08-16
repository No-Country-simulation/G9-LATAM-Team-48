# URL canónica del backend en prod. Override con ENERGY_API_URL.
# Default: OCI directo (smoke completo incl. /v3/api-docs).
# Para probar el proxy del front: ENERGY_API_URL=https://g9-latam-team-48.vercel.app
$script:EnergyApiUrl = if ($env:ENERGY_API_URL) {
    $env:ENERGY_API_URL.TrimEnd("/")
} else {
    "http://163.176.248.56:8080"
}
