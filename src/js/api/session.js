import Api from "./api";

Api.onUserChange(() => {
  // Invalidate user data when user changed
  Session.invalidate();
});

/** Caches the user data */
let data = null;

/** Session storage key */
const sessionKey = "mikepay_session";

/** Local storage key */
const storageKey = "mikepay_session";

/**
 * @typedef {Object} SessionUserInfo
 * @property {Boolean} loggedIn
 * @property {Number} id
 * @property {String} username
 * @property {String} firstname
 * @property {String} lastname
 * @property {String} role
 */

/**
 * Class which handles the session on the client
 * The session data is stored in localStorage. If it isn't present or out of date, a call to the api
 * is made.
 */
export default class Session {
  /**
   * Check if user is logged in
   * @returns {Boolean}
   */
  static async isLoggedIn() {
    const data = await this._getData();
    return data.loggedIn;
  }

  /**
   * Retrieve id from current user
   * @returns {Boolean}
   */
  static async id() {
    return (await this.data()).id;
  }

  /**
   * Returns data of the current user
   * @returns {SessionUserInfo}
   */
  static async data() {
    const data = await this._getData();

    if (!data.loggedIn) {
      throw Error("user not logged in");
    }

    return data;
  }

  /**
   * Clears all saved data
   * This forces the client to fetch the user data from the server next time.
   */
  static invalidate() {
    data = null;
    sessionStorage.removeItem(sessionKey);
    localStorage.removeItem(localStorage);
  }

  /**
   * Retrieves session user data from either local storage (when recent) or server
   * @returns {SessionUserInfo}
   */
  static async _getData() {
    if (data) {
      return data;
    }

    // Default to not logged in
    data = { loggedIn: false };

    const sessionItem = sessionStorage.getItem(sessionKey);
    const storageItem = localStorage.getItem(storageKey);

    if (sessionItem !== "true" || !storageItem) {
      // Try to get data from server
      try {
        const sessionData = await Api.sessionInfo();

        if (sessionData !== null) {
          data = sessionData;
          data.loggedIn = true;
        }

        this._updateData();
      }
      catch(e) {}

      return data;
    }

    try {
      data = JSON.parse(storageItem);
    }
    catch (e) {
      // Log exception and return default session
      console.log(e);
    }

    return data;
  }

  /**
   * Store current data in local/session storage
   */
  static _updateData() {
    sessionStorage.setItem(sessionKey, "true");
    localStorage.setItem(storageKey, JSON.stringify(data));
  }
};
