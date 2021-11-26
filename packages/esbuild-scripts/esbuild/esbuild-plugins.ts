import { readFile } from 'fs/promises';
import { resolve } from 'path';

import mdx from '@mdx-js/mdx';
import type { Plugin } from 'esbuild';

const webAppResolvePlugin: Plugin = {
  name: 'WebAppResolvePlugin',
  setup(buildConfig) {
    buildConfig.onResolve({ filter: /^data:/ }, () => ({ external: true }));
  },
};

/** A mapping from a virtual path to its content. */
export type VirtualPathMappings = { readonly [virtualPath: string]: string };

const VIRTURL_PATH_FILTER = /^esbuild-scripts-internal\/virtual\//;
const currentProjectDirectory = resolve('.');
const virtualPathResolvePlugin = (virtualPathMappings: VirtualPathMappings): Plugin => ({
  name: 'VirtualPathResolvePlugin',
  setup(buildConfig) {
    buildConfig.onResolve({ filter: VIRTURL_PATH_FILTER }, (args) => ({
      path: args.path,
      namespace: 'virtual-path',
    }));

    buildConfig.onLoad({ filter: VIRTURL_PATH_FILTER, namespace: 'virtual-path' }, (args) => ({
      contents: virtualPathMappings[args.path],
      resolveDir: currentProjectDirectory,
      loader: 'jsx',
    }));
  },
});

async function compileMarkdownToReact(text: string): Promise<string> {
  return `import React from 'react';
import mdx from 'esbuild-scripts/__internal-components__/mdx';
${await mdx(text.trim().split('\n').slice(1).join('\n').trim())}
MDXContent.additionalProperties = typeof additionalProperties === 'undefined' ? undefined : additionalProperties;
`;
}

const mdxPlugin: Plugin = {
  name: 'mdx',
  setup(buildConfig) {
    buildConfig.onLoad({ filter: /\.md$/ }, async (args) => {
      return {
        contents: await compileMarkdownToReact((await readFile(args.path)).toString()),
        loader: 'jsx',
      };
    });
  },
};

const esbuildPlugins = (virtualPathMappings: VirtualPathMappings): Plugin[] => [
  webAppResolvePlugin,
  virtualPathResolvePlugin(virtualPathMappings),
  mdxPlugin,
];

export default esbuildPlugins;
