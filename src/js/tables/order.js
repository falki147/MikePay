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

    if (data.url) {
      const orderLink = document.getElementById("order-link");
      orderLink.innerText = data.url;
      orderLink.href = data.url;
    }

    // TODO: Add prefix
    const url = `/place_order/?order_id=${orderId}`;
    const shareLink = document.getElementById("order-share-link");
    shareLink.href = url;

    Loader.end();
  }

  async function load() {
    const body = debtorTable.getElementsByTagName("tbody")[0];

    Loader.begin(body);

    const data = await Api.orderPositions(
      orderId, pagination.page, sortLinks.selected, sortLinks.ascending
    );

    let html = "";

    if (data.items.length !== 0) {
      for (const item of data.items) {
        html += "<tr>";
        html += `  <td>${encode(item.item)}</td>`;
        html += `  <td>${encode(item.price)}</td>`;
        html += `  <td><a href="/debtor/?user_id=${item.user_id}">${encode(item.firstname)} ${encode(item.lastname)}</a></td>`;
        html += `  <td>${encode(getShortDate(item.date))}</td>`;
        html += "</tr>";
      }
    }
    else {
      html = "<tr><td class=\"text-center\" colspan=\"4\">Keine Daten</td></tr>";
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
