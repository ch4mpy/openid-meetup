export class Order {
  id: number;
  drink: string;

  constructor(init?: Partial<Order>) {
    Object.assign(this, init);
  }
}
