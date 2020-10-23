import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BtScanModule } from '@ch4mpy/ng-bt-scan';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import {
  ApiModule as BarApi,
  OrderControllerRestClient,
} from '@tahiti-devops/bar-api';
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
    BtScanModule.forRoot({
      barcodePrefix: '$can$',
      barcodeSuffix: 'Enter',
      keysCapturePeriod: 1500,
    }),
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
