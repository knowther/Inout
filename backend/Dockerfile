# Etapa 1: compila o jar
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline
COPY src ./src
RUN mvn -q -DskipTests package

# Etapa 2: imagem final só com o JRE
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/estoque-*.jar app.jar
RUN mkdir -p /data
ENV SPRING_DATASOURCE_URL=jdbc:sqlite:/data/estoque.db
VOLUME /data
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
