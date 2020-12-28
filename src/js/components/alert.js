import encode from "../utils/encode";

export default class Alert {
  static error(message) {
    this.show("alert-danger", message);
  }

  static success(message) {
    this.show("alert-success", message);
  }

  static show(type, message) {
    const html = `<div class="alert ${type}" role="alert">${encode(message)}</div>`;

    for (const el of document.getElementsByClassName("alert-outlet")) {
      el.innerHTML = html;
    }
  }
};
