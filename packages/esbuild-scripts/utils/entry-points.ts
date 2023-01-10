import * as fs from 'fs/promises';
import { extname, resolve } from 'path';
import {
  PAGES_PATH,
  VIRTUAL_GENERATED_ENTRY_POINT_PATH_PREFIX,
  VIRTUAL_PATH_PREFIX,
  VIRTUAL_SERVER_ENTRY_PATH,
} from './constants';
import type { VirtualPathMappings } from './esbuild-config';
import { readDirectory } from './fs';

const GENERATED_COMMENT = `// ${'@'}generated`;

function rewriteEntryPointPathForRouting(path: string): string {
  if (!path.endsWith('index')) {
    return path;
  }
  return path.substring(0, path.length - (path.endsWith('/index') ? 6 : 5));
}

const getPathForImport = (absoluteProjectPath: string, path: string, isRealPath: boolean) =>
  isRealPath ? `${absoluteProjectPath}/src/pages/${path}` : `${VIRTUAL_PATH_PREFIX}${path}`;

export function getClientTemplate(
  absoluteProjectPath: string,
  path: string,
  isRealPath: boolean,
  realPaths: readonly string[],
  virtualPaths: readonly string[],
): string {
  const otherRealPaths = realPaths.filter((it) => it !== path);
  const otherVirtualPaths = virtualPaths.filter((it) => it !== path);

  const importPath = (p: string, real: boolean) => getPathForImport(absoluteProjectPath, p, real);

  const lazyImports = [
    ...otherRealPaths.map(
      (otherPath, i) =>
        `const RealComponent${i} = lazy(() => import('${importPath(otherPath, true)}'));`,
    ),
    ...otherVirtualPaths.map(
      (otherPath, i) =>
        `const VirtualComponent${i} = lazy(() => import('${importPath(otherPath, false)}'));`,
    ),
  ].join('\n');
  const currentPageImportPath = importPath(path, isRealPath);
  const lazyLoadedRoutes = [
    ...otherRealPaths.map((otherPath, i) => {
      const routePath = rewriteEntryPointPathForRouting(otherPath);
      return `        <Route exact path="/${routePath}" element={<Suspense fallback={null}><RealComponent${i} /></Suspense>} />`;
    }),
    ...otherVirtualPaths.map((otherPath, i) => {
      const routePath = rewriteEntryPointPathForRouting(otherPath);
      return `        <Route exact path="/${routePath}" element={<Suspense fallback={null}><VirtualComponent${i} /></Suspense>}/>`;
    }),
  ].join('\n');

  return `${GENERATED_COMMENT}
import React,{Suspense,lazy} from 'react';
import {hydrateRoot} from 'react-dom';
import {createRoot} from 'react-dom/client';
import HelmetProvider from 'esbuild-scripts/__internal-components__/helmet-provider';
import {BrowserRouter,Route,Routes} from 'esbuild-scripts/__internal-components__/react-router';
import Page from '${currentPageImportPath}';
import 'lib-react-prism/common.css';

${lazyImports}
const element = (
  <HelmetProvider>
    <BrowserRouter>
      <Routes>
        <Route exact path="/${rewriteEntryPointPathForRouting(path)}" element={<Page />} />
${lazyLoadedRoutes}
      </Routes>
    </BrowserRouter>
  </HelmetProvider>
);
const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) hydrateRoot(rootElement, element); else createRoot(rootElement).render(element);
`;
}

export function getServerTemplate(
  absoluteProjectPath: string,
  realPaths: readonly string[],
): string {
  const importPath = (p: string, real: boolean) => getPathForImport(absoluteProjectPath, p, real);

  const pageImports = realPaths
    .map((path, i) => `import RealPage${i} from '${importPath(path, true)}';`)
    .join('\n');
  const mappingObjectInner = [...realPaths.map((path, i) => `'${path}': RealPage${i}`)].join(', ');
  return `${GENERATED_COMMENT}
import React from 'react';
import {renderToString} from 'react-dom/server';
import HelmetProvider from 'esbuild-scripts/__internal-components__/helmet-provider';
import {StaticRouter} from 'esbuild-scripts/__internal-components__/react-router-server';
${pageImports}
const map = { ${mappingObjectInner} };
export default (path) => {
  const helmetContext = {};
  return {
    divHTML: renderToString(
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={'/'+path}>
          {React.createElement(map[path])}
        </StaticRouter>
      </HelmetProvider>
    ),
    noJS: map[path].noJS,
    helmet: helmetContext.helmet,
  }
};
`;
}

/**
 * @returns a list of entry point paths under `src/pages`.
 * The paths will be relativized against `src/pages` and with extensions removed.
 */
async function getEntryPointsWithoutExtension(): Promise<readonly string[]> {
  await fs.mkdir(PAGES_PATH, { recursive: true });
  return (await readDirectory(PAGES_PATH))
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
    .filter((it): it is string => it != null);
}

export async function createEntryPointsGeneratedVirtualFiles(): Promise<{
  readonly entryPointsWithoutExtension: readonly string[];
  readonly entryPointVirtualFiles: VirtualPathMappings;
}> {
  const absoluteProjectPath = resolve('.');
  const entryPointsWithoutExtension = await getEntryPointsWithoutExtension();
  const entryPointVirtualFiles = Object.fromEntries([
    ...entryPointsWithoutExtension.map((path) => [
      `${VIRTUAL_GENERATED_ENTRY_POINT_PATH_PREFIX}${path}.jsx`,
      getClientTemplate(absoluteProjectPath, path, true, entryPointsWithoutExtension, []),
    ]),
  ]);
  entryPointVirtualFiles[VIRTUAL_SERVER_ENTRY_PATH] = getServerTemplate(
    absoluteProjectPath,
    entryPointsWithoutExtension,
  );
  return { entryPointsWithoutExtension, entryPointVirtualFiles };
}
