import htmlWithElementsAttached from './html-rewriter';

it('htmlWithElementsAttached works', () => {
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
      { type: 'js', originalFilename: 'app.js', content: 'aa' },
      { type: 'css', originalFilename: 'app.css', content: 'aa' }
    )
  ).toBe(
    '<!DOCTYPE html>' +
      '<html lang="en">' +
      '<head>' +
      '<meta charset="utf-8" >' +
      '<link rel="preload" href="/app.js?h=4124bc0a" as="script" >' +
      '<link rel="stylesheet" href="/app.css?h=4124bc0a" >' +
      '</head>' +
      '<body>' +
      '<div id="root">foo bar</div>' +
      '<script src="/app.js?h=4124bc0a"></script>' +
      '</body>' +
      '</html>'
  );
});
