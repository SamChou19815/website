import { getClientTemplate, getServerTemplate } from './entry-points';

const GENERATED_COMMENT = `// ${'@'}generated`;

it('getClientTemplate works', () => {
  expect(getClientTemplate('foo/bar')).toBe(`${GENERATED_COMMENT}

import React from React;
import { hydrate, render } from 'react-dom';

import Document from '../../src/pages/_document.tsx';
import Page from '../../src/pages/foo/bar';

const element = <Document><App /></Document>;
const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) {
  hydrate(rootElement, rootElement);
} else {
  render(rootElement, rootElement);
}
`);
});

it('getServerTemplate works', () => {
  expect(getServerTemplate(['foo/bar', 'bar/baz'])).toBe(`${GENERATED_COMMENT}

import React from React;
import { renderToString } from 'react-dom/server';

import Document from '../../src/pages/_document.tsx';
import Page0 from '../../src/pages/foo/bar';
import Page1 from '../../src/pages/bar/baz';

const components = {
  'foo/bar': Page0,
  'bar/baz': Page1,
};

module.exports = (path) => {
  const Page = components[path];
  return renderToString(<Document><Page /></Document>);
};
`);
});
