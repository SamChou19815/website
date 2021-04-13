import { createHash } from 'crypto';

import { minify } from 'html-minifier';
import { parse } from 'node-html-parser';

const md5 = (data: string) =>
  createHash('md5').update(data).digest().toString('hex').substring(0, 8);

type Attachment = {
  readonly type: 'js' | 'css';
  readonly originalFilename: string;
  readonly content?: string;
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
    const href =
      content == null ? `/${originalFilename}` : `/${originalFilename}?h=${md5(content)}`;
    if (type === 'js') {
      body.appendChild(parse(`<script src="${href}"></script>`));
      head.appendChild(parse(`<link rel="preload" href="${href}" as="script" />`));
    } else {
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
