import Api from "../api/api";
import encode from "../utils/encode";
import DataTable from "../components/data-table";
import link from "../utils/link";

document.addEventListener("DOMContentLoaded", () => {
  const debtorTable = document.getElementById("debtors-table");
  if (debtorTable) {
    const params = new URLSearchParams(location.search);
    let queryString = params.get("query") || "";

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

    const searchInputField = document.getElementById("debtors-search");
    searchInputField.value = queryString;

    const searchForm = document.getElementById("search-form");
    searchForm.addEventListener("submit", ev => {
      ev.preventDefault();

      if (searchInputField.value !== queryString) {
        queryString = searchInputField.value;
        dataTable.resetPage();

        const url = new URL(window.location);

        if (queryString) {
          url.searchParams.set("query", queryString);
        }
        else {
          url.searchParams.delete("query");
        }

        window.history.replaceState({}, "", url);
      }
    });
  }
});
