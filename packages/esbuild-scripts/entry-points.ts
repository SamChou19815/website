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
