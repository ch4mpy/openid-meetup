import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TahitiDevopsUser } from '../domain/tahiti-devops-user';
import { UaaService } from '../uaa.service';
import { SettingsService } from './settings.service';

@Component({
  selector: 'bar-settings',
  template: `<ion-header>
      <ion-toolbar color="primary">
        <ion-menu-button slot="start"></ion-menu-button>
        <ion-title>Paramètres</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form [formGroup]="settingsForm">
        <ion-item-divider>Serveur</ion-item-divider>
        <ion-item>
          <ion-label position="floating">URL de l'API "cafe-skifo"</ion-label>
          <ion-input formControlName="basePath" required></ion-input>
        </ion-item>

        <div *ngIf="currentUser?.isAuthenticated()">
          <ion-item-divider>Info utilisateur</ion-item-divider>
          <ion-item>
            <ion-label>nom:</ion-label>
            <ion-label>{{ currentUser?.preferredUsername }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>subject:</ion-label>
            <ion-label>{{ currentUser?.sub }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>roles:</ion-label>
            <ion-label>{{ currentUser?.roles }}</ion-label>
          </ion-item>
        </div>
      </form>
    </ion-content>

    <ion-footer>
      <ion-grid>
        <ion-row>
          <ion-col>
            <a [routerLink]="['/', 'settings', 'privacy-policy']">
              privacy policy
            </a>
          </ion-col>
          <ion-col>
            <a [routerLink]="['/', 'settings', 'terms-and-conditions']">
              terms & conditions
            </a>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-footer>`,
  styles: [],
})
export class SettingsPage implements OnInit, OnDestroy {
  settingsForm = new FormGroup({
    basePath: new FormControl(null, [Validators.required]),
  });

  private settingsFormValueSubscription: Subscription;

  constructor(private settings: SettingsService, private uaa: UaaService) {}

  ngOnInit() {
    this.settings
      .getOrderApiBasePath()
      .then((basePath) =>
        this.settingsForm.get('basePath').patchValue(basePath)
      );

    this.settingsFormValueSubscription = this.settingsForm.valueChanges.subscribe(
      (form) => this.settings.setOrderApiBasePath(form.basePath)
    );
  }

  ngOnDestroy() {
    this.settingsFormValueSubscription.unsubscribe();
  }

  get currentUser(): TahitiDevopsUser {
    return this.uaa.currentUser;
  }
}
