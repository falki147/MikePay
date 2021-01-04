/**
 * Escapes string for usage in HTML
 * @param {String} str
 */
export default function encode(str) {
  const el = document.createElement("div");
  el.innerText = str;
  return el.innerHTML;
};
