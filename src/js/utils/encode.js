export default function encode(str) {
  const el = document.createElement("div");
  el.innerText = str;
  return el.innerHTML;
};
