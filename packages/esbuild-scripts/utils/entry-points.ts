import { extname, resolve } from 'path';

import type { VirtualPathMappings } from '../esbuild/esbuild-virtual-path-plugin';
import {
  PAGES_PATH,
  VIRTUAL_PATH_PREFIX,
  VIRTUAL_GENERATED_ENTRY_POINT_PATH_PREFIX,
  VIRTUAL_SERVER_ENTRY_PATH,
} from './constants';
import { ensureDirectory, readDirectory } from './fs';

const GENERATED_COMMENT = `// ${'@'}generated`;

const rewriteEntryPointPathForRouting = (path: string): string => {
  if (!path.endsWith('index')) return path;
  return path.substring(0, path.length - (path.endsWith('/index') ? 6 : 5));
};

const getPathForImport = (absoluteProjectPath: string, path: string, isRealPath: boolean) =>
  isRealPath ? `${absoluteProjectPath}/src/pages/${path}` : `${VIRTUAL_PATH_PREFIX}${path}`;

export const getClientTemplate = (
  absoluteProjectPath: string,
  path: string,
  isRealPath: boolean,
  realPaths: readonly string[],
  virtualPaths: readonly string[]
): string => {
  const otherRealPaths = realPaths.filter((it) => it !== path);
  const otherVirtualPaths = virtualPaths.filter((it) => it !== path);

  const importPath = (p: string, real: boolean) => getPathForImport(absoluteProjectPath, p, real);

  const lazyImports = [
    ...otherRealPaths.map(
      (otherPath, i) =>
        `const RealComponent${i} = lazy(() => import('${importPath(otherPath, true)}'));`
    ),
    ...otherVirtualPaths.map(
      (otherPath, i) =>
        `const VirtualComponent${i} = lazy(() => import('${importPath(otherPath, false)}'));`
    ),
  ].join('\n');
  const currentPageImportPath = importPath(path, isRealPath);
  const lazyLoadedRoutes = [
    ...otherRealPaths.map((otherPath, i) => {
      const routePath = rewriteEntryPointPathForRouting(otherPath);
      return `        <Route exact path="/${routePath}"><Suspense fallback={null}><RealComponent${i} /></Suspense></Route>`;
    }),
    ...otherVirtualPaths.map((otherPath, i) => {
      const routePath = rewriteEntryPointPathForRouting(otherPath);
      return `        <Route exact path="/${routePath}"><Suspense fallback={null}><VirtualComponent${i} /></Suspense></Route>`;
    }),
  ].join('\n');

  return `${GENERATED_COMMENT}
import React,{Suspense,lazy} from 'react';
import {hydrate,render} from 'react-dom';
import {BrowserRouter,Route,Switch} from 'esbuild-scripts/__internal-components__/react-router';
import Document from '${absoluteProjectPath}/src/pages/_document';
import Page from '${currentPageImportPath}';
${lazyImports}
const element = (
  <BrowserRouter>
    <Document>
      <Switch>
        <Route exact path="/${rewriteEntryPointPathForRouting(path)}"><Page /></Route>
${lazyLoadedRoutes}
      </Switch>
    </Document>
  </BrowserRouter>
);
const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) hydrate(element, rootElement); else render(element, rootElement);
`;
};

export const getServerTemplate = (
  absoluteProjectPath: string,
  realPaths: readonly string[],
  virtualPaths: readonly string[]
): string => {
  const importPath = (p: string, real: boolean) => getPathForImport(absoluteProjectPath, p, real);

  const pageImports = [
    ...realPaths.map((path, i) => `import RealPage${i} from '${importPath(path, true)}';`),
    ...virtualPaths.map((path, i) => `import VirtualPage${i} from '${importPath(path, false)}';`),
  ].join('\n');
  const mappingObjectInner = [
    ...realPaths.map((path, i) => `'${path}': RealPage${i}`),
    ...virtualPaths.map((path, i) => `'${path}': VirtualPage${i}`),
  ].join(', ');
  return `${GENERATED_COMMENT}
import React from 'react';
import {renderToString} from 'react-dom/server';
import Helmet from 'esbuild-scripts/components/Head';
import {StaticRouter} from 'esbuild-scripts/__internal-components__/react-router';
import Document from '${absoluteProjectPath}/src/pages/_document';
${pageImports}
const map = { ${mappingObjectInner} };
module.exports = (path) => ({
  divHTML: renderToString(
    <StaticRouter location={'/'+path}>
      <Document>{React.createElement(map[path])}</Document>
    </StaticRouter>
  ),
  noJS: map[path].noJS,
  helmet: Helmet.renderStatic(),
});
`;
};

/**
 * @returns a list of entry point paths under `src/pages`.
 * The paths will be relativized against `src/pages` and with extensions removed.
 */
const getEntryPointsWithoutExtension = async (): Promise<readonly string[]> => {
  await ensureDirectory(PAGES_PATH);
  return (await readDirectory(PAGES_PATH, true))
    .map((it) => {
      const extension = extname(it);
      switch (extension) {
        case '.js':
        case '.jsx':
        case '.ts':
        case '.tsx':
          break;
        default:
          return null;
      }
      return it.substring(0, it.lastIndexOf('.'));
    })
    .filter((it): it is string => it != null && !it.startsWith('_document'));
};

export const virtualEntryComponentsToVirtualPathMappings = (
  virtualEntryComponents: VirtualPathMappings
): VirtualPathMappings =>
  Object.fromEntries(
    Object.entries(virtualEntryComponents).map(([key, value]) => [
      `${VIRTUAL_PATH_PREFIX}${key}`,
      value,
    ])
  );

export const createEntryPointsGeneratedVirtualFiles = async (
  virtualEntryPointsWithoutExtension: readonly string[]
): Promise<{
  readonly entryPointsWithoutExtension: readonly string[];
  readonly entryPointVirtualFiles: VirtualPathMappings;
}> => {
  const absoluteProjectPath = resolve('.');
  const entryPointsWithoutExtension = await getEntryPointsWithoutExtension();
  const entryPointVirtualFiles = Object.fromEntries([
    ...entryPointsWithoutExtension.map((path) => [
      `${VIRTUAL_GENERATED_ENTRY_POINT_PATH_PREFIX}${path}.jsx`,
      getClientTemplate(
        absoluteProjectPath,
        path,
        true,
        entryPointsWithoutExtension,
        virtualEntryPointsWithoutExtension
      ),
    ]),
    ...virtualEntryPointsWithoutExtension.map((path) => [
      `${VIRTUAL_GENERATED_ENTRY_POINT_PATH_PREFIX}${path}.jsx`,
      getClientTemplate(
        absoluteProjectPath,
        path,
        false,
        entryPointsWithoutExtension,
        virtualEntryPointsWithoutExtension
      ),
    ]),
  ]);
  entryPointVirtualFiles[VIRTUAL_SERVER_ENTRY_PATH] = getServerTemplate(
    absoluteProjectPath,
    entryPointsWithoutExtension,
    virtualEntryPointsWithoutExtension
  );
  return { entryPointsWithoutExtension, entryPointVirtualFiles };
};
