import htmlWithElementsAttached from './html-rewriter';

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

it('htmlWithElementsAttached works 1', () => {
  expect(htmlWithElementsAttached(html, 'foo bar', ['app.js', 'app.css'], { esModule: true })).toBe(
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
    htmlWithElementsAttached(html, 'foo bar', ['app.js', 'app.css'], { esModule: false })
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
