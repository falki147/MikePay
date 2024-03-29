import "bootstrap";
import "./forms/login-form";
import "./forms/place-order-form";
import "./forms/create-user";
import "./forms/create-order";
import "./forms/enter-debts";
import "./forms/settle_debts";
import "./forms/contact-form";
import "./forms/edit_user";
import "./forms/edit-order-position";
import "./tables/debt_history";
import "./tables/debtor";
import "./tables/debtors";
import "./tables/order";
import "./tables/orders";
import "./components/session";
import "./components/header";
import "./components/startpage";
import "./components/tooltip";
import config from "./config";

if (typeof config.onLoad === 'function') {
  config.onLoad();
}
