import { BaseRepository } from "./base-repository";

export class Orders extends BaseRepository {
  constructor(persistor) {
    super(persistor, 'orders');
  }

  findLatestOrder() {
    let maxOrder = null;
    for (const order of this.findAll()) {
      if (!maxOrder || order.date > maxOrder.date) {
        maxOrder = order;
      }
    }

    return maxOrder;
  }
};
