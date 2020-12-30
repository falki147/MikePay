let count = 0;

export default class Loader {
  static begin() {
    ++count;
    this.update();
  }

  static end() {
    --count;
    this.update();
  }

  static update() {
    const main = document.querySelector("main");

    if (count == 0) {
      if (main) {
        main.style.display = "block";
      }
      
      const spinner = document.getElementById("spinner-wrapper");

      if (spinner) {
        spinner.remove();
      }
    }
    else {
      if (main) {
        const height = main.getBoundingClientRect().height;
        main.style.display = "none";

        if (!document.getElementById("spinner-wrapper")) {
          const spinner = document.createElement("div");
          spinner.id = "spinner-wrapper";
          spinner.className = "d-flex flex-grow-1 justify-content-center";

          // Keep height of original content
          spinner.style.minHeight = height + "px";

          spinner.innerHTML =
            `<div class="spinner-border my-3" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>`;
          main.parentNode.insertBefore(spinner, main.nextSibling);
        }
      }
    }
  }
};
