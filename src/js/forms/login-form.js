import Api from "../api/api";

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async ev => {
    ev.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      await Api.login(username, password);
    }
    catch (e) {
      console.log(e);
    }
  });
}
