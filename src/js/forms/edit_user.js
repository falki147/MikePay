import Api from "../api/api";
import Session from "../api/session";
import Alert from "../components/alert";
import Loader from "../components/loader";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("edit-user-form");
  if (form) {
    form.addEventListener("submit", onSubmit);
    document.getElementById("password_edit").addEventListener("input", onPasswordInput);

    /**
     * Handle submit event
     * @param {Event} e
     */
    function onSubmit(e) {
      e.preventDefault();

      const firstname = document.getElementById("firstname_edit").value;
      const lastname = document.getElementById("lastname_edit").value;
      const username = document.getElementById("username_edit").value;
      const password = document.getElementById("password_edit").value;
      const passwordConf = document.getElementById("password_edit_conf").value;

      if (password != passwordConf) {
        document.getElementById("password_edit_conf").setCustomValidity("do not match");
      } else {
        document.getElementById("password_edit_conf").setCustomValidity("");
      }

      if (form.checkValidity()) {
        if (password === "") {
          editUser({username: username, firstname: firstname, lastname: lastname});
        }
        else {
          editUser({
            username: username, firstname: firstname, lastname: lastname, password: password
          });
        }
      }

      form.classList.add("was-validated");
    }

    /**
     * Set password to required when user enters a new one
     */
    function onPasswordInput() {
      const password = document.getElementById("password_edit");
      const passwordConf = document.getElementById("password_edit_conf");

      if (password.value != "") {
        password.required = true;
        passwordConf.required = true;
      } else {
        password.required = false;
        passwordConf.required = false;
      }
    }

    /**
     * Edit user
     */
    async function editUser(data){
      try {
        Loader.begin(document.getElementById("edit-user-btn"));
        Api.editUser(await Session.id(), data);
        Alert.success("Ihr Konto wurde erfolgreich bearbeitet.");
      }
      catch(e) {
        console.error(e);
        Alert.error(e);
      }
      Loader.end();
    }

    /**
     * Load user data of current user and prefill fields with the data
     */
    async function loadUserInfo(){
      const firstname = document.getElementById("firstname_edit");
      const lastname = document.getElementById("lastname_edit");
      const username = document.getElementById("username_edit");
      const password = document.getElementById("password_edit");
    
      try {
        Loader.begin();
        const data = await Session.data();
        firstname.value = data.firstname;
        lastname.value = data.lastname;
        username.value = data.username;
        password.value = "";
      } catch(e){
        console.log(e);
        Alert.error(e);
      }

      Loader.end();
    }

    loadUserInfo();
  }
});
