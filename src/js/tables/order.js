import Api from "../api/api";
import Loader from "../components/loader";
import DataTable from "../components/data-table";
import encode from "../utils/encode";
import link from "../utils/link";
import getShortDate from "../utils/dateShort";

document.addEventListener("DOMContentLoaded", () => {
  const orderTable = document.getElementById("order-table");
  if (orderTable) {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("order_id");

    const pagination = document.getElementById("order-pagination");

    new DataTable(
      orderTable, pagination,
      async (page, sort, asc) => await Api.orderPositions(orderId, page, sort, asc),
      item => [
        encode(item.item),
        encode(item.price),
        link(`/debtor/?user_id=${item.user_id}`, `${item.firstname} ${item.lastname}`),
        encode(getShortDate(item.date))
      ]
    );

    async function loadInfo() {
      Loader.begin();

      try {
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

        const orderLock = document.getElementById("order-lock");
        orderLock.checked = data.status === "locked";

        orderLock.addEventListener("change", async () => {
          await Api.lockOrder(orderId, orderLock.checked);
        });
      }
      catch (e) {
        console.error(e);
      }

      Loader.end();
    }

    loadInfo();
  }
});
