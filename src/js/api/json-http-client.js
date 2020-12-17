export default class JSONHttpClient {
  /**
   * Perform HTTP Get request on url
   * @param {String} url
   */
  static async get(url) {
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json"
      }
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
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
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
    try {
      message = (await response.json()).message;
    }
    catch (e) {}
    
    throw Error(message || `request failed with ${response.status}`);
  }
};
