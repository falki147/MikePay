export default class JSONHttpClient {
  /**
   * Perform HTTP Get request on url
   * @param {String} url
   */
  static async get(url) {
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json"
      },
      credentials: "include"
    });

    if (response.status !== 200) {
      await this.handleError(response);
    }

    return await response.json();
  }

  /**
   * Perform HTTP Post request on url
   * @param {String} url
   * @param {Object} data Body of the request sent as JSON
   */
  static async post(url, data) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include"
    });

    if (response.status !== 200) {
      await this.handleError(response);
    }

    return await response.json();
  }

  /**
   * Perform HTTP Path request on url
   * @param {String} url
   * @param {Object} data Body of the request sent as JSON
   */
  static async patch(url, data) {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include"
    });

    if (response.status !== 200) {
      await this.handleError(response);
    }

    return await response.json();
  }

  /**
   * Helper function to throw exception when request failed
   * @param {Response} response 
   */
  static async handleError(response) {
    let message = null;
    let code = null;
    try {
      const data = await response.json();
      code = data.code;
      message = data.message;
    }
    catch (e) {}

    console.error("Request failed");

    switch (code) {
      case "AUTH_FAILED":
        throw Error("Authentifizierung fehlgeschlagen");
      case "VALUE_NOT_POSITIVE":
        throw Error("Wert muss größer als 0 sein");
      case "VALUE_EMPTY":
        throw Error("Wert darf nicht leer sein");
      case "USER_NOT_FOUND":
        throw Error("Benutzer wurde nicht gefunden");
      case "ORDER_NOT_FOUND":
        throw Error("Bestellung wurde nicht gefunden");
      default:
        throw Error("Interner Fehler ist aufgetreten");
    }
  }
};
