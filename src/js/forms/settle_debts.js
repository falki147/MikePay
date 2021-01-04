import Api from "../api/api";
import Alert from "../components/alert";
import Loader from "../components/loader";

/**
 * Add all event listeners to settle debts form
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("settle-debts-form");
  if (form) {
    form.addEventListener("submit", onSubmit);

    /**
     * Handle submit event
     * @param {Event} e
     */
    function onSubmit(e) {
      e.preventDefault();

      const userId = document.getElementById("settle_debts_select").value;
      const amount = document.getElementById("settle_debts_settle").amount;
    
      if (form.checkValidity()) {
        addPaymentEntry({ userid: userId, amount: amount });
      }

      form.classList.add("was-validated");
    }

    /**
     * Add a new payment entry
     */
    async function addPaymentEntry(data){
      try {
        Loader.begin(document.getElementById("settle-debts-btn"));
        Api.pay(data);
        Alert.success("Schulden wurden erfolgreich beglichen.");
      }
      catch (e) {
        console.error(e);
        Alert.error(e.message);
      }
    
      Loader.end();
    }
  }
});
