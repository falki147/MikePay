import Api from "../api/api";
import Session from "../api/session";
import Alert from "../components/alert";
import Loader from "../components/loader";

window.addEventListener("load", function () {
  if(document.getElementById("edit-user-form")){
    load_user_info();
    document.getElementById("edit-user-form").addEventListener("submit", validate_edit_user_form);
    document.getElementById("password_edit").addEventListener("input", password_change_state);
  }
});

function password_change_state(){
  let password = document.getElementById("password_edit");
  let password_conf = document.getElementById("password_edit_conf");

  if(password.value != "" || password_conf.value != ""){
    password.required = true;
    password_conf.required = true;
  } else {
    password.required = false;
    password_conf.required = false;
  }
}

async function load_user_info(){
 
  let firstname = document.getElementById("firstname_edit");
  let lastname = document.getElementById("lastname_edit");
  let username = document.getElementById("username_edit");
  let password = document.getElementById("password_edit");

  try{
    const data = await Session.data();
    firstname.value = data.firstname;
    lastname.value = data.lastname;
    username.value = data.username;
    password.value = "";
  } catch(e){
    Alert.error(e);
  }
}

function validate_edit_user_form(e){
  e.preventDefault();

  const form = document.getElementById("edit-user-form");
  let firstname = document.getElementById("firstname_edit").value;
  let lastname = document.getElementById("lastname_edit").value;
  let username = document.getElementById("username_edit").value;
  let password = document.getElementById("password_edit").value;
  let password_conf = document.getElementById("password_edit_conf").value;

  if(password != password_conf){
    document.getElementById("password_edit_conf").setCustomValidity("do not match");
  } else {
    document.getElementById("password_edit_conf").setCustomValidity("");
  }

  if((password == password_conf) && form.checkValidity()){
    if(password == ""){
      send_edited_data({username: username, firstname: firstname, lastname: lastname});
    } else {
      send_edited_data({username: username, firstname: firstname, lastname: lastname, password: password});
    }
  }

  form.classList.add('was-validated');
}

async function send_edited_data(data){
  try {
    Loader.begin(document.getElementById("edit-user-btn"));
    const id = await Session.id();
    Api.editUser(id, data);
    Alert.success("Ihr Konto wurde erfolgreich bearbeitet");
  } catch(e) {
    Alert.error(e);
  }
  Loader.end();
}