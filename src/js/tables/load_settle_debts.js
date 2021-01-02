import Api from "../api/api";
import encode from "../utils/encode";

window.addEventListener("load", function () {
  load_entries();
  if(document.getElementById("settle_debts_select")){
    document.getElementById("settle_debts_select").addEventListener("change", changeAmount);
  }
});

async function load_entries() {
  const selector = document.getElementById("settle_debts_select");
  let amount = document.getElementById("settle_debts_amount");
  if(selector && amount){
    const data = await Api.allDebts("name", true);
    
    let debts_arr = [];
    let options = "";
    for (const item of data) {
      debts_arr.push(item.debt);
      options += `  <option value="${item.id}">${encode(item.firstname)} ${encode(item.lastname)}</option>`;
    }
  
    amount.value = debts_arr[0];
    selector.innerHTML = options;
  }
}

async function change_Amount(){
  
  const currentItem = document.getElementById("settle_debts_select").value;
  const data = await Api.allDebts("name", true);

  for (const item of data) {
    if(item.id == currentItem){
      document.getElementById("settle_debts_amount").value = item.debt;
    }
  }
}

function changeAmount(){
  change_Amount();
}