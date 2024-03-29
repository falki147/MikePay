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

const onUserChangeCallbacks = [];
const config = {
  apiBaseURL: ''
};

export default class RestApi {
  onUserChangeCallbacks = [];
  
  constructor(apiBaseURL) {
    this.apiBaseURL = apiBaseURL;
  }

  /**
   * Log user in
   * @param {String} username
   * @param {String} password
   */
  async login(username, password) {
    const userdata = await JSONHttpClient.post(
      `${config.apiBaseURL}/login`,
      { username: username, password: password }
    );
    this._triggerOnUserChangeCallbacks();
  }

  /**
   * Log user out
   */
  async logout() {
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
  async orders(page, sort, ascending) {
    return await JSONHttpClient.get(
      `${config.apiBaseURL}/order?page=${page}&sort=${sort || ''}&asc=${!!ascending}`
    );
  }

  /**
   * @param {Number} id order id
   * @returns {OrderInfo}
   */
  async orderInfo(id) {
    return await JSONHttpClient.get(`${config.apiBaseURL}/order/${id}`);
  }

  /**
   * @returns {OrderInfo}
   */
  async orderInfoLatest() {
    return await JSONHttpClient.get(`${config.apiBaseURL}/order/latest`);
  }

  /**
   * @param {Number} id order id
   * @param {Number} page
   * @param {String} sort can be "price", "date" or "name"
   * @param {String} ascending
   * @returns {Paginated<OrderPosition>}
   */
  async orderPositions(id, page, sort, ascending) {
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
  async debts(page, sort, ascending, query) {
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
  async transactions(page, sort, ascending) {
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
  async userTransactions(id, page, sort, ascending) {
    return await JSONHttpClient.get(
      `${config.apiBaseURL}/user/${id}/transactions?page=${page}&sort=${sort || ''}&asc=${!!ascending}`
    );
  }

  /**
   * @param {String} sort can be "debt", "paid", "total" or "name"
   * @param {String} ascending
   * @returns {BalanceInfo[]}
   */
  async allDebts(sort, ascending) {
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
  async createOrder(data) {
    const orderData = await JSONHttpClient.post(`${config.apiBaseURL}/order`, data);
    return orderData.id;
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
    await JSONHttpClient.post(`${config.apiBaseURL}/order/${orderId}`, data);
  }

  /**
   * Get order position info
   * @param {Number} orderPositionId
   * @returns {OrderPositionInfo}
   */
  async orderPositionInfo(orderPositionId) {
    return await JSONHttpClient.get(`${config.apiBaseURL}/order/position/${orderPositionId}`);
  }

  /**
   * Edit an order position
   * @param {Number} orderPositionId
   * @param {Object} data
   * @param {String} data.item Item which the user ordered
   * @param {String} data.price Price as a string e.g. "10,50"
   */
  async editOrderPosition(orderPositionId, data) {
    await JSONHttpClient.patch(`${config.apiBaseURL}/order/position/${orderPositionId}`, data);
  }

  /**
   * Delete an order position
   * @param {Number} orderPositionId
   */
  async deleteOrderPosition(orderPositionId) {
    await JSONHttpClient.delete(`${config.apiBaseURL}/order/position/${orderPositionId}`, {});
  }

  /**
   * Lock or unlock an order
   * @param {Number} orderId
   * @param {Boolean} lock
   */
  async lockOrder(orderId, lock) {
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
  async createUser(data) {
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
  async editUser(id, data) {
    await JSONHttpClient.patch(`${config.apiBaseURL}/user/${id}`, data);
    this._triggerOnUserChangeCallbacks();
  }

  /**
   * @param {Number} id user id
   * @returns {ExtendedUserInfo}
   */
  async userInfo(id) {
    return await JSONHttpClient.get(`${config.apiBaseURL}/user/${id}`);
  }

  /**
   * @returns {UserInfo|null}
   */
  async sessionInfo() {
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
  async contact(email, name, message) {
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
  async pay(data) {
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
  async addDebt(data) {
    await JSONHttpClient.post(`${config.apiBaseURL}/transaction/owe`, data);
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
