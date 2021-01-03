import encode from "./encode";

export default function link(href, text, raw) {
  if (!href) {
    return raw ? text : encode(text);
  }

  const div = document.createElement("div");
  const anchor = document.createElement("a");

  if (raw) {
    anchor.innerHTML = text;
  }
  else {
    anchor.innerText = text;
  }
  
  anchor.href = href;
  div.appendChild(anchor);
  return div.innerHTML;
};
