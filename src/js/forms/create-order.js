import Api from "../api/api";

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
  
  let flag = 1;

  let reg_titel = /\w+/;
  let reg_url = /\w+/;
  let reg_desc = /\w*/;

  if(!reg_titel.test(titel)){
    document.getElementById("titel-val").innerText = "Bitte geben Sie einen Titel an!";
    flag = 0;
  }

  if(!reg_url.test(url)){
    document.getElementById("url-val").innerText = "Bitte geben Sie einen URL an!";
    flag = 0;
  }

  if(!reg_desc.test(description)){
    document.getElementById("description-val").innerText = "Bitte geben Sie eine Beschreibung an!";
    flag = 0;
  }

  if(!flag || !form.checkValidity()){
    e.preventDefault();
    e.stopPropagation();
  }

  form.classList.add('was-validated');
}