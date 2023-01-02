import { StoragePersistor } from './persistor/storage-persistor';
import { Orders } from './repository/orders';
import { Users } from './repository/users';
import { Session } from './session';
import { OrderPositions } from './repository/order-positions';
import { Transactions } from './repository/transactions';
import { Seeder } from './seeder';
import { ContactController } from './controllers/contact-controller';
import { LoginController } from './controllers/login-controller';
import { OrderController } from './controllers/order-controller';
import { TransactionController } from './controllers/transaction-controller';
import { UserController } from './controllers/user-controller';
import { DemoApi } from './demo-api';

export function createDemoApi() {
  const persistor = new StoragePersistor(sessionStorage, 'mikePayDemo.');
  const session = new Session(persistor);
  const users = new Users(persistor);
  const orders = new Orders(persistor);
  const orderPositions = new OrderPositions(persistor);
  const transactions = new Transactions(persistor);
  const contactController = new ContactController();
  const loginController = new LoginController(session, users);
  const orderController = new OrderController(orders, orderPositions, users, transactions);
  const transactionController = new TransactionController(transactions, orderPositions, orders, users);
  const userController = new UserController(session, transactions, users, orders, orderPositions);
  const demoApi = new DemoApi(contactController, loginController, orderController, transactionController, userController);

  persistor.getOrCreate('initialized', () => {
    const seeder = new Seeder;
    persistor.set('users', seeder.users);
    persistor.set('orders', seeder.orders);
    persistor.set('orderPositions', seeder.orderPositions);
    persistor.set('transactions', seeder.transactions);
    return true;
  });

  return demoApi;
}
