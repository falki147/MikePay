import Api from "../api/api";
import encode from "../utils/encode";
import Pagination from "../components/pagination";
import SortLinks from "../components/sort-links";

const debtorTable = document.getElementById("order-table");
if (debtorTable) {
  const params = new URLSearchParams(location.search);
  const orderId = params.get('order_id');

  const pagination = new Pagination(document.getElementById("order-pagination"));
  const sortLinks = new SortLinks(debtorTable);

  async function loadInfo() {
    const data = await Api.orderInfo(orderId);
    document.getElementById("order-title").innerText = data.title;
    document.getElementById("order-description").innerText = data.description;
  }

  async function load() {
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
      html += `  <td>${encode(item.date)}</td>`;
      html += "</tr>";
    }

    body.innerHTML = html;
    pagination.pages = data.pages;
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
