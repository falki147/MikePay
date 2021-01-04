import Session from "../api/session";

/**
 * Handle session classes (e.g. remove/enable certain elements)
 */
document.addEventListener("DOMContentLoaded", async () => {
  /**
   * Remove every element which has css class
   * @param {String} className
   */
  function removeElements(className) {
    for (const el of [...document.getElementsByClassName(className)]) {
      el.remove();
    }
  }

  /**
   * Remove css class from every element
   * @param {String} className
   */
  function removeClass(className) {
    for (const el of [...document.getElementsByClassName(className)]) {
      el.classList.remove(className);
    }
  }

  if (await Session.isLoggedIn()) {
    const role = (await Session.data()).role;

    removeElements("guest-only");
    removeClass("user-only");

    if (role === "admin") {
      removeClass("admin-only");
    }
    else {
      removeElements("admin-only");
    }
  }
  else {
    removeClass("guest-only");
    removeElements("user-only");
    removeElements("admin-only");
  }
});
