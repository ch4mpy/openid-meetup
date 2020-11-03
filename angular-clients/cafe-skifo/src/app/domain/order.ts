export class Order {
  id: number;
  drink: string;
  owner: string;
  table: string;
  creationTimeStamp: Date;

  constructor(init?: Partial<Order>) {
    Object.assign(this, init);
  }
}
