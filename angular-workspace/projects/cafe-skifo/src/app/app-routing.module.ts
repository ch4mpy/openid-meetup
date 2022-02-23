import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAuthenticatedGuard } from './is-authenticated.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'settings',
    pathMatch: 'full'
  },
  {
    path: 'account',
    loadChildren: () => import('./user-account/user-account.module').then( m => m.UserAccountModule)
  },
  {
    path: 'orders',
    canActivate: [IsAuthenticatedGuard],
    loadChildren: () =>
      import('./orders/orders.module').then((m) => m.OrdersModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsModule)
  },
  {
    path: '**',
    redirectTo: 'settings',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
