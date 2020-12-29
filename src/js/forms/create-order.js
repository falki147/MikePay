import Api from "../api/api";
import Alert from "../components/alert";

window.addEventListener("load", function () {
  if(document.getElementById("createOrder-form")){
    document.getElementById("createOrder-form").addEventListener("submit", validateCreateOrderForm);
  }
});

function validateCreateOrderForm(e){

  const form = document.getElementById("createOrder-form");
  let titel = document.getElementById("titel").value;
  let url = document.getElementById("url").value;
  let description = document.getElementById("description").value;
  
  if(!form.checkValidity()){
    e.preventDefault();
    e.stopPropagation();
  } else {
    send_created_order({title: titel, description: description, url: url});
  }

  form.classList.add('was-validated');
}

async function send_created_order(data){
  try{
    await Api.createOrder(data);
    //Alert.success("Daten wurden erfolgreich übermittelt.");
  } catch(e){
    //Alert.error(e.message);
  }
}