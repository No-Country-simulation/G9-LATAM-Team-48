# Multi-stage build — EnergIA Frontend
# Etapa 1: build con Node
# Etapa 2: servir estáticos con nginx

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# URL del backend vista desde el navegador.
# En docker-compose (NAS), nginx proxea /api → backend: VITE_API_URL vacío = rutas relativas.
ARG VITE_API_URL=
ARG VITE_USE_MOCK_AUTH=false
ARG VITE_ML_API_URL=
# Mismo Client ID que GOOGLE_CLIENT_ID del backend (bake en build time)
ARG VITE_GOOGLE_CLIENT_ID=
ENV VITE_API_URL=$VITE_API_URL \
    VITE_USE_MOCK_AUTH=$VITE_USE_MOCK_AUTH \
    VITE_ML_API_URL=$VITE_ML_API_URL \
    VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
