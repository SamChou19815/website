// @ts-check

let changed = false;
window.setInterval(() => {
  if (changed) return;
  const nodes = Array.from(document.querySelectorAll("span")).filter(
    (el) => el.textContent === "For you",
  );
  for (const node of nodes) {
    console.log("[threads-helper] Force following feed");
    node.click();
    changed = true;
  }
}, 1000);
