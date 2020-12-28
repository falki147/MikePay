import Api from "../api/api";

const form = document.getElementById("place-order-form");
if (form) {
  const params = new URLSearchParams(location.search);
  const orderId = params.get('order_id');

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
