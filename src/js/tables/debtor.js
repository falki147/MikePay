import Api from "../api/api";
import encode from "../utils/encode";
import Pagination from "../components/pagination";
import SortLinks from "../components/sort-links";
import Loader from "../components/loader";
import getShortDate from "../utils/dateShort";

const debtorTable = document.getElementById("debtor-table");
if (debtorTable) {
  const params = new URLSearchParams(location.search);
  const userId = params.get('user_id');

  const pagination = new Pagination(document.getElementById("debtor-pagination"));
  const sortLinks = new SortLinks(debtorTable);

  async function loadInfo() {
    Loader.begin();
    const data = await Api.userInfo(userId);
    document.getElementById("debtor-name").innerText = `Schuldner - ${data.firstname} ${data.lastname}`;
    Loader.end();
  }

  async function load() {
    const body = debtorTable.getElementsByTagName("tbody")[0];

    Loader.begin(body);

    const data = await Api.userTransactions(
      userId, pagination.page, sortLinks.selected, sortLinks.ascending
    );

    let html = "";

    if(data.items.length > 0) {

    for (const item of data.items) {
      let orderTitle = "Keine Bestellung";
      if (item.order_id) {
        orderTitle = `<a href="/order/?order_id=${item.order_id}">${encode(item.order_title)} (${encode(item.order_id)})</a>`;
      }

      let itemTitle = item.item;
      if (!itemTitle) {
        itemTitle = item.amount < 0 ? "Schulden" : "Rückzahlung";
      }

      html += "<tr>";
      html += `  <td>${encode(itemTitle)}</td>`;
      html += `  <td>${orderTitle}</td>`;
      html += `  <td>${encode(item.amount)}</td>`;
      html += `  <td>${encode(getShortDate(item.date))}</td>`;
      html += "</tr>";
    }

    } else {
      html += `<td colspan="4" align="center"> Keine Daten </td>`;
    }

    body.innerHTML = html;
    pagination.pages = data.pages;

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
  loadInfo();
}
