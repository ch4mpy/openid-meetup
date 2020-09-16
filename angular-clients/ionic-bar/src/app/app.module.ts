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
import { AuthModule, OidcConfigService } from 'angular-auth-oidc-client';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizationHeaderHttpInterceptor } from './authorization-header.http-interceptor';

export function configureAuth(oidcConfigService: OidcConfigService) {
  return async () => {
    // https://github.com/damienbod/angular-auth-oidc-client/blob/master/docs/configuration.md
    await oidcConfigService.withConfig(environment.openIdConfiguration);
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
