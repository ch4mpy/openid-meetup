import { AuthConfig, OAuthModuleConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://dev-ch4mpy.eu.auth0.com/',
  redirectUri: window.location.href,
  postLogoutRedirectUri: window.location.origin,
  clientId: 'lRHwmwQr3bhkKZeezYD8UAaGna3KSnBB',
  responseType: 'code',
  scope: 'openid profile email offline_access solutions:manage',
  customQueryParams: {
    audience: 'https://bravo-ch4mp:8080',
  },
  showDebugInformation: true,
};

export const oAuthModuleConfig: OAuthModuleConfig = {
  resourceServer: {
    allowedUrls: ['https://bravo-ch4mp:8080'],
    sendAccessToken: true,
  },
};

export const environment = {
  production: true,
  authConfig,
  oAuthModuleConfig,
};
