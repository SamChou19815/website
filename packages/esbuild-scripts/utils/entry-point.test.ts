import { getClientTemplate, getServerTemplate } from './entry-points';

const GENERATED_COMMENT = `// ${'@'}generated`;

it('getClientTemplate works', () => {
  expect(getClientTemplate('foo/bar')).toBe(`${GENERATED_COMMENT}

import React from 'react';
import { hydrate, render } from 'react-dom';
import BrowserRouter from 'esbuild-scripts/__internal-components__/BrowserRouter';

import Document from '../src/pages/_document.tsx';
import Page from '../src/pages/foo/bar';

const element = (
  <BrowserRouter>
    <Document>
      <Page />
    </Document>
  </BrowserRouter>
);
const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) {
  hydrate(element, rootElement);
} else {
  render(element, rootElement);
}
`);
});

it('getServerTemplate works', () => {
  expect(getServerTemplate(['foo/bar', 'bar/baz'])).toBe(`${GENERATED_COMMENT}

import React from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'esbuild-scripts/components/Head'

import Document from '../src/pages/_document.tsx';
import Page0 from '../src/pages/foo/bar';
import Page1 from '../src/pages/bar/baz';

const components = {
  'foo/bar': Page0,
  'bar/baz': Page1,
};

module.exports = (path) => {
  const Page = components[path];
  const divHTML = renderToString(<Document><Page /></Document>);
  const helmet = Helmet.renderStatic();
  return { divHTML, helmet };
};
`);
});
