# ============================================================================
# Dockerfile base - Energy Backend (multi-stage build)
# ----------------------------------------------------------------------------
# Etapa 1 (build): compila y empaqueta el jar con Maven sobre JDK 21.
# Etapa 2 (runtime): imagen ligera con solo el JRE 21 y el jar resultante.
# ============================================================================

# ---- Etapa de construccion -------------------------------------------------
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Descarga de dependencias en una capa cacheable (solo se reejecuta si cambia el pom).
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Compilacion y empaquetado (los tests se ejecutan en el pipeline de CI, no aqui).
COPY src ./src
RUN mvn -B clean package -DskipTests

# ---- Etapa de ejecucion ----------------------------------------------------
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

# Usuario no root por seguridad.
RUN addgroup -S app && adduser -S app -G app
USER app

COPY --from=build /app/target/*.jar app.jar

# Perfil por defecto en contenedor; sobrescribible en despliegue.
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
