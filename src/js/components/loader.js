let count = 0;

export default class Loader {
  static begin(elem) {
    // Either add class to element or on main element
    elem = elem || document.getElementsByTagName("main")[0];

    // TODO: Make sure elem isn't a child of an exisiting loading element
    elem.classList.add("loading");

    // Remove loading class on children
    for (const child of elem.getElementsByClassName("loading")) {
      child.classList.remove("loading");
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
    }
  }
};
