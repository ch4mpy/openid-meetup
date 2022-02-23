import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, NgZone } from '@angular/core';
import { OrderControllerApi, OrderCreationRequestDto } from '@c4-soft/orders-endpoint';
import {
  AlertController,
  IonRefresher,
  LoadingController,
  PopoverController,
} from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { Order } from './order';
import { OrderEditComponent } from './order-edit.component';

@Component({
  selector: 'bar-orders',
  template: `<ion-header>
      <ion-toolbar color="primary">
        <ion-menu-button slot="start"></ion-menu-button>
        <ion-title>Commandes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="loadOrders($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-grid>
        <ion-row *ngFor="let order of orders">
          <ion-item-sliding>
            <ion-item>
              <ion-col>{{ order.drink }}</ion-col>
              <ion-col>{{ order.owner }}</ion-col>
              <ion-col size="2">{{ order.table }}</ion-col>
              <ion-col size="3">{{
                order.creationTimeStamp | date: 'HH:mm'
              }}</ion-col>
            </ion-item>
            <ion-item-options side="end">
              <ion-item-option color="danger" (click)="delete(order)">
                <ion-icon name="trash" slot="icon-only"></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </ion-row>
      </ion-grid>
    </ion-content>

    <ion-footer translucent="true" class="ion-no-border">
      <ion-button
        shape="round"
        size="large"
        class="ion-float-right"
        (click)="popOrderEdit()"
      >
        <ion-icon slot="icon-only" name="add-outline"></ion-icon>
      </ion-button>
    </ion-footer>`,
  styles: [],
})
export class OrdersScreen {
  orders: Order[] = [];

  constructor(
    private orderApi: OrderControllerApi,
    private popCtrl: PopoverController,
    private alertController: AlertController,
    private zone: NgZone,
    private loadingController: LoadingController
  ) {}

  async ionViewWillEnter() {
    this.loadOrders();
  }

  ionViewWillLeave() {
  }

  async loadOrders(event?: Event) {
    const loadingElt = await (event
      ? null
      : this.loadingController.create({
          duration: 5000,
        }));
    await loadingElt?.present();
    return this.zone.run(async () => {
      const refresher = (event?.target as unknown) as IonRefresher;
      this.orders = await this.orderApi
        .retrieveAll()
        .toPromise()
        .then((dtos) =>
          dtos
            ?.map(
              (dto) =>
                new Order({
                  id: dto.id,
                  creationTimeStamp: new Date(dto.createdOn),
                  drink: dto.drink,
                  owner: dto.owner,
                  table: dto.table,
                })
            )
            .sort(
              (a, b) =>
                (a?.creationTimeStamp?.getTime() || 0) - (b?.creationTimeStamp?.getTime() || 0)
            ) || []
        )
        .catch(async (error) => {
          refresher?.complete();
          loadingElt?.dismiss();
          this.alertController
            .create({
              header: 'Impossible de charger les commandes',
              message: JSON.stringify(error),
            })
            .then((alertElt) => alertElt.present());
          return this.orders;
        });
      await refresher?.complete();
      await loadingElt?.dismiss();
      return this.orders;
    });
  }

  delete(order: Order) {
    this.orderApi._delete(order.id || -1, 'response').subscribe((resp) => {
      if (resp.status >= 200 && resp.status < 300) {
        this.orders = this.orders.filter((o) => o.id !== order.id);
      }
    });
  }

  async popOrderEdit(barcode?: string) {
    const orderCreated = new EventEmitter<Order>();
    const popElmt = await this.popCtrl.create({
      component: OrderEditComponent,
      componentProps: {
        order: new Order({ drink: barcode }),
        onSubmit: orderCreated,
      },
    });
    orderCreated
      .pipe(
        mergeMap(
          (order: Order): Observable<Order> => {
            const dto: OrderCreationRequestDto = {
              drink: order.drink || '',
              table: order.table,
            };
            return this.orderApi.create(dto, 'response').pipe(
              map(
                (resp: HttpResponse<object>): Order => {
                  if(typeof resp.body === 'number') {
                    order.id = resp.body;
                  }
                  return order;
                }
              )
            );
          }
        )
      )
      .subscribe((order) => {
        this.loadOrders();
        popElmt.dismiss(order);
      });

    await popElmt.present();
  }
}
