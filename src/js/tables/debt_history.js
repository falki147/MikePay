import Api from "../api/api";
import encode from "../utils/encode";
import Pagination from "../components/pagination";
import SortLinks from "../components/sort-links";
import getShortDate from "../utils/dateShort";
import Loader from "../components/loader";

//
const debt_history_table = document.getElementById("debt-history-table");

if(debt_history_table){
  const pagination = new Pagination(document.getElementById("debt-history-pagination"));
  const sortLinks = new SortLinks(debt_history_table);

  async function load() {
    const body = debt_history_table.getElementsByTagName("tbody")[0];

    Loader.begin(body);

    const data = await Api.transactions(pagination.page, sortLinks.selected, sortLinks.ascending);

    let html = "";
    
    if(data.items.length > 0){

      for (const item of data.items) {

        let orderTitle = "Keine Bestellung";
        if(item.order_id){
          orderTitle = `<a href="/order/?order_id=${item.order_id}">${encode(item.order_title)} (${encode(item.order_id)})</a>`; 
        }

        let itemTitle = item.item;
        if(!itemTitle){
          itemTitle = item.amount < 0 ? "Schulden" : "Rückzahlung";
        }

        html += "<tr>";
        html += `  <td><a href="/debtor/?user_id=${item.user_id}">${encode(item.firstname)} ${encode(item.lastname)}</a></td>`;
        html += `  <td>${orderTitle}</td>`;
        html += `  <td>${encode(itemTitle)}</td>`;
        html += `  <td>${encode(item.amount)}</td>`;
        html += `  <td>${encode(getShortDate(item.date))}</td>`;
        html += "</tr>";
      }
      pagination.pages = data.pages;
    } else {
      html += `<td colspan="5" align="center"> Keine Daten </td>`;
    }
    body.innerHTML = html;
    
    Loader.end();
  }
 
  pagination.onClick(() => {
    load();
  });

  sortLinks.onChange(() => {
    pagination.page = 1;
    load();
  });

  load();
}