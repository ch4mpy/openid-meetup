Support project for a Meetup about a sample OpenID "full" stack composed of:

- Keycloak as authorization-server
- Spring RESTfull API as resource-server
- Ionic-Angular Web & Android app as client

Meetup Power-Point is joined for more background info.

## Setup

### Prerequisites

- [Git](https://git-scm.com/downloads) (with Git Bash under Windows).
- [Node.js](https://nodejs.org/en/download/) with npm.
- JDK 11. Not 8, not 14, **11**: my test lib requires 11 at minimum and Keycloak 11 does not support JDK above 11.
- Decent IDE(s). I use
  - [VS Code](https://code.visualstudio.com/download) with [John Papa's Angular Essentials](https://marketplace.visualstudio.com/items?itemName=johnpapa.angular-essentials) extension for Ionic / Angular projects.
  - [STS for Eclispe](https://spring.io/tools) for Spring projects.
  - [Android Studio](https://developer.android.com/studio) for building and running Android projects.
- [Keycloak](https://www.keycloak.org/downloads.html)
- SSL certificate. I wrote a [step-by-step tutorial](https://stackoverflow.com/a/63874376/619830) to create a self-signed certificate and register it on Widows, Keycloak, Spring and Ionic app

### Build & run

- if you followed the [step-by-step tutorial](https://stackoverflow.com/a/63874376/619830) referenced above, Keycloak should be running already, as should a DNS resolving a `[hostname]` to your machine
- `cd bar-api`
- edit `src/main/resources/application.properties` to adapt SSL certificate and Keycloak host name
- edit `pom.xml` to adapt `<apiDocsUrl>` to your machine host name
- `./mvnw install`
- `./mvnw spring-boot:run`
- `cd ../angular-clients`
- `npm i`
- check you duplicated `laptop-jerem` entries in `angular.json` to add equivalents for your SSL certificate
- `ionic cap sync`
- `ionic capacitor run android -l --ssl --host=[hostanme]`
- if you want to test from an android device, check wifi settings are pointing to a DNS knowing your host name
