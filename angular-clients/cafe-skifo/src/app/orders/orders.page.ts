import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, NgZone } from '@angular/core';
import { BtScanService } from '@ch4mpy/ng-bt-scan';
import {
  AlertController,
  IonRefresher,
  PopoverController,
} from '@ionic/angular';
import {
  OrderControllerRestClient,
  OrderCreationRequestDto,
} from '@tahiti-devops/bar-api';
import { Observable, Subscription } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Order } from '../domain/order';
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
      <ion-item-sliding *ngFor="let order of orders">
        <ion-item>
          {{ order.drink }}
        </ion-item>
        <ion-item-options side="end">
          <ion-item-option color="danger" (click)="delete(order)">
            <ion-icon name="trash" slot="icon-only"></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
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
export class OrdersPage {
  orders: Order[] = [];

  private scanSubscription: Subscription;

  constructor(
    private orderApi: OrderControllerRestClient,
    private popCtrl: PopoverController,
    private alertController: AlertController,
    private zone: NgZone,
    private btScan: BtScanService
  ) {}

  ionViewWillEnter() {
    this.loadOrders();
    this.scanSubscription = this.btScan.barcode$.subscribe((barcode) =>
      this.popOrderEdit(barcode)
    );
  }

  ionViewWillLeave() {
    this.scanSubscription?.unsubscribe();
  }

  loadOrders(event?: CustomEvent) {
    this.zone.run(async () => {
      const refresher = (event?.target as unknown) as IonRefresher;
      this.orders = await this.orderApi
        .getAll()
        .toPromise()
        .then((dtos) => dtos.map((dto) => new Order(dto)))
        .catch(async (error) => {
          refresher?.complete();
          this.alertController
            .create({
              header: 'Impossible de charger les commandes',
              message: JSON.stringify(error),
            })
            .then((alertElt) => alertElt.present());
          return this.orders;
        });
      await refresher?.complete();
    });
  }

  delete(order: Order) {
    this.orderApi.deleteById(order.id, 'response').subscribe((resp) => {
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
        flatMap(
          (order: Order): Observable<Order> => {
            const dto: OrderCreationRequestDto = {
              drink: order.drink,
            };
            return this.orderApi.placeOrder(dto, 'response').pipe(
              map(
                (resp: HttpResponse<number>): Order => {
                  order.id = resp.body;
                  return order;
                }
              )
            );
          }
        )
      )
      .subscribe((order) => {
        if (order.id) {
          this.orders = this.orders.concat(order);
        }
        popElmt.dismiss(order);
      });

    await popElmt.present();
  }
}
