import type { HelmetData } from 'react-helmet';

export type SSRResult = {
  readonly divHTML: string;
  readonly noJS: boolean;
  readonly helmet: HelmetData;
};

const scriptElement = (href: string, esModule: boolean) =>
  esModule ? `<script type="module" src="/${href}"></script>` : `<script src="/${href}"></script>`;

const linkScriptElement = (href: string, esModule: boolean) =>
  `<link rel="${esModule ? 'modulepreload' : 'preload'}" href="/${href}" />`;

const getLinks = (files: readonly string[], esModule: boolean, noJS?: boolean) => {
  const jsFiles: string[] = [];
  const cssFiles: string[] = [];
  files.forEach((filename) => {
    if (!noJS && filename.endsWith('js')) {
      jsFiles.push(filename);
    } else if (filename.endsWith('css')) {
      cssFiles.push(filename);
    }
  });

  const headLinks =
    cssFiles.map((filename) => `<link rel="stylesheet" href="/${filename}" />`).join('') +
    jsFiles.map((filename) => linkScriptElement(filename, esModule)).join('');
  const bodyScriptLinks = jsFiles.map((filename) => scriptElement(filename, esModule)).join('');
  return { headLinks, bodyScriptLinks };
};

const getHeadHTML = (headLinks: string, helmet?: HelmetData) => {
  if (helmet == null) return `<head>${headLinks}</head>`;
  const parts = [
    helmet.meta.toString(),
    helmet.title.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
    headLinks,
  ];
  return `<head>${parts.join('')}</head>`;
};

const getGeneratedHTML = (
  ssrResult: SSRResult | undefined,
  files: readonly string[],
  esModule: boolean
): string => {
  const { headLinks, bodyScriptLinks } = getLinks(files, esModule, ssrResult?.noJS);
  if (ssrResult == null) {
    const head = getHeadHTML(headLinks);
    const body = `<body><div id="root"></div>${bodyScriptLinks}</body>`;
    return `<!DOCTYPE html><html>${head}${body}</html>`;
  }
  const { divHTML, helmet } = ssrResult;
  const head = getHeadHTML(headLinks, helmet);
  const body = `<body><div id="root">${divHTML}</div>${bodyScriptLinks}</body>`;
  return `<!DOCTYPE html><html ${helmet.htmlAttributes.toString()}>${head}${body}</html>`;
};

export default getGeneratedHTML;
