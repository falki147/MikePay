import Api from "../api/api";
import Session from "../api/session";
import Alert from "../components/alert";

window.addEventListener("load", function () {
  if(document.getElementById("settle-debts-form")){
    document.getElementById("settle-debts-form").addEventListener("submit", validateSettleDebtForm);
  }
});

function validateSettleDebtForm(e){
  e.preventDefault();

  const form = document.getElementById("settle-debts-form");
  let select = document.getElementById("settle_debts_select").value;
  let amount = document.getElementById("settle_debts_amount").value;
  let settle = document.getElementById("settle_debts_settle").value;

  if(!form.checkValidity()){
    e.preventDefault();
    e.stopPropagation();
  } else {
    send_settle_debt({userid: get_userid(), amount: settle});
  }

  form.classList.add('was-validated');
}

async function send_settle_debt(data){
  try {
    Api.pay(data);
    Alert.success("Schulden wurden erfolgreich begliechen");
  } catch(e) {
    Alert.error("Schulden konnten nicht begliechen werden");
  }
}

async function get_userid(){
  const currentItem = document.getElementById("settle_debts_select").value;
  const data = await Api.allDebts(null, true);

  for (const item of data) {
    if((item.firstname + " " + item.lastname) == currentItem){
      return item.id;
    }
  }
}