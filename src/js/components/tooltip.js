import { Tooltip } from "bootstrap";

document.addEventListener("DOMContentLoaded", () => {
  for (const tooltip of document.querySelectorAll("[data-bs-toggle=\"tooltip\"]")) {
    new Tooltip(tooltip);
  }
});
