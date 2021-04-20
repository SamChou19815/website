import { dirname, extname, join } from 'path';

import { PAGES_PATH, TEMP_PATH, TEMP_SERVER_ENTRY_PATH } from './constants';
import { emptyDirectory, ensureDirectory, readDirectory, writeFile } from './fs-promise';

const GENERATED_COMMENT = `// ${'@'}generated`;

export const getClientTemplate = (path: string): string => `${GENERATED_COMMENT}

import React from 'react';
import { hydrate, render } from 'react-dom';

import Document from '../src/pages/_document.tsx';
import Page from '../src/pages/${path}';

const element = <Document><Page /></Document>;
const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) {
  hydrate(element, rootElement);
} else {
  render(element, rootElement);
}
`;

export const getServerTemplate = (paths: readonly string[]): string => `${GENERATED_COMMENT}

import React from 'react';
import { renderToString } from 'react-dom/server';
import Helmet from 'esbuild-scripts/components/Head'

import Document from '../src/pages/_document.tsx';
${paths.map((path, i) => `import Page${i} from '../src/pages/${path}';`).join('\n')}

const components = {
${paths.map((path, i) => `  '${path}': Page${i},`).join('\n')}
};

module.exports = (path) => {
  const Page = components[path];
  const divHTML = renderToString(<Document><Page /></Document>);
  const helmet = Helmet.renderStatic();
  return { divHTML, helmet };
};
`;

/**
 * @returns a list of entry point paths under `src/pages`.
 * The paths will be relativized against `src/pages` and with extensions removed.
 */
const getEntryPointsWithoutExtension = async (): Promise<readonly string[]> => {
  await ensureDirectory(PAGES_PATH);
  const allPaths = await readDirectory(PAGES_PATH, true);
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
      await writeFile(fullPath, getClientTemplate(path));
    }),
    writeFile(TEMP_SERVER_ENTRY_PATH, getServerTemplate(entryPoints)),
  ]);
  return entryPoints;
};
