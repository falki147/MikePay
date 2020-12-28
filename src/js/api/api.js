import config from "../config";
import JSONHttpClient from "./json-http-client";
import Session from "./session";

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

    Session.login(userdata);
  }

  /**
   * Log user out
   */
  static async logout() {
    await JSONHttpClient.post(`${config.apiBaseURL}/logout`);
    Session.logout();
  }

  static async orders() {
    return await JSONHttpClient.get(`${config.apiBaseURL}/order`);
  }

  static async getOrderInfo(id) {
    return await JSONHttpClient.get(`${config.apiBaseURL}/order/${id}`);
  }

  static async debts(page, sort, ascending) {
    return await JSONHttpClient.get(
      `${config.apiBaseURL}/user/debts?page=${page}&sort=${sort || ''}&asc=${!!ascending}`
    );
  }

  static async userTransactions(id, page, sort, ascending) {
    return await JSONHttpClient.get(
      `${config.apiBaseURL}/user/${id}/transactions?page=${page}&sort=${sort || ''}&asc=${!!ascending}`
    );
  }

  static async allDebts(sort, ascending) {
    const data = await JSONHttpClient.get(
      `${config.apiBaseURL}/user/debts?per_page=-1&sort=${sort || ''}&asc=${!!ascending}`
    );
    return data.items;
  }

  /**
   * Create a new order
   * @param {Object} data
   * @param {String} data.description Description
   * @param {String} data.url Url to the shop
   * @param {String} data.comments Additional comments
   */
  static async createOrder(data) {
    await JSONHttpClient.post(`${config.apiBaseURL}/order`, data);
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
};
