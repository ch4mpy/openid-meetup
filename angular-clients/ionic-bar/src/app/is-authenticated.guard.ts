import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { NavController } from '@ionic/angular';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class IsAuthenticatedGuard implements CanActivate {
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private navCtrl: NavController
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.oidcSecurityService.isAuthenticated$.pipe(
      map((isIdentified) => {
        if (!isIdentified) {
          console.warn(`User is not identified. Access denied to ${route.url}`);
          this.navCtrl.navigateBack(environment.unauthorizedRoute);
        }
        return isIdentified;
      })
    );
  }
}
