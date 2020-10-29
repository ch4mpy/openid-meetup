import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonInput } from '@ionic/angular';
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
          <ion-label position="floating">déisignation</ion-label>
          <ion-input #drink formControlName="drink" autofocus></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">table</ion-label>
          <ion-select #table formControlName="table" autofocus>
            <ion-select-option *ngFor="let table of tables" [value]="table">{{
              table
            }}</ion-select-option>
          </ion-select>
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
  @ViewChild('drink') drinkInput: IonInput;

  tables: string[] = [...Array(21).keys()].map((n) => (n + 1).toString());
  orderEditForm: FormGroup;
  private orderEditFormValueSubscription: Subscription;

  constructor() {}

  ngOnInit() {
    this.orderEditForm = new FormGroup({
      drink: new FormControl(this.order.drink, [Validators.required]),
      table: new FormControl(this.order.table, []),
    });
    this.orderEditFormValueSubscription = this.orderEditForm.valueChanges.subscribe(
      (orderForm) => {
        if (orderForm.drink !== this.order.drink) {
          this.order.drink = orderForm.drink;
        }
        if (orderForm.table !== this.order.table) {
          this.order.table = orderForm.table;
        }
      }
    );
    setTimeout(
      () =>
        this.drinkInput
          .setFocus()
          .then(() =>
            this.drinkInput
              .getInputElement()
              .then((elt) => setTimeout(() => elt.select(), 100))
          ),
      500
    );
  }

  ngOnDestroy() {
    this.orderEditFormValueSubscription.unsubscribe();
  }

  save() {
    this.onSubmit.emit(this.order);
  }
}
