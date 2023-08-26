// @ts-check

let changed = false;
window.setInterval(() => {
  if (changed) return;
  const node = Array.from(document.querySelectorAll("span")).find(
    (el) => el.textContent === "For you",
  );
  if (node) {
    console.log("[threads-helper] Force following feed");
    node.click();
    changed = true;
  }
}, 1000);
