import { minify } from 'html-minifier';
import { parse } from 'node-html-parser';

const htmlWithElementsAttached = (
  input: string,
  ssrContent: string,
  esModule: boolean,
  files: readonly string[]
): string => {
  const root = parse(input);
  const head = root.querySelector('head');
  const body = root.querySelector('body');

  root.querySelector('#root').innerHTML = ssrContent;

  const relForScript = esModule ? 'modulepreload' : 'preload';
  files.forEach((filename) => {
    const href = `/${filename}`;
    if (filename.endsWith('js')) {
      body.appendChild(
        parse(
          esModule
            ? `<script type="module" src="${href}"></script>`
            : `<script src="${href}"></script>`
        )
      );
      head.appendChild(parse(`<link rel="${relForScript}" href="${href}" />`));
    } else if (filename.endsWith('css')) {
      head.appendChild(parse(`<link rel="stylesheet" href="${href}" />`));
    }
  });

  return minify(root.toString(), {
    minifyCSS: false,
    minifyJS: false,
    collapseWhitespace: true,
    collapseInlineTagWhitespace: true,
  });
};

export default htmlWithElementsAttached;
