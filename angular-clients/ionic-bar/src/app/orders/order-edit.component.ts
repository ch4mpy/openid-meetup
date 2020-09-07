import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Order } from '../domain/order';

@Component({
  selector: 'bar-order-edit',
  template: `<ion-header>
      <ion-toolbar color="primary">
        <ion-title>Commande</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form [formGroup]="orderEditForm" (ngSubmit)="save()">
        <ion-item>
          <ion-label position="floating">boisson</ion-label>
          <ion-input formControlName="drink" autofocus="true"></ion-input>
        </ion-item>
        <ion-button
          type="submit"
          [disabled]="orderEditForm.invalid"
          expand="block"
        >
          <ion-icon slot="icon-only" name="return-down-back"></ion-icon>
        </ion-button>
      </form>
    </ion-content>`,
  styles: [],
})
export class OrderEditComponent implements OnInit, OnDestroy {
  @Input() order: Order;
  @Output() onSubmit = new EventEmitter<Order>();

  orderEditForm: FormGroup;
  private orderEditFormValueSubscription: Subscription;

  constructor() {}

  ngOnInit() {
    this.orderEditForm = new FormGroup({
      drink: new FormControl(this.order.drink, [Validators.required]),
    });
    this.orderEditFormValueSubscription = this.orderEditForm.valueChanges.subscribe(
      (orderForm) => {
        if (orderForm.drink !== this.order.drink) {
          this.order.drink = orderForm.drink;
        }
      }
    );
  }

  ngOnDestroy() {
    this.orderEditFormValueSubscription.unsubscribe();
  }

  save() {
    this.onSubmit.emit(this.order);
  }
}
