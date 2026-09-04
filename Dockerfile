# ============================================================================
# Stage 1: build — compila la app React con Vite
# ============================================================================
FROM node:22-alpine AS build
WORKDIR /app

# Copiamos primero los manifiestos para cachear la instalacion de dependencias
COPY package*.json ./
RUN npm ci

# Codigo fuente y build. VITE_API_URL se hornea en el bundle (build-time).
COPY . .
ARG VITE_API_URL=http://localhost:8080/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ============================================================================
# Stage 2: runtime — Nginx sirviendo los estaticos
# ============================================================================
FROM nginx:1.31.5-alpine3.24 AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Verifica que Nginx sirve el index (wget viene con la base alpine/busybox)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
