import { LogLevel } from 'angular-auth-oidc-client';

export const environment = {
  production: true,
  openIdConfiguration: {
    // https://github.com/damienbod/angular-auth-oidc-client/blob/master/docs/configuration.md
    clientId: 'tahiti-devops',
    forbiddenRoute: '/settings',
    ignoreNonceAfterRefresh: true, // Keycloak sends refresh_token with nonce
    logLevel: LogLevel.Debug,
    postLogoutRedirectUri: 'com.c4-soft://device/ionic-bar',
    redirectUrl: 'com.c4-soft://device/ionic-bar',
    renewTimeBeforeTokenExpiresInSeconds: 10,
    responseType: 'code',
    scope: 'email openid offline_access roles',
    silentRenew: true,
    // silentRenewUrl: 'com.c4soft.mobileapp://ionic-bar/silent-renew-pkce.html',
    useRefreshToken: true,
    stsServer: 'https://laptop-jerem:8443/auth/realms/master',
    unauthorizedRoute: '/settings',
  },
};
