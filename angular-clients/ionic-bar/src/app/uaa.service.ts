import { Injectable, OnDestroy } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import {
  BehaviorSubject,
  fromEvent,
  merge,
  Observable,
  Subscription,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { KeycloakUser } from './domain/keycloak-user';

@Injectable({ providedIn: 'root' })
export class UaaService implements OnDestroy {
  private user$ = new BehaviorSubject<KeycloakUser>(KeycloakUser.ANONYMOUS);
  private userdataSubscription: Subscription;

  constructor(private oidcSecurityService: OidcSecurityService) {
    console.log(
      `Starting UaaService in ${navigator.onLine ? 'online' : 'offline'} mode`
    );
    merge<boolean>(
      fromEvent(window, 'offline').pipe(
        map((): boolean => {
          console.log('Switching UaaService to offline mode');
          return true;
        })
      ),
      fromEvent(window, 'online').pipe(
        map((): boolean => {
          console.log('Switching UaaService to online mode');
          return false;
        })
      )
    ).subscribe((isOffline: boolean) => {
      if (isOffline) {
        this.onOffline();
      } else {
        this.onBackOnline();
      }
    });
  }

  public ngOnDestroy() {
    this.userdataSubscription.unsubscribe();
  }

  public async init(): Promise<boolean> {
    if (!navigator.onLine) {
      this.user$.next(KeycloakUser.ANONYMOUS);
      return false;
    }

    const user = await this.onBackOnline();
    return !!user.sub;
  }

  private async onBackOnline(): Promise<KeycloakUser> {
    const isAlreadyAuthenticated = await this.oidcSecurityService
      .checkAuth()
      .toPromise()
      .catch(() => false);

    const user = UaaService.fromToken(
      this.oidcSecurityService.getPayloadFromIdToken()
    );
    console.log('UaaService::onBackOnline', isAlreadyAuthenticated, user);

    this.userdataSubscription?.unsubscribe();
    this.userdataSubscription = this.oidcSecurityService.isAuthenticated$.subscribe(
      () =>
        this.user$.next(
          UaaService.fromToken(this.oidcSecurityService.getPayloadFromIdToken())
        )
    );

    return user;
  }

  private static fromToken = (idToken: any) =>
    idToken?.sub
      ? new KeycloakUser({
          sub: idToken.sub,
          preferredUsername: idToken.preferred_username,
          roles: idToken?.resource_access?.['tahiti-devops']?.roles || [],
        })
      : KeycloakUser.ANONYMOUS;

  private onOffline() {
    this.userdataSubscription?.unsubscribe();
  }

  get currentUser$(): Observable<KeycloakUser> {
    return this.user$;
  }

  public login(): void {
    this.oidcSecurityService.authorize();
  }

  public logout(): boolean {
    this.oidcSecurityService.logoff();

    if (this.user$.value !== KeycloakUser.ANONYMOUS) {
      this.user$.next(KeycloakUser.ANONYMOUS);
      return true;
    }

    return false;
  }
}
