# Capturas de pantalla

Imágenes del README. Regenerar las automatizadas con el front levantado:

```bash
npm run dev          # en una terminal
npm run screenshots  # en otra
```

Formato: **PNG**, viewport ~**1440×900** (o `fullPage` en dashboard/páginas largas). Preferible **tema oscuro** + **locale `es`** para consistencia con la demo.

## Ya publicadas en el README

| Archivo | Vista |
|---------|--------|
| `dashboard.png` | Dashboard (resumen, insights, gráficos) |
| `consumos.png` | Consumos |
| `analisis-ia.png` | Análisis IA (formulario + gráfico vs referencia + tips) |
| `recomendaciones.png` | Recomendaciones |
| `login.png` | Modal — pestaña Entrar |
| `registro.png` | Modal — pestaña Registrarse |
| `admin-usuarios.png` | Panel Admin — listado de usuarios |
| `admin-crear-usuario.png` | Modal — Crear usuario |
| `admin-editar-usuario.png` | Modal — Editar usuario |
| `forgot-password.png` | Modal — Recuperar contraseña |
| `reset-password.png` | Pantalla — Nueva contraseña (link del mail) |
| `verify-email.png` | Pantalla — Verificar email (link del mail) |
| `contacto.png` | Contáctanos (formulario + Equipo 48) |

## Pendientes (pasar estas capturas para sumarlas al README)

| Archivo sugerido | Cómo sacarla | Notas |
|------------------|--------------|--------|
| `mapa-idiomas.png` | Header → Idioma → mapa abierto con un país seleccionado / diálogo de confirmar | **Prioridad alta** (feature nueva) |
| `historia-consumos.png` | Login operador → menú **Historial de consumos** | Requiere sesión |
| `admin-analisis.png` | Login `admin@energyai.com` → Admin · **Análisis IA** | Requiere ADMIN |

## Conviene refrescar (UI cambió)

| Archivo | Motivo |
|---------|--------|
| `analisis-ia.png` | Tipos: apartamento / casa / comercio (ya no fábricas) |
| `dashboard.png` | Marca, a11y y layout actual |
| `recomendaciones.png` | Tip keys / copy actualizados |

Al pasar las imágenes: dejá los **mismos nombres de archivo** (o los de la columna “Archivo sugerido”) en `frontend/screenshots/` y avisá para actualizar las tablas del README.
