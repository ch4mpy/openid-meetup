import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Plugins, StatusBarStyle } from '@capacitor/core';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { KeycloakUser } from './domain/keycloak-user';
import { UaaService } from './uaa.service';

@Component({
  selector: 'bar-root',
  template: `<ion-app>
    <ion-split-pane contentId="main-content">
      <ion-menu contentId="main-content" type="overlay">
        <ion-header>
          <ion-toolbar translucent color="primary">
            <ion-grid>
              <ion-row>
                <ion-col size="8">
                  <ion-title>
                    {{ currentUser?.preferredUsername }}
                  </ion-title>
                </ion-col>
                <ion-col size="4">
                  <ion-icon
                    name="wine-sharp"
                    size="large"
                    *ngIf="currentUser?.isBarman()"
                  ></ion-icon>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-menu-toggle auto-hide="false">
            <ion-item
              routerDirection="root"
              [routerLink]="['/', 'orders']"
              lines="none"
              [class.selected]="selected === 'orders'"
              class="ion-button"
              *ngIf="currentUser?.isAuthenticated()"
            >
              <ion-icon slot="start" name="beer-sharp"></ion-icon>
              <ion-label>Commandes</ion-label>
            </ion-item>
            <ion-item
              routerDirection="root"
              [routerLink]="['/', 'settings']"
              lines="none"
              [class.selected]="selected === 'settings'"
              class="ion-button"
            >
              <ion-icon slot="start" name="settings"></ion-icon>
              <ion-label>Paramètres</ion-label>
            </ion-item>
            <ion-item
              (click)="login()"
              lines="none"
              class="ion-button"
              *ngIf="!currentUser?.isAuthenticated()"
            >
              <ion-icon slot="start" name="log-in-outline"></ion-icon>
              <ion-label>Identification</ion-label>
            </ion-item>
            <ion-item
              (click)="logout()"
              lines="none"
              class="ion-button"
              *ngIf="currentUser?.isAuthenticated()"
            >
              <ion-icon slot="start" name="log-out-outline"></ion-icon>
              <ion-label>Déconnexion</ion-label>
            </ion-item>
          </ion-menu-toggle>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>`,
  styles: [],
})
export class AppComponent implements OnInit, OnDestroy {
  selected = '';
  currentUser: KeycloakUser;
  isBarman: boolean;

  private deeplinksRouteSubscription: Subscription;

  constructor(
    private deeplinks: Deeplinks,
    private navController: NavController,
    private platform: Platform,
    private uaa: UaaService,
    private changedetector: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.platform.ready();
    console.log('PLATFORMS: ' + this.platform.platforms());

    if (this.platform.is('capacitor')) {
      this.setupDeeplinks();
      const { SplashScreen, StatusBar } = Plugins;
      StatusBar.setStyle({ style: StatusBarStyle.Light });
      SplashScreen.hide();
    }

    await this.initUaa();
  }

  ngOnDestroy() {
    this.deeplinksRouteSubscription.unsubscribe();
  }

  login() {
    this.uaa.login();
  }

  logout() {
    this.uaa.logout();
  }

  private setupDeeplinks() {
    this.deeplinks.routeWithNavController(this.navController, {}).subscribe(
      (match) =>
        this.navController
          .navigateForward(match.$link.path + '?' + match.$link.queryString)
          .then(async () => await this.initUaa()),
      (nomatch) =>
        console.error(
          "Got a deeplink that didn't match",
          JSON.stringify(nomatch)
        )
    );
  }

  private async initUaa(): Promise<void> {
    await this.uaa.init();

    this.uaa.currentUser$.subscribe((u) => {
      if (this.currentUser !== u) {
        this.currentUser = u;
        this.changedetector.detectChanges();
      }
    });
  }
}
