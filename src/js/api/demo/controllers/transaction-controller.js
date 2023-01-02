import { Price } from "../utils/price";

export class TransactionController {
  constructor(transactions, orderPositions, orders, users) {
    this.transactions = transactions;
    this.orderPositions = orderPositions;
    this.orders = orders;
    this.users = users;
  }

  getTransactions() {
    const transactions = this.transactions.findAll();
    return [
      transactions.map(t => {
        const orderPosition = this.orderPositions.find(t.order_position_id);
        const order = this.orders.find(orderPosition?.order_id);
        const user = this.users.find(t.user_id);

        return {
          id: t.id,
          amount: t.amount,
          date: t.date,
          item: orderPosition?.item,
          order_id: order?.id,
          order_title: order?.title,
          user_id: t.user_id,
          name: user?.firstname + ' ' + user?.lastname,
          username: user?.username,
          firstname: user?.firstname,
          lastname: user?.lastname,
        };
      }), row => {
        return {
          ...row,
          name: undefined,
          amount: Price.fromCentValue(row.amount).toString(),
        };
      }
    ];
  }

  pay(body) {
    const price = Price.parse(body.amount);
    if (price.centValue <= 0) {
      throw Error("Wert muss größer als 0 sein");
    }

    const transaction = {
      user_id: Number(body.userid),
      order_position_id: null,
      amount: price.centValue,
      date: (new Date()).toISOString()
    };

    this.transactions.persist(transaction);
    this.transactions.flush();
    return { id: transaction.id };
  }

  owe(body) {
    const price = Price.parse(body.amount);
    if (price.centValue <= 0) {
      throw Error("Wert muss größer als 0 sein");
    }

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

    const transaction = {
      user_id: Number(body.userid),
      order_position_id: null,
      amount: -price.centValue,
      date: (new Date()).toISOString()
    };

    this.transactions.persist(transaction);
    this.transactions.flush();
    return { id: transaction.id };
  }
};
