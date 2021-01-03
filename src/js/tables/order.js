import Api from "../api/api";
import Loader from "../components/loader";
import DataTable from "../components/data-table";
import encode from "../utils/encode";
import link from "../utils/link";
import getShortDate from "../utils/dateShort";
import Session from "../api/session";

document.addEventListener("DOMContentLoaded", async () => {
  const orderTable = document.getElementById("order-table");
  if (orderTable) {
    Loader.begin();

    const params = new URLSearchParams(location.search);
    const orderId = params.get("order_id");
    const userId = await Session.id();
    let locked = true;

    async function loadInfo() {
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

        locked = data.status === "locked";

        const orderLock = document.getElementById("order-lock");
        orderLock.checked = locked;

        orderLock.addEventListener("change", async () => {
          await Api.lockOrder(orderId, orderLock.checked);
          locked = orderLock.checked;
          dataTable.resetPage();
        });
      }
      catch (e) {
        console.error(e);
      }
    }

    await loadInfo();

    const pagination = document.getElementById("order-pagination");

    const dataTable = new DataTable(
      orderTable, pagination,
      async (page, sort, asc) => await Api.orderPositions(orderId, page, sort, asc),
      item => {
        let title = encode(item.item);

        if (!locked && item.user_id === userId) {
          title = link(
            `/edit_order_position/?order_position_id=${item.id}`,
            `${title} <i class="bi bi-pencil"></i>`, true
          );
        }

        return [
          title,
          encode(item.price),
          link(`/debtor/?user_id=${item.user_id}`, `${item.firstname} ${item.lastname}`),
          encode(getShortDate(item.date))
        ];
      }
    );

    Loader.end();
  }
});
