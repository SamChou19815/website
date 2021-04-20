import { getClientTemplate, getServerTemplate } from './entry-points';

const GENERATED_COMMENT = `// ${'@'}generated`;

it('getClientTemplate works', () => {
  expect(getClientTemplate('index', ['foo/bar', 'bar/baz', 'index', 'baz/index']))
    .toBe(`${GENERATED_COMMENT}
import React,{Suspense,lazy}from'react';import{hydrate,render}from'react-dom';
import {BrowserRouter,Route,Switch}from'esbuild-scripts/__internal-components__/react-router';
import Document from '../src/pages/_document.tsx';import Page from '../src/pages/';const Component0 = lazy(() => import('../src/pages/foo/bar'));const Component1 = lazy(() => import('../src/pages/bar/baz'));const Component2 = lazy(() => import('../src/pages/baz'));
const element = <BrowserRouter><Document><Switch><Route exact path="/"><Page /></Route><Route exact path="/foo/bar"><Suspense fallback={null}><Component0 /></Suspense></Route><Route exact path="/bar/baz"><Suspense fallback={null}><Component1 /></Suspense></Route><Route exact path="/baz"><Suspense fallback={null}><Component2 /></Suspense></Route></Switch></Document></BrowserRouter>;const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) hydrate(element, rootElement); else render(element, rootElement);
`);
});

it('getServerTemplate works', () => {
  expect(getServerTemplate(['foo/bar', 'bar/baz'])).toBe(`${GENERATED_COMMENT}
import{createElement as h}from'react';import{renderToString}from'react-dom/server';import Helmet from 'esbuild-scripts/components/Head';
import Document from '../src/pages/_document.tsx';import Page0 from '../src/pages/foo/bar';import Page1 from '../src/pages/bar/baz';
const map = { 'foo/bar': Page0, 'bar/baz': Page1 };
module.exports = (path) => ({ divHTML: renderToString(h(Document, {}, h(map[path]))), helmet: Helmet.renderStatic() });
`);
});
