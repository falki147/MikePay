import Api from "../api/api";
import Session from "../api/session";
import Alert from "../components/alert";
import Loader from "../components/loader";

document.addEventListener("DOMContentLoaded", async () => {
  const editOrderPositionForm = document.getElementById("edit-order-position-form");
  if (editOrderPositionForm) {
    const params = new URLSearchParams(location.search);
    const orderPositionId = params.get('order_position_id');

    const item = document.getElementById("item");
    const price = document.getElementById("price");

    Loader.begin();

    const data = await Api.orderPositionInfo(orderPositionId);
    item.value = data.item;
    price.value = data.price;

    Loader.end();

    editOrderPositionForm.addEventListener("submit", async ev => {
      editOrderPositionForm.classList.add('was-validated');

      ev.preventDefault();

      if (!editOrderPositionForm.checkValidity()) {
        return;
      }

      Loader.begin(document.getElementById("edit-order-position-btn"));

      try {
        await Api.editOrderPosition(orderPositionId, { item: item.value, price: price.value });
        Alert.success("Artikel wurde erfolgreich bearbeitet!");
      }
      catch (e) {
        Alert.error(e.message);
      }

      Loader.end();
    });

    const deleteButton = document.getElementById("delete-order-position-btn");
    deleteButton.addEventListener("click", async ev => {
      ev.preventDefault();
      Loader.begin(deleteButton);

      try {
        await Api.deleteOrderPosition(orderPositionId);
        window.location = `/order/?order_id=${data.order_id}`;
      }
      catch (e) {
        console.log(e.message);
      }

      Loader.end();
    });
  }
});
