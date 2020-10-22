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
import { environment } from '../environments/environment';
import { TahitiDevopsUser } from './domain/tahiti-devops-user';

@Injectable({ providedIn: 'root' })
export class UaaService implements OnDestroy {
  private user$ = new BehaviorSubject<TahitiDevopsUser>(
    TahitiDevopsUser.ANONYMOUS
  );
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
      this.user$.next(TahitiDevopsUser.ANONYMOUS);
      return false;
    }

    const user = await this.onBackOnline();
    return !!user.sub;
  }

  private async onBackOnline(): Promise<TahitiDevopsUser> {
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
      ? new TahitiDevopsUser({
          sub: idToken.sub,
          preferredUsername: idToken.preferred_username,
          roles:
            idToken?.resource_access?.[environment.openIdConfiguration.clientId]
              ?.roles || [],
        })
      : TahitiDevopsUser.ANONYMOUS;

  private onOffline() {
    this.userdataSubscription?.unsubscribe();
  }

  get currentUser(): TahitiDevopsUser {
    return this.user$.value;
  }

  get currentUser$(): Observable<TahitiDevopsUser> {
    return this.user$;
  }

  public login(): void {
    this.oidcSecurityService.authorize();
  }

  public logout(): boolean {
    this.oidcSecurityService.logoff();

    if (this.user$.value !== TahitiDevopsUser.ANONYMOUS) {
      this.user$.next(TahitiDevopsUser.ANONYMOUS);
      return true;
    }

    return false;
  }
}
