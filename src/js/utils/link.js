import encode from "./encode";

export default function link(href, text) {
  if (!href) {
    return encode(text);
  }

  const div = document.createElement("div");
  const anchor = document.createElement("a");
  anchor.innerText = text;
  anchor.href = href;
  div.appendChild(anchor);
  return div.innerHTML;
};
