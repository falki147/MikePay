import Api from "../api/api";
import encode from "../utils/encode";
import Pagination from "../components/pagination";
import SortLinks from "../components/sort-links";
import Loader from "../components/loader";

const debtorTable = document.getElementById("debtors-table");
if (debtorTable) {
  const pagination = new Pagination(document.getElementById("debtors-pagination"));
  const sortLinks = new SortLinks(debtorTable);

  let queryString = "";

  async function load() {
    const body = debtorTable.getElementsByTagName("tbody")[0];

    Loader.begin(body);

    const data = await Api.debts(
      pagination.page, sortLinks.selected, sortLinks.ascending, queryString
    );

    let html = "";

    if(data.items.length > 0){

      for (const item of data.items) {
        html += "<tr>";
        html += `  <td><a href="/debtor/?user_id=${item.id}">${encode(item.firstname)} ${encode(item.lastname)}</a></td>`;
        html += `  <td>${encode(item.debt)}</td>`;
        html += `  <td>${encode(item.paid)}</td>`;
        html += `  <td>${encode(item.total)}</td>`;
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

  const searchForm = document.getElementById("search-form");
  searchForm.addEventListener("submit", ev => {
    ev.preventDefault();

    const searchInputField = document.getElementById("debtors-search");
    if (searchInputField.value !== queryString) {
      queryString = searchInputField.value;
      pagination.page = 1;
      load();
    }
  });

  load();
}
