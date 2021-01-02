import Api from "../api/api";
import Alert from "../components/alert";
import Loader from "../components/loader";

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async ev => {
    ev.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      Loader.begin(document.getElementById("login-btn"));
      await Api.login(username, password);
      Alert.success("Login war erfolgreich!");
    }
    catch (e) {
      Alert.error(e.message);
    }

    Loader.end();
  });
}
