# Capturas de pantalla

Imágenes del README (tema oscuro, locale `es`, iconos actuales del menú).

Regenerar las automatizadas:

```bash
npm run dev          # en una terminal (con VITE_GOOGLE_CLIENT_ID en .env)
npm run screenshots  # en otra
```

Solo **login** y **registro** (recomendado, usa la demo en Vercel con Google ya configurado):

```bash
# PowerShell
$env:APP_URL = "https://g9-latam-team-48.vercel.app"
npm run screenshots:auth
```

Solo **Análisis IA** (formulario 12 campos + resultado):

```bash
$env:APP_URL = "https://g9-latam-team-48.vercel.app"
npm run screenshots:analisis
```

El script espera el iframe de **Continuar con Google** antes de guardar cada PNG.

Formato: **PNG**, viewport ~**1440×900** (o `fullPage` en páginas largas).

## Publicadas en el README

| Archivo | Vista |
|---------|--------|
| `dashboard.png` | Dashboard (KPIs, insights, gráficos) |
| `consumos.png` | Consumos energéticos |
| `historia-consumos.png` | Historia de consumos (análisis guardados) |
| `analisis-ia.png` | Análisis IA — formulario **12 campos ML** + opcionales legacy; panel derecho (gráfico y tips vacíos hasta analizar) |
| `mapa-idiomas.png` | Modal mapa mundial de idiomas |
| `recomendaciones.png` | Recomendaciones IA |
| `contacto.png` | Contáctanos + Equipo 48 |
| `admin-usuarios.png` | Panel Admin — Usuarios |
| `admin-analisis.png` | Admin — Análisis IA (historial global) |
| `login.png` | Modal **Iniciar sesión** — Google Sign-In + aviso **corto** (`googleBlockHintShort`) |
| `login-bloqueador.png` | Mismo modal con aviso **ampliado** cuando el bloqueador impide el popup (`googleBlockHint`) |
| `registro.png` | Modal **Crear cuenta** (misma UX Google + avisos que login) |
| `admin-crear-usuario.png` | Modal — Crear usuario |
| `admin-editar-usuario.png` | Modal — Editar usuario |
| `forgot-password.png` | Modal — Recuperar contraseña |
| `reset-password.png` | Nueva contraseña (vía `?resetToken=` del mail; captura del flujo documentado) |
| `verify-email.png` | Verificar email (vía `?verifyToken=` del mail) |

En la demo el SMTP no llega a todas las bandejas; por eso reset puede no regenerarse en vivo, pero el flujo y la captura se mantienen en el README.
