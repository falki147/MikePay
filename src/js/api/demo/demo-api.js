import { ContactController } from "./controllers/contact-controller";
import { LoginController } from "./controllers/login-controller";
import { OrderController } from "./controllers/order-controller";
import { TransactionController } from "./controllers/transaction-controller";
import { UserController } from "./controllers/user-controller";
import { generalSort } from "./utils/generalSort";
import { paginateResponse } from "./utils/paginateResponse";

/**
 * @typedef {Object} Order
 * @property {Number} id
 * @property {String} title
 * @property {String} description
 * @property {String} url
 * @property {String} comments
 * @property {String} date
 * @property {String} total
 */

/**
 * @typedef {Object} OrderInfo
 * @property {Number} id
 * @property {String} title
 * @property {String} description
 * @property {String} url
 * @property {String} comments
 * @property {String} date
 * @property {String} status
 * @property {String} total
 * @property {Number} items
 */

/**
 * @typedef {Object} OrderPosition
 * @property {Number} id
 * @property {Number} user_id
 * @property {String} item
 * @property {String} price
 * @property {String} date
 * @property {String} username
 * @property {String} firstname
 * @property {String} lastname
 */

/**
 * @typedef {Object} OrderPositionInfo
 * @property {Number} id
 * @property {Number} order_id
 * @property {String} item
 * @property {String} price
 */

/**
 * @typedef {Object} BalanceInfo
 * @property {Number} id user id
 * @property {String} username
 * @property {String} firstname
 * @property {String} lastname
 * @property {String} paid amount, which was already paid
 * @property {String} debt total debt
 * @property {String} total debt, which is still left
 */

 /**
 * @typedef {Object} UserInfo
 * @property {Number} id
 * @property {String} username
 * @property {String} firstname
 * @property {String} lastname
 * @property {String} role
 */

/**
 * @typedef {Object} ExtendedUserInfo
 * @extends UserInfo
 * @property {String} paid amount, which was already paid
 * @property {String} debt total debt
 * @property {String} total debt, which is still left
 */

/**
 * @typedef {Object} Transaction
 * @property {Number} id
 * @property {String} amount
 * @property {String} date
 * @property {String} item
 * @property {Number} order_id
 * @property {String} order_title
 */

/**
 * @typedef {Object} UserTransaction
 * @extends Transaction
 * @property {Number} user_id
 * @property {String} username
 * @property {String} firstname
 * @property {String} lastname
 */

/**
 * @template T
 * @typedef {Object} Paginated
 * @property {Number} current_page
 * @property {Number} total total items
 * @property {Number} pages total pages
 * @property {T[]} items
 */

export class DemoApi {
  /**
   * @param {ContactController} contactController
   * @param {LoginController} loginController
   * @param {OrderController} orderController
   * @param {TransactionController} transactionController
   * @param {UserController} userController
   */
  constructor(contactController, loginController, orderController, transactionController, userController) {
    this.contactController = contactController;
    this.loginController = loginController;
    this.orderController = orderController;
    this.transactionController = transactionController;
    this.userController = userController;
    this.onUserChangeCallbacks = [];
  }

  /**
   * Log user in
   * @param {String} username
   * @param {String} password
   */
  async login(username, password) {
    this.loginController.login({ username: username, password: password });
    this._triggerOnUserChangeCallbacks();
  }

  /**
   * Log user out
   */
  async logout() {
    this.loginController.logout();
    this._triggerOnUserChangeCallbacks();
  }

  /**
   * Get all orders
   * @param {Number} page
   * @param {String} sort can be "title", "date" or "total"
   * @param {Boolean} ascending sort in ascending order
   * @returns {Paginated<Order>}
   */
  async orders(page, sort, ascending) {
    const [ data, mapper ] = this.orderController.getOrders();
    return paginateResponse(generalSort(data, sort || 'date', ascending).map(mapper), page);page
  }

  /**
   * @param {Number} id order id
   * @returns {OrderInfo}
   */
  async orderInfo(id) {
    return this.orderController.getInfo(id);
  }

  /**
   * @returns {OrderInfo}
   */
  async orderInfoLatest() {
    return this.orderController.getLatest();
  }

  /**
   * @param {Number} id order id
   * @param {Number} page
   * @param {String} sort can be "price", "date" or "name"
   * @param {String} ascending
   * @returns {Paginated<OrderPosition>}
   */
  async orderPositions(id, page, sort, ascending) {
    const [ data, mapper ] = this.orderController.getOrderPositions(id);
    return paginateResponse(generalSort(data, sort || 'date', ascending).map(mapper), page);
  }

  /**
   * @param {Number} page
   * @param {String} sort can be "debt", "paid", "total" or "name"
   * @param {String} ascending
   * @param {String} [query] search string for finding user
   * @returns {Paginated<BalanceInfo>}
   */
  async debts(page, sort, ascending, query) {
    const [ data, mapper ] = this.userController.getDebts(query);
    return paginateResponse(generalSort(data, sort || 'date', ascending).map(mapper), page);
  }

