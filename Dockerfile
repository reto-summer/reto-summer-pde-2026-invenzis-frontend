# Build 
FROM node:20-alpine AS build

WORKDIR /app

# instalar dependencias
COPY package*.json ./
RUN npm ci

# copiar código
COPY . .

# build producción (Vite -> dist/)
RUN npm run build


# Runtime
FROM nginx:1.27-alpine

# copiar configuración nginx compatible con Cloud Run
COPY nginx.conf /etc/nginx/templates/default.conf.template

# copiar archivos build
COPY --from=build /app/dist /usr/share/nginx/html

# Cloud Run usa PORT dinámico
ENV PORT=8080

# iniciar nginx usando el puerto asignado
CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
