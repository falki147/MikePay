import Api from "../api/api";
import Session from "../api/session";
import Alert from "../components/alert";
import Loader from "../components/loader";
import absoluteURL from "../utils/absoluteURL";
import sleep from "../utils/sleep";

/**
 * Add all event listeners to place order form and load order info
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("place-order-form");
  if (form) {
    const params = new URLSearchParams(location.search);
    let orderId = params.get('order_id');

    form.addEventListener("submit", onSubmit);

    /**
     * Handle submit event
     * @param {Event} ev
     */
    async function onSubmit(ev) {
      ev.preventDefault();
      form.classList.add("was-validated");

      if (!form.checkValidity()) {
        return;
      }

      const item = document.getElementById("item").value;
      const price = document.getElementById("price").value;

      let data = { item: item, price: price };

      // If user is logged in use userid, otherwise create new user
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

        await successAnimation();
      }
      catch (e) {
        Alert.error(e.message);
        Loader.end();
      }
    }

    /**
     * Do fancy success animation
     */
    async function successAnimation() {
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

    /**
     * Load info of order and set describtion accordingly
     */
    async function load() {
      Loader.begin();

      try {
        let data;
        if (orderId) {
          data = await Api.orderInfo(orderId);
        }
        else {
          // When orderid isn't set, load data from latest order
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

        // Links can be empty/null
        if (data.url) {
          const anchor = document.createElement("a");
          anchor.href = absoluteURL(data.url);
          anchor.innerText = data.url;
          anchor.target = "_blank";
          url.appendChild(anchor);
        }
      }
      catch (e) {
        console.error(e);
        Alert.error(e.message);
      }

      Loader.end();
    }

    load();
  }
});
