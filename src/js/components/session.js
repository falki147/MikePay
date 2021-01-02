import Session from "../api/session";

/**
 * Handle session classes (e.g. remove/enable certain elements)
 */
document.addEventListener("DOMContentLoaded", async () => {
  if (await Session.isLoggedIn()) {
    // Remove guest only elements
    for (const el of [...document.getElementsByClassName("guest-only")]) {
      el.remove();
    }

    // Display user only elements
    for (const el of [...document.getElementsByClassName("user-only")]) {
      el.classList.remove("user-only");
    }
  }
  else {
    // Remove user only elements
    for (const el of [...document.getElementsByClassName("user-only")]) {
      el.remove();
    }

    // Display guest only elements
    for (const el of [...document.getElementsByClassName("guest-only")]) {
      el.classList.remove("guest-only");
    }
  }
});
