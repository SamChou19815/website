import mdx from '@mdx-js/mdx';
import remarkSlugs from 'remark-slug';

import parseMarkdownHeaderTree from './markdown-header-parser';

const compileMarkdownToReact = async (text: string, truncated: boolean): Promise<string> => {
  const contentLinesWithoutTitle = text.trim().split('\n').slice(1);

  let content: string;
  if (truncated) {
    const truncateIndex = contentLinesWithoutTitle.findIndex(
      (it) => it.trimStart().startsWith('<!--') && it.includes('truncate')
    );
    content = contentLinesWithoutTitle.slice(0, truncateIndex).join('\n');
  } else {
    content = contentLinesWithoutTitle.join('\n');
  }
  content = content.trim();

  return `import React from 'react';
import mdx from 'esbuild-scripts/__internal-components__/mdx';
${await mdx(content, { remarkPlugins: [remarkSlugs] })}
MDXContent.truncated = ${truncated};
MDXContent.toc = ${JSON.stringify(parseMarkdownHeaderTree(text), undefined, 2)};
MDXContent.additionalProperties = typeof additionalProperties === 'undefined' ? undefined : additionalProperties;
`;
};

export default compileMarkdownToReact;
