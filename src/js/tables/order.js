import Api from "../api/api";
import Loader from "../components/loader";
import DataTable from "../components/data-table";
import encode from "../utils/encode";
import link from "../utils/link";
import getShortDate from "../utils/dateShort";
import Session from "../api/session";
import absoluteURL from "../utils/absoluteURL";
import Alert from "../components/alert";

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
        locked = data.status === "locked";

        // Update order title
        document.getElementById("order-title").innerText = `Bestellung - ${data.title}`;

        // Update order description
        let description = encode(data.description);
        if (data.url) {
          description += ` (${link(absoluteURL(data.url), "Link", false, { target: "blank" })})`;
        }
        document.getElementById("order-description").innerHTML = description;

        // Update add product link href
        const shareLink = document.getElementById("order-add-product-link");
        // TODO: Add prefix
        shareLink.href = `/place_order/?order_id=${orderId}`;

        if (locked) {
          shareLink.classList.add("d-none");
        }

        // Update lock switch value
        const orderLock = document.getElementById("order-lock");
        if (orderLock) {
          orderLock.checked = locked;

          orderLock.addEventListener("change", async () => {
            await Api.lockOrder(orderId, orderLock.checked);
            locked = orderLock.checked;
            dataTable.resetPage();

            if (locked) {
              shareLink.classList.add("d-none");
            }
            else {
              shareLink.classList.remove("d-none");
            }
          });
        }

        // Update order total and item count
        const total = document.getElementById("order-total");
        if (total) {
          total.innerText = data.total;
        }

        const items = document.getElementById("order-items");
        if (items) {
          items.innerText = data.items;
        }
      }
      catch (e) {
        console.error(e);
        Alert.error(e.message);
      }
    }

    await loadInfo();

    const pagination = document.getElementById("order-pagination");

    const dataTable = new DataTable(
      orderTable, pagination,
      async (page, sort, asc) => await Api.orderPositions(orderId, page, sort, asc),
      item => {
        let title = encode(item.item);

        // Add edit link to order position when product is from same user and order is not locked
        if (!locked && item.user_id === userId) {
          title = link(
            `/edit_order_position/?order_position_id=${item.id}`,
            `${title}<i class="bi bi-pencil" aria-label="Artikel bearbeiten"></i>`, true
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
