import Api from "../api/api";
import Alert from "../components/alert";
import Loader from "../components/loader";

/**
 * Add all event listeners to contact form
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (form) {
    let isSubmitting = false;

    form.addEventListener("submit", onSubmit);

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

      const firstname = document.getElementById("firstname_contact_form").value;
      const lastname = document.getElementById("lastname_contact_form").value;
      const email = document.getElementById("email_contact_form").value;
      const description = document.getElementById("description_contact_form").value;
      
      if (form.checkValidity()) {
        sendContact(email, `${firstname} ${lastname}`, description);
      }

      form.classList.add("was-validated");
    }

    /**
     * Send data to server
     */
    async function sendContact(email, name, message) {
      try {
        isSubmitting = true;
        Loader.begin(document.getElementById("contact-btn"));
        await Api.contact(email, name, message);
        Alert.success("Ihr Anliegen wurde weitergeleitet.");
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
