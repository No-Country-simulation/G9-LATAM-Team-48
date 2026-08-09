# QA — EnergIA (Team 48)

Carpeta **independiente** de `frontend/`, `backend/` y `datascience/`.  
Aquí vive la checklist de pruebas y scripts de smoke; no modifica el código de producto.

| Archivo | Uso |
|---------|-----|
| [QA.md](./QA.md) | Checklist manual P0/P1 + cómo correr tests existentes |
| [api-url.ps1](./api-url.ps1) | URL canónica Railway prod (`ENERGY_API_URL` opcional) |
| [smoke-api.ps1](./smoke-api.ps1) | Probes HTTP de solo lectura contra Railway |
| [run-p0.ps1](./run-p0.ps1) | Corrida P0 contra prod (registro/login/análisis/admin; escribe `*-results.json` local, gitignored) |
| [check-users.ps1](./check-users.ps1) | Padrón de usuarios en prod vía admin (solo GET) |
| [mail-p0.ps1](./mail-p0.ps1) | Dispara los mails reales (verify / forgot) hacia la casilla habilitada |
| [start-local-backend.ps1](./start-local-backend.ps1) | Backend local con SMTP Gmail (en vez de Resend) y tokens expuestos |
| [run-mail-local.ps1](./run-mail-local.ps1) | Flujo completo verify / reset contra `localhost:8080` |
| [run-p1.ps1](./run-p1.ps1) | Corrida P1 contra prod (consumos/historia/admin/contacto/roles) |
| [inspect-google-i18n.ps1](./inspect-google-i18n.ps1) | Inspección Client ID + i18n en el bundle de Vercel |
| [import-dataset-railway.ps1](./import-dataset-railway.ps1) | Carga `03_feature_engineering.csv` → MySQL (activa `fromDataset` en API) |
| [load-qa-secrets.ps1](./load-qa-secrets.ps1) + [secrets.local.ps1.example](./secrets.local.ps1.example) | Credenciales QA fuera de Git |

Rama de deploy de referencia: `Jorge-martinez`.

### Secretos y GitGuardian

- **Nunca** commitear `backend/.env`, `.env` en la raíz, `qa/secrets.local.ps1` ni contraseñas junto a emails en docs.
- Scripts `run-p0.ps1`, `run-p1.ps1`, `check-users.ps1`, `mail-p0.ps1`, `run-mail-local.ps1` leen `QA_DEMO_*`, `QA_INBOX` o `secrets.local.ps1` (copiá desde `secrets.local.ps1.example`).
- Si GitGuardian alertó una **App Password de Gmail** u otra clave real: **revocala ya** en Google / Resend / Railway y generá una nueva; un commit que la quite del código **no borra** el historial de GitHub.
- Para borrar del historial: [GitHub — removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository) o BFG; luego marcar el incidente como resuelto en GitGuardian.

### Git hooks (co-autoría Cursor)

Tras clonar, ejecutá **`scripts/setup-git-hooks.ps1`** (o `.sh`) para activar `.githooks/` y evitar `Co-authored-by: Cursor` en commits/push. Detalle: [`.cursor/rules/git-commits-no-cursor-coauthor.mdc`](../.cursor/rules/git-commits-no-cursor-coauthor.mdc).
