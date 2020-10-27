import { LogLevel } from 'angular-auth-oidc-client';

export const environment = {
  production: false,
  apiBasePath: 'https://cafe-skifo.azurewebsites.net',
  openIdConfiguration: {
    // https://github.com/damienbod/angular-auth-oidc-client/blob/master/docs/configuration.md
    clientId: 'cafe-skifo',
    forbiddenRoute: '/settings',
    eagerLoadAuthWellKnownEndpoints: false,
    ignoreNonceAfterRefresh: true, // Keycloak sends refresh_token with nonce
    logLevel: LogLevel.Warn,
    postLogoutRedirectUri: 'com.c4-soft://device/cafe-skifo',
    redirectUrl: 'com.c4-soft://device/cafe-skifo',
    renewTimeBeforeTokenExpiresInSeconds: 10,
    responseType: 'code',
    scope: 'email openid offline_access roles',
    silentRenew: true,
    // silentRenewUrl: 'com.c4soft.mobileapp://cafe-skifo/silent-renew-pkce.html',
    useRefreshToken: true,
    stsServer: 'https://keycloak.devops.pf/auth/realms/meetup',
    unauthorizedRoute: '/settings',
  },
};
