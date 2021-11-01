import { getClientTemplate, getServerTemplate } from './entry-points';

const GENERATED_COMMENT = `// ${'@'}generated`;

it('getClientTemplate works for index real path', () => {
  expect(
    getClientTemplate(
      'absolute-root',
      'index',
      true,
      ['foo/bar', 'bar/baz', 'index'],
      ['baz/index']
    )
  ).toBe(`${GENERATED_COMMENT}
import React,{Suspense,lazy} from 'react';
import {hydrate,render} from 'react-dom';
import {BrowserRouter,Route,Switch} from 'esbuild-scripts/__internal-components__/react-router';
import Document from 'absolute-root/src/pages/_document';
import Page from 'absolute-root/src/pages/index';
const RealComponent0 = lazy(() => import('absolute-root/src/pages/foo/bar'));
const RealComponent1 = lazy(() => import('absolute-root/src/pages/bar/baz'));
const VirtualComponent0 = lazy(() => import('esbuild-scripts-internal/virtual/baz/index'));
const element = (
  <BrowserRouter>
    <Document>
      <Switch>
        <Route exact path="/"><Page /></Route>
        <Route exact path="/foo/bar"><Suspense fallback={null}><RealComponent0 /></Suspense></Route>
        <Route exact path="/bar/baz"><Suspense fallback={null}><RealComponent1 /></Suspense></Route>
        <Route exact path="/baz"><Suspense fallback={null}><VirtualComponent0 /></Suspense></Route>
      </Switch>
    </Document>
  </BrowserRouter>
);
const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) hydrate(element, rootElement); else render(element, rootElement);
`);
});

it('getClientTemplate works for non index virtual path', () => {
  expect(
    getClientTemplate(
      'absolute-root',
      'docs/foo/bar',
      false,
      ['foo/bar', 'bar/baz', 'docs/foo/bar'],
      ['baz/index']
    )
  ).toBe(`${GENERATED_COMMENT}
import React,{Suspense,lazy} from 'react';
import {hydrate,render} from 'react-dom';
import {BrowserRouter,Route,Switch} from 'esbuild-scripts/__internal-components__/react-router';
import Document from 'absolute-root/src/pages/_document';
import Page from 'esbuild-scripts-internal/virtual/docs/foo/bar';
const RealComponent0 = lazy(() => import('absolute-root/src/pages/foo/bar'));
const RealComponent1 = lazy(() => import('absolute-root/src/pages/bar/baz'));
const VirtualComponent0 = lazy(() => import('esbuild-scripts-internal/virtual/baz/index'));
const element = (
  <BrowserRouter>
    <Document>
      <Switch>
        <Route exact path="/docs/foo/bar"><Page /></Route>
        <Route exact path="/foo/bar"><Suspense fallback={null}><RealComponent0 /></Suspense></Route>
        <Route exact path="/bar/baz"><Suspense fallback={null}><RealComponent1 /></Suspense></Route>
        <Route exact path="/baz"><Suspense fallback={null}><VirtualComponent0 /></Suspense></Route>
      </Switch>
    </Document>
  </BrowserRouter>
);
const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) hydrate(element, rootElement); else render(element, rootElement);
`);
});

it('getServerTemplate works', () => {
  expect(getServerTemplate('absolute-root', ['foo/bar'], ['bar/baz'])).toBe(`${GENERATED_COMMENT}
import React from 'react';
import {renderToString} from 'react-dom/server';
import Helmet from 'esbuild-scripts/components/Head';
import {StaticRouter} from 'esbuild-scripts/__internal-components__/react-router';
import Document from 'absolute-root/src/pages/_document';
import RealPage0 from 'absolute-root/src/pages/foo/bar';
import VirtualPage0 from 'esbuild-scripts-internal/virtual/bar/baz';
const map = { 'foo/bar': RealPage0, 'bar/baz': VirtualPage0 };
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
