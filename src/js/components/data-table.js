import Pagination from "./pagination";
import SortLinks from "./sort-links";
import Loader from "./loader";
import encode from "../utils/encode";

export default class DataTable {
  constructor(table, paginationElement, dataCallback, renderCallback) {
    const pagination = new Pagination(paginationElement);
    const sortLinks = new SortLinks(table);

    const {page, sort, asc} = this._getQueryInfo();
    pagination.page = page;
    sortLinks.selected = sort;
    sortLinks.ascending = asc;

    pagination.onClick(() => {
      this._load();
      window.scrollTo({
        top: 0,
        behavior: "auto"
      });
    });
  
    sortLinks.onChange(() => {
      pagination.page = 1;
      this._load();
    });

    // Sort on click
    sortLinks.sortOnClick();

    // Add selectbox for mobile
    const sortLinksSelect = sortLinks.createSelectbox();
    sortLinksSelect.classList.add("responsive-sort");
    sortLinksSelect.classList.add("mb-3");
    sortLinksSelect.classList.add("mt-2");
    table.parentNode.insertBefore(sortLinksSelect, table);

    this._head = table.getElementsByTagName("thead")[0];
    this._body = table.getElementsByTagName("tbody")[0];
    this._pagination = pagination;
    this._sortLinks = sortLinks;
    this._dataCallback = dataCallback;
    this._renderCallback = renderCallback;

    // Force loading animation on main element on first load
    Loader.begin();
    this._load();
    Loader.end();
  }

  resetPage() {
    this._pagination.page = 1;
    this._load();
  }

  async _load() {
    this._updateQueryParameter();

    Loader.begin(this._body.parentNode);

    try {
      const data = await this._dataCallback(
        this._pagination.page, this._sortLinks.selected, this._sortLinks.ascending
      );

      const columnNames =
        [...this._head.getElementsByTagName("th")].map(e => e.innerText);

      let html = "";
      for (const item of data.items) {
        html += "<tr>";

        const columns = this._renderCallback(item);
        for (let i = 0; i < columns.length; ++i) {
          html += `<td data-label="${encode(columnNames[i])}: ">${columns[i]}</td>`;
        }

        html += "</tr>";
      }

      this._body.innerHTML = html;
      this._pagination.pages = data.pages;

      if (data.items.length === 0) {
        this._writeMessage("Keine Daten");
      }

      Loader.end();
    }
    catch (e) {
      console.log(e);
      Loader.end();
      this._writeMessage(e.message);
    }
  }

  _writeMessage(message) {
    // Might not be 100% accurate
    const columns = this._head.getElementsByTagName("th").length;

    this._body.innerHTML = `<tr><td class="text-center" colspan="${columns}">${encode(message)}</td></tr>`;
  }

  _updateQueryParameter() {
    const {page, sort, asc} = this._getQueryInfo();

    if (this._pagination.page !== page ||
        this._sortLinks.selected !== sort ||
        (this._sortLinks.selected && this._sortLinks.ascending !== asc)) {
      const url = new URL(window.location);
      url.searchParams.set("page", this._pagination.page);

      if (!this._sortLinks.selected) {
        url.searchParams.delete("sort");
        url.searchParams.delete("asc");
      }
      else {
        url.searchParams.set("sort", this._sortLinks.selected);
        url.searchParams.set("asc", this._sortLinks.ascending ? "true" : "false");
      }

      window.history.replaceState({}, "", url);
    }
  }

  _getQueryInfo() {
    const url = new URL(window.location);

    return {
      page: Number(url.searchParams.get("page") || "1"),
      sort: url.searchParams.get("sort") || null,
      asc: (url.searchParams.get("asc") || "true") === "true"
    };
  }
};
