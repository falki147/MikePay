import Api from "./api";

let data = null;
const sessionKey = "mikepay_session";

export default class Session {
  /**
   * Check if user is logged in
   * @returns {Boolean}
   */
  static async isLoggedIn() {
    const data = await this._getData();
    return data.loggedIn;
  }

  static async id() {
    return (await this.data()).id;
  }

  static async username() {
    return (await this.data()).username;
  }

  static async firstname() {
    return (await this.data()).firstname;
  }

  static async lastname() {
    return (await this.data()).lastname;
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

  /**
   * Returns data of user
   */
  static async data() {
    const data = await this._getData();

    if (!await this.isLoggedIn()) {
      throw Error("user not logged in");
    }

    return data;
  }

  static async _getData() {
    if (data) {
      return data;
    }

    data = { loggedIn: false };

    const item = sessionStorage.getItem(sessionKey);
    if (!item) {
      try {
        data = await Api.sessionInfo();
        data.loggedIn = true;
        this._updateData();
      }
      catch(e) {}

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
