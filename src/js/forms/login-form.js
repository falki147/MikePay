import Api from "../api/api";
import Alert from "../components/alert";

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async ev => {
    ev.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      await Api.login(username, password);
      Alert.success("Login war erfolgreich!");
    }
    catch (e) {
      Alert.error(e.message);
    }
  });
}
