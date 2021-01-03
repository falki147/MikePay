import Api from "../api/api";
import Session from "../api/session";
import Loader from "./loader";

/**
 * Handle logout button and initialize profile text
 */
document.addEventListener("DOMContentLoaded", async () => {
  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      try{
        Loader.begin(logoutButton);
        await Api.logout();
        window.location = "/";
      } catch(e) {
        console.log(e);
      }

      Loader.end();
    });
  }

  const profileNav = document.getElementById("navbar-dropdown-profile");
  if (profileNav && await Session.isLoggedIn()) {
    const data = await Session.data();
    profileNav.innerText = `${data.firstname} ${data.lastname}`;
  }

  const debts = document.getElementById("navbar-dropdown-debts");
  if(debts && await Session.isLoggedIn()){
    const id = await Session.id();
    debts.setAttribute("href", "/debtor/?user_id=" + id);
  }
  
});