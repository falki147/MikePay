import { Price } from "../utils/price";

export class OrderController {
  constructor(orders, orderPositions, users, transactions) {
    this.orders = orders;
    this.orderPositions = orderPositions;
    this.users = users;
    this.transactions = transactions;
  }

  create(body) {
    const order = {
      title: body.title,
      description: body.description,
      url: body.url,
      comments: body.comments,
      date: (new Date()).toISOString(),
      status: ''
    };

    this.orders.persist(order);
    this.orders.flush();

    return { id: order.id };
  }

  placeOrder(id, body) {
    id = Number(id);

    const price = Price.parse(body.price);

    if (!body.userid) {
      if (!body.firstname || !body.lastname) {
        throw Error("Wert darf nicht leer sein");
      }

      const user = {
        username: '',
        firstname: body.firstname,
        lastname: body.lastname,
        role: 'guest'
      };

      this.users.persist(user);
      this.users.flush();
      body.userid = user.id;
    }

    const orderPosition = {
      order_id: id,
      user_id: body.userid,
      item: body.item,
      price: price.centValue,
      date: (new Date()).toISOString()
    };

    this.orderPositions.persist(orderPosition);
    this.orderPositions.flush();

    this.transactions.persist({
      user_id: body.userid,
      order_position_id: orderPosition.id,
      amount: -price.centValue,
      date: (new Date()).toISOString()
    });
    this.transactions.flush();

    return { id: orderPosition.id };
  }

  getOrderPositionInfo(id) {
    id = Number(id);
    const orderPosition = this.orderPositions.find(id);
    if (!orderPosition) {
      throw Error("Artikel wurde nicht gefunden");
    }
 
    return {
      id,
      item: orderPosition.item,
      order_id: orderPosition.order_id,
      price: Price.fromCentValue(orderPosition.price).toString()
    };
  }

  editOrderPosition(id, body) {
    id = Number(id);
    const price = Price.parse(body.price);

    const orderPosition = this.orderPositions.find(id);
    if (orderPosition) {
      orderPosition.item = body.item;
      orderPosition.price = price.centValue;
      this.orderPositions.flush();
    }

    const transaction = this.transactions.findOneBy({ order_position_id: id });
    if (transaction) {
      transaction.amount = -price.centValue;
      this.transactions.flush();
    }
  }

  deleteOrderPosition(id) {
    id = Number(id);
    const transaction = this.transactions.findOneBy({ order_position_id: id });
    if (transaction) {
      this.transactions.remove(transaction);
      this.transactions.flush();
    }

    const orderPosition = this.orderPositions.find(id);
    if (orderPosition) {
      this.orderPositions.remove(orderPosition);
      this.orderPositions.flush();
    }
  }

  getOrders() {
    return [
      this.orders.findAll().map(o => {
        const ops = this.orderPositions.findAllBy({ order_id: o.id });
        const total = ops.reduce((p, op) => p + op.price, 0);

        return { ...o, total };
      }), row => {
        return {
          ...row,
          total: Price.fromCentValue(row.total).toString()
        }
      }
    ];
  }

  getInfo(id) {
    id = Number(id);
    return this.getInfoFromOrder(this.orders.find(id));
  }

  getLatest() {
    return this.getInfoFromOrder(this.orders.findLatestOrder());
  }

  lock(id, body) {
    id = Number(id);
    const order = this.orders.find(id);
    if (order) {
      order.status = body.locked ? 'locked' : null;
      this.orders.flush();
    }
  }

  getOrderPositions(id) {
    id = Number(id);
    const orderPositions = this.orderPositions.findAllBy({ order_id: id });
    return [
      orderPositions.map(o => {
        const user = this.users.find(o.user_id);

        return {
          ...o,
          name: user?.firstname + ' ' + user?.lastname,
          username: user?.username,
          firstname: user?.firstname,
          lastname: user?.lastname,
          price: o.price
        };
      }), row => {
        return {
          ...row,
          name: undefined,
          price: Price.fromCentValue(row.price).toString()
        };
      }
    ];
  }

  getInfoFromOrder(order) {
    if (!order) {
      throw Error("Bestellung wurde nicht gefunden");
    }

    const orderPositions = this.orderPositions.findAllBy({ order_id: order.id });
    const total = orderPositions.reduce((p, op) => p + op.price, 0);

    return {
      ...order,
      items: orderPositions.length,
      total: Price.fromCentValue(total).toString()
    };
  }
};
