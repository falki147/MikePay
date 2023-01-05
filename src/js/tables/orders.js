import Api from "../api/api";
import DataTable from "../components/data-table";
import encode from "../utils/encode";
import link from "../utils/link";
import getShortDate from "../utils/dateShort";

document.addEventListener("DOMContentLoaded", () => {
  const debtorTable = document.getElementById("orders-table");
  if (debtorTable) {
    const pagination = document.getElementById("orders-pagination");

    new DataTable(
      debtorTable, pagination,
      async (page, sort, asc) => await Api.orders(page, sort, asc),
      item => [
        link("order/?order_id=" + item.id, item.title),
        encode(item.total),
        encode(getShortDate(item.date))
      ]
    );
  }
});
