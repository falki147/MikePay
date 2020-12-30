import Api from "../api/api";
import Session from "../api/session";
import Alert from "../components/alert";

window.addEventListener("load", function () {
  if(document.getElementById("edit-user-form")){
    load_user_info();
    document.getElementById("edit-user-form").addEventListener("submit", validate_edit_user_form);
  }
});

async function load_user_info(){
 
  let firstname = document.getElementById("firstname_edit");
  let lastname = document.getElementById("lastname_edit");
  let username = document.getElementById("username_edit");
  let password = document.getElementById("password_edit");

  try{
    const data = await Api.userInfo(await Session.id());
    //const data = await Api.userInfo(1);
    console.log(data);
    firstname.value = data.firstname;
    lastname.value = data.lastname;
    username.value = data.username;
    password.value = data.password;
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
  
  if(form.checkValidity()){
    //TODO adapt data format
    send_edited_data({username: username, firstname: firstname, lastname: lastname, password: password});
  }

  form.classList.add('was-validated');
}

async function send_edited_data(data){
  try {
    //TODO Api call
    Alert.success("yay");
  } catch(e) {
    Alert.error(e);
  }
}