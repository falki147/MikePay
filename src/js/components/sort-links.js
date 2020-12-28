export default class SortLinks {
  /**
   * @param {HTMLElement} element 
   */
  constructor(element) {
    this._element = element;
    this._selected = null;
    this._ascending = true;
    this._callbacks = [];

    for (const link of element.getElementsByClassName("sort-link")) {
      link.addEventListener("click", ev => {
        ev.preventDefault();
        this.selected = link.getAttribute("data-sort");
      });
    }
  }

  set selected(value) {
    if (this._selected == value) {
      this._ascending = !this._ascending;
    }
    else {
      this._selected = value;
      this._ascending = true;
    }

    // Clear previous icons
    this._element.querySelectorAll(".sort-link i.bi")
      .forEach(el => el.remove());

    const target = this._element.querySelector(`.sort-link[data-sort="${value}"]`);
    if (target) {
      const iconClass = this._ascending ? "bi-arrow-down" : "bi-arrow-up";
      target.innerHTML = `<i class="bi ${iconClass}"></i>${target.innerHTML}`;
    }

    for (const cb of this._callbacks) {
      cb(this._selected, this._ascending);
    }
  }

  get selected() {
    return this._selected;
  }

  get ascending() {
    return this._ascending;
  }

  onChange(cb) {
    this._callbacks.push(cb);
  }
};