  /**
   * @param {Number} page
   * @param {String} sort can be "amount", "date" or "name"
   * @param {String} ascending
   * @returns {Paginated<UserTransaction>}
   */
  async transactions(page, sort, ascending) {
    const [ data, mapper ] = this.transactionController.getTransactions();
    return paginateResponse(generalSort(data, sort || 'date', ascending).map(mapper), page);
  }

  /**
   * @param {Number} id user id
   * @param {Number} page
   * @param {String} sort can be "amount" or "date"
   * @param {String} ascending
   * @returns {Paginated<Transaction>}
   */
  async userTransactions(id, page, sort, ascending) {
    const [ data, mapper ] = this.userController.getUserTransactions(id);
    return paginateResponse(generalSort(data, sort || 'date', ascending).map(mapper), page);
  }

  /**
   * @param {String} sort can be "debt", "paid", "total" or "name"
   * @param {String} ascending
   * @returns {BalanceInfo[]}
   */
  async allDebts(sort, ascending) {
    const [ data, mapper ] = this.userController.getDebts('');
    return generalSort(data, sort || 'name', ascending).map(mapper);
  }

  /**
   * Create a new order
   * @param {Object} data
   * @param {String} data.title Title
   * @param {String} data.description Description
   * @param {String} data.url Url to the shop
   * @param {String} data.comments Additional comments
   * @returns id of the new order
   */
  async createOrder(data) {
    return this.orderController.create(data).id;
  }

  /**
   * Add an order position to an existing order
   * Either userid or firstname and lastname must be set.
   * If userid is not set, a new user is created.
   * @param {Number} orderId
   * @param {Object} data
   * @param {Number} [data.userid] User, which placed the order
   * @param {String} [data.firstname]
   * @param {String} [data.lastname]
   * @param {String} data.item Item which the user ordered
   * @param {String} data.price Price as a string e.g. "10,50"
   */
  async placeOrder(orderId, data) {
    this.orderController.placeOrder(orderId, data);
  }

  /**
   * Get order position info
   * @param {Number} orderPositionId
   * @returns {OrderPositionInfo}
   */
  async orderPositionInfo(orderPositionId) {
    return this.orderController.getOrderPositionInfo(orderPositionId);
  }

  /**
   * Edit an order position
   * @param {Number} orderPositionId
   * @param {Object} data
   * @param {String} data.item Item which the user ordered
   * @param {String} data.price Price as a string e.g. "10,50"
   */
  async editOrderPosition(orderPositionId, data) {
    this.orderController.editOrderPosition(orderPositionId, data);
  }

  /**
   * Delete an order position
   * @param {Number} orderPositionId
   */
  async deleteOrderPosition(orderPositionId) {
    this.orderController.deleteOrderPosition(orderPositionId);
  }

  /**
   * Lock or unlock an order
   * @param {Number} orderId
   * @param {Boolean} lock
   */
  async lockOrder(orderId, lock) {
    this.orderController.lock(orderId, { locked: lock });
  }

  /**
   * Create a new user
   * @param {Object} data
   * @param {String} data.username New username, can be empty
   * @param {String} data.firstname
   * @param {String} data.lastname
   * @param {String} data.password
   */
  async createUser(data) {
    this.userController.create(data);
  }

  /**
   * Edits an existing user
   * @param {Number} id userid
   * @param {Object} data
   * @param {String} [data.username]
   * @param {String} [data.firstname]
   * @param {String} [data.lastname]
   * @param {String} [data.password]
   */
  async editUser(id, data) {
    this.userController.editUser(id, data);
    this._triggerOnUserChangeCallbacks();
  }

  /**
   * @param {Number} id user id
   * @returns {ExtendedUserInfo}
   */
  async userInfo(id) {
    return this.userController.getUserInfo(id);
  }

  /**
   * @returns {UserInfo|null}
   */
  async sessionInfo() {
    const data = this.userController.getSessionInfo();
    if (!data.id) {
      return null;
    }
    return data;
  }

  /**
   * Send contact message to admin
   * @param {String} email
   * @param {String} name
   * @param {String} message
   */
  async contact(email, name, message) {
    this.contactController.contact({
      email: email,
      name: name,
      message: message
    });
  }

  /**
   * Add payment
   * @param {Object} data
   * @param {String} data.userid
   * @param {String} data.amount
   */
  async pay(data) {
    this.transactionController.pay(data);
  }

  /**
   * Add debt
   * Either userid or firstname and lastname must be set.
   * If userid is not set, a new user is created.
   * @param {Object} data
   * @param {String} data.amount
   * @param {String} [data.userid]
   * @param {String} [data.firstname]
   * @param {String} [data.lastname]
   */
  async addDebt(data) {
    this.transactionController.owe(data);
  }

  /**
   * Add callback which gets called when something user related changed
   * @param {Function} cb
   */
  onUserChange(cb) {
    this.onUserChangeCallbacks.push(cb);
  }

  /**
   * Call all onUserChange-Callbacks
   */
  _triggerOnUserChangeCallbacks() {
    for (const cb of this.onUserChangeCallbacks) {
      cb();
    }
  }
};
