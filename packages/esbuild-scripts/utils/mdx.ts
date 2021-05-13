import mdx from '@mdx-js/mdx';
import remarkSlugs from 'remark-slug';

const compileMarkdownToReact = async (text: string): Promise<string> => `import React from 'react';
import mdx from 'esbuild-scripts/__internal-components__/mdx';
${await mdx(text, { remarkPlugins: [remarkSlugs] })}`;

export default compileMarkdownToReact;
