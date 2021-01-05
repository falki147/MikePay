import Api from "../api/api";
import Alert from "../components/alert";
import Loader from "../components/loader";

/**
 * Add all event listeners to create user form
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createUser-form");
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

      const passwordConfInput = document.getElementById("password_conf");

      const firstname = document.getElementById("firstname").value;
      const lastname = document.getElementById("lastname").value;
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const passwordConf = passwordConfInput.value;

      if (password != passwordConf) {
        passwordConfInput.setCustomValidity("do not match");
      }
      else {
        passwordConfInput.setCustomValidity("");
      }

      if (form.checkValidity()) {
        createUser({
          username: username, firstname: firstname, lastname: lastname, password: password
        });
      }

      form.classList.add("was-validated");
    }

    /**
     * Create new user
     */
    async function createUser(data){
      try {
        isSubmitting = true;
        Loader.begin(document.getElementById("create-user-btn"));
        await Api.createUser(data);
        Alert.success("Benutzer wurde erfolgreich erstellt.");
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
