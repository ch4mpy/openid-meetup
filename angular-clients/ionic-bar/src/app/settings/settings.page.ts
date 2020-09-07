import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderControllerRestClient } from '@tahiti-devops/bar-api';
import { Subscription } from 'rxjs';

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
        <ion-item>
          <ion-label position="floating">URL du serveur</ion-label>
          <ion-input formControlName="basePath" required></ion-input>
        </ion-item>
      </form>
    </ion-content>`,
  styles: [],
})
export class SettingsPage implements OnInit, OnDestroy {
  settingsForm = new FormGroup({
    basePath: new FormControl(null, [Validators.required]),
  });

  private settingsFormValueSubscription: Subscription;

  constructor(private orderApi: OrderControllerRestClient) {}

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
  }

  ngOnDestroy() {
    this.settingsFormValueSubscription.unsubscribe();
  }
}
