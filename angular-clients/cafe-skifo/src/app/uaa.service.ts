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

  private offline$ = UaaService.offline$();
  private userdataSubscription: Subscription;
  private networkStatusSubscription: Subscription;

  constructor(private oidcSecurityService: OidcSecurityService) {
    this.networkStatusSubscription = this.offline$.subscribe(
      (isOffline: boolean) =>
        isOffline ? this.onOffline() : this.onBackOnline()
    );
  }

  public ngOnDestroy() {
    this.networkStatusSubscription?.unsubscribe();
    this.userdataSubscription?.unsubscribe();
  }

  public async init(): Promise<TahitiDevopsUser> {
    console.log(
      `Init UaaService in ${navigator.onLine ? 'online' : 'offline'} mode`
    );
    const initialUser: TahitiDevopsUser = navigator.onLine
      ? await this.onBackOnline()
      : TahitiDevopsUser.ANONYMOUS;
    this.user$ = new BehaviorSubject(initialUser);

    return this.user$.value;
  }

  private async onBackOnline(): Promise<TahitiDevopsUser> {
    const isAlreadyAuthenticated = await this.oidcSecurityService
      .checkAuth()
      .toPromise()
      .catch((err) => {
        console.warn(err);
        return false;
      });

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

  get accessToken(): string {
    return this.oidcSecurityService.getToken();
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

  private static offline$() {
    return merge<boolean>(
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
    );
  }
}
