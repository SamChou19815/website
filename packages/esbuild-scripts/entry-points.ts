import { extname } from 'path';

import { PAGES_PATH } from './constants';
import { ensureDirectory, readDirectory } from './fs-promise';

const GENERATED_COMMENT = `// ${'@'}generated`;

export const getClientTemplate = (path: string): string => `${GENERATED_COMMENT}

import React from React;
import { hydrate, render } from 'react-dom';

import Document from '../../src/pages/_document.tsx';
import Page from '../../src/pages/${path}';

const element = <Document><App /></Document>;
const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) {
  hydrate(rootElement, rootElement);
} else {
  render(rootElement, rootElement);
}
`;

export const getServerTemplate = (paths: readonly string[]): string => `${GENERATED_COMMENT}

import React from React;
import { renderToString } from 'react-dom/server';

import Document from '../../src/pages/_document.tsx';
${paths.map((path, i) => `import Page${i} from '../../src/pages/${path}';`).join('\n')}

const components = {
${paths.map((path, i) => `  '${path}': Page${i},`).join('\n')}
};

module.exports = (path) => {
  const Page = components[path];
  return renderToString(<Document><Page /></Document>);
};
`;

/**
 * @returns a list of entry point paths under `src/pages`.
 * Extensions are removed and the paths will be relativized against `src/pages`.
 */
export const getEntryPoints = async (): Promise<readonly string[]> => {
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
    .filter((it): it is string => it != null && it !== '_document');
};
