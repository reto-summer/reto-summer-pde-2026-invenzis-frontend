# Build
FROM node:20-alpine AS build
WORKDIR /app

# DECLARAR EL ARGUMENTO AQUÍ
ARG API_BASE_URL
# Pasamos a variable de entorno para que Vite lo vea
ENV VITE_API_BASE_URL=$API_BASE_URL

# Instala deps de forma reproducible
COPY package*.json ./
RUN npm ci

# Copia el resto y construye
COPY . .
RUN npm run build

# Run
FROM nginx:1.27-alpine

# Nginx template (necesitamos $PORT para Cloud Run)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copia build de Vite (dist/)
COPY --from=build /app/dist /usr/share/nginx/html

# Cloud Run define PORT dinámico; dejamos default
ENV PORT=8080

# Renderiza el template con $PORT y arranca nginx
CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
