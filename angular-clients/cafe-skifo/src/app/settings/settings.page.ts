import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderControllerRestClient } from '@tahiti-devops/bar-api';
import { Observable, Subscription } from 'rxjs';
import { TahitiDevopsUser } from '../domain/tahiti-devops-user';
import { UaaService } from '../uaa.service';

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

  constructor(
    private orderApi: OrderControllerRestClient,
    private uaa: UaaService
  ) {}

  ngOnInit() {
    this.settingsForm
      .get('basePath')
      .patchValue(this.orderApi.configuration.basePath);

    this.settingsFormValueSubscription = this.settingsForm.valueChanges.subscribe(
      (settings) => {
        if (this.orderApi.configuration.basePath !== settings.basePath) {
          this.orderApi.configuration.basePath = settings.basePath;
        }
      }
    );

    this.user$ = this.uaa.currentUser$;
  }

  ngOnDestroy() {
    this.settingsFormValueSubscription.unsubscribe();
  }
}
