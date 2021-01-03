import Api from "../api/api";
import Session from "../api/session";
import Alert from "../components/alert";
import Loader from "../components/loader";

window.addEventListener("load", function () {
  if(document.getElementById("settle-debts-form")){
    document.getElementById("settle-debts-form").addEventListener("submit", validateSettleDebtForm);
  }
});

function validateSettleDebtForm(e){
  e.preventDefault();

  const form = document.getElementById("settle-debts-form");
  let settle = document.getElementById("settle_debts_settle").value;

  if(!form.checkValidity()){
    e.preventDefault();
    e.stopPropagation();
  } else {
    const userId = document.getElementById("settle_debts_select").value;
    send_settle_debt({userid: userId, amount: settle});
  }
  form.classList.add('was-validated');
}

async function send_settle_debt(data){
  try {
    Loader.begin(document.getElementById("settle-debts-btn"));
    Api.pay(data);
    Alert.success("Schulden wurden erfolgreich begliechen");
  } catch(e) {
    Alert.error("Schulden konnten nicht begliechen werden");
  }

  Loader.end();
}
