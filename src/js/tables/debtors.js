import Api from "../api/api";
import encode from "../utils/encode";
import Pagination from "../components/pagination";
import SortLinks from "../components/sort-links";

const debtorTable = document.getElementById("debtor-table");
if (debtorTable) {
  const pagination = new Pagination(document.getElementById("debtor-pagination"));
  const sortLinks = new SortLinks(debtorTable);

  async function load() {
    const body = debtorTable.getElementsByTagName("tbody")[0];
    const data = await Api.debts(pagination.page, sortLinks.selected, sortLinks.ascending);

    let html = "";
    for (const item of data.items) {
      html += "<tr>";
      html += `  <td>${encode(item.firstname)} ${encode(item.lastname)}</td>`;
      html += `  <td>${encode(item.debt)}</td>`;
      html += `  <td>${encode(item.paid)}</td>`;
      html += `  <td>${encode(item.total)}</td>`;
      html += "  <td><a href=\"#\">Details</a></td>";
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
