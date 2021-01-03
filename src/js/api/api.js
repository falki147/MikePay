import config from "../config";
import JSONHttpClient from "./json-http-client";

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

let onUserChangeCallbacks = [];

export default class Api {
  /**
   * Log user in
   * @param {String} username
   * @param {String} password
   */
  static async login(username, password) {
    const userdata = await JSONHttpClient.post(
      `${config.apiBaseURL}/login`,
      { username: username, password: password }
    );
    this._triggerOnUserChangeCallbacks();
  }

  /**
   * Log user out
   */
  static async logout() {
    await JSONHttpClient.post(`${config.apiBaseURL}/logout`);
    this._triggerOnUserChangeCallbacks();
  }

  /**
   * Get all orders
   * @param {Number} page
   * @param {String} sort can be "title", "date" or "total"
   * @param {Boolean} ascending sort in ascending order
   * @returns {Paginated<Order>}
   */
  static async orders(page, sort, ascending) {
    return await JSONHttpClient.get(
      `${config.apiBaseURL}/order?page=${page}&sort=${sort || ''}&asc=${!!ascending}`
    );
  }

  /**
   * @param {Number} id order id
   * @returns {OrderInfo}
   */
  static async orderInfo(id) {
    return await JSONHttpClient.get(`${config.apiBaseURL}/order/${id}`);
  }

  /**
   * @param {Number} id order id
   * @param {Number} page
   * @param {String} sort can be "price", "date" or "name"
   * @param {String} ascending
   * @returns {Paginated<OrderPosition>}
   */
  static async orderPositions(id, page, sort, ascending) {
    return await JSONHttpClient.get(
      `${config.apiBaseURL}/order/${id}/positions?page=${page}&sort=${sort || ''}&asc=${!!ascending}`
    );
  }

  /**
   * @param {Number} page
   * @param {String} sort can be "debt", "paid", "total" or "name"
   * @param {String} ascending
   * @param {String} [query] search string for finding user
   * @returns {Paginated<BalanceInfo>}
   */
  static async debts(page, sort, ascending, query) {
    return await JSONHttpClient.get(
      `${config.apiBaseURL}/user/debts?page=${page}&sort=${sort || ''}&asc=${!!ascending}&query=${query || ""}`
    );
  }

  /**
   * @param {Number} page
   * @param {String} sort can be "amount", "date" or "name"
   * @param {String} ascending
   * @returns {Paginated<UserTransaction>}
   */
  static async transactions(page, sort, ascending) {
    return await JSONHttpClient.get(
      `${config.apiBaseURL}/transaction?page=${page}&sort=${sort || ''}&asc=${!!ascending}`
    );
  }

  /**
   * @param {Number} id user id
   * @param {Number} page
   * @param {String} sort can be "amount" or "date"
   * @param {String} ascending
   * @returns {Paginated<Transaction>}
   */
  static async userTransactions(id, page, sort, ascending) {
    return await JSONHttpClient.get(
      `${config.apiBaseURL}/user/${id}/transactions?page=${page}&sort=${sort || ''}&asc=${!!ascending}`
    );
  }

  /**
   * @param {String} sort can be "debt", "paid", "total" or "name"
   * @param {String} ascending
   * @returns {BalanceInfo[]}
   */
  static async allDebts(sort, ascending) {
    const data = await JSONHttpClient.get(
      `${config.apiBaseURL}/user/debts?per_page=-1&sort=${sort || ''}&asc=${!!ascending}`
    );
    return data.items;
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
  static async createOrder(data) {
    const orderData = await JSONHttpClient.post(`${config.apiBaseURL}/order`, data);
    return orderData.id;
  }

  /**
   * Add an order position to an existing order
   * @param {Number} orderId
   * @param {Object} data
   * @param {Number} data.userid User, which placed the order
   * @param {String} data.item Item which the user ordered
   * @param {String} data.price Price as a string e.g. "10,50"
   */
  static async placeOrder(orderId, data) {
    await JSONHttpClient.post(`${config.apiBaseURL}/order/${orderId}`, data);
  }

  /**
   * Lock or unlock an order
   * @param {Number} orderId
   * @param {Boolean} lock
   */
  static async lockOrder(orderId, lock) {
    await JSONHttpClient.post(`${config.apiBaseURL}/order/${orderId}/lock`, { locked: lock });
  }

  /**
   * Create a new user
   * @param {Object} data
   * @param {String} data.username New username, can be empty
   * @param {String} data.firstname
   * @param {String} data.lastname
   * @param {String} data.password
   */
  static async createUser(data) {
    await JSONHttpClient.post(`${config.apiBaseURL}/user`, data);
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
  static async editUser(id, data) {
    await JSONHttpClient.patch(`${config.apiBaseURL}/user/${id}`, data);
    this._triggerOnUserChangeCallbacks();
  }

  /**
   * @param {Number} id user id
   * @returns {UserInfo}
   */
  static async userInfo(id) {
    return await JSONHttpClient.get(`${config.apiBaseURL}/user/${id}`);
  }

  /**
   * @returns {UserInfo|null}
   */
  static async sessionInfo() {
    const data = await JSONHttpClient.get(`${config.apiBaseURL}/user`);
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
  static async contact(email, name, message) {
    await JSONHttpClient.post(`${config.apiBaseURL}/contact`, {
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
  static async pay(data) {
    await JSONHttpClient.post(`${config.apiBaseURL}/transaction/pay`, data);
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
  static async addDebt(data) {
    await JSONHttpClient.post(`${config.apiBaseURL}/transaction/owe`, data);
  }

  /**
   * Add callback which gets called when something user related changed
   * @param {Function} cb
   */
  static onUserChange(cb) {
    onUserChangeCallbacks.push(cb);
  }

  /**
   * Call all onUserChange-Callbacks
   */
  static _triggerOnUserChangeCallbacks() {
    for (const cb of onUserChangeCallbacks) {
      cb();
    }
  }
};
