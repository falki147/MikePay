import Session from "../api/session";

/**
 * Set debts link on startpage
 */
document.addEventListener("DOMContentLoaded", async () => {
  const debtLink = document.getElementById("startpage-debts-link");
  const debtLinkCard = document.getElementById("startpage-debts-link-card");
  if (debtLink && debtLinkCard && await Session.isLoggedIn()) {
    debtLink.href = `/debtor/?user_id=${await Session.id()}`;
    debtLinkCard.href = `/debtor/?user_id=${await Session.id()}`; 
  }
});
