import Api from "../api/api";
import encode from "../utils/encode";
import Pagination from "../components/pagination";
import SortLinks from "../components/sort-links";

const debtorTable = document.getElementById("debtor-table");
if (debtorTable) {
  const pagination = new Pagination(document.getElementById("debtor-pagination"));
  const sortLinks = new SortLinks(debtorTable);

  async function load() {
    const params = new URLSearchParams(location.search);
    const userId = params.get('user_id');

    const body = debtorTable.getElementsByTagName("tbody")[0];
    const data = await Api.userTransactions(
      userId, pagination.page, sortLinks.selected, sortLinks.ascending
    );

    let html = "";
    for (const item of data.items) {
      html += "<tr>";
      html += `  <td>${encode(item.item)}</td>`;
      html += `  <td>${encode(item.amount)}</td>`;
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
}
