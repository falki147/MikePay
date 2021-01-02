import "bootstrap";
import "./forms/login-form";
import "./forms/place-order-form";
import "./forms/create-user";
import "./forms/create-order";
import "./forms/enter-debts";
import "./forms/settle_debts";
import "./forms/contact-form";
import "./forms/edit_user";
import "./tables/debt_history";
import "./tables/load_settle_debts";
import "./tables/load_enter_debts";
import "./tables/debtor";
import "./tables/debtors";
import "./tables/order";
import "./tables/orders";

import Session from "./api/session";
import Api from "./api/api";
import Loader from "./components/loader";

async function sessionStart() {
  if (await Session.isLoggedIn()) {
    // Remove guest only elements
    for (const el of [...document.getElementsByClassName("guest-only")]) {
      el.remove();
    }

    // Display user only elements
    for (const el of [...document.getElementsByClassName("user-only")]) {
      el.classList.remove("user-only");
    }

    const profileNav = document.getElementById("navbar-dropdown-profile");
    if (profileNav) {
      const data = await Session.data();
      profileNav.innerText = `${data.firstname} ${data.lastname}`;
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
}

sessionStart();

window.onload = function(){
  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      try{
        Loader.begin(logoutButton);
        await Api.logout();
        window.location = "/start_page/";
      } catch(e) {
        console.log(e);
      }

      Loader.end();
    });
  }
}
