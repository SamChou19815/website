import { dirname, extname, join, relative } from 'path';

import { PAGES_PATH, GENERATED_PAGES_PATH, TEMP_PATH, TEMP_SERVER_ENTRY_PATH } from './constants';
import { emptyDirectory, ensureDirectory, exists, readDirectory, writeFile } from './fs-promise';

const GENERATED_COMMENT = `// ${'@'}generated`;

const rewriteEntryPointPathForRouting = (path: string): string => {
  if (!path.endsWith('index')) return path;
  return path.substring(0, path.length - (path.endsWith('/index') ? 6 : 5));
};

export const getClientTemplate = (path: string, paths: readonly string[]): string => {
  const normalizedSelfPath = rewriteEntryPointPathForRouting(path);
  const normalizedPaths = paths.filter((it) => it !== path).map(rewriteEntryPointPathForRouting);
  const importPageBase = join(relative(dirname(path), '..'), 'src', 'pages');

  const lazyImports = normalizedPaths
    .map(
      (otherPath, i) =>
        `const Component${i} = lazy(() => import('${importPageBase}/${otherPath}'));`
    )
    .join('');
  const lazyLoadedRoutes = normalizedPaths
    .map(
      (otherPath, i) =>
        `<Route exact path="/${otherPath}"><Suspense fallback={null}><Component${i} /></Suspense></Route>`
    )
    .join('');
  const routes = `<Switch><Route exact path="/${normalizedSelfPath}"><Page /></Route>${lazyLoadedRoutes}</Switch>`;

  return `${GENERATED_COMMENT}
import React,{Suspense,lazy}from'react';import{hydrate,render}from'react-dom';
import {BrowserRouter,Route,Switch}from'esbuild-scripts/__internal-components__/react-router';
import Document from '${importPageBase}/_document.tsx';import Page from '${importPageBase}/${normalizedSelfPath}';${lazyImports}
const element = <BrowserRouter><Document>${routes}</Document></BrowserRouter>;const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) hydrate(element, rootElement); else render(element, rootElement);
`;
};

export const getServerTemplate = (paths: readonly string[]): string => `${GENERATED_COMMENT}
import React from 'react';
import {renderToString} from'react-dom/server';
import Helmet from 'esbuild-scripts/components/Head';
import {StaticRouter}from'esbuild-scripts/__internal-components__/react-router';
import Document from '../src/pages/_document.tsx';
${paths.map((path, i) => `import Page${i} from '../src/pages/${path}';`).join('\n')}
const map = { ${paths.map((path, i) => `'${path}': Page${i}`).join(', ')} };
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

const recursivelyReadDirectoryAllowNonExist = async (path: string) =>
  (await exists(path)) ? readDirectory(path, true) : [];

/**
 * @returns a list of entry point paths under `src/pages`.
 * The paths will be relativized against `src/pages` and with extensions removed.
 */
const getEntryPointsWithoutExtension = async (): Promise<readonly string[]> => {
  await ensureDirectory(PAGES_PATH);
  const [pagesPath, generatedPagesPath] = await Promise.all([
    recursivelyReadDirectoryAllowNonExist(PAGES_PATH),
    recursivelyReadDirectoryAllowNonExist(GENERATED_PAGES_PATH),
  ]);
  const allPaths = [...pagesPath, ...generatedPagesPath];
  return allPaths
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

export const createEntryPointsGeneratedFiles = async (): Promise<readonly string[]> => {
  const entryPoints = await getEntryPointsWithoutExtension();
  await ensureDirectory(TEMP_PATH);
  await emptyDirectory(TEMP_PATH);
  await Promise.all([
    ...entryPoints.map(async (path) => {
      const fullPath = join(TEMP_PATH, `${path}.jsx`);
      await ensureDirectory(dirname(fullPath));
      await writeFile(fullPath, getClientTemplate(path, entryPoints));
    }),
    writeFile(TEMP_SERVER_ENTRY_PATH, getServerTemplate(entryPoints)),
  ]);
  return entryPoints;
};
