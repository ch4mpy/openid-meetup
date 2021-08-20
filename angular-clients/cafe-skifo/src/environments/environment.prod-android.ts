import { LogLevel } from 'angular-auth-oidc-client';

export const environment = {
  production: true,
  apiBasePath: 'https://cafe-skifo.azurewebsites.net',
  openIdConfiguration: {
    // https://github.com/damienbod/angular-auth-oidc-client/blob/master/docs/configuration.md
    clientId: 'PLJO8P148QjTwkbNUy8BhCVcpFmLqXtG',
    forbiddenRoute: '/settings',
    eagerLoadAuthWellKnownEndpoints: false,
    ignoreNonceAfterRefresh: true, // Keycloak sends refresh_token with nonce
    logLevel: LogLevel.Warn,
    postLogoutRedirectUri: 'device://starter',
    redirectUrl: 'device://starter',
    renewTimeBeforeTokenExpiresInSeconds: 10,
    responseType: 'code',
    scope: 'email openid offline_access roles',
    silentRenew: true,
    // silentRenewUrl: 'com.c4soft.mobileapp://cafe-skifo/silent-renew-pkce.html',
    useRefreshToken: true,
    stsServer: 'https://dev-ch4mpy.eu.auth0.com',
    unauthorizedRoute: '/settings',
  },
};
