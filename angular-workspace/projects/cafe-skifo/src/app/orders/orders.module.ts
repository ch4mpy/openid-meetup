import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrderEditComponent } from './order-edit.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersScreen } from './orders.screen';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OrdersRoutingModule,
  ],
  declarations: [OrdersScreen, OrderEditComponent],
})
export class OrdersModule {}
