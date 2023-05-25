// @ts-check

(() => {
  const url = new URL("/_ws", window.location.href);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  const connection = new WebSocket(url.toString());

  let isFirstCompilation = true;
  let hasCompileErrors = false;

  function clearOutdatedErrors() {
    // Clean up outdated compile errors, if any.
    if (!isFirstCompilation && hasCompileErrors) {
      console.clear();
    }
  }

  connection.onclose = () =>
    console.info("The development server has disconnected.\nRefresh the page if necessary.");

  connection.onmessage = (m) => {
    /** @type {{hasErrors: boolean}} */
    const { hasErrors } = JSON.parse(m.data);

    if (hasErrors) {
      hasCompileErrors = true;
      clearOutdatedErrors();
      console.error("Check the terminal for compile time errors.");
      document.body.innerHTML =
        '<div style="text-align: center;font-size: 4em;margin: 2em;">Failed to compile.</div>';
    } else {
      hasCompileErrors = false;
      if (!isFirstCompilation) {
        window.location.reload();
      }
    }
    isFirstCompilation = false;
  };
})();
