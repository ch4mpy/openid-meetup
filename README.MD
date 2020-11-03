Support project for a Meetup about a sample OpenID "full" stack composed of:

- Keycloak as authorization-server
- Spring RESTfull API as resource-server
- Ionic-Angular Web & Android app as client

Meetup slides are accessible [from there](https://drive.google.com/file/d/1BVw5y3nAh9aU2n0q4isGCl5kM3HclsqR/view?usp=sharing) for more background info.

## CI up and running!

A Github action builds both the Angular app and Spring API, and then deploys it on Azure at https://cafe-skifo.azurewebsites.net.

This is a perfect place to start playing with the Meetup show-case app.

## Android app on Google Play

"Café Skifo" is submitted for aproval, but still waiting to be processed. Google states that it might take longer than usual because of COVID-19, so please be patient until first public test release is available.

## Development environment setup

### Prerequisites

- [Git](https://git-scm.com/downloads) (with Git Bash under Windows).
- [Node.js](https://nodejs.org/en/download/) with npm.
- JDK 11 or above.
- Decent IDE(s). I use
  - [VS Code](https://code.visualstudio.com/download) with [John Papa's Angular Essentials](https://marketplace.visualstudio.com/items?itemName=johnpapa.angular-essentials) extension for Ionic / Angular projects.
  - [STS for Eclispe](https://spring.io/tools) for Spring projects.
  - [Android Studio](https://developer.android.com/studio) for building and running Android projects.
- [Keycloak](https://www.keycloak.org/downloads.html)
- SSL certificate. I wrote a [step-by-step tutorial](https://stackoverflow.com/a/63874376/619830) to create a self-signed certificate and register it on Widows, Keycloak, Spring and Ionic app

### Build & run

- if you followed the [step-by-step tutorial](https://stackoverflow.com/a/63874376/619830) referenced above, Keycloak should be running already, as should a DNS resolving a `[hostname]` to your machine
- `cd api`
- copy `src/main/resources/application-laptop-jerem.properties` to adapt SSL certificate and Keycloak host name
- edit `pom.xml` to adapt `<apiDocsUrl>` to your machine host name
- `./mvnw integration-test` to generate OpenAPI JSON file describing public Spring API
- `cd ../angular-clients`
- `npm i` to install npm dependencies and generate a lib from OpenAPI JSON file generated two steps before
- check you duplicated `laptop-jerem` entries in `angular.json` to add equivalents for your SSL certificate
- `ionic cap sync -c=prod-android`
- `ionic capacitor run android -l --ssl --external --public-host=[hostanme]`
- if you want to test from an android device, check wifi settings are pointing to a DNS knowing your host name
