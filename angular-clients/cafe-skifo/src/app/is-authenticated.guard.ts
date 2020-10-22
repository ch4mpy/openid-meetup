import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { NavController } from '@ionic/angular';
import { UaaService } from './uaa.service';

@Injectable({ providedIn: 'root' })
export class IsAuthenticatedGuard implements CanActivate {
  constructor(private uaa: UaaService, private navCtrl: NavController) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.uaa.currentUser.isAuthenticated();
  }
}
