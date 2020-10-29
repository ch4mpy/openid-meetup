import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { OrderControllerRestClient } from '@tahiti-devops/cafe-skifo';
import { environment } from 'cafe-skifo/src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  constructor(
    private storage: Storage,
    private orderApi: OrderControllerRestClient
  ) {}

  async init() {
    const configuredOrderApiBasePath = await this.storage.get(
      SettingsService.API_BASE_PATH_KEY
    );
    if (!configuredOrderApiBasePath) {
      await this.setOrderApiBasePath(environment.apiBasePath);
    }

    this.orderApi.configuration.basePath =
      configuredOrderApiBasePath || environment.apiBasePath;

    return;
  }

  async setOrderApiBasePath(basePath: string) {
    if (this.orderApi.configuration.basePath !== basePath) {
      this.orderApi.configuration.basePath = basePath;
      await this.storage.set(SettingsService.API_BASE_PATH_KEY, basePath);
    }
    return this;
  }

  async getOrderApiBasePath(): Promise<string> {
    return this.storage.get(SettingsService.API_BASE_PATH_KEY);
  }

  private static readonly API_BASE_PATH_KEY = 'apiUri';
}
