import Api from "../api/api";
import encode from "../utils/encode";
import Pagination from "../components/pagination";
import SortLinks from "../components/sort-links";
import Loader from "../components/loader";
import DataTable from "../components/data-table";
import link from "../utils/link";

const debtorTable = document.getElementById("debtors-table");
if (debtorTable) {
  let queryString = "";

  const pagination = document.getElementById("debtors-pagination");

  const dataTable = new DataTable(
    debtorTable, pagination,
    async (page, sort, asc) => await Api.debts(page, sort, asc, queryString),
    item => [
      link(`/debtor/?user_id=${item.id}`, `${item.firstname} ${item.lastname}`),
      encode(item.debt),
      encode(item.paid),
      encode(item.total)
    ]
  );

  const searchForm = document.getElementById("search-form");
  searchForm.addEventListener("submit", ev => {
    ev.preventDefault();

    const searchInputField = document.getElementById("debtors-search");
    if (searchInputField.value !== queryString) {
      queryString = searchInputField.value;
      dataTable.resetPage();
    }
  });
}
