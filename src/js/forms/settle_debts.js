import Api from "../api/api";
import Alert from "../components/alert";
import Loader from "../components/loader";

/**
 * Add all event listeners to settle debts form
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("settle-debts-form");
  if (form) {
    let isSubmitting = false;
    const userDebt = {};

    form.addEventListener("submit", onSubmit);
    document.getElementById("settle_debts_select")
      .addEventListener("change", onChangeAmount);

    /**
     * Handle submit event
     * @param {Event} e
     */
    function onSubmit(e) {
      e.preventDefault();

      if (isSubmitting) {
        // Prevent double submit
        return;
      }

      const userId = document.getElementById("settle_debts_select").value;
      const amount = document.getElementById("settle_debts_settle").value;
    
      if (form.checkValidity()) {
        addPaymentEntry({ userid: userId, amount: amount });
      }

      form.classList.add("was-validated");
    }

    /**
     * Add a new payment entry
     */
    async function addPaymentEntry(data) {
      try {
        isSubmitting = true;
        Loader.begin(document.getElementById("settle-debts-btn"));
        await Api.pay(data);
        Alert.success("Schulden wurden erfolgreich beglichen.");
      }
      catch (e) {
        console.error(e);
        Alert.error(e.message);
      }
    
      Loader.end();
      isSubmitting = false;
    }

    /**
     * Update amount when user is changed
     */
    function onChangeAmount() {
      const userId = document.getElementById("settle_debts_select").value;
      document.getElementById("settle_debts_amount").value = userDebt[userId] || "";
    }

    /**
     * Load users for select element
     */
    async function initializeUsers() {
      try {
        Loader.begin();
        const data = await Api.allDebts("name", true);

        const selector = document.getElementById("settle_debts_select");
        for (const user of data) {
          selector.options.add(new Option(`${user.firstname} ${user.lastname}`, user.id));

          // Negate total (amount of which the user already paid subtracted by debts)
          let total = user.total;
          if (total.startsWith("-")) {
            total = total.substring(1);
          }
          else {
            total = "-" + total;
          }

          userDebt[user.id] = total;
        }
      }
      catch (e) {
        console.error(e);
        Alert.error(e.message);
      }

      Loader.end();
    }

    initializeUsers();
  }
});
