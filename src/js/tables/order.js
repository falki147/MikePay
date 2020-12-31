import Api from "../api/api";
import encode from "../utils/encode";
import Pagination from "../components/pagination";
import SortLinks from "../components/sort-links";
import Loader from "../components/loader";
import getShortDate from "../utils/dateShort";

const debtorTable = document.getElementById("order-table");
if (debtorTable) {
  const params = new URLSearchParams(location.search);
  const orderId = params.get('order_id');

  const pagination = new Pagination(document.getElementById("order-pagination"));
  const sortLinks = new SortLinks(debtorTable);

  async function loadInfo() {
    Loader.begin();
    const data = await Api.orderInfo(orderId);
    document.getElementById("order-title").innerText = "Bestellung - " + data.title;
    document.getElementById("order-description").innerText = data.description;
    Loader.end();
  }

  async function load() {
    Loader.begin();
    const body = debtorTable.getElementsByTagName("tbody")[0];
    const data = await Api.orderPositions(
      orderId, pagination.page, sortLinks.selected, sortLinks.ascending
    );

    let html = "";
    for (const item of data.items) {
      html += "<tr>";
      html += `  <td>${encode(item.item)}</td>`;
      html += `  <td>${encode(item.price)}</td>`;
      html += `  <td><a href="/debtor/?user_id=${item.user_id}">${encode(item.firstname)} ${encode(item.lastname)}</a></td>`;
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
  loadInfo();
}
