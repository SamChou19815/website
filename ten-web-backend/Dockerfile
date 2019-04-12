FROM gradle:5.3.1 as builder

COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY src ./src

RUN gradle build

FROM openjdk:11-jre-stretch

# Copy the jar to the production image from the builder stage.
COPY --from=builder /home/gradle/build/libs/server.jar /server.jar

# Run the web service on container startup.
CMD [ "java", "-jar", "/server.jar" ]
