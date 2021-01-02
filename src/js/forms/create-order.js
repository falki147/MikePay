import Api from "../api/api";
import Alert from "../components/alert";

window.addEventListener("load", function () {
  if(document.getElementById("createOrder-form")){
    document.getElementById("createOrder-form").addEventListener("submit", validateCreateOrderForm);
  }
});

function validateCreateOrderForm(e){
  e.preventDefault();

  const form = document.getElementById("createOrder-form");
  let titel = document.getElementById("titel").value;
  let url = document.getElementById("url").value;
  let description = document.getElementById("description").value;
  
  if(form.checkValidity()){
    send_created_order({title: titel, description: description, url: url, comments: ""});
  }

  form.classList.add('was-validated');
}

async function send_created_order(data){
  try{
    await Api.createOrder(data);
    Alert.success("Bestellung wurde erfolgreich erstellt.");
  } catch(e){
    Alert.error(e.message);
  }
}