import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { NavController } from '@ionic/angular';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class IsAuthenticatedGuard implements CanActivate {
  constructor(private userService: UserService, private navCtrl: NavController) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if(this.userService.isAuthenticated) {
      return true
    }
    this.navCtrl.navigateRoot('/')
    return false
  }
}
