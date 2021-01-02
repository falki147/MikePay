let count = 0;
let buttonLoaders = [];

export default class Loader {
  /**
   * @param {HTMLElement} [elem]
   */
  static begin(elem) {
    // Either add class to element or on main element
    elem = elem || document.getElementsByTagName("main")[0];

    if (elem.tagName === "BUTTON") {
      // Add spinner to button when it wasn't already added
      if (elem.getElementsByClassName("spinner-border").length === 0) {
        elem.innerHTML =
          "<span class=\"align-baseline spinner-border spinner-border-sm\" " +
          "      role=\"status\" " +
          "      aria-hidden=\"true\">" +
          "</span> " + elem.innerHTML;
        buttonLoaders.push(elem);
      }
    }
    else {
      // TODO: Make sure elem isn't a child of an exisiting loading element
      elem.classList.add("loading");

      // Remove loading class on children
      for (const child of elem.getElementsByClassName("loading")) {
        child.classList.remove("loading");
      }
    }

    ++count;
  }

  static end() {
    --count;
    
    if (count == 0) {
      // Remove loading class from every element
      for (const child of document.getElementsByClassName("loading")) {
        child.classList.remove("loading");
      }

      // Remove spinner from loading button
      for (const button of buttonLoaders) {
        const spinner = button.getElementsByClassName("spinner-border")[0];
        spinner.remove();
      }

      buttonLoaders = [];
    }
  }
};
