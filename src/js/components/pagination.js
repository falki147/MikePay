export default class Pagination {
  /**
   * @param {HTMLElement} element
   */
  constructor(element) {
    this._element = element;
    this._pages = 1;
    this._page = 1;
    this._callbacks = [];
    this._render();
  }

  set page(value) {
    this._page = value;

    const items = this._element.getElementsByClassName("page-item");
    for (const item of items) {
      item.classList.remove("active");
      item.classList.remove("disabled");
    }

    if (this._page == 1) {
      items[0].classList.add("disabled");
    }

    items[this._page].classList.add("active");

    if (this._page == this._pages) {
      items[items.length - 1].classList.add("disabled");
    }
  }

  get page() {
    return this._page;
  }

  set pages(value) {
    if (this._pages != value) {
      this._pages = value;
      this._render();
    }
  }

  get pages() {
    return this._pages;
  }

  onClick(cb) {
    this._callbacks.push(cb);
  }

  dispatchOnClick(newPage) {
    for (const cb of this._callbacks) {
      cb(newPage);
    }
  }

  _render() {
    if (this._pages < 1) {
      this._element.innerHTML = "";
      return;
    }

    let html = "";
    html += "<ul class=\"pagination\">";

    html += `<li class="page-item ${this._page == 1 ? "disabled" : ""}">`;
    html += "  <a class=\"page-link\" href=\"#\" data-page=\"prev\">Previous</a>";
    html += "</li>";
    
    for (let i = 1; i <= this._pages; ++i) {
      html += `<li class="page-item ${i == this._page ? "active" : ""}">`;
      html += `  <a class="page-link" href="#" data-page="${i}">${i}</a>`;
      html += "</li>";
    }

    html += `<li class="page-item ${this._page == this._pages ? "disabled" : ""}">`;
    html += "  <a class=\"page-link\" href=\"#\" data-page=\"next\">Next</a>";
    html += "</li>";

    this._element.innerHTML = html;

    const links = this._element.getElementsByClassName("page-link");
    for (const link of links) {
      link.addEventListener("click", ev => {
        ev.preventDefault();

        let newPage = ev.target.getAttribute("data-page");
        if (newPage === "prev") {
          newPage = Math.max(1, this._page - 1);
        }
        else if (newPage === "next") {
          newPage = Math.min(this._pages, this._page + 1);
        }

        newPage = Number(newPage);

        if (this.page != newPage) {
          this.page = newPage;
          this.dispatchOnClick(newPage);
        }
      });
    }
  }
};
