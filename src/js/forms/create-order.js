import Api from "../api/api";
import Alert from "../components/alert";
import Loader from "../components/loader";

/**
 * Add all event listeners to create order form
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createOrder-form");
  if (form) {
    form.addEventListener("submit", onSubmit);

    let isSubmitting = false;

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

      const titel = document.getElementById("titel").value;
      const url = document.getElementById("url").value;
      const description = document.getElementById("description").value;
      
      if (form.checkValidity()) {
        createOrder({
          title: titel, description: description, url: url, comments: ""
        });
      }

      form.classList.add("was-validated");
    }

    /**
     * Create new order
     */
    async function createOrder(data){
      try {
        isSubmitting = true;
        Loader.begin(document.getElementById("create-order-btn"));
        const orderId = await Api.createOrder(data);
        Alert.success("Bestellung wurde erfolgreich erstellt.");

        // Redirect to new order
        window.location = `order/?order_id=${orderId}`;
      }
      catch (e) {
        console.error(e);
        Alert.error(e.message);
      }
    
      Loader.end();
      isSubmitting = false;
    }
  }
});
