import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {
  ApiModule as BarApi,
  OrderControllerRestClient,
} from '@tahiti-devops/bar-api';
import {
  AuthModule,
  LogLevel,
  OidcConfigService,
} from 'angular-auth-oidc-client';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizationHeaderHttpInterceptor } from './authorization-header.http-interceptor';

export function configureAuth(oidcConfigService: OidcConfigService) {
  return () => {
    // https://github.com/damienbod/angular-auth-oidc-client/blob/master/docs/configuration.md
    oidcConfigService.withConfig({
      clientId: 'tahiti-devops',
      forbiddenRoute: environment.forbiddenRoute,
      logLevel: LogLevel.Warn,
      postLogoutRedirectUri: environment.postLogoutRedirectUri,
      redirectUrl: environment.redirectUrl,
      renewTimeBeforeTokenExpiresInSeconds: 10,
      responseType: 'code',
      scope: 'email openid offline_access roles',
      silentRenew: true,
      silentRenewUrl: `${window.location.origin}/silent-renew.html`,
      stsServer: environment.stsServer,
      unauthorizedRoute: environment.unauthorizedRoute,
    });
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    AuthModule.forRoot(),
    BarApi,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    IonicModule.forRoot(),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: configureAuth,
      deps: [OidcConfigService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationHeaderHttpInterceptor,
      multi: true,
    },
    Deeplinks,
    HttpClient,
    OrderControllerRestClient,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
