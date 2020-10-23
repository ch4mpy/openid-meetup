## Build & run

- `./mvnw install -DskipTests`
- `rm -Rf target/dependency`
- `mkdir target/dependency`
- `(cd target/dependency; jar -xf ../\*.jar)`
- `docker build -t tahiti-devops/bar-api .`
- `docker run --add-host=laptop-jerem:172.16.3.19 -p 9080:9080 tahiti-devops/bar-api`
