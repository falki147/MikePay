import Session from "../api/session";

/**
 * Set debts link on startpage
 */
document.addEventListener("DOMContentLoaded", async () => {
  const debtLink = document.getElementById("startpage-debts-link");
  if (debtLink && await Session.isLoggedIn()) {
    debtLink.href = `debtor/?user_id=${await Session.id()}`;
  }
});
