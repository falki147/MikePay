import Pagination from "./pagination";
import SortLinks from "./sort-links";
import Loader from "./loader";
import encode from "../utils/encode";

export default class DataTable {
  constructor(table, paginationElement, dataCallback, renderCallback) {
    const pagination = new Pagination(paginationElement);
    const sortLinks = new SortLinks(table);

    pagination.onClick(() => {
      this._load();
    });
  
    sortLinks.onChange(() => {
      pagination.page = 1;
      this._load();
    });

    this._head = table.getElementsByTagName("thead")[0];
    this._body = table.getElementsByTagName("tbody")[0];
    this._pagination = pagination;
    this._sortLinks = sortLinks;
    this._dataCallback = dataCallback;
    this._renderCallback = renderCallback;

    this._load();
  }

  resetPage() {
    this._pagination.page = 1;
    this._load();
  }

  async _load() {
    Loader.begin(this._body);

    try {
      const data = await this._dataCallback(
        this._pagination.page, this._sortLinks.selected, this._sortLinks.ascending
      );

      let html = "";
      for (const item of data.items) {
        html += `<tr><td>${this._renderCallback(item).join("</td><td>")}</td></tr>`;
      }

      this._body.innerHTML = html;
      this._pagination.pages = data.pages;

      if (data.items.length === 0) {
        this.writeMessage("Keine Daten");
      }

      Loader.end();
    }
    catch (e) {
      console.log(e);
      Loader.end();
      this.writeMessage(e.message);
    }
  }

  writeMessage(message) {
    // Might not be 100% accurate
    const columns = this._head.getElementsByTagName("th").length;

    this._body.innerHTML = `<tr><td class="text-center" colspan="${columns}">${encode(message)}</td></tr>`;
  }
};
