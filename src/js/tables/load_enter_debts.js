import Api from "../api/api";
import encode from "../utils/encode";

window.addEventListener("load", function () {
  load_entries_enter_debts();
});

async function load_entries_enter_debts() {
  
  const selector = document.getElementById("enter_debts_user_select");
  if(selector){
    const data = await Api.allDebts(null, true);
    
    let debts_arr = [];
    let options = "";
    for (const item of data) {
      debts_arr.push(item.debt);
      options += `  <option>${encode(item.firstname)} ${encode(item.lastname)}</option>`;
    }
    selector.innerHTML = options;
  }
}