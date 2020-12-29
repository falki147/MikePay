import Api from "../api/api";
import Alert from "../components/alert";

window.addEventListener("load", function () {
  if(document.getElementById("createUser-form")){
    document.getElementById("createUser-form").addEventListener("submit", validateCreateUserForm);
  }
});

function validateCreateUserForm(e){
  
  const form = document.getElementById("createUser-form");
  let firstname = document.getElementById("firstname").value;
  let lastname = document.getElementById("lastname").value;
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  
  if(!form.checkValidity()){
    e.preventDefault();
    e.stopPropagation();
  } else {
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