import Api from "../api/api";
import Alert from "../components/alert";

window.addEventListener("load", function () {
  if(document.getElementById("settle-debts-form")){
    document.getElementById("settle-debts-form").addEventListener("submit", validateSettleDebtForm);
  }
});

function validateSettleDebtForm(e){
  
  const form = document.getElementById("settle-debts-form");
  let select = document.getElementById("settle_debts_select").value;
  let amount = document.getElementById("settle_debts_amount").value;
  let settle = document.getElementById("settle_debts_settle").value;

  if(!form.checkValidity()){
    e.preventDefault();
    e.stopPropagation();
  } else {
    //TODO : add data to be sent
    send_settle_debt();
  }

  form.classList.add('was-validated');
}

async function send_settle_debt(){
  try {
    //TODO : Api call
    Alert.success("Schulden wurden erfolgreich eingetragen");
  } catch(e) {
    Alert.error("Schulden konnten nicht eingetragen werden");
  }
}