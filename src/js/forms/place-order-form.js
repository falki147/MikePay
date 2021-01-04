import Api from "../api/api";
import Session from "../api/session";
import Alert from "../components/alert";
import Loader from "../components/loader";
import absoluteURL from "../utils/absoluteURL";
import encode from "../utils/encode";
import sleep from "../utils/sleep";

const form = document.getElementById("place-order-form");
if (form) {
  const params = new URLSearchParams(location.search);
  let orderId = params.get('order_id');

  form.addEventListener("submit", async ev => {
    ev.preventDefault();

    const item = document.getElementById("item").value;
    const price = document.getElementById("price").value;

    let data = { item: item, price: price };

    if (await Session.isLoggedIn()) {
      data.userid = await Session.id()
    }
    else {
      data.firstname = document.getElementById("firstname").value;
      data.lastname = document.getElementById("lastname").value;
    }

    try {
      Loader.begin(document.getElementById("place-order-btn"));
      await Api.placeOrder(orderId, data);
      Loader.end();

      const formWrapper = document.getElementsByClassName("form-wrapper")[0];

      formWrapper.classList.add("place-order-hide");

      await sleep(300);

      const checkmark = document.createElement("div");
      checkmark.classList.add("checkmark");
      checkmark.innerHTML = "<div class=\"checkmark-inner\"></div>";

      formWrapper.parentNode.insertBefore(checkmark, formWrapper);
      formWrapper.style.display = "none";

      await sleep(1500);

      checkmark.remove();
      formWrapper.classList.remove("place-order-hide");
      formWrapper.classList.add("place-order-show");
      formWrapper.style.removeProperty("display");

      await sleep(300);

      formWrapper.classList.remove("place-order-show");
    }
    catch (e) {
      Alert.error(e.message);
      Loader.end();
    }
  });

  async function load() {
    Loader.begin();

    try {
      let data;
      if (orderId) {
        data = await Api.orderInfo(orderId);
      }
      else {
        data = await Api.orderInfoLatest();
        orderId = data.id;
      }

      if (data.status === "locked") {
        Alert.error(
          "Die Bestellung ist bereits gesperrt. Neue Einträge können nicht hinzugefügt werden."
        );

        document.getElementById("place-order-btn").disabled = true;
      }
      
      const description = document.getElementById("description");
      const url = document.getElementById("url");

      description.innerText = data.description;

      const anchor = document.createElement("a");
      anchor.href = absoluteURL(data.url);
      anchor.innerText = data.url;
      anchor.target = "_blank";
      url.appendChild(anchor);
    }
    catch (e) {
      console.log(e);
      Alert.error(e.message);
    }

    Loader.end();
  }

  load();
}
