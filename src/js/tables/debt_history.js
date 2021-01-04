import Api from "../api/api";
import encode from "../utils/encode";
import getShortDate from "../utils/dateShort";
import DataTable from "../components/data-table";
import link from "../utils/link";

document.addEventListener("DOMContentLoaded", () => {
  const debtHistoryTable = document.getElementById("debt-history-table");
  if (debtHistoryTable) {
    const pagination = document.getElementById("debt-history-pagination");

    new DataTable(
      debtHistoryTable, pagination,
      async (page, sort, asc) => await Api.transactions(page, sort, asc),
      item => {
        let orderTitle = "Keine Bestellung";
        if(item.order_id) {
          orderTitle = link(`/order/?order_id=${item.order_id}`, `${item.order_title} (${item.order_id})`);
        }

        let itemTitle = item.item;
        if(!itemTitle){
          itemTitle = item.amount.startsWith("-") ? "Schulden" : "Rückzahlung";
        }

        return [
          link(`/debtor/?user_id=${item.user_id}`, `${item.firstname} ${item.lastname}`),
          orderTitle,
          encode(itemTitle),
          encode(item.amount),
          encode(getShortDate(item.date))
        ];
      }
    );
  }
});
