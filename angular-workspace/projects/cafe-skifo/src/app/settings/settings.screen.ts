import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { OrderControllerApi } from '@c4-soft/orders-endpoint';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-settings',
  template: `<ion-header>
      <ion-toolbar translucent color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Configuration</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div style="margin-top: 2em;">
        <ion-title>Serveurs</ion-title>
        <ion-item >
          <ion-label position="floating">API "sample"</ion-label>
          <ion-input [formControl]="sampleApiPathCtrl"></ion-input>
        </ion-item>
      </div>
    </ion-content>`,
  styles: [],
})
export class SettingsScreen implements OnInit {
  sampleApiPathCtrl = new FormControl('', [Validators.required]);

  constructor(
    private ordersApi: OrderControllerApi,
    private storage: Storage
  ) {}

  ngOnInit() {
    this.storage.create().then(() => {
      this.storage.get('solutionsPath').then(
        (p) => {
          this.sampleApiPathCtrl.patchValue(
            p || this.ordersApi.configuration.basePath
          )
          if (p) {
            this.ordersApi.configuration.basePath = p;
          }
        },
        (error) => {
          console.error(error);
          this.sampleApiPathCtrl.patchValue(
            this.ordersApi.configuration.basePath
          );
        }
      );
    });
    this.sampleApiPathCtrl.valueChanges.subscribe((newPath) => {
      if (this.sampleApiPathCtrl.valid) {
        this.storage.set('solutionsPath', newPath);
        this.ordersApi.configuration.basePath = newPath;
      }
    });
  }
}
