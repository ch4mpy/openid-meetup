## Build & run

- `./mvnw install -DskipTests`
- `rm -Rf target/dependency`
- `mkdir target/dependency`
- `(cd target/dependency; jar -xf ../\*.jar)`
- `docker build -t tahiti-devops/cafe-skifo .`
- `docker run --add-host=ch4mpy-bravo:172.16.3.19 -p 9080:9080 tahiti-devops/cafe-skifo`
