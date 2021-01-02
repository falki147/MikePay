import Api from "../api/api";
import Session from "../api/session";
import Alert from "../components/alert";
import Loader from "../components/loader";

const form = document.getElementById("place-order-form");
if (form) {
  const params = new URLSearchParams(location.search);
  const orderId = params.get('order_id');

  form.addEventListener("submit", async ev => {
    ev.preventDefault();

    const item = document.getElementById("item").value;
    const price = document.getElementById("price").value;

    if (!Session.isLoggedIn()) {
      // TODO: Add guest implementation
      throw Error("not implemented");
    }

    try {
      Loader.begin(document.getElementById("place-order-btn"));
      await Api.placeOrder(orderId, { userid: await Session.id(), item: item, price: price });
      Alert.success("Bestellung war erfolgreich!");
    }
    catch (e) {
      Alert.error(e.message);
    }

    Loader.end();
  });

  async function load() {
    const data = await Api.getOrderInfo(orderId);
    
    const description = document.getElementById("description");
    const url = document.getElementById("url");

    description.innerText = data.description;

    const anchor = document.createElement("a");
    anchor.href = data.url;
    anchor.innerText = data.url;
    anchor.target = "_blank";
    url.appendChild(anchor);
  }

  load();
}
