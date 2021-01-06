import Api from "../api/api";
import Alert from "../components/alert";
import Loader from "../components/loader";

/**
 * Add all event listeners to edit order position form and load order position info
 */
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("edit-order-position-form");
  if (form) {
    let isSubmitting = false;

    // Get order position id from query parameters
    const params = new URLSearchParams(location.search);
    const orderPositionId = params.get("order_position_id");

    // Gets filled in loadOrderPositionInfo
    let orderId = null;

    form.addEventListener("submit", onSubmit);

    document.getElementById("delete-order-position-btn")
      .addEventListener("click", onDeleteClick);

    /**
     * Handle submit event
     * @param {Event} ev
     */
    async function onSubmit(ev) {
      ev.preventDefault();

      if (isSubmitting) {
        // Prevent double submit
        return;
      }

      form.classList.add("was-validated");

      if (!form.checkValidity()) {
        return;
      }

      try {
        isSubmitting = true;
        Loader.begin(document.getElementById("edit-order-position-btn"));
        
        await Api.editOrderPosition(orderPositionId, {
          item: document.getElementById("item").value,
          price: document.getElementById("price").value
        });

        Alert.success("Artikel wurde erfolgreich bearbeitet.");
      }
      catch (e) {
        console.error(e);
        Alert.error(e.message);
      }

      Loader.end();
      isSubmitting = false;
    }

    /**
     * Handle delete button click
     * @param {Event} ev
     */
    async function onDeleteClick(ev) {
      ev.preventDefault();

      try {
        Loader.begin(document.getElementById("delete-order-position-btn"));
        await Api.deleteOrderPosition(orderPositionId);
        Alert.success("Der Artikel wurde erfolgreich entfernt.");

        // Redirect to order after deletion
        window.location = `/order/?order_id=${orderId}`;
      }
      catch (e) {
        console.error(e);
        Alert.error(e.message);
      }

      Loader.end();
    }

    /**
     * Load user data of order postion and prefill fields with the data
     */
    async function loadOrderPositionInfo() {
      try {
        Loader.begin();

        const data = await Api.orderPositionInfo(orderPositionId);
        document.getElementById("item").value = data.item;
        document.getElementById("price").value = data.price;
        orderId = data.order_id;

        const anchor = document.getElementById("order-link");
        anchor.href = `/order/?order_id=${orderId}`;
      }
      catch (e) {
        console.error(e);
        Alert.error(e.message);
      }

      Loader.end();
    }

    loadOrderPositionInfo();
  }
});
