# ============================================
# Case à Chocs Connector - Frontend Dockerfile
# Build React + Serve avec Nginx
# ============================================

# ===========================================
# STAGE 1: Build - Compilation React
# ===========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build de production
RUN npm run build

# ===========================================
# STAGE 2: Runtime - Nginx pour servir
# ===========================================
FROM nginx:alpine AS runtime

# Copier la config Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier le build React
COPY --from=builder /app/dist /usr/share/nginx/html

# Port exposé
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
