import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsPage } from './settings.page';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SettingsRoutingModule,
  ],
  declarations: [
    SettingsPage,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
  ],
})
export class SettingsModule {}
