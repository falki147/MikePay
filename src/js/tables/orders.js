import Api from "../api/api";
import encode from "../utils/encode";
import Pagination from "../components/pagination";
import SortLinks from "../components/sort-links";
import Loader from "../components/loader";
import getShortDate from "../utils/dateShort";

const debtorTable = document.getElementById("orders-table");
if (debtorTable) {
  const pagination = new Pagination(document.getElementById("orders-pagination"));
  const sortLinks = new SortLinks(debtorTable);

  async function load() {
    const body = debtorTable.getElementsByTagName("tbody")[0];

    Loader.begin(body);

    const data = await Api.orders(pagination.page, sortLinks.selected, sortLinks.ascending);

    let html = "";
    for (const item of data.items) {
      html += "<tr>";
      html += `  <td><a href="/order/?order_id=${item.id}">${encode(item.title)}</a></td>`;
      html += `  <td>${encode(item.total)}</td>`;
      html += `  <td>${encode(getShortDate(item.date))}</td>`;
      html += "</tr>";
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
}
