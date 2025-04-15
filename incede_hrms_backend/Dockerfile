# ---- Stage 1: Build the application ----
    FROM maven:3.8.8-eclipse-temurin-21 AS build
    WORKDIR /app
    
    # Copy only pom.xml first and download dependencies (cache boost)
    COPY pom.xml .
    RUN mvn dependency:go-offline
    
    # Copy the source code
    COPY src ./src
    
    # Build the project
    RUN mvn clean package -DskipTests
    
    # ---- Stage 2: Create the runtime image ----
    FROM openjdk:21-jdk-slim
    WORKDIR /app
    VOLUME /tmp
    
    # Expose the port Spring Boot runs on
    EXPOSE 8080
    
    # Copy the jar from the build stage
    COPY --from=build /app/target/*.jar app.jar
    
    # Start the Spring Boot application
    ENTRYPOINT ["java", "-jar", "app.jar"]
    
    
