import { Price } from "../utils/price";

export class UserController {
  constructor(session, transactions, users, orders, orderPositions) {
    this.session = session;
    this.transactions = transactions;
    this.users = users;
    this.orders = orders;
    this.orderPositions = orderPositions;
  }

  create(body) {
    if (this.users.findOneBy({ username: body.username })) {
      throw Error("Benutzer existiert bereits");
    }

    const user = {
      username: body.username,
      firstname: body.firstname,
      lastname: body.lastname,
      role: 'user'
    };
    this.users.persist(user);
    this.users.flush();
    return { id: user.id };
  }

  getSessionInfo() {
    if (!this.session.loggedInUserId) {
      return;
    }

    const user = this.users.find(this.session.loggedInUserId);
    if (!user) {
      return;
    }

    return {
      ...user
    };
  }

  getUserInfo(id) {
    id = Number(id);
    const user = this.users.find(id);
    if (!user) {
      throw Error("Benutzer wurde nicht gefunden");
    }

    const sums = this.getTransactionSums(id);

    return {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      paid: Price.fromCentValue(sums.paid).toString(),
      debt: Price.fromCentValue(sums.debt).toString(),
      total: Price.fromCentValue(sums.total).toString()
    };
  }

  getUserTransactions(id) {
    id = Number(id);
    const user = this.users.find(id);
    const transactions = this.transactions.findAllBy({ user_id: id })

    return [
      transactions.map(t => {
        const orderPosition = this.orderPositions.find(t.order_position_id);
        const order = this.orders.find(orderPosition?.order_id);

        return {
          ...t,
          amount: t.amount,
          username: user?.username,
          firstname: user?.firstname,
          lastname: user?.lastname,
          item: orderPosition?.item,
          order_id: order?.id,
          order_title: order?.title
        };
      }), row => {
        return {
          ...row,
          amount: Price.fromCentValue(row.amount).toString()
        };
      }
    ];
  }

  getDebts(query) {
    query = String(query);
    const keywords = query.split(' ').filter(v => v.length > 0).map(k => k.toLowerCase());

    const users = this.users.findAll().filter(u => {
      for (const keyword of keywords) {
        if (!u.firstname.toLowerCase().includes(keyword) &&
            !u.lastname.toLowerCase().includes(keyword)) {
          return false;
        }
      }

      return true;
    });

    return [
      users.map(u => {
        const sums = this.getTransactionSums(u.id);

        return {
          id: u.id,
          name: u.firstname + ' ' + u.lastname,
          username: u.username,
          firstname: u.firstname,
          lastname: u.lastname,
          paid: sums.paid,
          debt: sums.debt,
          total: sums.total
        };
      }), row => {
        return {
          ...row,
          name: undefined,
          paid: Price.fromCentValue(row.paid).toString(),
          debt: Price.fromCentValue(row.debt).toString(),
          total: Price.fromCentValue(row.total).toString()
        };
      }
    ];
  }

  editUser(id, body) {
    id = Number(id);
    const user = this.users.find(id);
    if (user) {
      if (body.username) {
        user.username = String(body.username);
      }

      if (body.firstname) {
        user.firstname = String(body.firstname);
      }

      if (body.lastname) {
        user.lastname = String(body.lastname);
      }

      this.users.flush();
    }
  }

  getTransactionSums(id) {
    let paid = 0;
    let debt = 0;
    let total = 0;

    for (const transaction of this.transactions.findAllBy({ user_id: id })) {
      total += transaction.amount;

      if (transaction.amount < 0) {
        debt += -transaction.amount;
      }
      else {
        paid += transaction.amount;
      }
    }

    return { paid, debt, total };
  }
};
