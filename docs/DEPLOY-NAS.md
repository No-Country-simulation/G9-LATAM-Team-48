# Despliegue en NAS (Docker) — EnergyAI

Guía rápida para correr frontend + backend en el NAS con Docker.

## 1. Conectar Cursor / VS Code al NAS (recomendado)

1. Instalá la extensión **Remote - SSH**.
2. `F1` → **Remote-SSH: Connect to Host…** → `NASTNL`
   - Host: `192.168.0.116`
   - User: `jorge`
   - Port: `2222`
3. Ingresá la contraseña cuando la pida.
4. Abrí la carpeta del proyecto en el NAS (o cloná el repo ahí).

Opcional (más seguro): configurar llave SSH para no usar contraseña:

```bash
# En tu PC (PowerShell)
ssh-keygen -t ed25519 -C "nas-tnl"
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh -p 2222 jorge@192.168.0.116 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

## 2. Preparar el proyecto en el NAS

```bash
# Ejemplo de carpeta (ajustá a tu volumen)
mkdir -p ~/projects
cd ~/projects
git clone -b develop https://github.com/No-Country-simulation/G9-LATAM-Team-48.git
cd G9-LATAM-Team-48

cp .env.example .env
# Editá .env y cambiá JWT_SECRET
```

## 3. Levantar con Docker Compose

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f
```

## 4. Abrir en el navegador (red local)

| Servicio  | URL |
|-----------|-----|
| Frontend  | `http://192.168.0.116:3000` |
| Backend   | `http://192.168.0.116:8080` |
| Swagger   | `http://192.168.0.116:8080/swagger-ui.html` |

El frontend también proxea `/api` hacia el backend dentro de Docker.

## 5. Comandos útiles

```bash
docker compose down          # parar
docker compose up -d --build # reconstruir y levantar
docker compose logs backend  # logs del backend
docker compose logs frontend # logs del frontend
```

## Notas

- No subas el archivo `.env` a Git (tiene secretos).
- Data Science todavía no está en el compose; se puede agregar después como servicio aparte.
- Si el puerto 3000 u 8080 está ocupado, cambialo en `.env`.
