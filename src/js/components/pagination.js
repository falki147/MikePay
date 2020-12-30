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
    this._updateClasses();
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

  /**
   * Creates the HTML and sets it
   */
  _render() {
    if (this._pages <= 1) {
      this._element.innerHTML = "";
      return;
    }

    let html = "";
    html += "<ul class=\"pagination\">";

    html += "<li class=\"page-item page-item-prev\">";
    html += "  <a class=\"page-link\" href=\"#\" data-page=\"prev\">Previous</a>";
    html += "</li>";
    
    for (let i = 1; i <= this._pages; ++i) {
      if (i == this._pages) {
        html += "<li class=\"page-item page-item-dots-last disabled\">";
        html += "  <span class=\"page-link\"><i class=\"bi bi-three-dots\"></i></span>";
        html += "</li>";
      }

      html += "<li class=\"page-item page-item-page\">";
      html += `  <a class="page-link" href="#" data-page="${i}">${i}</a>`;
      html += "</li>";

      if (i == 1) {
        html += "<li class=\"page-item page-item-dots-first disabled\">";
        html += "  <span class=\"page-link\"><i class=\"bi bi-three-dots\"></i></span>";
        html += "</li>";
      }
    }

    html += "<li class=\"page-item page-item-next\">";
    html += "  <a class=\"page-link\" href=\"#\" data-page=\"next\">Next</a>";
    html += "</li>";

    this._element.innerHTML = html;

    // Add click events to all a-tags
    const links = this._element.getElementsByClassName("page-link");
    for (const link of links) {
      if (link.tagName === "A") {
        link.addEventListener("click", ev => {
          ev.preventDefault();

          let newPage = link.getAttribute("data-page");
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

    this._updateClasses();
  }

  /**
   * Updates the classes & styles of the HTML
   */
  _updateClasses() {
    const items = this._element.getElementsByClassName("page-item-page");

    if (items.length <= 0) {
      return;
    }

    const prev = this._element.getElementsByClassName("page-item-prev")[0];
    const next = this._element.getElementsByClassName("page-item-next")[0];
    const firstDots = this._element.getElementsByClassName("page-item-dots-first")[0];
    const lastDots = this._element.getElementsByClassName("page-item-dots-last")[0];

    // Enable previous and next button
    prev.classList.remove("disabled");
    prev.removeAttribute("tabindex");
    next.classList.remove("disabled");
    next.removeAttribute("tabindex");

    // Remove active class from all pages
    for (const item of items) {
      item.classList.remove("active");
    }

    // Disable previous button when on first page
    if (this._page == 1) {
      prev.classList.add("disabled");
      prev.setAttribute("tabindex", "-1");
    }

    // Set current page active
    if (this._page <= items.length) {
      items[this._page - 1].classList.add("active");
    }

    // Disable next button when on last page
    if (this._page == this._pages) {
      next.classList.add("disabled");
      next.setAttribute("tabindex", "-1");
    }

    // Hide all pages
    for (const item of items) {
      item.style.display = "none";
    }

    // Always Display first and last page
    items[0].style.removeProperty("display");
    items[items.length - 1].style.removeProperty("display");

    // Display 2 additional pages on each side of the active one
    const begin = Math.max(0, this._page - 3);
    const end = Math.min(items.length - 1, this._page + 1);

    for (let i = begin; i <= end; ++i) {
      items[i].style.removeProperty("display");
    }

    // Display ... when needed
    firstDots.style.display = "none";
    lastDots.style.display = "none";

    if (begin > 1) {
      firstDots.style.removeProperty("display");
    }

    if (end < items.length - 2) {
      lastDots.style.removeProperty("display");
    }
  }
};
