import type { HelmetData } from 'react-helmet';

export type SSRResult = {
  readonly divHTML: string;
  readonly noJS: boolean;
  readonly helmet: HelmetData;
};

const getLinks = (files: readonly string[], noJS?: boolean) => {
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
    cssFiles.map((href) => `<link rel="stylesheet" href="/${href}" />`).join('') +
    jsFiles.map((href) => `<link rel="modulepreload" href="/${href}" />`).join('');
  const bodyScriptLinks = jsFiles
    .map((href) => `<script type="module" src="/${href}"></script>`)
    .join('');
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

const getGeneratedHTML = (ssrResult: SSRResult | undefined, files: readonly string[]): string => {
  const { headLinks, bodyScriptLinks } = getLinks(files, ssrResult?.noJS);
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
