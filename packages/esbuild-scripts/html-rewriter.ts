import { minify } from 'html-minifier';
import { parse } from 'node-html-parser';

const scriptElement = (href: string, esModule: boolean) =>
  parse(
    esModule ? `<script type="module" src="${href}"></script>` : `<script src="${href}"></script>`
  );

const linkScriptElement = (href: string, esModule: boolean) =>
  parse(`<link rel="${esModule ? 'modulepreload' : 'preload'}" href="${href}" />`);

const htmlWithElementsAttached = (
  input: string,
  ssrContent: string | null,
  files: readonly string[],
  { esModule, noJS = false }: { readonly esModule: boolean; readonly noJS?: boolean }
): string => {
  const root = parse(input);
  const head = root.querySelector('head');
  const body = root.querySelector('body');

  if (ssrContent != null) root.querySelector('#root').innerHTML = ssrContent;

  files.forEach((filename) => {
    const href = `/${filename}`;
    if (filename.endsWith('js') && !noJS) {
      body.appendChild(scriptElement(href, esModule));
      head.appendChild(linkScriptElement(href, esModule));
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
