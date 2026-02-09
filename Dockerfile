# ============================================
# Case à Chocs Connector - Dockerfile
# Multi-stage build pour optimisation
# ============================================

# ===========================================
# STAGE 1: Build - Compilation du projet
# ===========================================
FROM eclipse-temurin:17-jdk-alpine AS builder

# Installer Maven
RUN apk add --no-cache maven

# Répertoire de travail
WORKDIR /app

# Copier TOUT le projet (pom.xml, src/, frontend/)
COPY . .

# Compiler le projet
# -DskipTests : ne pas exécuter les tests
# -Dmaven.test.skip=true : ne pas compiler les tests non plus
RUN mvn clean package -DskipTests -Dmaven.test.skip=true -B

# ===========================================
# STAGE 2: Runtime - Image finale légère
# ===========================================
FROM eclipse-temurin:17-jre-alpine AS runtime

# Métadonnées de l'image
LABEL maintainer="Equipe Zhongma International Construction"
LABEL description="Case à Chocs Connector - Intégration HEEDS/PETZI"
LABEL version="1.0.0"

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Répertoire de travail
WORKDIR /app

# Copier le JAR depuis le stage builder
COPY --from=builder /app/target/*.jar app.jar

# Changer le propriétaire des fichiers
RUN chown -R appuser:appgroup /app

# Utiliser l'utilisateur non-root
USER appuser

# Port exposé (Spring Boot default)
EXPOSE 8080

# Variables d'environnement par défaut
ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENV SPRING_PROFILES_ACTIVE="prod"

# Health check - vérifie que l'API répond
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

# Commande de démarrage
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]