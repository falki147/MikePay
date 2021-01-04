import Api from "../api/api";
import Alert from "../components/alert";
import Loader from "../components/loader";

/**
 * Add all event listeners to login form
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  if (form) {
    form.addEventListener("submit", async ev => {
      ev.preventDefault();
      form.classList.add("was-validated");

      if (!form.checkValidity()) {
        return;
      }

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        Loader.begin(document.getElementById("login-btn"));
        await Api.login(username, password);
        Alert.success("Login war erfolgreich.");
        window.location = "/";
      }
      catch (e) {
        console.error(e);
        Alert.error(e.message);
      }

      Loader.end();
    });
  }
});
