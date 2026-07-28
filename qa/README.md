# QA — EnergIA (Team 48)

Carpeta **independiente** de `frontend/`, `backend/` y `datascience/`.  
Aquí vive la checklist de pruebas y scripts de smoke; no modifica el código de producto.

| Archivo | Uso |
|---------|-----|
| [QA.md](./QA.md) | Checklist manual P0/P1 + cómo correr tests existentes |
| [smoke-api.ps1](./smoke-api.ps1) | Probes HTTP de solo lectura contra Railway |
| [run-p0.ps1](./run-p0.ps1) | Corrida P0 contra prod (registro/login/análisis/admin; escribe `p0-results.json`) |
| [check-users.ps1](./check-users.ps1) | Padrón de usuarios en prod vía admin (solo GET) |
| [mail-p0.ps1](./mail-p0.ps1) | Dispara los mails reales (verify / forgot) hacia la casilla habilitada |
| [start-local-backend.ps1](./start-local-backend.ps1) | Backend local con SMTP Gmail (en vez de Resend) y tokens expuestos |
| [run-mail-local.ps1](./run-mail-local.ps1) | Flujo completo verify / reset contra `localhost:8080` |
| [run-p1.ps1](./run-p1.ps1) | Corrida P1 contra prod (consumos/historia/admin/contacto/roles) |
| [inspect-google-i18n.ps1](./inspect-google-i18n.ps1) | Inspección Client ID + i18n en el bundle de Vercel |
| [NAS-DOCKER.md](./NAS-DOCKER.md) | Stack en QNAP (`192.168.0.116`, `:3000` / `:8082`, `docker run`) |

Rama de deploy de referencia: `Jorge-martinez`.
