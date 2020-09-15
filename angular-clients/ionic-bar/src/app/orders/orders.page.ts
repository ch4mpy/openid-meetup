import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { AlertController, PopoverController } from '@ionic/angular';
import {
  OrderControllerRestClient,
  OrderCreationRequestDto,
  OrderResponseDto,
} from '@tahiti-devops/bar-api';
import { Observable } from 'rxjs';
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
export class OrdersPage implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderApi: OrderControllerRestClient,
    private popCtrl: PopoverController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders(event?) {
    this.orderApi.getAll().subscribe(
      (orders: OrderResponseDto[]) => {
        this.orders =
          orders.map((dto) => new Order({ id: dto.id, drink: dto.drink })) ||
          [];
        event?.target?.complete();
      },
      async (error) => {
        event?.target?.complete();
        const alertElt = await this.alertController.create({
          header: 'Impossible de charger les commandes',
          message: JSON.stringify(error),
        });
        await alertElt.present();
      }
    );
  }

  delete(order: Order) {
    this.orderApi.deleteById(order.id, 'response').subscribe((resp) => {
      if (resp.status >= 200 && resp.status < 300) {
        this.orders = this.orders.filter((o) => o.id !== order.id);
      }
    });
  }

  async popOrderEdit() {
    const orderCreated = new EventEmitter<Order>();
    const popElmt = await this.popCtrl.create({
      component: OrderEditComponent,
      componentProps: {
        order: new Order(),
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
