FROM adoptopenjdk:11-jre-hotspot as builder

WORKDIR /opt/workdir/
COPY laptop-jerem_self_signed.crt /opt/workdir/
RUN keytool -importcert -file laptop-jerem_self_signed.crt -alias laptop-jerem_self_signed -cacerts -storepass changeit -noprompt

VOLUME /tmp
WORKDIR /tmp
ARG DEPENDENCY=target/dependency
COPY ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY ${DEPENDENCY}/META-INF /app/META-INF
COPY ${DEPENDENCY}/BOOT-INF/classes /app
ENTRYPOINT ["java","-cp","/app:/app/lib/*","com.c4soft.tahitidevops.bar.BarApiApplication"]