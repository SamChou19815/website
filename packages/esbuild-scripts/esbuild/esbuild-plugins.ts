import { readFile } from 'fs/promises';
import { resolve } from 'path';

import type { Plugin } from 'esbuild';

import compileMarkdownToReact from '../utils/mdx';

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

const mdxPlugin: Plugin = {
  name: 'mdx',
  setup(buildConfig) {
    buildConfig.onResolve({ filter: /\.mdtruncated$/ }, (args) => ({ path: args.path }));
    buildConfig.onLoad({ filter: /\.mdtruncated$/ }, async (args) => ({
      contents: await compileMarkdownToReact(
        (await readFile(args.path.substring(0, args.path.length - 9))).toString(),
        true
      ),
      loader: 'jsx',
    }));
    buildConfig.onLoad({ filter: /\.md$/ }, async (args) => {
      return {
        contents: await compileMarkdownToReact((await readFile(args.path)).toString(), false),
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
