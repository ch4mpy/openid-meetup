import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserAccountRoutingModule } from './user-account-routing.module';
import { UserAccountScreen } from './user-account.screen';


@NgModule({
  declarations: [
    UserAccountScreen
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UserAccountRoutingModule
  ]
})
export class UserAccountModule { }
