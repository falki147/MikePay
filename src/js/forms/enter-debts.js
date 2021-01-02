import Api from "../api/api";
import Session from "../api/session";
import Alert from "../components/alert";

window.addEventListener("load", function () {
  if(document.getElementById("enter-debts-form")){
    document.getElementById("checkUserSelection").addEventListener("change", changeSelection);
    document.getElementById("checkGuestSelection").addEventListener("change", changeSelection);
    document.getElementById("enter-debts-form").addEventListener("submit", validateEnterDebtForm);
  }
});

function changeSelection(){
  const rad_user = document.getElementById("checkUserSelection");
  const rad_guest = document.getElementById("checkGuestSelection");
  
  let firstname =  document.getElementById("firstname_enter_debts");
  let lastname = document.getElementById("lastname_enter_debts");
  let select = document.getElementById("enter_debts_user_select");

  if(rad_user.checked){
    
    firstname.disabled = true;
    lastname.disabled = true;
    select.disabled = false;
    firstname.required = false;
    lastname.required = false;
    select.required = true;

  } else if(rad_guest.checked) {
    
    firstname.disabled = false;
    lastname.disabled = false;
    select.disabled = true;
    firstname.required = true;
    lastname.required = true;
    select.required = false;
  
  }
}

async function validateEnterDebtForm(e){
  
  const form = document.getElementById("enter-debts-form");
  let select = document.getElementById("enter_debts_user_select").value;
  let firstname = document.getElementById("firstname_enter_debts").value;
  let lastname = document.getElementById("lastname_enter_debts").value;
  let amount = document.getElementById("amount_enter_debts").value;

  if(!form.checkValidity()){
    e.preventDefault();
    e.stopPropagation();
  } else {
    send_entry_debt({amount: amount, userid: await Session.id(), firstname: firstname, lastname: lastname});
  }

  form.classList.add('was-validated');
}

async function send_entry_debt(){
  try {
    Api.addDebt(data);
    Alert.success("Schulden wurden erfolgreich eingetragen");
  } catch(e) {
    Alert.error("Schulden konnten nicht eingetragen werden");
  }
}