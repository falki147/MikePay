import Api from "../api/api";
import Alert from "../components/alert";

window.addEventListener("load", function () {
  if(document.getElementById("contact-form")){
    document.getElementById("contact-form").addEventListener("submit", validateContactForm);
  }
});

function validateContactForm(e){
  e.preventDefault();
  
  const form = document.getElementById("contact-form");
  
  let firstname = document.getElementById("firstname_contact_form").value;
  let lastname = document.getElementById("lastname_contact_form").value;
  let email = document.getElementById("email_contact_form").value;
  let description = document.getElementById("description_contact_form").value;
  
  if(form.checkValidity()){
    send_contact(email, firstname + " " + lastname, description);
  }

  form.classList.add('was-validated');
}

async function send_contact(email, name, message){
  try{
    await Api.contact(email, name, message);
    Alert.success("Ihr Anliegen wurde weitergeleitet.");
  } catch(e){
    Alert.error(e.message);
  }
}