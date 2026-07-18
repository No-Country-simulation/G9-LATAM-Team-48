# Multi-stage build — EnergyAI Frontend
# Etapa 1: build con Node
# Etapa 2: servir estáticos con nginx

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# URL del backend vista desde el navegador.
# En docker-compose, nginx proxea /api → backend, así que usamos ruta relativa.
ARG VITE_API_URL=
ARG VITE_USE_MOCK_AUTH=false
ARG VITE_USE_MOCK_API=false
ENV VITE_API_URL=$VITE_API_URL \
    VITE_USE_MOCK_AUTH=$VITE_USE_MOCK_AUTH \
    VITE_USE_MOCK_API=$VITE_USE_MOCK_API

RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
