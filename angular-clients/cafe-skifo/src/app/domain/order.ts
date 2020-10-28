export class Order {
  id: number;
  drink: string;
  owner: string;
  table: string;

  constructor(init?: Partial<Order>) {
    Object.assign(this, init);
  }
}
