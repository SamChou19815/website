import type { HelmetServerState } from 'react-helmet-async';

export type SSRResult = {
  readonly divHTML: string;
  readonly noJS: boolean;
  readonly helmet: HelmetServerState;
};

function getLinks(entryPoint: string, files: readonly string[], noJS?: boolean) {
  const jsFiles: string[] = [];
  const cssFiles: string[] = [];
  files.forEach((filename) => {
    if (filename.startsWith('__server__')) {
      return;
    }
    if (!noJS && filename.endsWith('js')) {
      jsFiles.push(filename);
    } else if (filename.endsWith('css') && filename.startsWith('index-')) {
      cssFiles.push(filename);
    }
  });

  const headLinks =
    cssFiles.map((href) => `<link rel="stylesheet" href="/${href}" />`).join('') +
    jsFiles.map((href) => `<link rel="modulepreload" href="/${href}" />`).join('');

  const bodyScriptLinks = jsFiles
    .filter((it) => it.startsWith('chunk') || it.startsWith(entryPoint))
    .map((href) => `<script type="module" src="/${href}"></script>`)
    .join('');
  return { headLinks, bodyScriptLinks };
}

function getHeadHTML(headLinks: string, helmet?: HelmetServerState) {
  if (helmet == null) {
    return `<head>${headLinks}</head>`;
  }
  const parts = [
    helmet.meta.toString(),
    helmet.title.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
    headLinks,
  ];
  return `<head>${parts.join('')}</head>`;
}

export default function getGeneratedHTML(
  ssrResult: SSRResult | undefined,
  entryPoint: string,
  files: readonly string[],
): string {
  const { headLinks, bodyScriptLinks } = getLinks(entryPoint, files, ssrResult?.noJS);
  if (ssrResult == null) {
    const head = getHeadHTML(headLinks);
    const body = `<body><div id="root"></div>${bodyScriptLinks}</body>`;
    return `<!DOCTYPE html><html>${head}${body}</html>`;
  }
  const { divHTML, helmet } = ssrResult;
  const head = getHeadHTML(headLinks, helmet);
  const body = `<body><div id="root">${divHTML}</div>${bodyScriptLinks}</body>`;
  return `<!DOCTYPE html><html ${helmet.htmlAttributes.toString()}>${head}${body}</html>`;
}
