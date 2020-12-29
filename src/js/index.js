import "bootstrap";
import "./forms/login-form";
import "./forms/place-order-form";
import "./forms/create-user";
import "./forms/create-order";
import "./forms/enter-debts";
import "./forms/settle_debts";
import "./forms/contact-form";
import "./tables/load_settle_debts";
import "./tables/load_enter_debts";
import "./tables/debtor";
import "./tables/debtors";
import "./tables/order";
import "./tables/orders";

import Session from "./api/session";

if (Session.isLoggedIn()) {
  // Remove guest only elements
  for (const el of document.getElementsByClassName("guest-only")) {
    el.remove();
  }
}
