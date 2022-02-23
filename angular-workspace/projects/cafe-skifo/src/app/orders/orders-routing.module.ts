import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersScreen } from './orders.screen';

const routes: Routes = [
  {
    path: '',
    component: OrdersScreen,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
