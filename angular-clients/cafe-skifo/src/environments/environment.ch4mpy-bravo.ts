// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { LogLevel } from 'angular-auth-oidc-client';

export const environment = {
  production: false,
  apiBasePath: 'https://ch4mpy-bravo:9000',
  openIdConfiguration: {
    // https://github.com/damienbod/angular-auth-oidc-client/blob/master/docs/configuration.md
    clientId: 'cafe-skifo',
    forbiddenRoute: '/settings',
    eagerLoadAuthWellKnownEndpoints: false,
    ignoreNonceAfterRefresh: true, // Keycloak sends refresh_token with nonce
    logLevel: LogLevel.Warn,
    postLogoutRedirectUri: 'https://ch4mpy-bravo:8100/cafe-skifo',
    redirectUrl: 'https://ch4mpy-bravo:8100/cafe-skifo',
    renewTimeBeforeTokenExpiresInSeconds: 60,
    responseType: 'code',
    scope: 'email openid offline_access roles',
    silentRenew: true,
    // silentRenewUrl: 'https://ch4mpy-bravo:8100/silent-renew-pkce.html',
    useRefreshToken: true,
    stsServer: 'https://keycloak.devops.pf/auth/realms/meetup',
    unauthorizedRoute: '/settings',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
