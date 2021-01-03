export default class SortLinks {
  /**
   * @param {HTMLElement} element 
   */
  constructor(element) {
    this._element = element;
    this._selected = null;
    this._ascending = true;
    this._callbacks = [];
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

  sortOnClick() {
    for (const link of this._element.getElementsByClassName("sort-link")) {
      link.addEventListener("click", ev => {
        ev.preventDefault();
        const value = link.getAttribute("data-sort");

        if (this._selected == value) {
          this._ascending = !this._ascending;
        }
        else {
          this._selected = value;
          this._ascending = true;
        }

        this._update();
      });
    }
  }

  createSelectbox() {
    const id = Math.random().toString().substr(2);

    const label = document.createElement("label");
    label.className = "input-group-text";
    label.for = id;
    label.innerText = "Sortierung";

    const select = document.createElement("select");
    select.className = "form-select";
    select.id = id;
    
    for (const link of this._element.getElementsByClassName("sort-link")) {
      select.options.add(
        new Option(link.innerText + " Aufsteigend", link.getAttribute("data-sort") + ";asc")
      );

      select.options.add(
        new Option(link.innerText + " Absteigend", link.getAttribute("data-sort") + ";desc")
      );
    }

    select.addEventListener("change", () => {
      const value = select.value.split(";");
      this._selected = value[0];
      this._ascending = value[1] === "asc";
      this._update();
    });

    this.onChange(() => {
      const newValue = `${this._selected};${this._ascending ? "asc" : "desc"}`;

      if (select.value !== newValue) {
        select.value = newValue;
      }
    });

    const wrapper = document.createElement("div");
    wrapper.classList = "input-group";
    wrapper.appendChild(label);
    wrapper.appendChild(select);
    return wrapper;
  }

  _update() {
    // Clear previous icons
    this._element.querySelectorAll(".sort-link i.bi")
      .forEach(el => el.remove());

    const target = this._element.querySelector(`.sort-link[data-sort="${this._selected}"]`);
    if (target) {
      const iconClass = this._ascending ? "bi-arrow-down" : "bi-arrow-up";
      target.innerHTML = `<i class="bi ${iconClass}"></i>${target.innerHTML}`;
    }

    for (const cb of this._callbacks) {
      cb(this._selected, this._ascending);
    }
  }
};
