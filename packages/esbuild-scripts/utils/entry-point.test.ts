import { getClientTemplate, getServerTemplate } from './entry-points';

const GENERATED_COMMENT = `// ${'@'}generated`;

it('getClientTemplate works', () => {
  expect(getClientTemplate('index', ['foo/bar', 'bar/baz', 'index', 'baz/index']))
    .toBe(`${GENERATED_COMMENT}
import React,{Suspense,lazy} from 'react';
import {hydrate,render} from 'react-dom';
import {BrowserRouter,Route,Switch} from 'esbuild-scripts/__internal-components__/react-router';
import Document from 'esbuild-scripts-internal/page/_document';
import Page from 'esbuild-scripts-internal/page/index';
const Component0 = lazy(() => import('esbuild-scripts-internal/page/foo/bar'));
const Component1 = lazy(() => import('esbuild-scripts-internal/page/bar/baz'));
const Component2 = lazy(() => import('esbuild-scripts-internal/page/baz/index'));
const element = <BrowserRouter><Document><Switch><Route exact path="/"><Page /></Route><Route exact path="/foo/bar"><Suspense fallback={null}><Component0 /></Suspense></Route><Route exact path="/bar/baz"><Suspense fallback={null}><Component1 /></Suspense></Route><Route exact path="/baz"><Suspense fallback={null}><Component2 /></Suspense></Route></Switch></Document></BrowserRouter>;const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) hydrate(element, rootElement); else render(element, rootElement);
`);
});

it('getClientTemplate works', () => {
  expect(getClientTemplate('docs/foo/bar', ['foo/bar', 'bar/baz', 'docs/foo/bar', 'baz/index']))
    .toBe(`${GENERATED_COMMENT}
import React,{Suspense,lazy} from 'react';
import {hydrate,render} from 'react-dom';
import {BrowserRouter,Route,Switch} from 'esbuild-scripts/__internal-components__/react-router';
import Document from 'esbuild-scripts-internal/page/_document';
import Page from 'esbuild-scripts-internal/page/docs/foo/bar';
const Component0 = lazy(() => import('esbuild-scripts-internal/page/foo/bar'));
const Component1 = lazy(() => import('esbuild-scripts-internal/page/bar/baz'));
const Component2 = lazy(() => import('esbuild-scripts-internal/page/baz/index'));
const element = <BrowserRouter><Document><Switch><Route exact path="/docs/foo/bar"><Page /></Route><Route exact path="/foo/bar"><Suspense fallback={null}><Component0 /></Suspense></Route><Route exact path="/bar/baz"><Suspense fallback={null}><Component1 /></Suspense></Route><Route exact path="/baz"><Suspense fallback={null}><Component2 /></Suspense></Route></Switch></Document></BrowserRouter>;const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) hydrate(element, rootElement); else render(element, rootElement);
`);
});

it('getServerTemplate works', () => {
  expect(getServerTemplate(['foo/bar', 'bar/baz'])).toBe(`${GENERATED_COMMENT}
import React from 'react';
import {renderToString} from 'react-dom/server';
import Helmet from 'esbuild-scripts/components/Head';
import {StaticRouter} from 'esbuild-scripts/__internal-components__/react-router';
import Document from 'esbuild-scripts-internal/page/_document';
import Page0 from 'esbuild-scripts-internal/page/foo/bar';
import Page1 from 'esbuild-scripts-internal/page/bar/baz';
const map = { 'foo/bar': Page0, 'bar/baz': Page1 };
module.exports = (path) => ({
  divHTML: renderToString(
    <StaticRouter location={'/'+path}>
      <Document>{React.createElement(map[path])}</Document>
    </StaticRouter>
  ),
  noJS: map[path].noJS,
  helmet: Helmet.renderStatic(),
});
`);
});
