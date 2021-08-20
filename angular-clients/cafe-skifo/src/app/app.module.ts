import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import {
  ApiModule as BarApi,
  OrderControllerRestClient,
} from '@tahiti-devops/cafe-skifo';
import { AuthModule, OidcConfigService } from 'angular-auth-oidc-client';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizationHeaderHttpInterceptor } from './authorization-header.http-interceptor';
import { SettingsService } from './settings/settings.service';
import { UaaService } from './uaa.service';

export function init(
  platform: Platform,
  settings: SettingsService,
  oidcConfigService: OidcConfigService,
  uaa: UaaService
) {
  return async () => {
    await platform.ready();
    await settings.init();
    await oidcConfigService.withConfig(environment.openIdConfiguration);
    await uaa.init();
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
    IonicStorageModule.forRoot(),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: init,
      deps: [Platform, SettingsService, OidcConfigService, UaaService],
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
