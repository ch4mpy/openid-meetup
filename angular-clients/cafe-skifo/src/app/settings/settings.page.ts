import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
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
          <ion-label position="floating">URL "bar-api"</ion-label>
          <ion-input formControlName="basePath" required></ion-input>
        </ion-item>

        <ion-item-divider>Info utilisateur</ion-item-divider>
        <ion-item>
          <ion-label>nom:</ion-label>
          <ion-label>{{ (user$ | async).preferredUsername }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>subject:</ion-label>
          <ion-label>{{ (user$ | async).sub }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>roles:</ion-label>
          <ion-label>{{ (user$ | async).roles }}</ion-label>
        </ion-item>
      </form>
    </ion-content>`,
  styles: [],
})
export class SettingsPage implements OnInit, OnDestroy {
  settingsForm = new FormGroup({
    basePath: new FormControl(null, [Validators.required]),
  });

  user$: Observable<TahitiDevopsUser>;

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

    this.user$ = this.uaa.currentUser$;
  }

  ngOnDestroy() {
    this.settingsFormValueSubscription.unsubscribe();
  }
}
