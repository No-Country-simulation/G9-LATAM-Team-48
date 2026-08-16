# EnergyAI en el NAS (QNAP NASTNL)

Mapa operativo del stack Docker. **No** confundir con Vercel/OCI ni con `docker compose` del repo (en este QNAP `compose` falló por un bug de red; se usa `docker run`).

## Host

| Dato | Valor |
|------|--------|
| NAS | **NASTNL** — `192.168.0.116` (no usar `192.168.0.166`) |
| SSH | `Jorge@NASTNL` |
| Proyecto Docker (build/`docker run`) | `/share/CACHEDEV1_DATA/proyectos/G9-LATAM-Team-48` |
| Copia en share Datos (Windows `N:\`) | `/share/Datos/Proyectos/Cursos/ALURA-G9/hackathon/G9-LATAM-Team-48` → volumen `CACHEDEV3_DATA` |
| Otra copia bajo ALURA-G9 (sin `hackathon`) | `/share/CACHEDEV3_DATA/Datos/Proyectos/Cursos/ALURA-G9/G9-LATAM-Team-48` |
| Docker config | `DOCKER_CONFIG=/share/CACHEDEV1_DATA/proyectos/.docker` |
| HOME Docker | `HOME=/share/CACHEDEV1_DATA/proyectos` |
| Binarios CS | `/share/CACHEDEV1_DATA/.qpkg/container-station/bin` |

Hay **más de una copia** del repo. Para rebuild de contenedores usá siempre la de **`CACHEDEV1_DATA/proyectos`**. Para editar desde Windows: `N:\Proyectos\Cursos\ALURA-G9\hackathon\G9-LATAM-Team-48`.

## URLs (LAN)

| Servicio | URL |
|----------|-----|
| Frontend | http://192.168.0.116:3000 |
| Backend | http://192.168.0.116:8082 |
| Health | http://192.168.0.116:8082/actuator/health |
| Swagger | http://192.168.0.116:8082/swagger-ui/index.html |

Contenedores: `energyai-frontend`, `energyai-backend`.

## Terminal remota (siempre al abrir sesión)

```bash
export PATH="/share/CACHEDEV1_DATA/.qpkg/container-station/bin:$PATH"
export DOCKER_CONFIG=/share/CACHEDEV1_DATA/proyectos/.docker
export HOME=/share/CACHEDEV1_DATA/proyectos

docker ps | grep energyai
docker logs -f energyai-backend
docker logs -f energyai-frontend
docker restart energyai-backend energyai-frontend
docker stop energyai-backend energyai-frontend
docker start energyai-backend energyai-frontend
```

## Rebuild tras cambiar código

```bash
cd /share/CACHEDEV1_DATA/proyectos/G9-LATAM-Team-48
# (sync/actualizar archivos desde el PC)

docker build -t g9-latam-team-48-backend ./backend
docker build -t g9-latam-team-48-frontend ./frontend
docker rm -f energyai-backend energyai-frontend

docker run -d --name energyai-backend --restart unless-stopped -p 8082:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e SERVER_PORT=8080 \
  -e JWT_SECRET=cambia-este-secreto-por-uno-largo-y-aleatorio \
  -e SPRINGDOC_SWAGGER_UI_ENABLED=true \
  -e GOOGLE_CLIENT_ID=TU_CLIENT_ID \
  g9-latam-team-48-backend

# --link …:backend = nginx puede resolver el upstream (o usá red común + nombre energyai-backend)
docker run -d --name energyai-frontend --restart unless-stopped \
  --link energyai-backend:backend \
  --link energyai-backend:energyai-backend \
  -p 3000:80 energyai-frontend
```


## Notas

- Backend en NAS: puerto **8082** (no 8080 del `docker-compose.yml` genérico).
- Para Google Sign-In en LAN: origin `http://192.168.0.116:3000` + bake `VITE_GOOGLE_CLIENT_ID` en el rebuild del front.
- Si el front viejo aún apunta a `localhost:8000`, hay que copiar el fix desde el PC y **rebuild** del frontend.
- Chequeo rápido desde el PC: abrir http://192.168.0.116:3000 y http://192.168.0.116:8082/actuator/health

## Cursor Remote SSH (`NASTNL-Docker`)

Host en `~/.ssh/config`: `HostName 192.168.0.116`, `User Jorge`, llave `id_ed25519_nas`.  
En Cursor ya debería estar `"remote.SSH.remoteServerListenOnSocket": true` (QNAP suele tener `AllowTcpForwarding no`).

### Si el log muestra `channel … open failed` / `ECONNRESET`

El server de Cursor quedó colgado con sockets muertos en `/tmp`. **No es que falte el proyecto.**

1. Conectá por SSH normal (terminal, no Remote-SSH de Cursor):
   ```bash
   ssh NASTNL-Docker
   ```
2. En el NAS, limpiá el server viejo:
   ```bash
   pkill -f cursor-server || true
   pkill -f multiplex-server || true
   rm -rf /tmp/cursor-remote-ssh-* \
          /tmp/cursor-remote-*.token* \
          /tmp/cursor-remote-lock.* \
          /tmp/cursor-remote-code.log* \
          /tmp/cursor-remote-multiplex.log* 2>/dev/null || true
   ```
3. En Cursor local: Command Palette → **Remote-SSH: Kill Local Connection** / cerrá la ventana remota, y volvé a conectar a `NASTNL-Docker`.
4. Abrí la carpeta del proyecto Docker:
   `/share/CACHEDEV1_DATA/proyectos/G9-LATAM-Team-48`

Si sigue fallando: en el QNAP, Control Panel → Telnet/SSH (o `sshd_config`) habilitar **TCP forwarding** si la UI lo permite, reiniciar SSH, y reintentar. Alternativa estable: editar en el PC (`F:\…` o `N:\…`) y rebuild por SSH con los comandos de arriba.
