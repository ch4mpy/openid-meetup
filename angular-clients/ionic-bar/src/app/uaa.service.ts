import { Injectable, OnDestroy } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { KeycloakUser } from './domain/keycloak-user';

@Injectable({ providedIn: 'root' })
export class UaaService implements OnDestroy {
  private user$ = new BehaviorSubject<KeycloakUser>(KeycloakUser.ANONYMOUS);
  private userdataSubscription: Subscription;

  constructor(private oidcSecurityService: OidcSecurityService) {
    this.userdataSubscription = this.oidcSecurityService.userData$
      .pipe(
        map(
          (oidcUser: any): KeycloakUser => {
            return oidcUser?.sub
              ? new KeycloakUser({
                  sub: oidcUser.sub,
                  email: oidcUser.email,
                  preferredUsername: oidcUser.preferred_username,
                  roles:
                    this.oidcSecurityService.getPayloadFromIdToken()
                      ?.resource_access?.['tahiti-devops']?.roles || [],
                })
              : KeycloakUser.ANONYMOUS;
          }
        )
      )
      .subscribe((user: KeycloakUser) => this.user$.next(user));

    this.oidcSecurityService
      .checkAuthIncludingServer()
      .subscribe((isAuthenticated) =>
        console.log('Keycloak user authenicated: ', isAuthenticated)
      );
  }

  public ngOnDestroy() {
    this.userdataSubscription.unsubscribe();
  }

  get currentUser$(): Observable<KeycloakUser> {
    return this.user$.asObservable();
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.oidcSecurityService.isAuthenticated$;
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
