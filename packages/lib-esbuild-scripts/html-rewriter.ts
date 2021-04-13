import { createHash } from 'crypto';

import { parse } from 'node-html-parser';

const md5 = (data: string) =>
  createHash('md5').update(data).digest().toString('hex').substring(0, 8);

type Attachment = {
  readonly type: 'js' | 'css';
  readonly originalFilename: string;
  readonly content: string;
};

const htmlWithElementsAttached = (
  input: string,
  ssrContent: string,
  ...attachments: readonly Attachment[]
): string => {
  const root = parse(input);
  const head = root.querySelector('head');
  const body = root.querySelector('body');

  root.querySelector('#root').innerHTML = ssrContent;

  attachments.forEach(({ type, originalFilename, content }) => {
    const href = `/${originalFilename}?h=${md5(content)}`;
    if (type === 'js') {
      const scriptNode = document.createElement('script');
      scriptNode.src = href;
      body.appendChild(parse(`<script src="${href}"></script>`));

      const preloadLinkNode = document.createElement('link');
      preloadLinkNode.rel = 'preload';
      preloadLinkNode.href = href;
      head.appendChild(parse(`<link rel="preload" href="${href}" as="script" />`));
    } else {
      const linkNode = document.createElement('link');
      linkNode.rel = 'stylesheet';
      linkNode.href = href;
      head.appendChild(parse(`<link rel="stylesheet" href="${href}" />`));
    }
  });

  root.removeWhitespace();
  return root.toString();
};

export default htmlWithElementsAttached;
