import htmlWithElementsAttached from './html-rewriter';

it('htmlWithElementsAttached works 1', () => {
  expect(
    htmlWithElementsAttached(
      `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
    </head>
    <body>
      <div id="root"></div>
    </body>
  </html>
  `,
      'foo bar',
      true,
      ['app.js', 'app.css']
    )
  ).toBe(
    '<!DOCTYPE html>' +
      '<html lang="en">' +
      '<head>' +
      '<meta charset="utf-8">' +
      '<link rel="modulepreload" href="/app.js">' +
      '<link rel="stylesheet" href="/app.css">' +
      '</head>' +
      '<body>' +
      '<div id="root">foo bar</div>' +
      '<script type="module" src="/app.js"></script>' +
      '</body>' +
      '</html>'
  );
});

it('htmlWithElementsAttached works 2', () => {
  expect(
    htmlWithElementsAttached(
      `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
    </head>
    <body>
      <div id="root"></div>
    </body>
  </html>
  `,
      'foo bar',
      false,
      ['app.js', 'app.css']
    )
  ).toBe(
    '<!DOCTYPE html>' +
      '<html lang="en">' +
      '<head>' +
      '<meta charset="utf-8">' +
      '<link rel="preload" href="/app.js">' +
      '<link rel="stylesheet" href="/app.css">' +
      '</head>' +
      '<body>' +
      '<div id="root">foo bar</div>' +
      '<script src="/app.js"></script>' +
      '</body>' +
      '</html>'
  );
});
