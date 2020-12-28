let data = null;
const sessionKey = "mikepay_session";

export default class Session {
  /**
   * Check if user is logged in
   * @returns {Boolean}
   */
  static isLoggedIn() {
    return this._getData().loggedIn;
  }

  /**
   * Returns first name of user
   */
  static firstname() {
    if (!this.isLoggedIn()) {
      throw Error("user not logged in");
    }

    return this._getData().firstname;
  }

  /**
   * Returns last name of user
   */
  static lastname() {
    if (!this.isLoggedIn()) {
      throw Error("user not logged in");
    }

    return this._getData().lastname;
  }

  /**
   * Returns user name of user
   */
  static username() {
    if (!this.isLoggedIn()) {
      throw Error("user not logged in");
    }

    return this._getData().username;
  }

  /**
   * Set user session data
   */
  static login(userdata) {
    data = userdata;
    data.loggedIn = true;
    this._updateData();
  }

  /**
   * Clear session
   */
  static logout() {
    data = { loggedIn: false };
    this._updateData();
  }

  static _getData() {
    if (data) {
      return data;
    }

    data = { loggedIn: false };

    const item = sessionStorage.getItem(sessionKey);
    if (!item) {
      return data;
    }

    try {
      data = JSON.parse(item);
    }
    catch (e) {
      // Log exception and return default session
      console.log(e);
    }

    return data;
  }

  static _updateData() {
    sessionStorage.setItem(sessionKey, JSON.stringify(data));
  }
};
