import { Random } from "./utils/random";

const firstnames = ['Marie', 'Anna', 'Emilia', 'Emma', 'Mia', 'Lena', 'Lea', 'Johanna', 'Sophia', 'Laura', 'Jakob', 'David', 'Maximilian', 'Felix', 'Paul', 'Elias', 'Jonas', 'Leon', 'Lukas', 'Tobias'];
const lastnames = ['Gruber', 'Huber', 'Wagner', 'Müller', 'Pichler', 'Moser', 'Steiner', 'Mayer', 'Berger', 'Hofer'];

const restaurants = [
	[ 'Pizzeria David Urfahr', 'http://www.pizzeria-david-linz.at/' ],
	[ 'Pizza Mir', 'http://www.pizza-mir-linz.at/' ],
	[ 'Fuzo Pizza Schnitzel Pasta & Getränke', 'http://www.fuzoexpress-zustellung.at/' ],
	[ 'Pho-Hanoi Linz', 'http://www.pho-hanoilinz.at/' ],
	[ 'El Paso Restaurant & Pizzeria', 'http://www.el-paso-linz.at/' ],
	[ 'Buffalo', 'http://www.linzbuffalo.at/' ],
	[ 'China Restaurant Kim San', 'http://www.china-restaurant-kim-san.at/' ],
	[ 'Asahii', 'http://www.asahii-linz.at/' ]
];

const products = [ "Salami Pizza", "Burger", "Sushi", "8 Schätze", "Tortilla", "Diavolo", "Schnitzel", "Ente Süß Sauer", "Gebratene Nudeln", "Reis", "Bier", "Cola" ];

export class Seeder {
  initialized = false;
  userData = [];
  orderData = [];
  orderPositionData = [];
  transactionData = [];

  get users() {
    this.init();
    return this.userData;
  }

  get orders() {
    this.init();
    return this.orderData;
  }

  get orderPositions() {
    this.init();
    return this.orderPositionData;
  }

  get transactions() {
    this.init();
    return this.transactionData;
  }

  init() {
    if (this.initialized) {
      return;
    }

    this.createUsers();
    this.createOrders();
    this.createOrderPositions();
    this.createTransactions();

    this.initialized = true;
  }

  createUsers() {
    for (let i = 1; i <= 30; ++i) {
      this.userData.push(this.createRandomUser(`user${i}`));
    }

    this.userData.push(this.createAdminUser());
    this.setIds(this.userData, 'id');
  }

  createAdminUser() {
    return {
      firstname: 'Mike',
      lastname: 'Pay',
      role: 'admin',
      username: 'mike'
    };
  }

  createRandomUser(username) {
    return {
      firstname: Random.item(firstnames),
      lastname: Random.item(lastnames),
      role: 'user',
      username
    };
  }

  createOrders() {
    for (let i = 0; i < 65; ++i) {
      const [ title, url ] = Random.item(restaurants);

      const date = new Date(2020, 10, 10, Random.integer(9, 11), Random.integer(0, 60));
      date.setDate(date.getDate() - i);

      this.orderData.push({
        title,
        description: `Description of ${title}`,
        url,
        comments: `Random comment #${i + 1}`,
        date: date.toISOString(),
        status: ''
      });
    }

    this.setIds(this.orderData, 'id');
  }

  createOrderPositions() {
    const users = Random.shuffle([...this.userData]);
    const orders = this.orderData;

    for (let i = 0; i < 500; ++i) {
      const product = Random.item(products);
      const order = Random.item(orders);
      const price = Random.integer(200, 1400);
      const user = Random.itemQuad(users);

      const date = new Date(2020, 10, 10, Random.integer(9, 11), Random.integer(0, 60));
      date.setDate(date.getDate() - (order.id - 1));

      this.orderPositionData.push({
        order_id: order.id,
        user_id: user.id,
        item: product,
        price,
        date: date.toISOString()
      });
    }

    this.setIds(this.orderPositionData, 'id');
  }

  createTransactions() {
    for (const orderPosition of this.orderPositionData) {
      this.transactionData.push({
        user_id: orderPosition.user_id,
        order_position_id: orderPosition.id,
        amount: -orderPosition.price,
        date: orderPosition.date
      });
    }

    for (const user of this.userData) {
      const numPayments = Random.integer(0, 4);
      for (let i = 0; i < numPayments; ++i) {
        const amount = Random.integer(300, 20000);
        const date = new Date(2020, 10, 10, Random.integer(7, 15), Random.integer(0, 60));
        date.setDate(date.getDate() + Random.integer(0, 30));

        this.transactionData.push({
          user_id: user.id,
          order_position_id: null,
          amount,
          date: date.toISOString()
        });
      }
    }

    this.setIds(this.transactionData, 'id');
  }

  setIds(data, key) {
    let id = 0;
    for (const row of data) {
      row[key] = ++id;
    }
    return data;
  }
};
