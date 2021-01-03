import Api from "../api/api";
import DataTable from "../components/data-table";
import encode from "../utils/encode";
import Loader from "../components/loader";
import getShortDate from "../utils/dateShort";
import link from "../utils/link";

document.addEventListener("DOMContentLoaded", () => {
  const debtorTable = document.getElementById("debtor-table");
  if (debtorTable) {
    const params = new URLSearchParams(location.search);
    const userId = params.get('user_id');

    const pagination = document.getElementById("debtor-pagination");

    new DataTable(
      debtorTable, pagination,
      async (page, sort, asc) => await Api.userTransactions(userId, page, sort, asc),
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
          encode(itemTitle),
          orderTitle,
          encode(item.amount),
          encode(getShortDate(item.date))
        ];
      }
    );

    async function loadInfo() {
      Loader.begin();

      try {
        const data = await Api.userInfo(userId);
        document.getElementById("debtor-name").innerText = `Schuldner - ${data.firstname} ${data.lastname}`;
      }
      catch (e) {
        console.error(e);
      }

      Loader.end();
    }

    loadInfo();
  }
});
