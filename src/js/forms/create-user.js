import Api from "../api/api";
import Alert from "../components/alert";

window.addEventListener("load", function () {
  if(document.getElementById("createUser-form")){
    document.getElementById("createUser-form").addEventListener("submit", validateCreateUserForm);
  }
});

function validateCreateUserForm(e){
  e.preventDefault();
  
  const form = document.getElementById("createUser-form");
  let firstname = document.getElementById("firstname").value;
  let lastname = document.getElementById("lastname").value;
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let password_conf = document.getElementById("password_conf").value;

  if(password != password_conf){
    document.getElementById("password_conf").setCustomValidity("do not match");
  } else {
    document.getElementById("password_conf").setCustomValidity("");
  }

  if((password == password_conf) && form.checkValidity()){
    send_crated_user({username: username, firstname: firstname, lastname: lastname, password: password});
  }

  form.classList.add('was-validated');
}

async function send_crated_user(data){
  try{
    await Api.createUser(data);
    Alert.success("Benutzer wurde erfolgreich erstellt!");
  } catch(e){
    Alert.error("Fehler beim Erstellen des Benutzers!");
  }
}