// @ts-check
/* eslint-disable no-console */

(() => {
  const url = new URL('/_ws', window.location.href);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  const connection = new WebSocket(url.toString());

  let isFirstCompilation = true;
  let hasCompileErrors = false;

  function clearOutdatedErrors() {
    // Clean up outdated compile errors, if any.
    if (!isFirstCompilation && hasCompileErrors) console.clear();
  }

  connection.onclose = () =>
    console.info('The development server has disconnected.\nRefresh the page if necessary.');

  connection.onmessage = (m) => {
    /** @type {{building: boolean, hasErrors: boolean}} */
    const { building, hasErrors } = JSON.parse(m.data);

    if (building) {
      clearOutdatedErrors();
    } else if (!hasErrors) {
      hasCompileErrors = false;
      if (!isFirstCompilation) window.location.reload();
    } else {
      hasCompileErrors = true;
      clearOutdatedErrors();
      console.error('Check the terminal for compile time errors.');
      document.body.innerHTML =
        '<div style="text-align: center;font-size: 4em;margin: 2em;">Failed to compile.</div>';
    }
    isFirstCompilation = false;
  };
})();
