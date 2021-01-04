import Api from "../api/api";
import Alert from "../components/alert";
import Loader from "../components/loader";

/**
 * Add all event listeners to enter debts form
 */
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("enter-debts-form");
  if (form) {
    form.addEventListener("submit", onSubmit);
    document.getElementById("checkUserSelection").addEventListener("change", changeSelection);
    document.getElementById("checkGuestSelection").addEventListener("change", changeSelection);

    /**
     * Handle submit event
     * @param {Event} ev
     */
    function onSubmit(e) {
      e.preventDefault();

      const firstname = document.getElementById("firstname_enter_debts").value;
      const lastname = document.getElementById("lastname_enter_debts").value;
      const amount = document.getElementById("amount_enter_debts").value;
      const user = document.getElementById("checkUserSelection");

      if (form.checkValidity()) {
        if (user.checked) {
          const id = document.getElementById("enter_debts_user_select").value;
          enterDebt({ amount: amount, userid: id });
        } else {
          enterDebt({ amount: amount, firstname: firstname, lastname: lastname });
        }
      }

      form.classList.add("was-validated");
    }

    /**
     * Handle change of user type. Depending on the type certain fields are disabled/required.
     */
    function changeSelection() {
      const user = document.getElementById("checkUserSelection");
      const guest = document.getElementById("checkGuestSelection");
      
      const firstname =  document.getElementById("firstname_enter_debts");
      const lastname = document.getElementById("lastname_enter_debts");
      const select = document.getElementById("enter_debts_user_select");
    
      if (user.checked) {
        firstname.disabled = true;
        lastname.disabled = true;
        select.disabled = false;
        firstname.required = false;
        lastname.required = false;
        select.required = true;
      }
      else if (guest.checked) {
        firstname.disabled = false;
        lastname.disabled = false;
        select.disabled = true;
        firstname.required = true;
        lastname.required = true;
        select.required = false;
      }
    }

    /**
     * Add a new debt entry
     */
    async function enterDebt(data){
      try {
        Loader.begin(document.getElementById("enter-debts-btn"));
        Api.addDebt(data);
        Alert.success("Schulden wurden erfolgreich eingetragen.");
      }
      catch (e) {
        console.error(e);
        Alert.error(e.message);
      }
      Loader.end();
    }
  }
});
