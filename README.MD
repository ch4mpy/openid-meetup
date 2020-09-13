## Setup

### Prerequisites

- [Git](https://git-scm.com/downloads) (with Git Bash under Windows).
- [Node.js](https://nodejs.org/en/download/) with npm.
- JDK 11. Not 8, not 14, **11**: my test lib requires 11 at minimum and Keycloak 11 does not support JDK above 11.
- Decent IDE(s). I use
  - [VS Code](https://code.visualstudio.com/download) with [John Papa's Angular Essentials](https://marketplace.visualstudio.com/items?itemName=johnpapa.angular-essentials) extension for Ionic / Angular projects.
  - [STS for Eclispe](https://spring.io/tools) for Spring projects.
  - [Android Studio](https://developer.android.com/studio) for building and running Android projects.

### Self-signed certificate

Https is a requirement for OAuth2.

If you don't have one already, you really should generate a self-signed certificate and configure your dev servers & clients to use it.
Please refer to [this tutorial I wrote](https://stackoverflow.com/a/63874376/619830) to do so.
