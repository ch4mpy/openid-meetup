import { Injectable, OnDestroy } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { KeycloakUser } from './domain/keycloak-user';

@Injectable({ providedIn: 'root' })
export class UaaService implements OnDestroy {
  private user$ = new BehaviorSubject<KeycloakUser>(KeycloakUser.ANONYMOUS);
  private userdataSubscription: Subscription;

  constructor(private oidcSecurityService: OidcSecurityService) {}

  public async init(): Promise<boolean> {
    const isAlreadyAuthenticated = await this.oidcSecurityService
      .checkAuthIncludingServer()
      .toPromise();

    console.log(
      'UaaService::init isAlreadyAuthenticated',
      isAlreadyAuthenticated
    );

    this.userdataSubscription = this.oidcSecurityService.userData$.subscribe(
      (oidcUser: any) => {
        const keycloakUser = oidcUser?.sub
          ? new KeycloakUser({
              sub: oidcUser.sub,
              email: oidcUser.email,
              preferredUsername: oidcUser.preferred_username,
              roles:
                this.oidcSecurityService.getPayloadFromIdToken()
                  ?.resource_access?.['tahiti-devops']?.roles || [],
            })
          : KeycloakUser.ANONYMOUS;
        this.user$.next(keycloakUser);
      }
    );

    return isAlreadyAuthenticated;
  }

  public ngOnDestroy() {
    this.userdataSubscription.unsubscribe();
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
